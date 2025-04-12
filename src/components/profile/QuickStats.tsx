
import React from 'react';
import { Calendar, Clock, Settings, Brain, Zap, Battery } from 'lucide-react';
import FadeIn from '@/components/ui/FadeIn';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface QuickStatsProps {
  assessmentCount: number;
  lastAssessmentDate: string | null;
}

const QuickStats = ({ assessmentCount, lastAssessmentDate }: QuickStatsProps) => {
  const { user } = useAuth();
  
  const { data: techniqueCount = 0 } = useQuery({
    queryKey: ['techniqueCount', user?.id],
    queryFn: async () => {
      if (!user) return 0;
      
      const { count, error } = await supabase
        .from('technique_interactions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);
        
      if (error) throw error;
      return count || 0;
    },
    enabled: !!user,
  });
  
  const { data: latestAssessment } = useQuery({
    queryKey: ['latestAssessmentStats', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('assessment_results')
        .select('focus_level, energy_level, creativity_score')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false })
        .limit(1)
        .single();
        
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!user,
  });

  return (
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
              {lastAssessmentDate ? new Date(lastAssessmentDate).toLocaleDateString() : 'Never'}
            </span>
          </div>
          <div className="flex justify-between items-center pb-3 border-b border-border">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center mr-3">
                <Settings size={16} className="text-accent" />
              </div>
              <span>Techniques Applied</span>
            </div>
            <span className="font-semibold">{techniqueCount}</span>
          </div>
          
          {latestAssessment && (
            <>
              <div className="flex justify-between items-center pb-3 border-b border-border">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center mr-3">
                    <Brain size={16} className="text-accent" />
                  </div>
                  <span>Current Focus</span>
                </div>
                <span className="font-semibold">{latestAssessment.focus_level}/100</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-border">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center mr-3">
                    <Battery size={16} className="text-accent" />
                  </div>
                  <span>Current Energy</span>
                </div>
                <span className="font-semibold">{latestAssessment.energy_level}/100</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center mr-3">
                    <Zap size={16} className="text-accent" />
                  </div>
                  <span>Current Creativity</span>
                </div>
                <span className="font-semibold">{latestAssessment.creativity_score}/100</span>
              </div>
            </>
          )}
        </div>
      </div>
    </FadeIn>
  );
};

export default QuickStats;
