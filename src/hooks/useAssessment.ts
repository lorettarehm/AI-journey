import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Question } from '@/components/assessment/AssessmentData';
import { calculateScores } from '@/utils/assessment/scoring';
import { prepareQuestionsForStorage, generateAssessmentDescription, generateScoringRationale } from '@/utils/assessment/assessmentHelpers';

export interface AssessmentState {
  currentQuestionIndex: number;
  answers: Record<string, number>;
  completed: boolean;
  questions: Question[];
  loading: boolean;
  saved: boolean;
  saving: boolean;
}

export const useAssessment = (initialQuestions: Question[] = []) => {
  const [state, setState] = useState<AssessmentState>({
    currentQuestionIndex: 0,
    answers: {},
    completed: false,
    questions: initialQuestions,
    loading: initialQuestions.length === 0,
    saved: false,
    saving: false
  });
  
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const setQuestions = useCallback((questions: Question[]) => {
    setState(prev => ({ ...prev, questions, loading: false }));
  }, []);
  
  const handleAnswer = useCallback((questionId: string, answer: number) => {
    setState(prev => ({
      ...prev,
      answers: {
        ...prev.answers,
        [questionId]: answer,
      },
    }));
  }, []);
  
  const handleNext = useCallback(() => {
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
    }
  }, [state.currentQuestionIndex, state.questions.length]);
  
  const handlePrevious = useCallback(() => {
    if (state.currentQuestionIndex > 0) {
      setState(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex - 1
      }));
    }
  }, [state.currentQuestionIndex]);
  
  const saveAssessmentResults = useCallback(async () => {
    if (!user || state.saved || state.saving || Object.keys(state.answers).length === 0) return;
    
    // Set saving state to true to prevent multiple simultaneous saves
    setState(prev => ({ ...prev, saving: true }));
    
    try {
      const scores = calculateScores(state.answers, state.questions);
      
      const description = generateAssessmentDescription(scores);
      const scoringRationale = generateScoringRationale(state.answers, scores);
      const questionsJson = prepareQuestionsForStorage(state.questions);
      
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
      
      setState(prev => ({ ...prev, saved: true, saving: false }));
    } catch (error) {
      console.error('Error saving assessment:', error);
      toast({
        title: "Save Failed",
        description: "Failed to save your assessment results.",
        variant: "destructive",
      });
      setState(prev => ({ ...prev, saving: false }));
    }
  }, [user, state.answers, state.questions, state.saved, state.saving, toast]);
  
  const handleComplete = useCallback(() => {
    navigate('/profile');
  }, [navigate]);
  
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