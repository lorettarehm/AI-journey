
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import LineChartDisplay from './charts/LineChartDisplay';
import ChartEmptyState from './charts/ChartEmptyState';

const ProgressChart = () => {
  const { user } = useAuth();

  const { data: assessments, isLoading } = useQuery({
    queryKey: ['progressChartData', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('assessment_results')
        .select('*')
        .order('completed_at', { ascending: true });
        
      if (error) throw error;
      
      // Transform the data for the chart
      return data?.map(assessment => ({
        date: format(new Date(assessment.completed_at), 'MMM d'),
        focus: assessment.focus_level,
        energy: assessment.energy_level,
        creativity: assessment.creativity_score,
        problemSolving: assessment.problem_solving,
        patternRecognition: assessment.pattern_recognition,
        organization: assessment.organization,
        timeAwareness: assessment.time_awareness,
      })) || [];
    },
    enabled: !!user,
  });

  const chartConfig = {
    focus: { color: "#4338CA" },
    energy: { color: "#F59E0B" },
    creativity: { color: "#10B981" },
    problemSolving: { color: "#6366F1" },
    patternRecognition: { color: "#EC4899" },
  };

  if (isLoading) {
    return (
      <div className="glass-card rounded-2xl p-6 animate-pulse">
        <div className="h-6 bg-accent/10 rounded w-1/4 mb-4"></div>
        <div className="h-64 bg-accent/5 rounded"></div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-6">
      <h3 className="text-xl font-semibold mb-4">Progress Over Time</h3>
      <p className="text-muted-foreground mb-6">
        Track how your cognitive abilities have changed over time based on your assessments.
      </p>
      
      {!assessments || assessments.length < 2 ? (
        <ChartEmptyState message="Need at least 2 assessments to generate a progress chart." />
      ) : (
        <LineChartDisplay data={assessments} chartConfig={chartConfig} />
      )}
    </div>
  );
};

export default ProgressChart;
