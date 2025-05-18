import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useTechniqueInteractions = (techniqueId?: string) => {
  const [interactionStats, setInteractionStats] = useState({
    helpfulCount: 0,
    notHelpfulCount: 0
  });
  const [currentFeedback, setCurrentFeedback] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Fetch existing feedback for this technique when component mounts
  useEffect(() => {
    if (techniqueId && user) {
      fetchExistingFeedback();
    }
  }, [techniqueId, user]);

  // Fetch existing feedback for this technique
  const fetchExistingFeedback = async () => {
    if (!techniqueId || !user) return;
    
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('technique_interactions')
        .select('feedback')
        .eq('technique_id', techniqueId)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        setCurrentFeedback(data[0].feedback);
      }
      
      // Also fetch the counts
      const { data: statsData, error: statsError } = await supabase
        .from('technique_interactions')
        .select('feedback, count(*)')
        .eq('technique_id', techniqueId)
        .group('feedback');
      
      if (statsError) throw statsError;
      
      if (statsData) {
        const helpfulCount = statsData.find(item => item.feedback === 'helpful')?.count || 0;
        const notHelpfulCount = statsData.find(item => item.feedback === 'not-helpful')?.count || 0;
        
        setInteractionStats({
          helpfulCount: Number(helpfulCount),
          notHelpfulCount: Number(notHelpfulCount)
        });
      }
    } catch (error) {
      console.error('Error fetching technique feedback:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Save interaction record when user views a technique
  const handleInteraction = async (techniqueId: string, techniqueTitle: string) => {
    try {
      // Check for auth user
      if (!user) return;
      
      await supabase.from('technique_interactions').insert({
        user_id: user.id,
        technique_id: techniqueId,
        technique_title: techniqueTitle
      });
    } catch (error) {
      console.error('Error saving technique interaction:', error);
    }
  };

  // Handle feedback for a technique
  const handleFeedback = async (feedback: 'helpful' | 'not-helpful') => {
    try {
      if (!user || !techniqueId) {
        toast({
          title: "Authentication required",
          description: "Please sign in to provide feedback.",
          variant: "destructive",
        });
        return;
      }
      
      setIsLoading(true);
      
      // First, check if there's an existing interaction to update
      const { data: existingData, error: existingError } = await supabase
        .from('technique_interactions')
        .select('id, feedback')
        .eq('user_id', user.id)
        .eq('technique_id', techniqueId)
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (existingError) throw existingError;
      
      let result;
      
      if (existingData && existingData.length > 0) {
        // Update existing interaction
        const { error } = await supabase
          .from('technique_interactions')
          .update({ feedback })
          .eq('id', existingData[0].id);
        
        if (error) throw error;
        
        // Update local stats
        if (existingData[0].feedback === 'helpful' && feedback === 'not-helpful') {
          setInteractionStats(prev => ({
            helpfulCount: Math.max(0, prev.helpfulCount - 1),
            notHelpfulCount: prev.notHelpfulCount + 1
          }));
        } else if (existingData[0].feedback === 'not-helpful' && feedback === 'helpful') {
          setInteractionStats(prev => ({
            helpfulCount: prev.helpfulCount + 1,
            notHelpfulCount: Math.max(0, prev.notHelpfulCount - 1)
          }));
        } else if (!existingData[0].feedback && feedback === 'helpful') {
          setInteractionStats(prev => ({
            ...prev,
            helpfulCount: prev.helpfulCount + 1
          }));
        } else if (!existingData[0].feedback && feedback === 'not-helpful') {
          setInteractionStats(prev => ({
            ...prev,
            notHelpfulCount: prev.notHelpfulCount + 1
          }));
        }
        
        result = { updated: true };
      } else {
        // Create new interaction with feedback
        const { error } = await supabase
          .from('technique_interactions')
          .insert({
            user_id: user.id,
            technique_id: techniqueId,
            technique_title: 'Unknown Technique', // This should be passed in or fetched
            feedback
          });
        
        if (error) throw error;
        
        // Update local stats
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
        
        result = { created: true };
      }
      
      // Update current feedback state
      setCurrentFeedback(feedback);
      
      toast({
        title: "Feedback recorded",
        description: "Thank you for your feedback on this technique.",
      });
      
      return result;
    } catch (error) {
      console.error('Error recording feedback:', error);
      toast({
        title: "Error recording feedback",
        description: "There was a problem saving your feedback.",
        variant: "destructive",
      });
      return { error };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    interactionStats,
    currentFeedback,
    isLoading,
    handleFeedback,
    handleInteraction
  };
};