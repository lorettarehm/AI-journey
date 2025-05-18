import React from 'react';
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";

interface TechniqueFiltersProps {
  filter: string | null;
  setFilter: (filter: string | null) => void;
  difficultyFilter: string | null;
  setDifficultyFilter: (filter: string | null) => void;
}

const TechniqueFilters: React.FC<TechniqueFiltersProps> = ({ 
  filter, 
  setFilter, 
  difficultyFilter, 
  setDifficultyFilter 
}) => {
  return (
    <div className="mb-8">
      <h3 className="text-center text-sm font-medium mb-3">Filter by Category</h3>
      <div className="flex flex-wrap gap-2 justify-center mb-6">
        <Button 
          variant={filter === null ? "secondary" : "outline"} 
          size="sm"
          onClick={() => setFilter(null)}
        >
          All Categories
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

      <h3 className="text-center text-sm font-medium mb-3">Filter by Difficulty</h3>
      <div className="flex flex-wrap gap-2 justify-center">
        <Button 
          variant={difficultyFilter === null ? "secondary" : "outline"} 
          size="sm"
          onClick={() => setDifficultyFilter(null)}
        >
          All Levels
        </Button>
        <Button 
          variant={difficultyFilter === 'beginner' ? "secondary" : "outline"} 
          size="sm"
          onClick={() => setDifficultyFilter('beginner')}
        >
          Beginner
        </Button>
        <Button 
          variant={difficultyFilter === 'intermediate' ? "secondary" : "outline"} 
          size="sm"
          onClick={() => setDifficultyFilter('intermediate')}
        >
          Intermediate
        </Button>
        <Button 
          variant={difficultyFilter === 'advanced' ? "secondary" : "outline"} 
          size="sm"
          onClick={() => setDifficultyFilter('advanced')}
        >
          Advanced
        </Button>
      </div>
    </div>
  );
};

export default TechniqueFilters;