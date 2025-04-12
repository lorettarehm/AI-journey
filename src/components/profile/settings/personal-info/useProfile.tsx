
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

export interface Profile {
  id: string;
  full_name: string | null;
  email: string;
  avatar_url: string | null;
}

export const useProfile = () => {
  const { user } = useAuth();

  // Fetch user profile
  const {
    data: profile,
    isLoading,
    error
  } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const {
        data,
        error
      } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (error) throw error;
      return data as Profile;
    },
    enabled: !!user
  });

  return {
    profile,
    isLoading,
    error
  };
};
