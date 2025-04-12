
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import FadeIn from "@/components/ui/FadeIn";
import { Loader2 } from "lucide-react";
import TechniqueHeader from './TechniqueHeader';
import TechniqueFilters from './TechniqueFilters';
import TechniqueList from './TechniqueList';
import ResearchProcess from './ResearchProcess';
import { useTechniques } from './useTechniques';
import { useToast } from '@/hooks/use-toast';

const TechniquePage: React.FC = () => {
  const [filter, setFilter] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const { techniques, isLoading, isError, refetch, triggerResearchUpdate } = useTechniques();
  const { toast } = useToast();

  useEffect(() => {
    // If there are no techniques, automatically load them
    if (techniques && techniques.length === 0 && !isLoading) {
      handleUpdateResearch();
    }
  }, [techniques, isLoading]);

  const handleUpdateResearch = async () => {
    try {
      setIsUpdating(true);
      const result = await triggerResearchUpdate();
      
      if (result?.count) {
        toast({
          title: "Research Updated",
          description: `Now showing ${result.count} neurodiversity techniques from our expanded database.`,
        });
      }
    } catch (error) {
      console.error("Error updating research:", error);
      toast({
        title: "Update Failed",
        description: "Failed to update research data. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

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
        triggerResearchUpdate={handleUpdateResearch}
      />
      
      <FadeIn delay={0.4}>
        <div className="text-center">
          <Button 
            className="mx-auto"
            onClick={handleUpdateResearch}
            disabled={isLoading || isUpdating}
          >
            {(isLoading || isUpdating) ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Research Data"
            )}
          </Button>
          <p className="text-sm text-muted-foreground mt-3">
            Our technique database has been expanded with the latest research-backed interventions.
            <span className="ml-1 text-accent font-medium">🔜 AI-powered technique analysis coming soon!</span>
          </p>
        </div>
      </FadeIn>

      <ResearchProcess />
    </div>
  );
};

export default TechniquePage;
