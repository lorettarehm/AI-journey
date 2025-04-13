
import React from 'react';
import FadeIn from '@/components/ui/FadeIn';
import QuestionnaireCard from '@/components/assessment/QuestionnaireCard';
import AssessmentHeader from '@/components/assessment/AssessmentHeader';
import AssessmentProgress from '@/components/assessment/AssessmentProgress';
import AssessmentNavigation from '@/components/assessment/AssessmentNavigation';
import { Question } from '@/components/assessment/AssessmentData';

interface AssessmentContentProps {
  currentQuestionIndex: number;
  answers: Record<string, number>;
  onAnswer: (questionId: string, answer: number) => void;
  onPrevious: () => void;
  onNext: () => void;
  questions: Question[];
}

const AssessmentContent = ({
  currentQuestionIndex,
  answers,
  onAnswer,
  onPrevious,
  onNext,
  questions
}: AssessmentContentProps) => {
  const currentQuestion = questions[currentQuestionIndex];
  
  if (!currentQuestion) {
    return <div>No question available</div>;
  }
  
  // Check if the current question has an answer
  const hasCurrentAnswer = currentQuestion && 
                          currentQuestion.id in answers && 
                          answers[currentQuestion.id] !== undefined;
  
  return (
    <>
      <AssessmentHeader />
      
      <AssessmentProgress 
        currentIndex={currentQuestionIndex} 
        totalQuestions={questions.length} 
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
        canProceed={hasCurrentAnswer}
      />
    </>
  );
};

export default AssessmentContent;
