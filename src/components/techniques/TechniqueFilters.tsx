
import React from 'react';
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";

interface TechniqueFiltersProps {
  filter: string | null;
  setFilter: (filter: string | null) => void;
}

const TechniqueFilters: React.FC<TechniqueFiltersProps> = ({ filter, setFilter }) => {
  return (
    <div className="mb-8 flex flex-wrap gap-2 justify-center">
      <Button 
        variant={filter === null ? "secondary" : "outline"} 
        size="sm"
        onClick={() => setFilter(null)}
      >
        All
      </Button>
      <Button 
        variant={filter === 'focus' ? "secondary" : "outline"} 
        size="sm"
        onClick={() => setFilter('focus')}
      >
        Focus
      </Button>
      <Button 
        variant={filter === 'organization' ? "secondary" : "outline"} 
        size="sm"
        onClick={() => setFilter('organization')}
      >
        Organization
      </Button>
      <Button 
        variant={filter === 'sensory' ? "secondary" : "outline"} 
        size="sm"
        onClick={() => setFilter('sensory')}
      >
        Sensory
      </Button>
      <Button 
        variant={filter === 'social' ? "secondary" : "outline"} 
        size="sm"
        onClick={() => setFilter('social')}
      >
        Social
      </Button>
    </div>
  );
};

export default TechniqueFilters;
