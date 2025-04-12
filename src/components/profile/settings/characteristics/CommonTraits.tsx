
import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import InfoTooltip from './InfoTooltip';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PlusCircle } from 'lucide-react';

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
  // Default common neurodivergent traits
  const defaultTraits = [
    "ADHD", "Autism", "Dyslexia", "Dyscalculia", "Dyspraxia", 
    "Hyperfocus", "Sensory Sensitivity", "Pattern Recognition",
    "Creative Thinking", "Hyperlexia", "Synesthesia"
  ];

  // State to track all traits including user added ones
  const [allTraits, setAllTraits] = useState<string[]>(defaultTraits);

  // Function to add a new trait to the table (ensuring no duplicates, case-insensitive)
  const addNewTrait = (newTrait: string) => {
    if (!newTrait.trim()) return;
    
    // Check if the trait already exists (case-insensitive)
    const normalizedNewTrait = newTrait.trim();
    const exists = allTraits.some(trait => 
      trait.toLowerCase() === normalizedNewTrait.toLowerCase()
    );

    if (!exists) {
      setAllTraits(prev => [...prev, normalizedNewTrait]);
    }
  };

  // Effect to sync with localStorage for persistence
  useEffect(() => {
    // Load traits from localStorage on mount
    const savedTraits = localStorage.getItem('neurodivergentTraits');
    if (savedTraits) {
      try {
        const parsedTraits = JSON.parse(savedTraits);
        
        // Make sure we have all default traits and user additions
        const combinedTraits = [...defaultTraits];
        
        // Add only unique traits (case-insensitive)
        parsedTraits.forEach((trait: string) => {
          const exists = combinedTraits.some(existingTrait => 
            existingTrait.toLowerCase() === trait.toLowerCase()
          );
          
          if (!exists) {
            combinedTraits.push(trait);
          }
        });
        
        setAllTraits(combinedTraits);
      } catch (e) {
        console.error('Error parsing saved traits:', e);
      }
    }
  }, []);

  // Save traits to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('neurodivergentTraits', JSON.stringify(allTraits));
  }, [allTraits]);

  // Handler when user selects a trait
  const handleSelectTrait = (trait: string) => {
    onSelectTrait(trait);
    
    // Collect any traits added through the characteristic form
    if (!defaultTraits.includes(trait)) {
      addNewTrait(trait);
    }
  };

  return (
    <div className="border-t p-6">
      <div className="flex items-center gap-2 mb-3">
        <h4 className="font-medium">Common Neurodivergent Traits</h4>
        <InfoTooltip content={
          <div className="text-sm">
            <p>Click on any trait to quickly add it to your profile.</p>
            <p className="mt-1">Hover over traits to learn more about them.</p>
            <p className="mt-1">New traits you add to your profile will appear in this table.</p>
          </div>
        } />
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Trait</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="w-[100px] text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {allTraits.map((trait) => (
            <TableRow key={trait}>
              <TableCell className="font-medium">{trait}</TableCell>
              <TableCell>
                {traitDescriptions[trait as keyof typeof traitDescriptions] || 
                 "A neurodivergent trait that affects how individuals process information and interact with the world."}
              </TableCell>
              <TableCell className="text-right">
                <HoverCard openDelay={300} closeDelay={100}>
                  <HoverCardTrigger asChild>
                    <Badge 
                      variant="outline" 
                      className="cursor-pointer hover:bg-accent/10"
                      onClick={() => handleSelectTrait(trait)}
                    >
                      <PlusCircle size={12} className="mr-1" />
                      Add
                    </Badge>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80 text-sm">
                    <p>Click to add this trait to your profile.</p>
                  </HoverCardContent>
                </HoverCard>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CommonTraits;
