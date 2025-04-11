
import React from 'react';
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import FadeIn from "@/components/ui/FadeIn";
import TechniqueCard from './TechniqueCard';

interface TechniqueType {
  technique_id: string;
  title: string;
  description: string;
  implementation_steps?: string[];
  category?: 'focus' | 'organization' | 'sensory' | 'social' | null;
  difficulty_level?: 'beginner' | 'intermediate' | 'advanced' | null;
  journal?: string;
  publication_date?: string;
}

interface TechniqueListProps {
  techniques: TechniqueType[] | undefined;
  isLoading: boolean;
  isError: boolean;
  filter: string | null;
  refetch: () => void;
  triggerResearchUpdate: () => Promise<void>;
}

const TechniqueList: React.FC<TechniqueListProps> = ({ 
  techniques, 
  isLoading, 
  isError, 
  filter,
  refetch,
  triggerResearchUpdate
}) => {
  // Filter techniques by category
  const filteredTechniques = techniques ? 
    (filter ? techniques.filter(tech => tech.category === filter) : techniques) : 
    [];

  if (isLoading) {
    return (
      <div className="flex justify-center my-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }
  
  if (isError) {
    return (
      <div className="text-center my-12">
        <p className="text-destructive">Error loading techniques. Please try again later.</p>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => refetch()}
        >
          Retry
        </Button>
      </div>
    );
  }
  
  if (filteredTechniques.length === 0) {
    return (
      <div className="text-center my-12">
        <p className="text-muted-foreground">No techniques found. Try updating the research data.</p>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={triggerResearchUpdate}
        >
          Update Research Data
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
      {filteredTechniques.map((technique, index) => (
        <FadeIn key={technique.technique_id} delay={0.1 * index}>
          <TechniqueCard
            id={technique.technique_id}
            title={technique.title}
            description={technique.description}
            category={technique.category || 'focus'}
            source={technique.journal || "Journal of Neurodiversity"}
            researchBased={true}
          />
        </FadeIn>
      ))}
    </div>
  );
};

export default TechniqueList;
