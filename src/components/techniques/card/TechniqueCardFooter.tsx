
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Smile, Frown } from 'lucide-react';
import { TechniqueCardFeedback } from './index';
import { useTechniqueInteractions } from './useTechniqueInteractions';

interface TechniqueCardFooterProps {
  id: string;
  title: string;
}

const TechniqueCardFooter: React.FC<TechniqueCardFooterProps> = ({ id, title }) => {
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);
  const { handleFeedback, currentFeedback } = useTechniqueInteractions(id, title);

  return (
    <div className="p-4 mt-auto flex justify-between items-center border-t border-border">
      <div className="flex space-x-3">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => handleFeedback('helpful')}
          className={`flex items-center gap-2 ${
            currentFeedback === 'helpful' 
              ? 'bg-accent/10 text-accent border-accent' 
              : 'text-muted-foreground hover:text-white hover:bg-accent hover:border-accent'
          }`}
        >
          <Smile className="h-4 w-4" />
          <span>Helpful</span>
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => handleFeedback('not-helpful')}
          className={`flex items-center gap-2 ${
            currentFeedback === 'not-helpful' 
              ? 'bg-destructive/10 text-destructive border-destructive' 
              : 'text-muted-foreground hover:text-white hover:bg-destructive hover:border-destructive'
          }`}
        >
          <Frown className="h-4 w-4" />
          <span>Unhelpful</span>
        </Button>
      </div>

      {feedbackOpen && (
        <TechniqueCardFeedback
          open={feedbackOpen}
          setOpen={setFeedbackOpen}
          techniqueId={id}
          techniqueName={title}
          type="feedback"
        />
      )}

      {supportOpen && (
        <TechniqueCardFeedback
          open={supportOpen}
          setOpen={setSupportOpen}
          techniqueId={id}
          techniqueName={title}
          type="support"
        />
      )}
    </div>
  );
};

export default TechniqueCardFooter;
