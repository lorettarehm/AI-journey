
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { fetchAIRecommendations } from './services/aiRecommendationService';
import { fetchTechniques, triggerResearchUpdate as triggerUpdate } from './services/techniqueService';
import { TechniqueType } from './types';

export type { TechniqueType } from './types';

export const useTechniques = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Fetch AI-generated recommendations first
  const { 
    data: aiRecommendations, 
    isLoading: isLoadingAiRecommendations 
  } = useQuery({
    queryKey: ['aiTechniqueRecommendations', user?.id],
    queryFn: async () => fetchAIRecommendations(user?.id),
    enabled: !!user,
  });

  // Fetch techniques from our database with random ordering
  const { 
    data: techniques, 
    isLoading, 
    isError, 
    refetch 
  } = useQuery({
    queryKey: ['techniques'],
    queryFn: fetchTechniques
  });

  // Trigger the refactored edge function to fetch new research
  const triggerResearchUpdate = async () => {
    try {
      const result = await triggerUpdate();
      
      toast({
        title: "Research Updated",
        description: "The latest research has been fetched with verified URLs and DOIs.",
      });
      
      // Refetch techniques to display the latest
      await refetch();
      
      return result;
    } catch (error) {
      console.error('Error updating research:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update research data. Please try again later.",
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
    techniques,
    isLoading: isLoading || isLoadingAiRecommendations,
    isError,
    aiRecommendations,
    refetch,
    triggerResearchUpdate
  };
};
