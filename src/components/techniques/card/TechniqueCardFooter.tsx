
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare, HelpCircle } from 'lucide-react';
import { TechniqueCardFeedback } from './index';

interface TechniqueCardFooterProps {
  id: string;
  title: string;
}

const TechniqueCardFooter: React.FC<TechniqueCardFooterProps> = ({ id, title }) => {
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);

  return (
    <div className="p-4 mt-auto flex justify-between items-center border-t border-border">
      <div className="flex space-x-2">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setFeedbackOpen(true)}
          className="flex items-center gap-1"
        >
          <MessageSquare className="h-4 w-4" />
          <span className="hidden sm:inline">Feedback</span>
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setSupportOpen(true)}
          className="flex items-center gap-1"
        >
          <HelpCircle className="h-4 w-4" />
          <span className="hidden sm:inline">Support</span>
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
