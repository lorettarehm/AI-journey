
import React from 'react';
import { Check } from 'lucide-react';
import FadeIn from '@/components/ui/FadeIn';

interface CompletionMessageProps {
  onComplete: () => void;
  assessmentResults: Record<string, number>;
}

const CompletionMessage = ({ onComplete, assessmentResults }: CompletionMessageProps) => {
  return (
    <FadeIn>
      <div className="glass-card rounded-2xl p-8 text-center max-w-2xl mx-auto">
        <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check size={32} className="text-accent" />
        </div>
        <h2 className="text-2xl font-bold mb-4">Assessment Completed!</h2>
        <p className="text-lg text-muted-foreground mb-8">
          Thank you for completing today's assessment. Your responses help us provide
          personalized recommendations to support your neurodivergent journey.
        </p>
        <button onClick={onComplete} className="btn-primary">
          View Your Profile
        </button>
      </div>
    </FadeIn>
  );
};

export default CompletionMessage;
