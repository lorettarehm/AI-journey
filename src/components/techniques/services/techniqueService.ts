
import { supabase } from '@/integrations/supabase/client';
import { TechniqueType } from '../types';

// Fisher-Yates shuffle algorithm to randomize the order of techniques
export const shuffleArray = (array: TechniqueType[]): TechniqueType[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export const fetchTechniques = async (): Promise<TechniqueType[]> => {
  try {
    // Check which columns actually exist in the view by querying for them
    const { data, error } = await supabase
      .from('technique_recommendations')
      .select('technique_id, title, description, category, difficulty_level, effectiveness_score, journal, publication_date, implementation_steps')
      .order('title', { ascending: false })
      .limit(50);
    
    if (error) {
      console.error('Error fetching techniques:', error);
      throw error;
    }
    
    const techniques = data ? data.map(technique => ({
      technique_id: technique.technique_id || '',
      title: technique.title || '',
      description: technique.description || '',
      category: technique.category as any || null,
      difficulty_level: technique.difficulty_level as any || null,
      effectiveness_score: technique.effectiveness_score || undefined,
      journal: technique.journal || undefined,
      publication_date: technique.publication_date || undefined,
      url: undefined, // We don't have URL in the view, so explicitly set it to undefined
      doi: undefined, // We don't have DOI in the view, so explicitly set it to undefined
      implementation_steps: technique.implementation_steps || undefined,
    })) : [];
    
    return shuffleArray(techniques as TechniqueType[]);
  } catch (error) {
    console.error('Error fetching techniques:', error);
    throw error;
  }
};

export const triggerResearchUpdate = async () => {
  try {
    // Call our edge function
    const response = await supabase.functions.invoke('fetch-research', {
      body: { searchQuery: 'adhd autism interventions recent expanded', limit: 50 }
    });
    
    if (!response.data.success) {
      throw new Error(response.data.error || 'Unknown error');
    }
    
    // Return additional data for the caller
    return {
      count: response.data.count || (response.data.data?.length || 0),
      message: response.data.message
    };
  } catch (error) {
    console.error('Error updating research:', error);
    throw error;
  }
};
