
import React, { useState } from 'react';
import { Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import FadeIn from "@/components/ui/FadeIn";
import TechniqueCard from './TechniqueCard';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import { TechniqueType } from './useTechniques';

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
  const [currentPage, setCurrentPage] = useState(1);
  const techniquesPerPage = 4;
  
  // Filter techniques by category
  const filteredTechniques = techniques ? 
    (filter ? techniques.filter(tech => tech.category === filter) : techniques) : 
    [];
    
  // Get current techniques
  const indexOfLastTechnique = currentPage * techniquesPerPage;
  const indexOfFirstTechnique = indexOfLastTechnique - techniquesPerPage;
  const currentTechniques = filteredTechniques.slice(indexOfFirstTechnique, indexOfLastTechnique);
  
  // Change page
  const nextPage = () => {
    if (currentPage < Math.ceil(filteredTechniques.length / techniquesPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  // Function to get new random suggestions
  const getNewSuggestions = () => {
    // Shuffle the filtered techniques and reset to page 1
    refetch();
    setCurrentPage(1);
  };

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
    <>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-muted-foreground">
          Showing {indexOfFirstTechnique + 1}-{Math.min(indexOfLastTechnique, filteredTechniques.length)} of {filteredTechniques.length} techniques
        </p>
        <Button 
          onClick={getNewSuggestions} 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh Suggestions
        </Button>
      </div>
    
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {currentTechniques.map((technique, index) => (
          <FadeIn key={technique.technique_id} delay={0.1 * index}>
            <TechniqueCard
              technique={technique}
            />
          </FadeIn>
        ))}
      </div>
      
      {filteredTechniques.length > techniquesPerPage && (
        <Pagination className="my-8">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={prevPage} 
                className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
            <PaginationItem>
              <span className="px-4">
                Page {currentPage} of {Math.ceil(filteredTechniques.length / techniquesPerPage)}
              </span>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext 
                onClick={nextPage} 
                className={currentPage >= Math.ceil(filteredTechniques.length / techniquesPerPage) ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </>
  );
};

export default TechniqueList;
