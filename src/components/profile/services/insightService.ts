
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

export interface Insight {
  area: string;
  description: string;
}

export interface UserInsights {
  id?: string;
  strengths: Insight[];
  weaknesses: Insight[];
  generalInsight: string;
  createdAt?: string;
  assessmentId?: string;
}

// Get the latest insights or generate new ones
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
    
    // Generate more varied and dynamic general insight based on the data
    const formattedDate = format(new Date(assessmentData.completed_at), 'dd/MM/yyyy');
    const currentHour = new Date().getHours();
    
    // Dynamic parts of the insight message
    const timeContext = currentHour < 12 ? "morning" : 
                         currentHour < 18 ? "afternoon" : "evening";
    
    const strengthsPhrase = strengths.length > 0 
      ? `your notable strengths include ${strengths.slice(0, 2).map(s => s.area).join(" and ")}` 
      : "you haven't yet developed strong areas based on our assessment criteria";
    
    const weaknessesPhrase = weaknesses.length > 0 
      ? `focusing on improving ${weaknesses.slice(0, 2).map(w => w.area).join(" and ")} could help you achieve better outcomes` 
      : "you're doing well across all assessed areas";
    
    // Choose a random insight template to make the text feel more varied
    const insightTemplates = [
      `Based on your assessment from ${formattedDate}, ${strengthsPhrase}. For this ${timeContext}, ${weaknessesPhrase}.`,
      `Your ${formattedDate} assessment shows that ${strengthsPhrase}. As you continue your journey, ${weaknessesPhrase}.`,
      `According to your recent assessment (${formattedDate}), ${strengthsPhrase}. To progress further, ${weaknessesPhrase}.`,
      `The data from ${formattedDate} suggests that ${strengthsPhrase}. For best results, ${weaknessesPhrase}.`
    ];
    
    const generalInsight = insightTemplates[Math.floor(Math.random() * insightTemplates.length)];
    
    // Save the new insights to the history table
    const insightToSave = {
      user_id: userId,
      general_insight: generalInsight,
      strengths: strengths,
      weaknesses: weaknesses,
      assessment_id: assessmentData.id
    };
    
    const { data: savedInsight, error: saveError } = await supabase
      .from('user_insight_history')
      .insert(insightToSave)
      .select('id, created_at')
      .single();
    
    if (saveError) {
      console.error('Error saving insight history:', saveError);
    }
    
    return {
      id: savedInsight?.id,
      strengths,
      weaknesses,
      generalInsight,
      createdAt: savedInsight?.created_at,
      assessmentId: assessmentData.id
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

// Get the history of insights for a user
export const getInsightHistory = async (userId: string): Promise<UserInsights[]> => {
  try {
    const { data: history, error } = await supabase
      .from('user_insight_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (error) {
      console.error('Error fetching insight history:', error);
      throw error;
    }
    
    return history.map(item => ({
      id: item.id,
      generalInsight: item.general_insight,
      strengths: item.strengths || [],
      weaknesses: item.weaknesses || [],
      createdAt: item.created_at,
      assessmentId: item.assessment_id
    }));
  } catch (error) {
    console.error('Error in getInsightHistory:', error);
    return [];
  }
};
