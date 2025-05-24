import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { corsHeaders } from "./cors.ts";
import { fetchUserData } from "./userDataService.ts";
import { createRAGPrompt } from "./promptGenerator.ts";
import { storeRecommendation } from "./databaseService.ts";
import { getLLMModels, callLLMModel, retryWithBackoff, sleep } from "./llmService.ts";

// Maximum consecutive failures before disabling a model
const MAX_CONSECUTIVE_FAILURES = 5;
// Time window for failure tracking (in milliseconds)
const FAILURE_WINDOW = 300000; // 5 minutes
// Timeout for model health check (in milliseconds)
const HEALTH_CHECK_TIMEOUT = 5000;

// Create a Supabase client with the service role key
const createServiceClient = () => {
  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  return createClient(supabaseUrl, supabaseServiceKey);
};

// Circuit breaker state
const modelFailures = new Map<string, { count: number; lastFailure: number }>();

// Check if a model should be temporarily disabled
function isModelDisabled(modelName: string): boolean {
  const failure = modelFailures.get(modelName);
  if (!failure) return false;

  const now = Date.now();
  // Reset failures if outside the time window
  if (now - failure.lastFailure > FAILURE_WINDOW) {
    modelFailures.delete(modelName);
    return false;
  }

  return failure.count >= MAX_CONSECUTIVE_FAILURES;
}

// Record a model failure
function recordModelFailure(modelName: string) {
  const now = Date.now();
  const failure = modelFailures.get(modelName);
  
  if (!failure || now - failure.lastFailure > FAILURE_WINDOW) {
    modelFailures.set(modelName, { count: 1, lastFailure: now });
  } else {
    modelFailures.set(modelName, {
      count: failure.count + 1,
      lastFailure: now
    });
  }
}

// Reset model failures
function resetModelFailures(modelName: string) {
  modelFailures.delete(modelName);
}

// Function to validate API key format
function isValidAPIKey(apiKey: string): boolean {
  return apiKey.length > 0 && apiKey.length < 1000;
}

// Function to check if a model endpoint is healthy
async function checkModelHealth(model: any): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), HEALTH_CHECK_TIMEOUT);

    const response = await fetch(model.api_url, {
      method: "HEAD",
      signal: controller.signal,
      headers: {
        "Authorization": `Bearer ${model.api_key}`,
      },
    });

    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    console.error(`Health check failed for ${model.model_name}:`, error);
    return false;
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId } = await req.json();
    
    if (!userId) {
      return new Response(
        JSON.stringify({ 
          error: "User ID is required",
          details: "Please provide a valid user ID"
        }),
        { 
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    const supabase = createServiceClient();
    
    // Fetch comprehensive user data
    const userData = await fetchUserData(supabase, userId);
    
    if (!userData) {
      return new Response(
        JSON.stringify({ 
          error: "User data not found",
          details: "Could not retrieve user data. Please try again later."
        }),
        { 
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    // Generate RAG prompt
    const ragPrompt = createRAGPrompt(userData);

    // Get available and healthy LLM models
    const models = await getLLMModels(supabase);
    
    if (models.length === 0) {
      return new Response(
        JSON.stringify({ 
          error: "No LLM models available",
          details: "Our AI recommendation system is temporarily unavailable. Please try again in a few minutes. Our team has been notified."
        }),
        { 
          status: 503,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }
    
    // Try each model in order until one succeeds
    let aiRecommendation = "";
    let technique = null;
    let success = false;
    let lastError = null;
    let attemptedModels = [];
    
    for (const model of models) {
      if (!isValidAPIKey(model.api_key)) {
        console.error(`Invalid API key format for model ${model.model_name}`);
        continue;
      }

      if (isModelDisabled(model.model_name)) {
        console.warn(`Model ${model.model_name} is temporarily disabled due to consecutive failures`);
        continue;
      }

      try {
        console.log(`Attempting to generate recommendation with model: ${model.model_name}`);
        
        // Add more detailed logging
        console.log(`API URL: ${model.api_url}`);
        console.log(`API Key (first 4 chars): ${model.api_key.substring(0, 4)}...`);
        
        // Check model health before attempting to call
        const isHealthy = await checkModelHealth(model);
        if (!isHealthy) {
          console.warn(`Model ${model.model_name} failed health check, skipping`);
          recordModelFailure(model.model_name);
          continue;
        }
        
        const response = await retryWithBackoff(() => callLLMModel(model, ragPrompt));
        
        // Process the response based on the model
        let generatedText = "";
        if (Array.isArray(response) && response[0]?.generated_text) {
          generatedText = response[0].generated_text;
        } else if (response.generated_text) {
          generatedText = response.generated_text;
        } else if (typeof response === 'string') {
          generatedText = response;
        } else if (response.choices && response.choices[0]?.text) {
          // Handle OpenAI-like response format
          generatedText = response.choices[0].text;
        } else if (response.choices && response.choices[0]?.message?.content) {
          // Handle OpenAI chat completion format
          generatedText = response.choices[0].message.content;
        }
        
        console.log(`Generated text (first 100 chars): ${generatedText.substring(0, 100)}...`);
        
        if (generatedText) {
          // Simple parsing logic - adjust based on your prompt structure
          const [title, ...rest] = generatedText.split('\n');
          const description = rest.join('\n');
          
          aiRecommendation = description.trim();
          technique = {
            title: title.trim(),
            description: description.trim()
          };
          
          success = true;
          resetModelFailures(model.model_name);
          console.log(`Successfully generated recommendation with ${model.model_name}`);
          break;
        } else {
          console.warn(`Model ${model.model_name} returned empty response`);
          recordModelFailure(model.model_name);
        }
      } catch (error) {
        recordModelFailure(model.model_name);
        console.error(`Error with model ${model.model_name}:`, error);
        lastError = error;
        attemptedModels.push(model.model_name);
        // Continue to the next model
      }
    }
    
    if (!success) {
      return new Response(
        JSON.stringify({ 
          error: "Failed to generate recommendation",
          details: `All available models failed. Attempted models: ${attemptedModels.join(', ')}. Last error: ${lastError?.message || "Unknown error"}`
        }),
        { 
          status: 503,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    // Store the recommendation
    await storeRecommendation(supabase, userId, technique, aiRecommendation, userData);

    return new Response(
      JSON.stringify({
        recommendation: aiRecommendation,
        technique: technique
      }),
      { 
        headers: { 
          ...corsHeaders, 
          "Content-Type": "application/json" 
        } 
      }
    );
  } catch (error) {
    console.error("Error in recommendation generation:", error);
    return new Response(
      JSON.stringify({ 
        error: "Internal server error",
        details: error.message || "An unexpected error occurred. Please try again later."
      }),
      { 
        status: 500, 
        headers: { 
          ...corsHeaders, 
          "Content-Type": "application/json" 
        } 
      }
    );
  }
});