
import React from 'react';
import { Badge } from '@/components/ui/badge';
import InfoTooltip from './InfoTooltip';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

interface CommonTraitsProps {
  onSelectTrait: (trait: string) => void;
}

// Trait descriptions for hover cards
const traitDescriptions = {
  "ADHD": "Attention-Deficit/Hyperactivity Disorder involves patterns of inattention, hyperactivity, and impulsivity that can impact daily functioning.",
  "Autism": "A developmental condition characterized by differences in social communication, sensory processing, and often includes specialized interests or repetitive behaviors.",
  "Dyslexia": "A specific learning difficulty that primarily affects reading and language-related skills.",
  "Dyscalculia": "A specific learning difficulty affecting the ability to understand and work with numbers and mathematical concepts.",
  "Dyspraxia": "A developmental coordination disorder affecting physical coordination and motor skills.",
  "Hyperfocus": "The ability to focus intensely on a specific task or interest, often to the exclusion of other stimuli.",
  "Sensory Sensitivity": "Heightened reactions to sensory stimuli such as sounds, textures, lights, or smells.",
  "Pattern Recognition": "Enhanced ability to identify patterns, connections, and details that others might miss.",
  "Creative Thinking": "Ability to generate novel ideas and approach problems from unconventional perspectives.",
  "Hyperlexia": "Advanced reading ability that develops very early, often accompanied by challenges in language comprehension.",
  "Synesthesia": "A perceptual phenomenon where stimulation of one sensory pathway leads to automatic experiences in a second sensory pathway."
};

const CommonTraits: React.FC<CommonTraitsProps> = ({ onSelectTrait }) => {
  // Common neurodivergent traits that users can quickly add
  const commonTraits = [
    "ADHD", "Autism", "Dyslexia", "Dyscalculia", "Dyspraxia", 
    "Hyperfocus", "Sensory Sensitivity", "Pattern Recognition",
    "Creative Thinking", "Hyperlexia", "Synesthesia"
  ];

  return (
    <div className="border-t p-6">
      <div className="flex items-center gap-2 mb-3">
        <h4 className="font-medium">Common Neurodivergent Traits</h4>
        <InfoTooltip content={
          <div className="text-sm">
            <p>Click on any trait to quickly add it to your profile.</p>
            <p className="mt-1">Hover over traits to learn more about them.</p>
          </div>
        } />
      </div>
      <div className="flex flex-wrap gap-2">
        {commonTraits.map((trait) => (
          <HoverCard key={trait} openDelay={300} closeDelay={100}>
            <HoverCardTrigger asChild>
              <Badge 
                variant="outline" 
                className="cursor-pointer hover:bg-accent/10"
                onClick={() => onSelectTrait(trait)}
              >
                {trait}
              </Badge>
            </HoverCardTrigger>
            <HoverCardContent className="w-80 text-sm">
              <p>{traitDescriptions[trait as keyof typeof traitDescriptions] || `A common trait among neurodivergent individuals.`}</p>
            </HoverCardContent>
          </HoverCard>
        ))}
      </div>
    </div>
  );
};

export default CommonTraits;
