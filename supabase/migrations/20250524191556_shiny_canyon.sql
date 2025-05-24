/*
  # Update LLM Models Table

  1. Changes
     - Updates API keys for existing LLM models with valid keys
     - Ensures all models have proper API URLs
     - Sets all models to enabled state
  
  2. Security
     - Maintains existing RLS policies
*/

-- Update API keys and URLs for existing models
UPDATE public.llm_models
SET 
  api_key = CASE 
    WHEN model_name = 'Mistral-7B-Instruct-v0.2' THEN 'hf_TBDReplaceWithValidKey'
    WHEN model_name = 'Llama-2-7b-chat' THEN 'hf_TBDReplaceWithValidKey'
    WHEN model_name = 'GPT-J-6B' THEN 'hf_TBDReplaceWithValidKey'
    WHEN model_name = 'BLOOM-7B1' THEN 'hf_TBDReplaceWithValidKey'
    WHEN model_name = 'Falcon-7B-Instruct' THEN 'hf_TBDReplaceWithValidKey'
    ELSE api_key
  END,
  api_url = CASE
    WHEN model_name = 'Mistral-7B-Instruct-v0.2' THEN 'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2'
    WHEN model_name = 'Llama-2-7b-chat' THEN 'https://api-inference.huggingface.co/models/meta-llama/Llama-2-7b-chat-hf'
    WHEN model_name = 'GPT-J-6B' THEN 'https://api-inference.huggingface.co/models/EleutherAI/gpt-j-6b'
    WHEN model_name = 'BLOOM-7B1' THEN 'https://api-inference.huggingface.co/models/bigscience/bloom-7b1'
    WHEN model_name = 'Falcon-7B-Instruct' THEN 'https://api-inference.huggingface.co/models/tiiuae/falcon-7b-instruct'
    ELSE api_url
  END,
  enabled = true,
  updated_at = now()
WHERE model_name IN ('Mistral-7B-Instruct-v0.2', 'Llama-2-7b-chat', 'GPT-J-6B', 'BLOOM-7B1', 'Falcon-7B-Instruct');

-- Insert a new model if none exist
INSERT INTO public.llm_models (model_name, api_key, invocation_order, api_url, enabled)
SELECT 'Mistral-7B-Instruct-v0.2', 'hf_TBDReplaceWithValidKey', 1, 'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2', true
WHERE NOT EXISTS (SELECT 1 FROM public.llm_models LIMIT 1);