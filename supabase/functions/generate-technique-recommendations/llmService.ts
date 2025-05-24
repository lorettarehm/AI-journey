import { corsHeaders } from "./cors.ts";

// Maximum number of retries
const MAX_RETRIES = 3;
// Initial delay in milliseconds
const INITIAL_DELAY = 1000;

// Function to get available LLM models in order
export async function getLLMModels(supabase: any) {
  try {
    console.log("Fetching enabled LLM models...");
    const { data, error } = await supabase
      .from('llm_models')
      .select('*')
      .eq('enabled', true)
      .order('invocation_order', { ascending: true });
    
    if (error) {
      console.error("Error fetching LLM models:", error);
      return [];
    }

    if (!data || data.length === 0) {
      console.error("No enabled LLM models found in the database");
      return [];
    }
    
    console.log(`Found ${data.length} enabled LLM models`);
    return data;
  } catch (error) {
    console.error("Error in getLLMModels:", error);
    return [];
  }
}

// Function to generate a curl command for testing
export function generateCurlCommand(model: any, prompt: string): string {
  const requestBody = JSON.stringify({
    inputs: prompt,
    parameters: {
      max_new_tokens: 1024,
      temperature: 0.7,
      top_p: 0.9,
      do_sample: true,
    }
  });
  
  return `curl -X POST ${model.api_url} \\
  -H "Authorization: Bearer ${model.api_key}" \\
  -H "Content-Type: application/json" \\
  -d '${requestBody.replace(/'/g, "'\\''")}'`;
}

// Function to call an LLM model API
export async function callLLMModel(model: any, prompt: string) {
  try {
    console.log(`Calling ${model.model_name} at ${model.api_url}`);
    
    // Log a curl command for debugging (with masked API key)
    const maskedApiKey = model.api_key.substring(0, 4) + '...' + model.api_key.substring(model.api_key.length - 4);
    const debugCurlCommand = generateCurlCommand({...model, api_key: maskedApiKey}, prompt);
    console.log(`Test with curl (API key masked): ${debugCurlCommand}`);
    
    // Set a timeout for the fetch request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
    
    const response = await fetch(model.api_url, {
      method: "POST",
      signal: controller.signal,
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
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API error response for ${model.model_name}:`, {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      throw new Error(`API error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    console.log(`Successful response from ${model.model_name}:`, JSON.stringify(data).substring(0, 200) + '...');
    return data;
  } catch (error) {
    console.error(`Error calling ${model.model_name}:`, error);
    throw error;
  }
}

// Sleep function for delay
export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Retry function with exponential backoff
export async function retryWithBackoff<T>(
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