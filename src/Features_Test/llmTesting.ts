import { supabase } from '@/integrations/supabase/client';

// Interface for LLM model data
interface LLMModel {
  id: string;
  model_name: string;
  api_key: string;
  api_url: string;
  invocation_order: number;
  enabled: boolean;
}

/**
 * Generates a curl command for testing an LLM model API call
 * @param prompt The prompt to send to the LLM model
 * @param modelId Optional specific model ID to use (otherwise uses first enabled model)
 * @returns A string containing the curl command
 */
export async function generateCurlCommand(prompt: string, modelId?: string): Promise<string> {
  try {
    // Fetch available models
    const { data: models, error } = await supabase
      .from('llm_models')
      .select('*')
      .eq('enabled', true)
      .order('invocation_order', { ascending: true });
    
    if (error) {
      throw new Error(`Error fetching models: ${error.message}`);
    }
    
    if (!models || models.length === 0) {
      return 'echo "No enabled LLM models found in the database"';
    }
    
    // Find the specific model if modelId is provided, otherwise use the first enabled model
    const model = modelId 
      ? models.find(m => m.id === modelId) 
      : models[0];
    
    if (!model) {
      return 'echo "Specified model not found or not enabled"';
    }
    
    // Create the request body
    const requestBody = JSON.stringify({
      inputs: prompt,
      parameters: {
        max_new_tokens: 1024,
        temperature: 0.7,
        top_p: 0.9,
        do_sample: true,
      }
    });
    
    // Generate the curl command
    return `curl -X POST ${model.api_url} \\
  -H "Authorization: Bearer ${model.api_key}" \\
  -H "Content-Type: application/json" \\
  -d '${requestBody.replace(/'/g, "'\\''")}'`;
  } catch (error) {
    console.error('Error generating curl command:', error);
    return `echo "Error generating curl command: ${error.message}"`;
  }
}

/**
 * Lists all available models with their IDs for reference
 * @returns A promise that resolves to an array of model information
 */
export async function listAvailableModels(): Promise<{ id: string; name: string; enabled: boolean }[]> {
  try {
    const { data, error } = await supabase
      .from('llm_models')
      .select('id, model_name, enabled')
      .order('invocation_order', { ascending: true });
    
    if (error) {
      throw error;
    }
    
    return (data || []).map(model => ({
      id: model.id,
      name: model.model_name,
      enabled: model.enabled
    }));
  } catch (error) {
    console.error('Error listing models:', error);
    return [];
  }
}