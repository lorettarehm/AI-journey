/*
  # Rename adhd_screening_questions to screening_questions

  1. Changes
    - Rename the adhd_screening_questions table to screening_questions
    - Update all references to the old table name
  2. Security
    - Preserve existing RLS policies
*/

-- Create the new table with the same structure
CREATE TABLE IF NOT EXISTS public.screening_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_text TEXT NOT NULL,
  source TEXT NOT NULL,
  category TEXT,
  score_type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Copy data from the old table to the new one
INSERT INTO public.screening_questions (id, question_text, source, category, score_type, created_at)
SELECT id, question_text, source, category, score_type, created_at
FROM public.adhd_screening_questions;

-- Enable row level security on the new table
ALTER TABLE public.screening_questions ENABLE ROW LEVEL SECURITY;

-- Create the same policy on the new table
CREATE POLICY "Allow read access for all users" 
ON public.screening_questions FOR SELECT USING (true);

-- Drop the old table
DROP TABLE public.adhd_screening_questions;