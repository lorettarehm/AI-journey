
import React, { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AssessmentContent from '@/components/assessment/AssessmentContent';
import CompletionMessage from '@/components/assessment/CompletionMessage';
import { sampleQuestions, fetchRandomQuestions } from '@/components/assessment/AssessmentData';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAssessment } from '@/hooks/useAssessment';

const Assessment = () => {
  const { toast } = useToast();
  const {
    state: { currentQuestionIndex, answers, completed, questions, loading },
    setQuestions,
    handleAnswer,
    handleNext,
    handlePrevious,
    handleComplete
  } = useAssessment();
  
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const fetchedQuestions = await fetchRandomQuestions(5);
        setQuestions(fetchedQuestions);
      } catch (error) {
        console.error('Failed to load questions:', error);
        setQuestions(sampleQuestions);
        toast({
          title: "Failed to load questions",
          description: "Using default questions instead.",
          variant: "destructive",
        });
      }
    };
    
    loadQuestions();
  }, [toast, setQuestions]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-grow flex items-center justify-center pt-32 pb-20 px-6">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-accent" />
            <h2 className="text-xl font-medium">Loading assessment questions...</h2>
          </div>
        </main>
        
        <Footer />
      </div>
    );
  }
  
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
              questions={questions}
            />
          ) : (
            <CompletionMessage 
              onComplete={handleComplete}
              assessmentResults={answers}
            />
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Assessment;
