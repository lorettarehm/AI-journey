
import React from 'react';
import { TechniqueCardHeader, TechniqueCardFooter } from './card';

interface TechniqueCardProps {
  id: string;
  title: string;
  description: string;
  category: 'focus' | 'organization' | 'sensory' | 'social';
  source?: string;
  researchBased?: boolean;
}

const TechniqueCard: React.FC<TechniqueCardProps> = ({
  id,
  title,
  description,
  category,
  source,
  researchBased = false,
}) => {
  return (
    <div className="glass-card h-full flex flex-col">
      <TechniqueCardHeader
        title={title}
        description={description}
        category={category}
        source={source}
        researchBased={researchBased}
      />
      <TechniqueCardFooter
        id={id}
        title={title}
      />
    </div>
  );
};

export default TechniqueCard;
