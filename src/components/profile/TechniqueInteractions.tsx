
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import FadeIn from '@/components/ui/FadeIn';
import TechniqueStats from './techniques/TechniqueStats';
import TechniqueSummaryTable from './techniques/TechniqueSummaryTable';
import EmptyInteractions from './techniques/EmptyInteractions';

type TechniqueInteraction = {
  id: string;
  technique_id: string;
  technique_title: string;
  feedback: 'helpful' | 'not-helpful' | null;
  created_at: string;
};

type LatestAssessment = {
  id: string;
  completed_at: string;
  focus_level: number;
  energy_level: number;
  creativity_score: number;
  stress_level: number;
  emotional_regulation: number;
  organization: number;
  pattern_recognition: number;
  problem_solving: number;
  time_awareness: number;
};

const TechniqueInteractions = () => {
  const { user } = useAuth();

  const { data: interactions, isLoading: isLoadingInteractions } = useQuery({
    queryKey: ['techniqueInteractions', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('technique_interactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data as TechniqueInteraction[];
    },
    enabled: !!user,
  });

  const { data: latestAssessment, isLoading: isLoadingAssessment } = useQuery({
    queryKey: ['latestAssessment', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('assessment_results')
        .select('*')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false })
        .limit(1)
        .single();
        
      if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "no rows returned"
      return data as LatestAssessment;
    },
    enabled: !!user,
  });

  const isLoading = isLoadingInteractions || isLoadingAssessment;

  const getFeedbackCount = (type: 'helpful' | 'not-helpful' | null) => {
    if (!interactions) return 0;
    return interactions.filter(interaction => interaction.feedback === type).length;
  };

  // Group interactions by technique_id
  const groupedInteractions = interactions?.reduce((acc, interaction) => {
    if (!acc[interaction.technique_id]) {
      acc[interaction.technique_id] = {
        id: interaction.technique_id,
        title: interaction.technique_title,
        interactions: [],
        helpful: 0,
        notHelpful: 0,
        assessment: latestAssessment || null
      };
    }
    
    acc[interaction.technique_id].interactions.push(interaction);
    
    if (interaction.feedback === 'helpful') {
      acc[interaction.technique_id].helpful += 1;
    } else if (interaction.feedback === 'not-helpful') {
      acc[interaction.technique_id].notHelpful += 1;
    }
    
    return acc;
  }, {} as Record<string, {
    id: string;
    title: string;
    interactions: TechniqueInteraction[];
    helpful: number;
    notHelpful: number;
    assessment: LatestAssessment | null;
  }>);

  const techniqueSummary = groupedInteractions ? Object.values(groupedInteractions) : [];

  return (
    <div className="glass-card rounded-2xl p-6">
      <h3 className="text-xl font-semibold mb-6">Technique Interactions</h3>
      
      {isLoading ? (
        <div className="text-center py-6">Loading...</div>
      ) : !interactions || interactions.length === 0 ? (
        <EmptyInteractions />
      ) : (
        <FadeIn>
          <TechniqueStats 
            totalInteractions={interactions.length} 
            helpfulCount={getFeedbackCount('helpful')}
            notHelpfulCount={getFeedbackCount('not-helpful')}
          />
          
          {techniqueSummary.length > 0 && (
            <TechniqueSummaryTable 
              techniqueSummary={techniqueSummary} 
              latestAssessment={latestAssessment}
            />
          )}
        </FadeIn>
      )}
    </div>
  );
};

export default TechniqueInteractions;
