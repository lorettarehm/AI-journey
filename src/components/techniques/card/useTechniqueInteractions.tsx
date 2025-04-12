
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useTechniqueInteractions = () => {
  const [interactionStats, setInteractionStats] = useState({
    helpfulCount: 0,
    notHelpfulCount: 0
  });
  const [currentFeedback, setCurrentFeedback] = useState<string>('');
  const { toast } = useToast();

  // Save interaction record when user views a technique
  const handleInteraction = async (techniqueId: string, techniqueTitle: string) => {
    try {
      // Check for auth user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        await supabase.from('technique_interactions').insert({
          user_id: user.id,
          technique_id: techniqueId,
          technique_title: techniqueTitle
        });
      }
    } catch (error) {
      console.error('Error saving technique interaction:', error);
    }
  };

  // Handle feedback for a technique
  const handleFeedback = async (feedback: 'helpful' | 'not-helpful') => {
    try {
      // Update current feedback
      setCurrentFeedback(feedback);
      
      // Update stats based on feedback
      if (feedback === 'helpful') {
        setInteractionStats(prev => ({
          ...prev,
          helpfulCount: prev.helpfulCount + 1
        }));
      } else {
        setInteractionStats(prev => ({
          ...prev,
          notHelpfulCount: prev.notHelpfulCount + 1
        }));
      }
      
      toast({
        title: "Feedback recorded",
        description: "Thank you for your feedback on this technique.",
      });
      
    } catch (error) {
      console.error('Error recording feedback:', error);
      toast({
        title: "Error recording feedback",
        description: "There was a problem saving your feedback.",
        variant: "destructive",
      });
    }
  };

  return {
    interactionStats,
    currentFeedback,
    handleFeedback,
    handleInteraction
  };
};
