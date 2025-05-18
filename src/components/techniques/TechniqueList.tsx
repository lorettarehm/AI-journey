import React, { useState } from 'react';
import { Loader2, RefreshCw, ChevronDown, ChevronUp } from "lucide-react";
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
import { TechniqueType } from './types';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface TechniqueListProps {
  techniques: TechniqueType[] | undefined;
  isLoading: boolean;
  isError: boolean;
  filter: string | null;
  difficultyFilter: string | null;
  refetch: () => void;
  triggerResearchUpdate: () => Promise<void>;
}

const TechniqueList: React.FC<TechniqueListProps> = ({ 
  techniques, 
  isLoading, 
  isError, 
  filter,
  difficultyFilter,
  refetch,
  triggerResearchUpdate
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [debugOpen, setDebugOpen] = useState(false);
  const [errorDetails, setErrorDetails] = useState<any>(null);
  const techniquesPerPage = 4;
  
  // Filter techniques by category and difficulty
  const filteredTechniques = techniques ? 
    techniques.filter(tech => {
      const matchesCategory = filter ? tech.category === filter : true;
      const matchesDifficulty = difficultyFilter ? tech.difficulty_level === difficultyFilter : true;
      return matchesCategory && matchesDifficulty;
    }) : 
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

  // Retry with debug info
  const handleRetry = async () => {
    try {
      await refetch();
    } catch (error) {
      console.error("Retry error:", error);
      setErrorDetails(error);
    }
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
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Error loading techniques</AlertTitle>
          <AlertDescription>There was a problem retrieving the techniques data. Please try again later.</AlertDescription>
        </Alert>
        
        <Button 
          variant="outline" 
          className="mt-2 mb-4"
          onClick={handleRetry}
        >
          Retry
        </Button>
        
        <Collapsible
          open={debugOpen}
          onOpenChange={setDebugOpen}
          className="w-full max-w-md mx-auto border rounded-md p-2"
        >
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="flex w-full justify-between">
              <span>Debug Information</span>
              {debugOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="text-left p-2">
            <div className="text-xs font-mono overflow-auto max-h-[200px] bg-slate-100 p-2 rounded">
              <p className="font-semibold">Error Details:</p>
              <pre>{JSON.stringify(errorDetails || "No specific error details", null, 2)}</pre>
              <p className="font-semibold mt-2">Database Info:</p>
              <p>Table: technique_recommendations</p>
              <p>Error Type: Possible recursion in database rules or triggers</p>
              <p className="mt-2">If this error persists, please contact support.</p>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    );
  }
  
  if (filteredTechniques.length === 0) {
    return (
      <div className="text-center my-12">
        <p className="text-muted-foreground">No techniques found matching your filters. Try changing your filter criteria or updating the research data.</p>
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
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
        <p className="text-sm text-muted-foreground text-center sm:text-left">
          Showing {indexOfFirstTechnique + 1}-{Math.min(indexOfLastTechnique, filteredTechniques.length)} of {filteredTechniques.length} techniques
        </p>
        <Button 
          onClick={getNewSuggestions} 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-2 w-full sm:w-auto"
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