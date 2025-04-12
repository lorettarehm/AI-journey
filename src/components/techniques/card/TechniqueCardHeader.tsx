
import React from 'react';
import { Badge } from "@/components/ui/badge";

interface TechniqueCardHeaderProps {
  title: string;
  difficultyLevel?: 'beginner' | 'intermediate' | 'advanced' | null;
  category?: 'focus' | 'organization' | 'sensory' | 'social' | null;
}

const TechniqueCardHeader: React.FC<TechniqueCardHeaderProps> = ({ 
  title, 
  difficultyLevel, 
  category 
}) => {
  const getDifficultyColor = () => {
    switch (difficultyLevel) {
      case 'beginner':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'intermediate':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'advanced':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getCategoryColor = () => {
    switch (category) {
      case 'focus':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'organization':
        return 'bg-indigo-100 text-indigo-800 border-indigo-300';
      case 'sensory':
        return 'bg-cyan-100 text-cyan-800 border-cyan-300';
      case 'social':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="bg-accent/10 p-6">
      <h3 className="font-bold text-lg mb-2">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {difficultyLevel && (
          <Badge variant="outline" className={`${getDifficultyColor()} capitalize text-xs font-medium`}>
            {difficultyLevel}
          </Badge>
        )}
        {category && (
          <Badge variant="outline" className={`${getCategoryColor()} capitalize text-xs font-medium`}>
            {category}
          </Badge>
        )}
      </div>
    </div>
  );
};

export default TechniqueCardHeader;
