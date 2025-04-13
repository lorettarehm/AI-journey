
import { Question } from '@/components/assessment/AssessmentData';

export interface AssessmentScores {
  focus: number;
  energy: number;
  emotional: number;
  stress: number;
  creativity: number;
  focusDuration: number;
  taskSwitching: number;
  emotionalRegulation: number;
  organization: number;
  patternRecognition: number;
  problemSolving: number;
  timeAwareness: number;
}

export const calculateScores = (
  answers: Record<string, number>, 
  questions: Question[]
): AssessmentScores => {
  const allValues = Object.values(answers);
  const avg = allValues.length ? 
    allValues.reduce((sum, val) => sum + val, 0) / allValues.length : 
    50;
  
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
  
  const scores: Record<string, number> = {};
  
  Object.entries(categoryScores).forEach(([category, values]) => {
    if (values.length) {
      scores[category] = values.reduce((sum, val) => sum + val, 0) / values.length * 20;
    }
  });
  
  return {
    focus: scores.attention || avg * 20,
    energy: scores.hyperactivity || avg * 20,
    emotional: scores.emotional_regulation || avg * 20,
    stress: 100 - (scores.executive_function || avg * 20),
    creativity: scores.creativity || 70,
    focusDuration: scores.attention || 40,
    taskSwitching: scores.executive_function || 45,
    emotionalRegulation: scores.emotional_regulation || 60,
    organization: scores.organization || 50,
    patternRecognition: scores.pattern_recognition || 80,
    problemSolving: scores.problem_solving || 75,
    timeAwareness: scores.executive_function || 35
  };
};
