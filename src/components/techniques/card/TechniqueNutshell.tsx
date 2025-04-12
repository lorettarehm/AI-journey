
import React from 'react';

interface TechniqueNutshellProps {
  descriptionText: string;
}

const TechniqueNutshell: React.FC<TechniqueNutshellProps> = ({ descriptionText }) => {
  return (
    <div className="prose prose-sm max-w-none">
      <h4 className="text-sm font-medium mb-1.5">In a Nutshell</h4>
      <p className="text-sm text-muted-foreground">{descriptionText}</p>
    </div>
  );
};

export default TechniqueNutshell;
