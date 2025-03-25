
import React from 'react';
import FadeIn from '@/components/ui/FadeIn';

const AssessmentHeader = () => {
  return (
    <FadeIn>
      <div className="text-center mb-12">
        <span className="inline-block bg-accent/10 text-accent px-4 py-1.5 rounded-full text-sm font-medium mb-4">
          Daily Assessment
        </span>
        <h1 className="text-3xl md:text-4xl font-bold mb-4">How Are You Today?</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          This assessment helps us understand your current state and provide personalized recommendations.
        </p>
      </div>
    </FadeIn>
  );
};

export default AssessmentHeader;
