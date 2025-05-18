/*
  # Update LLM Models Configuration

  1. Changes
    - Checks if the llm_models table exists before creating it
    - Adds policies for access control if the table exists
    - Inserts default LLM models if they don't already exist
  2. Security
    - Enables RLS on the table
    - Creates policies for admin users to manage models
    - Allows all users to view models
*/

-- Check if the table exists before creating it
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'llm_models') THEN
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
  END IF;
END $$;

-- Drop existing policies if they exist
DO $$ 
BEGIN
  -- Drop policies if they exist
  IF EXISTS (SELECT FROM pg_policies WHERE tablename = 'llm_models' AND policyname = 'Admin users can insert llm models') THEN
    DROP POLICY "Admin users can insert llm models" ON public.llm_models;
  END IF;
  
  IF EXISTS (SELECT FROM pg_policies WHERE tablename = 'llm_models' AND policyname = 'Admin users can update llm models') THEN
    DROP POLICY "Admin users can update llm models" ON public.llm_models;
  END IF;
  
  IF EXISTS (SELECT FROM pg_policies WHERE tablename = 'llm_models' AND policyname = 'Admin users can delete llm models') THEN
    DROP POLICY "Admin users can delete llm models" ON public.llm_models;
  END IF;
  
  IF EXISTS (SELECT FROM pg_policies WHERE tablename = 'llm_models' AND policyname = 'All users can select llm models') THEN
    DROP POLICY "All users can select llm models" ON public.llm_models;
  END IF;
END $$;

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

-- Insert default LLM models if they don't exist
INSERT INTO public.llm_models (model_name, api_key, invocation_order, api_url, enabled)
SELECT 'Mistral-7B-Instruct-v0.2', 'hf_dummy_key_replace_me', 1, 'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2', true
WHERE NOT EXISTS (SELECT 1 FROM public.llm_models WHERE model_name = 'Mistral-7B-Instruct-v0.2');

INSERT INTO public.llm_models (model_name, api_key, invocation_order, api_url, enabled)
SELECT 'Llama-2-7b-chat', 'hf_dummy_key_replace_me', 2, 'https://api-inference.huggingface.co/models/meta-llama/Llama-2-7b-chat-hf', true
WHERE NOT EXISTS (SELECT 1 FROM public.llm_models WHERE model_name = 'Llama-2-7b-chat');

INSERT INTO public.llm_models (model_name, api_key, invocation_order, api_url, enabled)
SELECT 'GPT-J-6B', 'hf_dummy_key_replace_me', 3, 'https://api-inference.huggingface.co/models/EleutherAI/gpt-j-6b', true
WHERE NOT EXISTS (SELECT 1 FROM public.llm_models WHERE model_name = 'GPT-J-6B');

INSERT INTO public.llm_models (model_name, api_key, invocation_order, api_url, enabled)
SELECT 'BLOOM-7B1', 'hf_dummy_key_replace_me', 4, 'https://api-inference.huggingface.co/models/bigscience/bloom-7b1', true
WHERE NOT EXISTS (SELECT 1 FROM public.llm_models WHERE model_name = 'BLOOM-7B1');

INSERT INTO public.llm_models (model_name, api_key, invocation_order, api_url, enabled)
SELECT 'Falcon-7B-Instruct', 'hf_dummy_key_replace_me', 5, 'https://api-inference.huggingface.co/models/tiiuae/falcon-7b-instruct', true
WHERE NOT EXISTS (SELECT 1 FROM public.llm_models WHERE model_name = 'Falcon-7B-Instruct');