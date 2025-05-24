/*
  # LLM Models Configuration

  1. New Tables
    - Checks if `llm_models` table exists before creating
    - Adds policies for admin access
  
  2. Default Data
    - Inserts default LLM models if table is created
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

    -- Insert some default LLM models
    INSERT INTO public.llm_models (model_name, api_key, invocation_order, api_url, enabled)
    VALUES 
      ('Mistral-7B-Instruct-v0.2', 'hf_dummy_key_replace_me', 1, 'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2', true),
      ('Llama-2-7b-chat', 'hf_dummy_key_replace_me', 2, 'https://api-inference.huggingface.co/models/meta-llama/Llama-2-7b-chat-hf', true),
      ('GPT-J-6B', 'hf_dummy_key_replace_me', 3, 'https://api-inference.huggingface.co/models/EleutherAI/gpt-j-6b', true),
      ('BLOOM-7B1', 'hf_dummy_key_replace_me', 4, 'https://api-inference.huggingface.co/models/bigscience/bloom-7b1', true),
      ('Falcon-7B-Instruct', 'hf_dummy_key_replace_me', 5, 'https://api-inference.huggingface.co/models/tiiuae/falcon-7b-instruct', true);
  END IF;
END $$;

-- Create policies for access control (these will be skipped if they already exist)
DO $$ 
BEGIN
  -- Drop existing policies if they exist to avoid conflicts
  DROP POLICY IF EXISTS "Admin users can insert llm models" ON public.llm_models;
  DROP POLICY IF EXISTS "Admin users can update llm models" ON public.llm_models;
  DROP POLICY IF EXISTS "Admin users can delete llm models" ON public.llm_models;
  DROP POLICY IF EXISTS "All users can select llm models" ON public.llm_models;

  -- Create new policies
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
EXCEPTION
  WHEN duplicate_object THEN
    -- Do nothing, policies already exist
    RAISE NOTICE 'Policies already exist';
END $$;