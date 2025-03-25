
import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

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
      <button
        onClick={onPrevious}
        disabled={isFirstQuestion}
        className={`flex items-center ${
          isFirstQuestion 
            ? 'text-muted-foreground cursor-not-allowed' 
            : 'text-foreground hover:text-accent'
        }`}
      >
        <ArrowLeft size={16} className="mr-2" />
        Previous
      </button>
      
      <button
        onClick={onNext}
        disabled={!canProceed}
        className={`btn-primary ${
          !canProceed 
            ? 'opacity-50 cursor-not-allowed' 
            : ''
        }`}
      >
        Next
        <ArrowRight size={16} className="ml-2" />
      </button>
    </div>
  );
};

export default AssessmentNavigation;
