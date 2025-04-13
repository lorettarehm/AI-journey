
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Question } from '@/components/assessment/AssessmentData';
import { calculateScores, AssessmentScores } from '@/utils/assessment/scoring';

export interface AssessmentState {
  currentQuestionIndex: number;
  answers: Record<string, number>;
  completed: boolean;
  questions: Question[];
  loading: boolean;
}

export const useAssessment = (initialQuestions: Question[] = []) => {
  const [state, setState] = useState<AssessmentState>({
    currentQuestionIndex: 0,
    answers: {},
    completed: false,
    questions: initialQuestions,
    loading: true
  });
  
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const setQuestions = (questions: Question[]) => {
    setState(prev => ({ ...prev, questions, loading: false }));
  };
  
  const handleAnswer = (questionId: string, answer: number) => {
    setState(prev => ({
      ...prev,
      answers: {
        ...prev.answers,
        [questionId]: answer,
      },
    }));
  };
  
  const handleNext = () => {
    if (state.currentQuestionIndex < state.questions.length - 1) {
      setState(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1
      }));
    } else {
      setState(prev => ({
        ...prev,
        completed: true
      }));
      saveAssessmentResults();
    }
  };
  
  const handlePrevious = () => {
    if (state.currentQuestionIndex > 0) {
      setState(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex - 1
      }));
    }
  };
  
  const generateAssessmentDescription = (scores: AssessmentScores) => {
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
    
    return description;
  };
  
  const generateScoringRationale = (answers: Record<string, number>, scores: AssessmentScores) => {
    return `
      Based on ${Object.keys(answers).length} questions answered, the following scores were calculated:
      
      Focus: Calculated from attention-related questions, resulting in a score of ${scores.focus}/100.
      Energy: Derived from hyperactivity and impulsivity responses, scoring ${scores.energy}/100.
      Emotional Regulation: Based on emotional control questions, scoring ${scores.emotional}/100.
      Stress: Inverted from executive function responses, scoring ${scores.stress}/100.
      
      The raw responses were averaged within their categories and scaled to a 0-100 range.
    `;
  };
  
  const saveAssessmentResults = async () => {
    if (!user) return;
    
    try {
      const scores = calculateScores(state.answers, state.questions);
      
      const description = generateAssessmentDescription(scores);
      
      const scoringRationale = generateScoringRationale(state.answers, scores);
      
      const questionsJson = state.questions.map(q => ({
        id: q.id,
        text: q.text,
        type: q.type,
        category: q.category || null,
        source: q.source || null,
        optionsCount: q.options.length
      }));
      
      const { error } = await supabase
        .from('assessment_results')
        .insert({
          user_id: user.id,
          focus_level: scores.focus,
          energy_level: scores.energy,
          emotional_state: scores.emotional,
          stress_level: scores.stress,
          creativity_score: scores.creativity,
          focus_duration: scores.focusDuration,
          task_switching: scores.taskSwitching,
          emotional_regulation: scores.emotionalRegulation,
          organization: scores.organization,
          pattern_recognition: scores.patternRecognition,
          problem_solving: scores.problemSolving,
          time_awareness: scores.timeAwareness,
          questions_asked: questionsJson,
          responses_given: state.answers,
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
  
  const handleComplete = () => {
    navigate('/profile');
  };
  
  return {
    state,
    setQuestions,
    handleAnswer,
    handleNext,
    handlePrevious,
    handleComplete,
    saveAssessmentResults
  };
};
