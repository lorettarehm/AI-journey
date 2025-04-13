
import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AssessmentNavigationProps {
  onPrevious: () => void;
  onNext: () => void;
  isFirstQuestion: boolean;
  canProceed: boolean;
}

const AssessmentNavigation = ({ 
  onPrevious, 
  onNext, 
  isFirstQuestion, 
  canProceed 
}: AssessmentNavigationProps) => {
  return (
    <div className="flex justify-between mt-12">
      <Button
        onClick={onPrevious}
        disabled={isFirstQuestion}
        variant="ghost"
        className={`flex items-center ${
          isFirstQuestion 
            ? 'text-muted-foreground cursor-not-allowed' 
            : 'text-foreground hover:text-accent'
        }`}
      >
        <ArrowLeft size={16} className="mr-2" />
        Previous
      </Button>
      
      <Button
        onClick={onNext}
        disabled={!canProceed}
        variant="default"
        className={`flex items-center ${
          !canProceed 
            ? 'opacity-50 cursor-not-allowed' 
            : ''
        }`}
      >
        Next
        <ArrowRight size={16} className="ml-2" />
      </Button>
    </div>
  );
};

export default AssessmentNavigation;
