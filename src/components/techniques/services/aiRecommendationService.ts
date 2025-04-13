
import { supabase } from '@/integrations/supabase/client';

export interface AIRecommendation {
  technique: {
    title: string;
    description: string;
  };
  recommendation: string;
}

export const fetchAIRecommendations = async (userId: string | undefined): Promise<AIRecommendation | null> => {
  if (!userId) return null;
  
  try {
    // Call the edge function to generate recommendations
    const { data, error } = await supabase.functions.invoke('generate-technique-recommendations', {
      body: JSON.stringify({ userId })
    });
    
    if (error) {
      console.error('Error generating AI recommendations:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error in AI recommendation service:', error);
    return null;
  }
};
