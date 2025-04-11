
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Calendar } from 'lucide-react';
import AssessmentTable from './assessment/AssessmentTable';
import EmptyAssessment from './assessment/EmptyAssessment';

const AssessmentHistory = () => {
  const { user } = useAuth();

  const { data: assessments, isLoading } = useQuery({
    queryKey: ['assessmentHistory', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('assessment_results')
        .select('*')
        .order('completed_at', { ascending: false });
        
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  if (isLoading) {
    return (
      <div className="glass-card rounded-2xl p-6 animate-pulse">
        <div className="h-6 bg-accent/10 rounded w-1/3 mb-4"></div>
        <div className="h-32 bg-accent/5 rounded"></div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-6">
      <h3 className="text-xl font-semibold mb-6 flex items-center">
        <Calendar size={20} className="mr-2 text-accent" />
        Assessment History
      </h3>
      
      {assessments && assessments.length > 0 ? (
        <AssessmentTable assessments={assessments} />
      ) : (
        <EmptyAssessment />
      )}
    </div>
  );
};

export default AssessmentHistory;
