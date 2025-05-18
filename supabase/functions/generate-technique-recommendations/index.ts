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

// Sleep function for delay
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Create a Supabase client with the service role key
const createServiceClient = () => {
  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  return createClient(supabaseUrl, supabaseServiceKey);
};

// Retry function with exponential backoff
async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  retries = MAX_RETRIES,
  delay = INITIAL_DELAY
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if (retries === 0 || !error.message.includes("404")) {
      throw error;
    }
    
    console.log(`Retrying operation. Attempts remaining: ${retries}. Delay: ${delay}ms`);
    await sleep(delay);
    
    return retryWithBackoff(operation, retries - 1, delay * 2);
  }
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
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
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
      throw new Error("User ID is required");
    }

    const supabase = createServiceClient();
    
    // Fetch comprehensive user data
    const userData = await fetchUserData(supabase, userId);
    
    if (!userData) {
      throw new Error("Could not retrieve user data");
    }

    // Generate RAG prompt
    const ragPrompt = createRAGPrompt(userData);

    // Get available LLM models
    const models = await getLLMModels(supabase);
    
    if (models.length === 0) {
      throw new Error("No LLM models configured or enabled");
    }
    
    // Try each model in order until one succeeds
    let aiRecommendation = "";
    let technique = null;
    let success = false;
    
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
        // Continue to the next model
      }
    }
    
    if (!success) {
      throw new Error("Your internet connection seems to be unstable. Please try again in 2 minutes");
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
        error: error.message,
        details: "If this error persists, please try again later or contact support."
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