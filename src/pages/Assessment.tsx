
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AssessmentContent from '@/components/assessment/AssessmentContent';
import CompletionMessage from '@/components/assessment/CompletionMessage';
import { sampleQuestions } from '@/components/assessment/AssessmentData';

const Assessment = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [completed, setCompleted] = useState(false);
  const navigate = useNavigate();
  
  const handleAnswer = (questionId: string, answer: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };
  
  const handleNext = () => {
    if (currentQuestionIndex < sampleQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setCompleted(true);
    }
  };
  
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };
  
  const handleComplete = () => {
    // In a real app, we would save the answers to the backend here
    navigate('/profile');
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {!completed ? (
            <AssessmentContent
              currentQuestionIndex={currentQuestionIndex}
              answers={answers}
              onAnswer={handleAnswer}
              onPrevious={handlePrevious}
              onNext={handleNext}
            />
          ) : (
            <CompletionMessage onComplete={handleComplete} />
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Assessment;
