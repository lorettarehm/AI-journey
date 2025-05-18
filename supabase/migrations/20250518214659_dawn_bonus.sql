/*
  # Create LLM Models Configuration Table

  1. New Tables
    - `llm_models`
      - `id` (uuid, primary key)
      - `model_name` (text, unique)
      - `api_key` (text)
      - `invocation_order` (integer)
      - `api_url` (text)
      - `enabled` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
  2. Security
    - Enable RLS on `llm_models` table
    - Add policies for admin access and read-only for all users
*/

-- Create the LLM models configuration table
CREATE TABLE public.llm_models (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  model_name TEXT UNIQUE NOT NULL,
  api_key TEXT NOT NULL,
  invocation_order INTEGER NOT NULL,
  api_url TEXT NOT NULL,
  enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable row level security
ALTER TABLE public.llm_models ENABLE ROW LEVEL SECURITY;

-- Create policies for access control
CREATE POLICY "Admin users can insert llm models" ON public.llm_models
FOR INSERT
WITH CHECK (auth.uid() IN (
  SELECT auth.uid() FROM auth.users WHERE auth.uid() = '00000000-0000-0000-0000-000000000000'
));

CREATE POLICY "Admin users can update llm models" ON public.llm_models
FOR UPDATE
USING (auth.uid() IN (
  SELECT auth.uid() FROM auth.users WHERE auth.uid() = '00000000-0000-0000-0000-000000000000'
));

CREATE POLICY "Admin users can delete llm models" ON public.llm_models
FOR DELETE
USING (auth.uid() IN (
  SELECT auth.uid() FROM auth.users WHERE auth.uid() = '00000000-0000-0000-0000-000000000000'
));

CREATE POLICY "All users can select llm models" ON public.llm_models
FOR SELECT
USING (true);

-- Insert some default LLM models
INSERT INTO public.llm_models (model_name, api_key, invocation_order, api_url, enabled)
VALUES 
  ('Mistral-7B-Instruct-v0.2', 'hf_dummy_key_replace_me', 1, 'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2', true),
  ('Llama-2-7b-chat', 'hf_dummy_key_replace_me', 2, 'https://api-inference.huggingface.co/models/meta-llama/Llama-2-7b-chat-hf', true),
  ('GPT-J-6B', 'hf_dummy_key_replace_me', 3, 'https://api-inference.huggingface.co/models/EleutherAI/gpt-j-6b', true),
  ('BLOOM-7B1', 'hf_dummy_key_replace_me', 4, 'https://api-inference.huggingface.co/models/bigscience/bloom-7b1', true),
  ('Falcon-7B-Instruct', 'hf_dummy_key_replace_me', 5, 'https://api-inference.huggingface.co/models/tiiuae/falcon-7b-instruct', true);