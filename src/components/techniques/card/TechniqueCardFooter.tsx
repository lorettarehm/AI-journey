import React from 'react';
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { useTechniqueInteractions } from './useTechniqueInteractions';

interface TechniqueCardFooterProps {
  techniqueId: string;
}

const TechniqueCardFooter: React.FC<TechniqueCardFooterProps> = ({ techniqueId }) => {
  const { handleFeedback, currentFeedback, isLoading } = useTechniqueInteractions(techniqueId);

  return (
    <div className="p-4 border-t border-border flex justify-between items-center">
      <div className="text-sm text-muted-foreground">
        Was this technique helpful?
      </div>
      <div className="flex gap-2">
        <Button 
          variant={currentFeedback === 'helpful' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => handleFeedback('helpful')}
          className="flex items-center gap-1"
          disabled={isLoading}
        >
          <ThumbsUp className="h-4 w-4" />
          <span className="hidden sm:inline">Helpful</span>
        </Button>
        <Button 
          variant={currentFeedback === 'not-helpful' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => handleFeedback('not-helpful')}
          className="flex items-center gap-1"
          disabled={isLoading}
        >
          <ThumbsDown className="h-4 w-4" />
          <span className="hidden sm:inline">Not helpful</span>
        </Button>
      </div>
    </div>
  );
};

export default TechniqueCardFooter;