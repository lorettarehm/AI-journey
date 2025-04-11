
import React from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TechniqueCardDetails from './TechniqueCardDetails';
import { useTechniqueInteractions } from './useTechniqueInteractions';

interface TechniqueCardFooterProps {
  id: string;
  title: string;
}

const TechniqueCardFooter: React.FC<TechniqueCardFooterProps> = ({ id, title }) => {
  const { interactionStats, currentFeedback, handleFeedback } = useTechniqueInteractions(id, title);
  
  return (
    <div className="border-t border-border/40 p-4">
      <div className="flex justify-between items-center">
        <div className="flex space-x-3">
          <Button 
            variant="ghost" 
            size="sm"
            className={`flex items-center ${currentFeedback === 'helpful' ? 'bg-accent/20 text-accent' : ''}`}
            onClick={() => handleFeedback('helpful')}
          >
            <ThumbsUp className="h-4 w-4 mr-1" />
            <span className="text-xs">{interactionStats?.helpfulCount || 0}</span>
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm"
            className={`flex items-center ${currentFeedback === 'not-helpful' ? 'bg-destructive/20 text-destructive' : ''}`}
            onClick={() => handleFeedback('not-helpful')}
          >
            <ThumbsDown className="h-4 w-4 mr-1" />
            <span className="text-xs">{interactionStats?.notHelpfulCount || 0}</span>
          </Button>
        </div>
        
        <TechniqueCardDetails id={id} title={title} />
      </div>
    </div>
  );
};

export default TechniqueCardFooter;
