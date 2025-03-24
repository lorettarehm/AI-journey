
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import QuestionnaireCard from '@/components/assessment/QuestionnaireCard';
import FadeIn from '@/components/ui/FadeIn';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Sample questions for the assessment
const sampleQuestions = [
  {
    id: '1',
    text: 'How difficult was it to focus on tasks today?',
    type: 'scale' as const,
    options: [
      { value: 1, label: 'Not difficult' },
      { value: 2, label: '' },
      { value: 3, label: '' },
      { value: 4, label: '' },
      { value: 5, label: 'Very difficult' },
    ],
  },
  {
    id: '2',
    text: 'How would you rate your energy level today?',
    type: 'scale' as const,
    options: [
      { value: 1, label: 'Very low' },
      { value: 2, label: '' },
      { value: 3, label: '' },
      { value: 4, label: '' },
      { value: 5, label: 'Very high' },
    ],
  },
  {
    id: '3',
    text: 'Which of these best describes your ability to organize tasks today?',
    type: 'multiple-choice' as const,
    options: [
      { value: 1, label: 'I had significant difficulty organizing tasks' },
      { value: 2, label: 'I struggled somewhat with organization' },
      { value: 3, label: 'I was moderately organized' },
      { value: 4, label: 'I was well organized throughout the day' },
    ],
  },
  {
    id: '4',
    text: 'How often did you feel overwhelmed by sensory input today?',
    type: 'multiple-choice' as const,
    options: [
      { value: 1, label: 'Not at all' },
      { value: 2, label: 'Once or twice' },
      { value: 3, label: 'Several times' },
      { value: 4, label: 'Throughout most of the day' },
    ],
  },
  {
    id: '5',
    text: 'How would you rate your overall mood today?',
    type: 'scale' as const,
    options: [
      { value: 1, label: 'Very low' },
      { value: 2, label: '' },
      { value: 3, label: '' },
      { value: 4, label: '' },
      { value: 5, label: 'Very high' },
    ],
  },
];

const Assessment = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [completed, setCompleted] = useState(false);
  const navigate = useNavigate();
  
  const currentQuestion = sampleQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex) / sampleQuestions.length) * 100;
  
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
            <>
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
              
              <div className="mb-8">
                <div className="w-full bg-secondary rounded-full h-2">
                  <div 
                    className="bg-accent h-2 rounded-full transition-all duration-500 ease-in-out" 
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                  <span>Question {currentQuestionIndex + 1} of {sampleQuestions.length}</span>
                  <span>{Math.round(progress)}% Complete</span>
                </div>
              </div>
              
              <FadeIn key={currentQuestion.id} duration={0.3}>
                <QuestionnaireCard
                  question={currentQuestion}
                  onAnswer={handleAnswer}
                  currentAnswer={answers[currentQuestion.id]}
                />
              </FadeIn>
              
              <div className="flex justify-between mt-12">
                <button
                  onClick={handlePrevious}
                  disabled={currentQuestionIndex === 0}
                  className={`flex items-center ${
                    currentQuestionIndex === 0 
                      ? 'text-muted-foreground cursor-not-allowed' 
                      : 'text-foreground hover:text-accent'
                  }`}
                >
                  <ArrowLeft size={16} className="mr-2" />
                  Previous
                </button>
                
                <button
                  onClick={handleNext}
                  disabled={!answers[currentQuestion.id]}
                  className={`btn-primary ${
                    !answers[currentQuestion.id] 
                      ? 'opacity-50 cursor-not-allowed' 
                      : ''
                  }`}
                >
                  Next
                  <ArrowRight size={16} className="ml-2" />
                </button>
              </div>
            </>
          ) : (
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
                <button onClick={handleComplete} className="btn-primary">
                  View Your Profile
                </button>
              </div>
            </FadeIn>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Assessment;
