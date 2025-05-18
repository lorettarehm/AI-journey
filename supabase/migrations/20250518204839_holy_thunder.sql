/*
  # Fix Technique Recommendations View

  1. Changes
    - Drop the existing technique_recommendations view
    - Create a new technique_recommendations view with proper joins
    - Avoid recursive references that could cause infinite loops
    - Check if policies exist before creating them
  2. Security
    - Ensure RLS is enabled on the underlying tables
    - Add policies for all users to read the tables if they don't exist
*/

-- Drop the existing view if it exists
DROP VIEW IF EXISTS public.technique_recommendations;

-- Create a new view with proper joins and no recursive references
CREATE OR REPLACE VIEW public.technique_recommendations AS
SELECT 
  rt.id as technique_id,
  rt.title,
  rt.description,
  rt.target_condition,
  rt.category,
  rt.difficulty_level,
  rt.effectiveness_score,
  rt.implementation_steps,
  tm.suitable_for_profiles,
  tm.contraindications,
  rp.publication_date,
  rp.journal
FROM 
  public.research_techniques rt
LEFT JOIN 
  public.technique_metadata tm ON rt.id = tm.technique_id
LEFT JOIN 
  public.research_papers rp ON rt.paper_id = rp.id;

-- Enable row level security on the underlying tables if not already enabled
ALTER TABLE public.research_techniques ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.technique_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.research_papers ENABLE ROW LEVEL SECURITY;

-- Check if policies exist before creating them
DO $$
BEGIN
    -- Check for research_techniques policy
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'research_techniques' 
        AND policyname = 'Allow read access for all users'
    ) THEN
        CREATE POLICY "Allow read access for all users" 
        ON public.research_techniques FOR SELECT USING (true);
    END IF;
    
    -- Check for technique_metadata policy
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'technique_metadata' 
        AND policyname = 'Allow read access for all users'
    ) THEN
        CREATE POLICY "Allow read access for all users" 
        ON public.technique_metadata FOR SELECT USING (true);
    END IF;
    
    -- Check for research_papers policy
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'research_papers' 
        AND policyname = 'Allow read access for all users'
    ) THEN
        CREATE POLICY "Allow read access for all users" 
        ON public.research_papers FOR SELECT USING (true);
    END IF;
END
$$;