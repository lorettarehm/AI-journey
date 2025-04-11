
import React from 'react';
import { Award } from 'lucide-react';

const EmptyAssessment = () => {
  return (
    <div className="text-center py-6 text-muted-foreground">
      <Award size={32} className="mx-auto mb-2 text-accent/40" />
      <p>No assessment history yet. Complete an assessment to start tracking your progress!</p>
      <a href="/assessment" className="btn-secondary mt-4 inline-block">Take your first assessment</a>
    </div>
  );
};

export default EmptyAssessment;
