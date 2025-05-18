import { supabase } from '@/integrations/supabase/client';
import { TechniqueType } from '../types';

// Fisher-Yates shuffle algorithm to randomize the order of techniques
export const shuffleArray = (array: TechniqueType[]): TechniqueType[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export const fetchTechniques = async (): Promise<TechniqueType[]> => {
  try {
    // Query the research_techniques table directly instead of the view
    // This avoids potential recursive issues with the view
    const { data, error } = await supabase
      .from('research_techniques')
      .select(`
        id,
        title,
        description,
        category,
        difficulty_level,
        effectiveness_score,
        implementation_steps,
        paper_id,
        research_papers(journal, publication_date)
      `)
      .limit(50);
    
    if (error) {
      console.error('Error fetching techniques:', error);
      throw error;
    }
    
    // Transform the data to match the expected format
    const techniques = data ? data.map(technique => ({
      technique_id: technique.id || '',
      title: technique.title || '',
      description: technique.description || '',
      category: technique.category as any || null,
      difficulty_level: technique.difficulty_level as any || null,
      effectiveness_score: technique.effectiveness_score || undefined,
      journal: technique.research_papers?.journal || undefined,
      publication_date: technique.research_papers?.publication_date || undefined,
      url: undefined,
      doi: undefined,
      implementation_steps: technique.implementation_steps || undefined,
    })) : [];
    
    return shuffleArray(techniques as TechniqueType[]);
  } catch (error) {
    console.error('Error fetching techniques:', error);
    
    // Fallback to direct data if database query fails
    return getFallbackTechniques();
  }
};

// Fallback techniques in case the database query fails
const getFallbackTechniques = (): TechniqueType[] => {
  const fallbackData: TechniqueType[] = [
    {
      technique_id: 'fallback-1',
      title: 'Pomodoro Technique',
      description: 'A time management method that uses a timer to break work into intervals, traditionally 25 minutes in length, separated by short breaks.',
      category: 'focus',
      difficulty_level: 'beginner',
      implementation_steps: [
        'Choose a task to be accomplished',
        'Set the Pomodoro timer (traditionally to 25 minutes)',
        'Work on the task until the timer rings',
        'Take a short break (5 minutes)',
        'After four pomodoros, take a longer break (15-30 minutes)'
      ]
    },
    {
      technique_id: 'fallback-2',
      title: 'Body Doubling',
      description: 'Working alongside another person to help maintain focus and motivation on tasks.',
      category: 'focus',
      difficulty_level: 'beginner',
      implementation_steps: [
        'Find a body double (friend, family member, colleague)',
        'Set up a time to work together (in person or virtually)',
        'Each person works on their own tasks',
        'The presence of another person helps maintain focus and accountability'
      ]
    },
    {
      technique_id: 'fallback-3',
      title: 'Sensory Regulation Toolkit',
      description: 'A personalized collection of tools and strategies to help manage sensory input and maintain optimal arousal levels.',
      category: 'sensory',
      difficulty_level: 'intermediate',
      implementation_steps: [
        'Identify personal sensory preferences and sensitivities',
        'Collect helpful sensory tools (noise-cancelling headphones, fidget toys, etc.)',
        'Create a portable kit for different environments',
        'Develop strategies for different sensory challenges',
        'Practice using tools proactively before becoming overwhelmed'
      ]
    },
    {
      technique_id: 'fallback-4',
      title: 'Time Blindness Management',
      description: 'Strategies to improve time awareness and estimation for those who struggle with perceiving the passage of time.',
      category: 'organization',
      difficulty_level: 'intermediate',
      implementation_steps: [
        'Use visual timers to make time passage visible',
        'Break tasks into smaller time chunks with clear endpoints',
        'Practice estimating task duration and compare with actual time',
        'Create time anchors throughout the day',
        'Use alarms and reminders for transitions'
      ]
    }
  ];
  
  return shuffleArray(fallbackData);
};

export const triggerResearchUpdate = async () => {
  try {
    // Call our edge function
    const response = await supabase.functions.invoke('fetch-research', {
      body: { searchQuery: 'adhd autism interventions recent expanded', limit: 50 }
    });
    
    if (!response.data.success) {
      throw new Error(response.data.error || 'Unknown error');
    }
    
    // Return additional data for the caller
    return {
      count: response.data.count || (response.data.data?.length || 0),
      message: response.data.message
    };
  } catch (error) {
    console.error('Error updating research:', error);
    throw error;
  }
};