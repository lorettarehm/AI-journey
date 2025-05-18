import { supabase } from '@/integrations/supabase/client';

export interface AIRecommendation {
  technique: {
    title: string;
    description: string;
  };
  recommendation: string;
}

// Maximum number of retries
const MAX_RETRIES = 3;
// Initial delay in milliseconds
const INITIAL_DELAY = 1000;

// Retry with exponential backoff
const retryWithBackoff = async (
  operation: () => Promise<any>,
  retries = MAX_RETRIES,
  delay = INITIAL_DELAY
): Promise<any> => {
  try {
    return await operation();
  } catch (error) {
    if (retries === 0) {
      throw error;
    }
    
    console.log(`Retrying operation. Attempts remaining: ${retries}. Delay: ${delay}ms`);
    await new Promise(resolve => setTimeout(resolve, delay));
    
    return retryWithBackoff(operation, retries - 1, delay * 2);
  }
};

export const fetchAIRecommendations = async (userId: string | undefined): Promise<AIRecommendation | null> => {
  if (!userId) {
    console.warn('No user ID provided for AI recommendations');
    return null;
  }
  
  try {
    // Call the edge function with retry mechanism
    const result = await retryWithBackoff(async () => {
      const { data, error } = await supabase.functions.invoke('generate-technique-recommendations', {
        body: JSON.stringify({ userId })
      });
      
      if (error) {
        // Log detailed error information
        console.error('Edge function error:', {
          message: error.message,
          details: error.details,
          status: error.status,
          name: error.name
        });
        
        // If the error contains a message about LLM models being unavailable,
        // throw a more user-friendly error
        if (error.message?.includes('No LLM models available') || 
            error.message?.includes('Failed to generate recommendation')) {
          throw new Error('Our recommendation system is temporarily unavailable. Please try again in a few minutes.');
        }
        
        throw error;
      }
      
      return data;
    });
    
    return result;
  } catch (error) {
    console.error('Error in AI recommendation service:', error);
    
    // Return null and let the UI handle the error state
    return null;
  }
};