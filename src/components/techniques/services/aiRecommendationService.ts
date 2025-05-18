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
      const response = await supabase.functions.invoke('generate-technique-recommendations', {
        body: JSON.stringify({ userId })
      });
      
      if (response.error) {
        // Check for specific error conditions
        if (response.error.message?.includes('No LLM models available') || 
            response.status === 503) {
          throw new Error('Our AI recommendation system is temporarily unavailable. Please try again in a few minutes. Our team has been notified.');
        }
        
        // Log detailed error information
        console.error('Edge function error:', {
          message: response.error.message,
          details: response.error.details,
          status: response.status,
          name: response.error.name
        });
        
        throw response.error;
      }
      
      return response.data;
    });
    
    return result;
  } catch (error) {
    // Log the error for debugging
    console.error('Error in AI recommendation service:', error);
    
    // If it's our custom error message, return null to display the user-friendly message
    if (error.message?.includes('temporarily unavailable')) {
      return null;
    }
    
    // For other errors, throw to be caught by the error boundary
    throw error;
  }
};