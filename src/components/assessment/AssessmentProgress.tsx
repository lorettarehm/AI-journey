
import React from 'react';

interface AssessmentProgressProps {
  currentIndex: number;
  totalQuestions: number;
}

const AssessmentProgress = ({ currentIndex, totalQuestions }: AssessmentProgressProps) => {
  const progress = ((currentIndex) / totalQuestions) * 100;
  
  return (
    <div className="mb-8">
      <div className="w-full bg-secondary rounded-full h-2">
        <div 
          className="bg-accent h-2 rounded-full transition-all duration-500 ease-in-out" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className="flex justify-between mt-2 text-sm text-muted-foreground">
        <span>Question {currentIndex + 1} of {totalQuestions}</span>
        <span>{Math.round(progress)}% Complete</span>
      </div>
    </div>
  );
};

export default AssessmentProgress;
