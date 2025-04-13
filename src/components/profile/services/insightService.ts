
import { supabase } from '@/integrations/supabase/client';

export interface Insight {
  area: string;
  description: string;
}

export interface UserInsights {
  strengths: Insight[];
  weaknesses: Insight[];
  generalInsight: string;
}

export const getStrengthsAndWeaknesses = async (userId: string): Promise<UserInsights> => {
  try {
    // Fetch the latest assessment data
    const { data: assessmentData, error: assessmentError } = await supabase
      .from('assessment_results')
      .select('*')
      .eq('user_id', userId)
      .order('completed_at', { ascending: false })
      .limit(1)
      .single();
    
    if (assessmentError) {
      console.error('Error fetching assessment data:', assessmentError);
      throw new Error('Failed to fetch assessment data');
    }
    
    if (!assessmentData) {
      return {
        strengths: [],
        weaknesses: [],
        generalInsight: "Complete an assessment to see personalized insights."
      };
    }
    
    // Map each attribute to a cognitive area with description
    const cognitiveAreas = [
      {
        field: 'creativity_score',
        value: assessmentData.creativity_score,
        area: 'Creativity',
        description: 'You excel at generating original ideas and thinking outside the box.'
      },
      {
        field: 'problem_solving',
        value: assessmentData.problem_solving,
        area: 'Problem Solving',
        description: 'You demonstrate strong abilities in finding solutions to complex challenges.'
      },
      {
        field: 'pattern_recognition',
        value: assessmentData.pattern_recognition,
        area: 'Pattern Recognition',
        description: 'You can easily identify connections and patterns where others might not see them.'
      },
      {
        field: 'focus_duration',
        value: assessmentData.focus_duration,
        area: 'Focus Duration',
        description: 'Improve your ability to maintain concentration for extended periods.'
      },
      {
        field: 'task_switching',
        value: assessmentData.task_switching,
        area: 'Task Switching',
        description: 'Work on transitioning between different activities smoothly without losing focus.'
      },
      {
        field: 'emotional_regulation',
        value: assessmentData.emotional_regulation,
        area: 'Emotional Regulation',
        description: 'Develop strategies to better manage emotional responses to stressors.'
      },
      {
        field: 'organization',
        value: assessmentData.organization,
        area: 'Organization',
        description: 'Create systems to better organize your tasks, environment, and information.'
      },
      {
        field: 'time_awareness',
        value: assessmentData.time_awareness,
        area: 'Time Awareness',
        description: 'Build skills to better estimate and manage time for various activities.'
      }
    ];
    
    // Threshold for determining strengths vs weaknesses
    const STRENGTH_THRESHOLD = 70;
    
    // Filter for strengths and weaknesses
    const strengths = cognitiveAreas
      .filter(item => item.value >= STRENGTH_THRESHOLD)
      .map(item => ({
        area: item.area,
        description: item.description
      }));
    
    const weaknesses = cognitiveAreas
      .filter(item => item.value < STRENGTH_THRESHOLD)
      .map(item => ({
        area: item.area,
        description: item.description
      }));
    
    // Generate general insight based on the data
    let generalInsight = `Based on your assessment from ${new Date(assessmentData.completed_at).toLocaleDateString()}, `;
    
    if (strengths.length > 0) {
      generalInsight += `you show particular strengths in ${strengths.slice(0, 2).map(s => s.area).join(" and ")}. `;
    }
    
    if (weaknesses.length > 0) {
      generalInsight += `You could benefit from focusing on improving your ${weaknesses.slice(0, 2).map(w => w.area).join(" and ")}.`;
    }
    
    return {
      strengths,
      weaknesses,
      generalInsight
    };
  } catch (error) {
    console.error('Error in getStrengthsAndWeaknesses:', error);
    return {
      strengths: [],
      weaknesses: [],
      generalInsight: "We're having trouble analyzing your data. Please try again later."
    };
  }
};
