
import React from 'react';
import FadeIn from '@/components/ui/FadeIn';
import QuestionnaireCard from '@/components/assessment/QuestionnaireCard';
import AssessmentHeader from '@/components/assessment/AssessmentHeader';
import AssessmentProgress from '@/components/assessment/AssessmentProgress';
import AssessmentNavigation from '@/components/assessment/AssessmentNavigation';
import { sampleQuestions } from '@/components/assessment/AssessmentData';

interface AssessmentContentProps {
  currentQuestionIndex: number;
  answers: Record<string, number>;
  onAnswer: (questionId: string, answer: number) => void;
  onPrevious: () => void;
  onNext: () => void;
}

const AssessmentContent = ({
  currentQuestionIndex,
  answers,
  onAnswer,
  onPrevious,
  onNext
}: AssessmentContentProps) => {
  const currentQuestion = sampleQuestions[currentQuestionIndex];
  
  return (
    <>
      <AssessmentHeader />
      
      <AssessmentProgress 
        currentIndex={currentQuestionIndex} 
        totalQuestions={sampleQuestions.length} 
      />
      
      <FadeIn key={currentQuestion.id}>
        <QuestionnaireCard
          question={currentQuestion}
          onAnswer={onAnswer}
          currentAnswer={answers[currentQuestion.id]}
        />
      </FadeIn>
      
      <AssessmentNavigation
        onPrevious={onPrevious}
        onNext={onNext}
        isFirstQuestion={currentQuestionIndex === 0}
        canProceed={!!answers[currentQuestion.id]}
      />
    </>
  );
};

export default AssessmentContent;
