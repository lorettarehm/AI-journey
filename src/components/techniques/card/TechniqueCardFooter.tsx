
import React from 'react';
import { TechniqueCardDetails, TechniqueCardFeedback, TechniqueNutshell } from '.';

interface TechniqueCardFooterProps {
  id: string;
  title: string;
}

const TechniqueCardFooter: React.FC<TechniqueCardFooterProps> = ({ id, title }) => {
  return (
    <div className="p-6 pt-0 flex items-center justify-between">
      <div className="flex space-x-2">
        <TechniqueCardDetails id={id} title={title} />
        <TechniqueNutshell id={id} title={title} />
      </div>
      <TechniqueCardFeedback id={id} title={title} />
    </div>
  );
};

export default TechniqueCardFooter;
