
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import FadeIn from "@/components/ui/FadeIn";
import { Loader2 } from "lucide-react";
import TechniqueHeader from './TechniqueHeader';
import TechniqueFilters from './TechniqueFilters';
import TechniqueList from './TechniqueList';
import ResearchProcess from './ResearchProcess';
import { useTechniques } from './useTechniques';

const TechniquePage: React.FC = () => {
  const [filter, setFilter] = useState<string | null>(null);
  const { techniques, isLoading, isError, refetch, triggerResearchUpdate } = useTechniques();

  return (
    <div className="container max-w-4xl py-12">
      <TechniqueHeader />
      <TechniqueFilters filter={filter} setFilter={setFilter} />
      <TechniqueList 
        techniques={techniques} 
        isLoading={isLoading} 
        isError={isError} 
        filter={filter}
        refetch={refetch}
        triggerResearchUpdate={triggerResearchUpdate}
      />
      
      <FadeIn delay={0.4}>
        <div className="text-center">
          <Button 
            className="mx-auto"
            onClick={triggerResearchUpdate}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Research Data"
            )}
          </Button>
        </div>
      </FadeIn>

      <ResearchProcess />
    </div>
  );
};

export default TechniquePage;
