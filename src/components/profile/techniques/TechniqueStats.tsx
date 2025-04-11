
import React from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';

interface TechniqueStatsProps {
  totalInteractions: number;
  helpfulCount: number;
  notHelpfulCount: number;
}

const TechniqueStats = ({ totalInteractions, helpfulCount, notHelpfulCount }: TechniqueStatsProps) => {
  return (
    <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="glass-card rounded-xl p-4 text-center">
        <h4 className="text-sm text-muted-foreground mb-2">Total Interactions</h4>
        <p className="text-2xl font-semibold">{totalInteractions}</p>
      </div>
      <div className="glass-card rounded-xl p-4 text-center">
        <h4 className="text-sm text-muted-foreground mb-2">Helpful Feedback</h4>
        <div className="flex items-center justify-center">
          <ThumbsUp className="h-5 w-5 text-accent mr-2" />
          <p className="text-2xl font-semibold">{helpfulCount}</p>
        </div>
      </div>
      <div className="glass-card rounded-xl p-4 text-center">
        <h4 className="text-sm text-muted-foreground mb-2">Not Helpful</h4>
        <div className="flex items-center justify-center">
          <ThumbsDown className="h-5 w-5 text-destructive mr-2" />
          <p className="text-2xl font-semibold">{notHelpfulCount}</p>
        </div>
      </div>
    </div>
  );
};

export default TechniqueStats;
