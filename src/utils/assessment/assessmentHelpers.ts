import { Question } from '@/components/assessment/AssessmentData';
import { AssessmentScores } from '@/utils/assessment/scoring';
import { format } from 'date-fns';

// Transform questions to a format suitable for database storage
export const prepareQuestionsForStorage = (questions: Question[]) => {
  return questions.map(q => ({
    id: q.id,
    text: q.text,
    type: q.type,
    category: q.category || null,
    source: q.source || null,
    optionsCount: q.options.length
  }));
};

// Generate a human-readable description of the assessment results
export const generateAssessmentDescription = (scores: AssessmentScores) => {
  const formattedDate = format(new Date(), 'dd/MM/yyyy');
  const time = format(new Date(), 'HH:mm');
  
  let description = `Assessment completed on ${formattedDate} at ${time}. `;
  
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

// Generate a technical explanation of how scores were calculated
export const generateScoringRationale = (answers: Record<string, number>, scores: AssessmentScores) => {
  return `
    Based on ${Object.keys(answers).length} questions answered, the following scores were calculated:
    
    Focus: Calculated from attention-related questions, resulting in a score of ${scores.focus}/100.
    Energy: Derived from hyperactivity and impulsivity responses, scoring ${scores.energy}/100.
    Emotional Regulation: Based on emotional control questions, scoring ${scores.emotional}/100.
    Stress: Inverted from executive function responses, scoring ${scores.stress}/100.
    
    The raw responses were averaged within their categories and scaled to a 0-100 range.
  `;
};