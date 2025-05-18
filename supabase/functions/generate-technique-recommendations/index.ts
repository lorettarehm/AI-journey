import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { corsHeaders } from "./cors.ts";
import { fetchUserData } from "./userDataService.ts";
import { createRAGPrompt } from "./promptGenerator.ts";
import { generateAIRecommendation } from "./aiService.ts";
import { storeRecommendation } from "./databaseService.ts";

// Maximum number of retries
const MAX_RETRIES = 3;
// Initial delay in milliseconds
const INITIAL_DELAY = 1000;
// Maximum consecutive failures before disabling a model
const MAX_CONSECUTIVE_FAILURES = 5;
// Time window for failure tracking (in milliseconds)
const FAILURE_WINDOW = 300000; // 5 minutes

// Sleep function for delay
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

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

// Retry function with exponential backoff
async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  retries = MAX_RETRIES,
  delay = INITIAL_DELAY
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if (retries === 0) {
      throw error;
    }
    
    console.log(`Retrying operation. Attempts remaining: ${retries}. Delay: ${delay}ms`);
    await sleep(delay);
    
    return retryWithBackoff(operation, retries - 1, delay * 2);
  }
}

// Function to validate API key format
function isValidAPIKey(apiKey: string): boolean {
  // Add your API key validation logic here
  return apiKey.length > 0 && apiKey.length < 1000;
}

// Function to get available LLM models in order
async function getLLMModels(supabase: any) {
  const { data, error } = await supabase
    .from('llm_models')
    .select('*')
    .eq('enabled', true)
    .order('invocation_order', { ascending: true })
    .limit(5);
  
  if (error) {
    console.error("Error fetching LLM models:", error);
    return [];
  }
  
  return data || [];
}

// Function to call an LLM model API
async function callLLMModel(model: any, prompt: string) {
  if (!isValidAPIKey(model.api_key)) {
    throw new Error(`Invalid API key format for model ${model.model_name}`);
  }

  if (isModelDisabled(model.model_name)) {
    throw new Error(`Model ${model.model_name} is temporarily disabled due to consecutive failures`);
  }

  try {
    const response = await fetch(model.api_url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${model.api_key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: 1024,
          temperature: 0.7,
          top_p: 0.9,
          do_sample: true,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    resetModelFailures(model.model_name); // Reset failures on success
    return data;
  } catch (error) {
    recordModelFailure(model.model_name);
    console.error(`Error calling ${model.model_name}:`, error);
    throw error;
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

    // Get available LLM models
    const models = await getLLMModels(supabase);
    
    if (models.length === 0) {
      return new Response(
        JSON.stringify({ 
          error: "No LLM models available",
          details: "No language models are currently configured or enabled. Please contact support."
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
    
    for (const model of models) {
      try {
        console.log(`Trying model: ${model.model_name}`);
        const response = await callLLMModel(model, ragPrompt);
        
        // Process the response based on the model
        let generatedText = "";
        if (Array.isArray(response) && response[0]?.generated_text) {
          generatedText = response[0].generated_text;
        } else if (response.generated_text) {
          generatedText = response.generated_text;
        } else if (typeof response === 'string') {
          generatedText = response;
        }
        
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
          console.log(`Successfully generated recommendation with ${model.model_name}`);
          break;
        }
      } catch (error) {
        console.error(`Error with model ${model.model_name}:`, error);
        lastError = error;
        // Continue to the next model
      }
    }
    
    if (!success) {
      return new Response(
        JSON.stringify({ 
          error: "Failed to generate recommendation",
          details: `All available models failed. Last error: ${lastError?.message}. Please try again later.`
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
        details: error.message
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