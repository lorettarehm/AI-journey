/*
  # Fix Technique Recommendations View

  1. Changes
    - Drop the existing technique_recommendations view
    - Create a new technique_recommendations view with proper joins
    - Avoid recursive references that could cause infinite loops
  2. Security
    - Enable RLS on the view
    - Add policy for all users to read the view
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

-- Enable row level security
ALTER VIEW public.technique_recommendations SECURITY INVOKER;

-- Create policy for read access
CREATE POLICY "Allow read access for all users" 
ON public.technique_recommendations FOR SELECT USING (true);