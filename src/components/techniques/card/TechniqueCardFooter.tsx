
import React, { useState } from 'react';
import { TechniqueCardDetails, TechniqueCardFeedback, TechniqueNutshell } from '.';

interface TechniqueCardFooterProps {
  id: string;
  title: string;
}

const TechniqueCardFooter: React.FC<TechniqueCardFooterProps> = ({ id, title }) => {
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  
  return (
    <div className="p-6 pt-0 flex items-center justify-between">
      <div className="flex space-x-2">
        <TechniqueCardDetails id={id} title={title} />
        <TechniqueNutshell id={id} title={title} />
      </div>
      <TechniqueCardFeedback 
        open={feedbackOpen} 
        setOpen={setFeedbackOpen} 
        techniqueId={id} 
        techniqueName={title} 
        type="feedback" 
      />
    </div>
  );
};

export default TechniqueCardFooter;
