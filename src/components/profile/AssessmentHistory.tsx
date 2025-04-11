
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Calendar, Award } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

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
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Focus</TableHead>
                <TableHead>Energy</TableHead>
                <TableHead>Creativity</TableHead>
                <TableHead>Stress</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assessments.map((assessment) => (
                <TableRow key={assessment.id}>
                  <TableCell>
                    {formatDistanceToNow(new Date(assessment.completed_at), { addSuffix: true })}
                  </TableCell>
                  <TableCell>{assessment.focus_level}/100</TableCell>
                  <TableCell>{assessment.energy_level}/100</TableCell>
                  <TableCell>{assessment.creativity_score}/100</TableCell>
                  <TableCell>{assessment.stress_level}/100</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-6 text-muted-foreground">
          <Award size={32} className="mx-auto mb-2 text-accent/40" />
          <p>No assessment history yet. Complete an assessment to start tracking your progress!</p>
          <a href="/assessment" className="btn-secondary mt-4 inline-block">Take your first assessment</a>
        </div>
      )}
    </div>
  );
};

export default AssessmentHistory;
