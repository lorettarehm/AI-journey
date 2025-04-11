
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';
import { ThumbsUp, ThumbsDown, Clock } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import FadeIn from '@/components/ui/FadeIn';

type TechniqueInteraction = {
  id: string;
  technique_id: string;
  technique_title: string;
  feedback: 'helpful' | 'not-helpful' | null;
  created_at: string;
};

const TechniqueInteractions = () => {
  const { user } = useAuth();

  const { data: interactions, isLoading } = useQuery({
    queryKey: ['techniqueInteractions', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('technique_interactions')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data as TechniqueInteraction[];
    },
    enabled: !!user,
  });

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
        notHelpful: 0
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
  }>);

  const techniqueSummary = groupedInteractions ? Object.values(groupedInteractions) : [];

  return (
    <div className="glass-card rounded-2xl p-6">
      <h3 className="text-xl font-semibold mb-6">Technique Interactions</h3>
      
      {isLoading ? (
        <div className="text-center py-6">Loading...</div>
      ) : !techniqueSummary || techniqueSummary.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p>You haven't interacted with any techniques yet.</p>
          <p className="mt-2">Explore the techniques page to find strategies that might help you.</p>
        </div>
      ) : (
        <FadeIn>
          <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass-card rounded-xl p-4 text-center">
              <h4 className="text-sm text-muted-foreground mb-2">Total Interactions</h4>
              <p className="text-2xl font-semibold">{interactions?.length || 0}</p>
            </div>
            <div className="glass-card rounded-xl p-4 text-center">
              <h4 className="text-sm text-muted-foreground mb-2">Helpful Feedback</h4>
              <div className="flex items-center justify-center">
                <ThumbsUp className="h-5 w-5 text-accent mr-2" />
                <p className="text-2xl font-semibold">{getFeedbackCount('helpful')}</p>
              </div>
            </div>
            <div className="glass-card rounded-xl p-4 text-center">
              <h4 className="text-sm text-muted-foreground mb-2">Not Helpful</h4>
              <div className="flex items-center justify-center">
                <ThumbsDown className="h-5 w-5 text-destructive mr-2" />
                <p className="text-2xl font-semibold">{getFeedbackCount('not-helpful')}</p>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Technique</TableHead>
                  <TableHead>Interactions</TableHead>
                  <TableHead>Helpful</TableHead>
                  <TableHead>Not Helpful</TableHead>
                  <TableHead>Last Interaction</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {techniqueSummary.map((technique) => (
                  <TableRow key={technique.id}>
                    <TableCell className="font-medium">{technique.title}</TableCell>
                    <TableCell>{technique.interactions.length}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <ThumbsUp className="h-4 w-4 text-accent mr-2" />
                        {technique.helpful}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <ThumbsDown className="h-4 w-4 text-destructive mr-2" />
                        {technique.notHelpful}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                        {format(new Date(technique.interactions[0].created_at), 'MMM d, yyyy')}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          <div className="mt-6">
            <h4 className="font-medium mb-4">Recent Interactions</h4>
            <div className="space-y-3">
              {interactions?.slice(0, 5).map((interaction) => (
                <div key={interaction.id} className="glass-card-secondary rounded-lg p-3 flex justify-between items-center">
                  <div>
                    <p className="font-medium">{interaction.technique_title}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(interaction.created_at), 'MMM d, yyyy - h:mm a')}
                    </p>
                  </div>
                  {interaction.feedback && (
                    <div>
                      {interaction.feedback === 'helpful' ? (
                        <div className="bg-accent/10 text-accent p-1 rounded-full">
                          <ThumbsUp size={16} />
                        </div>
                      ) : (
                        <div className="bg-destructive/10 text-destructive p-1 rounded-full">
                          <ThumbsDown size={16} />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      )}
    </div>
  );
};

export default TechniqueInteractions;
