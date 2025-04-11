
import React, { useState, useEffect } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import FadeIn from "@/components/ui/FadeIn";
import { Brain, Zap, Lightbulb, BookOpen, Filter, Loader2 } from "lucide-react";
import TechniqueCard from './TechniqueCard';
import ThemeSelector from '@/components/ui/ThemeSelector';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

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

const TechniquePage: React.FC = () => {
  const { toast } = useToast();
  const [filter, setFilter] = useState<string | null>(null);
  
  // Fetch techniques from our database
  const { data: techniques, isLoading, isError, refetch } = useQuery({
    queryKey: ['techniques'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('technique_recommendations')
        .select('*');
      
      if (error) throw error;
      return data as TechniqueType[];
    }
  });

  // Trigger the edge function to fetch new research
  const triggerResearchUpdate = async () => {
    try {
      // Call our edge function
      const response = await supabase.functions.invoke('fetch-research', {
        body: { searchQuery: 'adhd autism interventions recent', limit: 10 }
      });
      
      if (!response.data.success) {
        throw new Error(response.data.error || 'Unknown error');
      }
      
      toast({
        title: "Research Updated",
        description: "The latest research has been fetched and analyzed.",
      });
      
      // Refetch techniques to display the latest
      refetch();
    } catch (error) {
      console.error('Error updating research:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update research data. Please try again later.",
        variant: "destructive",
      });
    }
  };

  // Filter techniques by category
  const filteredTechniques = techniques ? 
    (filter ? techniques.filter(tech => tech.category === filter) : techniques) : 
    [];

  return (
    <div className="container max-w-4xl py-12">
      <FadeIn>
        <div className="text-center mb-12">
          <span className="inline-block bg-accent/10 text-accent px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            Evidence-Based Strategies
          </span>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Neurodivergent Techniques</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover and learn practical strategies tailored for your unique neurodivergent mind.
          </p>
          <div className="mt-6 flex justify-center">
            <ThemeSelector />
          </div>
        </div>
      </FadeIn>

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

      {isLoading ? (
        <div className="flex justify-center my-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : isError ? (
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
      ) : filteredTechniques.length === 0 ? (
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
      ) : (
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
      )}
      
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

      <FadeIn delay={0.6}>
        <div className="mt-16 bg-secondary/30 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">About Our Research Process</h2>
          <p className="text-muted-foreground mb-4">
            Our system scans and analyzes the latest scientific research on ADHD and Autism daily, ensuring that our recommendations are always based on the most current evidence.
          </p>
          
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="research-sources">
              <AccordionTrigger>Research Sources</AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-muted-foreground mb-2">
                  We analyze peer-reviewed publications from sources including:
                </p>
                <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                  <li>Journal of Attention Disorders</li>
                  <li>Journal of Autism and Developmental Disorders</li>
                  <li>Developmental Cognitive Neuroscience</li>
                  <li>Research in Developmental Disabilities</li>
                  <li>Journal of Child Psychology and Psychiatry</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="recommendation-process">
              <AccordionTrigger>Recommendation Process</AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-muted-foreground">
                  Our recommendation engine uses AI profiling to match techniques to individual needs based on assessment data, interaction history, and scientific evidence. Each technique is evaluated for effectiveness, difficulty level, and suitability for different profiles.
                </p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="data-freshness">
              <AccordionTrigger>Data Freshness</AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-muted-foreground">
                  Our database is updated daily with the latest research findings. The current database contains techniques extracted from publications dating from 2010 to present, with priority given to more recent studies.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </FadeIn>
    </div>
  );
};

export default TechniquePage;
