
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StrengthsWeaknessChart from '@/components/profile/StrengthsWeaknessChart';
import ProgressChart from '@/components/profile/ProgressChart';
import AssessmentHistory from '@/components/profile/AssessmentHistory';
import TechniqueInteractions from '@/components/profile/TechniqueInteractions';
import FadeIn from '@/components/ui/FadeIn';
import ProfileHeader from '@/components/profile/ProfileHeader';
import QuickStats from '@/components/profile/QuickStats';
import CompletionStreak from '@/components/profile/CompletionStreak';
import ProfileInsights from '@/components/profile/ProfileInsights';
import WeeklyProgress from '@/components/progress/WeeklyProgress';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const Profile = () => {
  const { user } = useAuth();
  
  const { data: latestResult } = useQuery({
    queryKey: ['latestAssessment', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('assessment_results')
        .select('*')
        .order('completed_at', { ascending: false })
        .limit(1)
        .single();
        
      if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "no rows returned"
      return data;
    },
    enabled: !!user,
  });

  const strengthsData = [
    { area: 'Creativity', value: latestResult?.creativity_score || 90, fullMark: 100 },
    { area: 'Problem Solving', value: latestResult?.problem_solving || 80, fullMark: 100 },
    { area: 'Pattern Recognition', value: latestResult?.pattern_recognition || 85, fullMark: 100 },
    { area: 'Focus Duration', value: latestResult?.focus_duration || 40, fullMark: 100 },
    { area: 'Task Switching', value: latestResult?.task_switching || 45, fullMark: 100 },
    { area: 'Emotional Regulation', value: latestResult?.emotional_regulation || 60, fullMark: 100 },
    { area: 'Organization', value: latestResult?.organization || 50, fullMark: 100 },
    { area: 'Time Awareness', value: latestResult?.time_awareness || 35, fullMark: 100 },
  ];

  const { data: assessmentCount = 0 } = useQuery({
    queryKey: ['assessmentCount', user?.id],
    queryFn: async () => {
      if (!user) return 0;
      
      const { count, error } = await supabase
        .from('assessment_results')
        .select('*', { count: 'exact', head: true });
        
      if (error) throw error;
      return count || 0;
    },
    enabled: !!user,
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <ProfileHeader />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <FadeIn delay={0.1}>
                <StrengthsWeaknessChart data={strengthsData} />
              </FadeIn>
            </div>
            
            <div>
              <FadeIn delay={0.2}>
                <WeeklyProgress />
              </FadeIn>
              <div className="mt-8">
                <CompletionStreak />
              </div>
              <div className="mt-8">
                <QuickStats 
                  assessmentCount={assessmentCount} 
                  lastAssessmentDate={latestResult?.completed_at || null} 
                />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-8 mt-12">
            <FadeIn delay={0.3}>
              <ProgressChart />
            </FadeIn>
            
            <FadeIn delay={0.4}>
              <AssessmentHistory />
            </FadeIn>
            
            <FadeIn delay={0.5}>
              <TechniqueInteractions />
            </FadeIn>
          </div>
          
          <ProfileInsights />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Profile;
