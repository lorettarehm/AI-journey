import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { startOfDay, endOfDay } from 'date-fns';

/**
 * Custom hook to check if the current user has completed an assessment today
 */
export const useHasAssessmentToday = () => {
  const { user } = useAuth();

  const { data: hasAssessmentToday = false, isLoading } = useQuery({
    queryKey: ['hasAssessmentToday', user?.id],
    queryFn: async () => {
      if (!user) return false;
      
      const start = startOfDay(new Date()).toISOString();
      const end = endOfDay(new Date()).toISOString();
      
      const { data, error } = await supabase
        .from('assessment_results')
        .select('id')
        .eq('user_id', user.id)
        .gte('completed_at', start)
        .lte('completed_at', end)
        .maybeSingle();
      
      if (error) {
        console.error('Error checking for today\'s assessment:', error);
        throw error;
      }
      
      return !!data;
    },
    enabled: !!user,
  });

  return { hasAssessmentToday, isLoading };
};