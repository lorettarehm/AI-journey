
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format, parseISO } from 'date-fns';
import LineChartDisplay from './charts/LineChartDisplay';
import ChartEmptyState from './charts/ChartEmptyState';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const METRICS = {
  focus: { color: "#4338CA" },
  energy: { color: "#F59E0B" },
  creativity: { color: "#10B981" },
  problemSolving: { color: "#6366F1" },
  patternRecognition: { color: "#EC4899" },
  organization: { color: "#8B5CF6" },
  timeAwareness: { color: "#059669" },
};

const METRIC_GROUPS = {
  "Cognitive": ["focus", "creativity", "problemSolving", "patternRecognition"],
  "Executive Function": ["organization", "timeAwareness"],
  "Emotional": ["energy"],
  "All": Object.keys(METRICS),
};

const ProgressChart = () => {
  const { user } = useAuth();
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(METRIC_GROUPS["All"]);

  const { data: assessments = [], isLoading } = useQuery({
    queryKey: ['progressChartData', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('assessment_results')
        .select('*')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: true });
        
      if (error) throw error;
      
      // Transform the data for the chart
      return data?.map(assessment => {
        const formattedDate = format(parseISO(assessment.completed_at), 'MMM d');
        
        // Map database fields to chart metrics
        return {
          date: formattedDate,
          focus: assessment.focus_level,
          energy: assessment.energy_level,
          creativity: assessment.creativity_score,
          problemSolving: assessment.problem_solving,
          patternRecognition: assessment.pattern_recognition,
          organization: assessment.organization,
          timeAwareness: assessment.time_awareness,
        };
      }) || [];
    },
    enabled: !!user,
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-semibold">Progress Over Time</CardTitle>
          <CardDescription>
            Track how your cognitive abilities have changed over time based on your assessments.
          </CardDescription>
        </CardHeader>
        <CardContent className="h-80 animate-pulse flex items-center justify-center bg-accent/5 rounded-md">
          <p className="text-muted-foreground">Loading progress data...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold">Progress Over Time</CardTitle>
        <CardDescription>
          Track how your cognitive abilities have changed over time based on your assessments.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex flex-wrap gap-2">
          {Object.entries(METRIC_GROUPS).map(([groupName, metrics]) => (
            <Button
              key={groupName}
              variant={selectedMetrics === metrics ? "secondary" : "outline"}
              size="sm"
              onClick={() => setSelectedMetrics(metrics)}
              className="text-xs"
            >
              {groupName}
            </Button>
          ))}
        </div>
        
        {!assessments || assessments.length < 2 ? (
          <ChartEmptyState message="Complete at least 2 assessments to generate a progress chart." />
        ) : (
          <LineChartDisplay 
            data={assessments} 
            chartConfig={METRICS} 
            metrics={selectedMetrics}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default ProgressChart;
