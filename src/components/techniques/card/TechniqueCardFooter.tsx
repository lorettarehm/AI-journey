
import React from 'react';
import { TechniqueCardDetails, useTechniqueInteractions } from '.';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown } from 'lucide-react';

interface TechniqueCardFooterProps {
  id: string;
  title: string;
}

const TechniqueCardFooter: React.FC<TechniqueCardFooterProps> = ({ id, title }) => {
  const { handleFeedback, currentFeedback, interactionStats } = useTechniqueInteractions(id, title);
  
  return (
    <div className="p-6 pt-0 flex items-center justify-between">
      <div className="flex space-x-2">
        <TechniqueCardDetails id={id} title={title} />
        <span className="text-xs text-accent font-medium flex items-center px-2">
          🔜 Video demos
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="sm" 
          className={`flex items-center ${currentFeedback === 'helpful' ? 'text-green-500' : ''}`} 
          onClick={() => handleFeedback('helpful')}
        >
          <ThumbsUp className="h-4 w-4 mr-1" />
          <span className="text-xs">Helpful</span>
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className={`flex items-center ${currentFeedback === 'not-helpful' ? 'text-red-500' : ''}`} 
          onClick={() => handleFeedback('not-helpful')}
        >
          <ThumbsDown className="h-4 w-4 mr-1" />
          <span className="text-xs">Unhelpful</span>
        </Button>
      </div>
    </div>
  );
};

export default TechniqueCardFooter;
