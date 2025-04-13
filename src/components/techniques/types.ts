
export interface TechniqueType {
  technique_id: string;
  title: string;
  description: string;
  implementation_steps?: string[];
  category?: 'focus' | 'organization' | 'sensory' | 'social' | null;
  difficulty_level?: 'beginner' | 'intermediate' | 'advanced' | null;
  effectiveness_score?: number;
  journal?: string;
  publication_date?: string;
  url?: string;
  doi?: string;
}
