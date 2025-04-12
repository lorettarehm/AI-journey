
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface CommonTraitsProps {
  onSelectTrait: (trait: string) => void;
}

const CommonTraits: React.FC<CommonTraitsProps> = ({ onSelectTrait }) => {
  // Common neurodivergent traits that users can quickly add
  const commonTraits = [
    "ADHD", "Autism", "Dyslexia", "Dyscalculia", "Dyspraxia", 
    "Hyperfocus", "Sensory Sensitivity", "Pattern Recognition",
    "Creative Thinking", "Hyperlexia", "Synesthesia"
  ];

  return (
    <div className="border-t p-6">
      <h4 className="font-medium mb-3">Common Neurodivergent Traits</h4>
      <div className="flex flex-wrap gap-2">
        {commonTraits.map((trait) => (
          <Badge 
            key={trait} 
            variant="outline" 
            className="cursor-pointer hover:bg-accent/10"
            onClick={() => onSelectTrait(trait)}
          >
            {trait}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default CommonTraits;
