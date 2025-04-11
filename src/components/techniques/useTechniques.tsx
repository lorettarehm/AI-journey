
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface TechniqueType {
  technique_id: string;
  title: string;
  description: string;
  implementation_steps?: string[];
  category?: 'focus' | 'organization' | 'sensory' | 'social' | null;
  difficulty_level?: 'beginner' | 'intermediate' | 'advanced' | null;
  journal?: string;
  publication_date?: string;
}

export const useTechniques = () => {
  const { toast } = useToast();
  
  // Fetch techniques from our database with random ordering
  const { data: techniques, isLoading, isError, refetch } = useQuery({
    queryKey: ['techniques'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('technique_recommendations')
        .select('*')
        .order(() => 'RANDOM()');  // Order randomly to get different suggestions each time
      
      if (error) throw error;
      return data as TechniqueType[];
    }
  });

  // Trigger the edge function to fetch new research
  const triggerResearchUpdate = async () => {
    try {
      // Call our edge function
      const response = await supabase.functions.invoke('fetch-research', {
        body: { searchQuery: 'adhd autism interventions recent', limit: 50 }
      });
      
      if (!response.data.success) {
        throw new Error(response.data.error || 'Unknown error');
      }
      
      toast({
        title: "Research Updated",
        description: "The latest research has been fetched and analyzed.",
      });
      
      // Refetch techniques to display the latest
      await refetch();
      
      // Return additional data for the caller
      return {
        count: response.data.count || (response.data.data?.length || 0),
        message: response.data.message
      };
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
    isLoading,
    isError,
    refetch,
    triggerResearchUpdate
  };
};
