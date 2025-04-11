
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StrengthsWeaknessChart from '@/components/profile/StrengthsWeaknessChart';
import ProgressChart from '@/components/profile/ProgressChart';
import AssessmentHistory from '@/components/profile/AssessmentHistory';
import FadeIn from '@/components/ui/FadeIn';
import { Calendar, Clock, Settings } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const Profile = () => {
  const { user } = useAuth();
  
  // Fetch the latest assessment data to show in the strengths chart
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

  // Transform data for the radar chart
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

  // Sample data for activity over time (will replace with real data)
  const activityData = [
    { date: 'Mon', focus: latestResult?.focus_level || 60, energy: latestResult?.energy_level || 80 },
    { date: 'Tue', focus: 45, energy: 70 },
    { date: 'Wed', focus: 75, energy: 65 },
    { date: 'Thu', focus: 50, energy: 50 },
    { date: 'Fri', focus: 60, energy: 75 },
    { date: 'Sat', focus: 80, energy: 85 },
    { date: 'Sun', focus: 65, energy: 60 },
  ];

  // Fetch the count of completed assessments
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
          <FadeIn>
            <div className="flex flex-col md:flex-row justify-between items-start mb-12">
              <div>
                <span className="inline-block bg-accent/10 text-accent px-4 py-1.5 rounded-full text-sm font-medium mb-4">
                  Your Profile
                </span>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">Profile Overview</h1>
                <p className="text-lg text-muted-foreground max-w-2xl">
                  Explore your neurodivergent strengths and patterns based on your assessments.
                </p>
              </div>
              <button className="mt-6 md:mt-0 btn-secondary flex items-center">
                <Settings size={16} className="mr-2" />
                Profile Settings
              </button>
            </div>
          </FadeIn>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <FadeIn delay={0.1}>
                <StrengthsWeaknessChart data={strengthsData} />
              </FadeIn>
            </div>
            
            <div>
              <FadeIn delay={0.2}>
                <div className="glass-card rounded-2xl p-6">
                  <h3 className="text-xl font-semibold mb-6">Completion Streak</h3>
                  <div className="flex items-center justify-center mb-6">
                    <div className="w-32 h-32 rounded-full border-8 border-accent flex items-center justify-center">
                      <div className="text-center">
                        <span className="block text-4xl font-bold">7</span>
                        <span className="text-sm text-muted-foreground">Days</span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-7 gap-2 mb-4">
                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                      <div 
                        key={i} 
                        className="aspect-square rounded-md flex items-center justify-center text-xs font-medium bg-accent/10 text-accent"
                      >
                        {day}
                      </div>
                    ))}
                  </div>
                  <div className="text-center text-muted-foreground text-sm">
                    Great work! You've completed 7 days in a row.
                  </div>
                </div>
              </FadeIn>
              
              <FadeIn delay={0.3}>
                <div className="glass-card rounded-2xl p-6 mt-8">
                  <h3 className="text-xl font-semibold mb-4">Quick Stats</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-3 border-b border-border">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center mr-3">
                          <Calendar size={16} className="text-accent" />
                        </div>
                        <span>Assessments Completed</span>
                      </div>
                      <span className="font-semibold">{assessmentCount}</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-border">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center mr-3">
                          <Clock size={16} className="text-accent" />
                        </div>
                        <span>Last Assessment</span>
                      </div>
                      <span className="font-semibold">
                        {latestResult ? new Date(latestResult.completed_at).toLocaleDateString() : 'Never'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center mr-3">
                          <Settings size={16} className="text-accent" />
                        </div>
                        <span>Techniques Applied</span>
                      </div>
                      <span className="font-semibold">8</span>
                    </div>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-8 mt-12">
            <FadeIn delay={0.3}>
              <ProgressChart />
            </FadeIn>
            
            <FadeIn delay={0.4}>
              <AssessmentHistory />
            </FadeIn>
          </div>
          
          <FadeIn delay={0.4}>
            <div className="mt-12 text-center">
              <h3 className="text-2xl font-bold mb-4">Insights Based on Your Profile</h3>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
                Your assessment data indicates you have strengths in creativity and pattern recognition, 
                which can be leveraged to help with task organization and time management.
              </p>
              <div className="inline-flex space-x-4">
                <a href="/techniques" className="btn-primary">
                  View Recommended Techniques
                </a>
                <a href="/assessment" className="btn-secondary">
                  Take Today's Assessment
                </a>
              </div>
            </div>
          </FadeIn>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Profile;
