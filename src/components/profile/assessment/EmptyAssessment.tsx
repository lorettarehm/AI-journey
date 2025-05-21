
import React from 'react';
import { Award } from 'lucide-react';
import { useHasAssessmentToday } from '@/hooks/useHasAssessmentToday';

const EmptyAssessment = () => {
  const { hasAssessmentToday } = useHasAssessmentToday();
  return (
    <div className="text-center py-6 text-muted-foreground">
      <Award size={32} className="mx-auto mb-2 text-accent/40" />
      <p>No assessment history yet. Complete an assessment to start tracking your progress!</p>
      <a href="/assessment" className="btn-secondary mt-4 inline-block">
        {hasAssessmentToday ? "Re-take your assessment" : "Take your first assessment"}
      </a>
    </div>
  );
};

export default EmptyAssessment;
