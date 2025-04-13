
import React from 'react';
import { format } from 'date-fns';
import { ThumbsUp, ThumbsDown } from 'lucide-react';

interface TechniqueInteraction {
  id: string;
  technique_id: string;
  technique_title: string;
  feedback: 'helpful' | 'not-helpful' | null;
  created_at: string;
}

interface RecentInteractionsProps {
  interactions: TechniqueInteraction[];
}

const RecentInteractions = ({ interactions = [] }: RecentInteractionsProps) => {
  return (
    <div className="mt-6">
      <h4 className="font-medium mb-4">Recent Interactions</h4>
      <div className="space-y-3">
        {interactions.slice(0, 5).map((interaction) => (
          <div key={interaction.id} className="glass-card-secondary rounded-lg p-3 flex justify-between items-center">
            <div>
              <p className="font-medium">{interaction.technique_title}</p>
              <p className="text-xs text-muted-foreground">
                {format(new Date(interaction.created_at), 'dd/MM/yyyy - HH:mm')}
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
  );
};

export default RecentInteractions;
