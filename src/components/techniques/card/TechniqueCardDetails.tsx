
import React from 'react';

interface TechniqueCardDetailsProps {
  implementationSteps?: string[];
}

const TechniqueCardDetails: React.FC<TechniqueCardDetailsProps> = ({ implementationSteps }) => {
  if (!implementationSteps || implementationSteps.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">No implementation steps available.</p>
    );
  }

  return (
    <div>
      <ol className="list-decimal pl-5 space-y-2">
        {implementationSteps.map((step, index) => (
          <li key={index} className="text-sm">
            {step}
          </li>
        ))}
      </ol>
    </div>
  );
};

export default TechniqueCardDetails;
