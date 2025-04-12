
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format, subDays } from 'date-fns';
import HeroContent from './HeroContent';
import UserCard from './UserCard';

const Hero = () => {
  const { user } = useAuth();
  
  // Fetch latest assessment data for daily check-in display
  const { data: latestAssessment, isLoading: isAssessmentLoading } = useQuery({
    queryKey: ['latestAssessment', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('assessment_results')
        .select('*')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false })
        .limit(1)
        .maybeSingle();
        
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
  
  const { data: weeklyData = [] } = useQuery({
    queryKey: ['homePageProgress', user?.id],
    queryFn: async () => {
      if (!user) {
        // Return mock data for non-logged in users
        return Array.from({ length: 7 }).map((_, i) => ({
          date: format(subDays(new Date(), 6 - i), 'EEE'),
          completed: i < 5, // First 5 days are "completed"
          value: Math.random() * 50 + 30 // Random height for visual interest
        }));
      }
      
      // Fetch real data for logged in users
      const { data, error } = await supabase
        .from('assessment_results')
        .select('completed_at')
        .eq('user_id', user.id)
        .gte('completed_at', subDays(new Date(), 7).toISOString());
        
      if (error) throw error;
      
      // Create a map of dates to completion status
      const assessmentMap = data.reduce((acc: Record<string, boolean>, result) => {
        const date = format(new Date(result.completed_at), 'yyyy-MM-dd');
        acc[date] = true;
        return acc;
      }, {});
      
      // Generate the last 7 days
      const days = Array.from({ length: 7 }).map((_, i) => {
        const date = subDays(new Date(), 6 - i);
        const dateStr = format(date, 'yyyy-MM-dd');
        const dayLabel = format(date, 'EEE');
        
        return {
          date: dayLabel,
          completed: !!assessmentMap[dateStr],
          value: assessmentMap[dateStr] ? Math.random() * 50 + 30 : 10
        };
      });
      
      return days;
    },
    enabled: !!user // Only run this query when user is logged in
  });

  return (
    <section className="pt-32 pb-20 px-6 relative overflow-hidden">
      {/* Abstract Background Shapes */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl">
        <div className="absolute top-20 right-16 w-72 h-72 rounded-full bg-accent/5 animate-float"></div>
        <div className="absolute top-40 -left-24 w-96 h-96 rounded-full bg-accent/5 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 right-32 w-48 h-48 rounded-full bg-accent/5 animate-float" style={{ animationDelay: '1s' }}></div>
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <HeroContent />
          <UserCard 
            user={user}
            latestAssessment={latestAssessment}
            weeklyData={weeklyData}
            isAssessmentLoading={isAssessmentLoading}
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
