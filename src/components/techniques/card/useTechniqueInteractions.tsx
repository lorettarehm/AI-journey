
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export const useTechniqueInteractions = (id: string, title: string) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [feedbackSubmitted, setFeedbackSubmitted] = useState<string | null>(null);

  // Get existing interactions for this technique
  const { data: interactionStats, refetch: refetchStats } = useQuery({
    queryKey: ['techniqueInteractionStats', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('technique_interactions')
        .select('feedback')
        .eq('technique_id', id);
        
      if (error) throw error;
      
      const helpfulCount = data?.filter(i => i.feedback === 'helpful').length || 0;
      const notHelpfulCount = data?.filter(i => i.feedback === 'not-helpful').length || 0;
      
      return { helpfulCount, notHelpfulCount };
    },
    enabled: !!id,
  });

  // Get the user's most recent interaction with this technique (for UI display purposes only)
  const { data: userRecentInteraction, refetch: refetchUserInteraction } = useQuery({
    queryKey: ['userRecentTechniqueInteraction', id, user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('technique_interactions')
        .select('id, feedback')
        .eq('technique_id', id)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
        
      if (error) return null;
      return data;
    },
    enabled: !!id && !!user,
  });

  const handleFeedback = async (feedback: 'helpful' | 'not-helpful') => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to provide feedback",
        variant: "destructive",
      });
      return;
    }

    try {
      // Always insert a new interaction record
      const { error } = await supabase
        .from('technique_interactions')
        .insert({
          user_id: user.id,
          technique_id: id,
          technique_title: title,
          feedback: feedback,
          created_at: new Date().toISOString(),
        });
        
      if (error) throw error;
      
      setFeedbackSubmitted(feedback);
      
      // Refetch stats and user interaction
      refetchStats();
      refetchUserInteraction();
      
      // Invalidate any queries related to technique interactions in profile
      queryClient.invalidateQueries({ queryKey: ['techniqueInteractions'] });
      
      toast({
        title: "Feedback submitted",
        description: `You marked this technique as ${feedback}`,
      });
    } catch (error) {
      console.error("Error saving feedback:", error);
      toast({
        title: "Error",
        description: "Failed to save your feedback",
        variant: "destructive",
      });
    }
  };

  // Use feedback from server or local state (for UI display only)
  const currentFeedback = userRecentInteraction?.feedback || feedbackSubmitted;

  return {
    interactionStats,
    currentFeedback,
    handleFeedback
  };
};
