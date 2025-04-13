
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AssessmentContent from '@/components/assessment/AssessmentContent';
import CompletionMessage from '@/components/assessment/CompletionMessage';
import { sampleQuestions, fetchRandomQuestions, Question } from '@/components/assessment/AssessmentData';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const Assessment = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [completed, setCompleted] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
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
      } finally {
        setLoading(false);
      }
    };
    
    loadQuestions();
  }, [toast]);
  
  const handleAnswer = (questionId: string, answer: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };
  
  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setCompleted(true);
      saveAssessmentResults();
    }
  };
  
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };
  
  const saveAssessmentResults = async () => {
    if (!user) return;
    
    try {
      // Calculate aggregated scores
      const scores = calculateScores();
      
      // Generate a description for this assessment
      const description = generateAssessmentDescription(scores);
      
      // Generate scoring rationale
      const scoringRationale = generateScoringRationale(answers, scores);
      
      // Save to Supabase
      const { error } = await supabase
        .from('assessment_results')
        .insert({
          user_id: user.id,
          focus_level: scores.focus || 50,
          energy_level: scores.energy || 50,
          emotional_state: scores.emotional || 50,
          stress_level: scores.stress || 50,
          creativity_score: scores.creativity || 70,
          focus_duration: scores.focusDuration || 40,
          task_switching: scores.taskSwitching || 45,
          emotional_regulation: scores.emotionalRegulation || 60,
          organization: scores.organization || 50,
          pattern_recognition: scores.patternRecognition || 80,
          problem_solving: scores.problemSolving || 75,
          time_awareness: scores.timeAwareness || 40,
          questions_asked: questions,
          responses_given: answers,
          scoring_rationale: scoringRationale,
          description: description
        });
      
      if (error) throw error;
      
      toast({
        title: "Assessment Saved",
        description: "Your assessment results have been saved successfully.",
      });
    } catch (error) {
      console.error('Error saving assessment:', error);
      toast({
        title: "Save Failed",
        description: "Failed to save your assessment results.",
        variant: "destructive",
      });
    }
  };
  
  const generateAssessmentDescription = (scores: Record<string, number>) => {
    // Generate a brief description based on the assessment results
    const date = new Date().toLocaleDateString();
    const time = new Date().toLocaleTimeString();
    
    let description = `Assessment completed on ${date} at ${time}. `;
    
    if (scores.focus > 70) {
      description += "Focus level is high. ";
    } else if (scores.focus < 40) {
      description += "Focus level is low. ";
    }
    
    if (scores.energy > 70) {
      description += "Energy level is high. ";
    } else if (scores.energy < 40) {
      description += "Energy level is low. ";
    }
    
    // Add more details based on other scores if needed
    return description;
  };
  
  const generateScoringRationale = (answers: Record<string, number>, scores: Record<string, number>) => {
    // Generate an explanation of how the answers were converted to scores
    return `
      Based on ${Object.keys(answers).length} questions answered, the following scores were calculated:
      
      Focus: Calculated from attention-related questions, resulting in a score of ${scores.focus}/100.
      Energy: Derived from hyperactivity and impulsivity responses, scoring ${scores.energy}/100.
      Emotional Regulation: Based on emotional control questions, scoring ${scores.emotional}/100.
      Stress: Inverted from executive function responses, scoring ${scores.stress}/100.
      
      The raw responses were averaged within their categories and scaled to a 0-100 range.
    `;
  };
  
  const calculateScores = () => {
    // Calculate aggregate scores from answers
    // This is a simplified version - in a real app you'd have more sophisticated scoring
    const allValues = Object.values(answers);
    const avg = allValues.length ? 
      allValues.reduce((sum, val) => sum + val, 0) / allValues.length : 
      50;
    
    // Map question categories to scores
    const categoryScores: Record<string, number[]> = {};
    
    questions.forEach(question => {
      const category = question.category || 'general';
      if (!categoryScores[category]) {
        categoryScores[category] = [];
      }
      if (answers[question.id] !== undefined) {
        categoryScores[category].push(answers[question.id]);
      }
    });
    
    // Calculate average for each category
    const scores: Record<string, number> = {};
    
    Object.entries(categoryScores).forEach(([category, values]) => {
      if (values.length) {
        scores[category] = values.reduce((sum, val) => sum + val, 0) / values.length * 20; // Scale to 0-100
      }
    });
    
    return {
      focus: scores.attention || avg * 20,
      energy: scores.hyperactivity || avg * 20,
      emotional: scores.emotional_regulation || avg * 20,
      stress: 100 - (scores.executive_function || avg * 20), // Invert for stress
      creativity: 70, // Default
      focusDuration: scores.attention || 40,
      taskSwitching: scores.executive_function || 45,
      emotionalRegulation: scores.emotional_regulation || 60,
      organization: scores.organization || 50,
      patternRecognition: 80, // Default
      problemSolving: 75, // Default
      timeAwareness: scores.executive_function || 35
    };
  };
  
  const handleComplete = () => {
    navigate('/profile');
  };
  
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
