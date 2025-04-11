
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { format } from 'date-fns';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

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

  if (isLoading) {
    return (
      <div className="glass-card rounded-2xl p-6 animate-pulse">
        <div className="h-6 bg-accent/10 rounded w-1/4 mb-4"></div>
        <div className="h-64 bg-accent/5 rounded"></div>
      </div>
    );
  }

  if (!assessments || assessments.length < 2) {
    return (
      <div className="glass-card rounded-2xl p-6">
        <h3 className="text-xl font-semibold mb-2">Progress Over Time</h3>
        <p className="text-muted-foreground mb-4">
          Complete more assessments to see your progress charted over time.
        </p>
        <div className="bg-accent/5 rounded-lg p-8 text-center">
          <p>Need at least 2 assessments to generate a progress chart.</p>
        </div>
      </div>
    );
  }

  const chartConfig = {
    focus: { color: "#4338CA" },
    energy: { color: "#F59E0B" },
    creativity: { color: "#10B981" },
    problemSolving: { color: "#6366F1" },
    patternRecognition: { color: "#EC4899" },
  };

  return (
    <div className="glass-card rounded-2xl p-6">
      <h3 className="text-xl font-semibold mb-4">Progress Over Time</h3>
      <p className="text-muted-foreground mb-6">
        Track how your cognitive abilities have changed over time based on your assessments.
      </p>
      
      <div className="h-80">
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={assessments}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 100]} />
              <Tooltip content={<ChartTooltipContent />} />
              <Legend />
              <Line type="monotone" dataKey="focus" stroke={chartConfig.focus.color} name="Focus" />
              <Line type="monotone" dataKey="energy" stroke={chartConfig.energy.color} name="Energy" />
              <Line type="monotone" dataKey="creativity" stroke={chartConfig.creativity.color} name="Creativity" />
              <Line type="monotone" dataKey="problemSolving" stroke={chartConfig.problemSolving.color} name="Problem Solving" />
              <Line type="monotone" dataKey="patternRecognition" stroke={chartConfig.patternRecognition.color} name="Pattern Recognition" />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  );
};

export default ProgressChart;
