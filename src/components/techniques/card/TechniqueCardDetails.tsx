
import React from 'react';
import { BookOpen, ExternalLink, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface TechniqueCardDetailsProps {
  id: string;
  title: string;
}

const TechniqueCardDetails: React.FC<TechniqueCardDetailsProps> = ({ id, title }) => {
  // Get technique details
  const { data: techniqueDetails } = useQuery({
    queryKey: ['techniqueDetails', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('technique_recommendations')
        .select('*')
        .eq('technique_id', id)
        .single();
        
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!id,
  });

  // Function to create a search URL for the journal
  const getJournalSearchUrl = (journalName: string) => {
    const encodedJournal = encodeURIComponent(journalName);
    return `https://scholar.google.com/scholar?q=${encodedJournal}`;
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center">
          <BookOpen className="h-4 w-4 mr-1" />
          <span className="text-xs">Details</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>
            {techniqueDetails?.description}
          </SheetDescription>
        </SheetHeader>
        
        <div className="py-4">
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="outline" className={getCategoryColorClass(techniqueDetails?.category)}>
              {formatCategoryName(techniqueDetails?.category)}
            </Badge>
            
            {techniqueDetails?.difficulty_level && (
              <Badge variant="outline">
                {techniqueDetails.difficulty_level.charAt(0).toUpperCase() + techniqueDetails.difficulty_level.slice(1)}
              </Badge>
            )}
            
            {techniqueDetails?.target_condition?.map((condition: string, index: number) => (
              <Badge key={index} variant="secondary">
                {condition.toUpperCase()}
              </Badge>
            ))}
          </div>
          
          {techniqueDetails?.implementation_steps && (
            <div className="mb-6">
              <h4 className="text-sm font-medium mb-2">Implementation Steps</h4>
              <ul className="space-y-2">
                {techniqueDetails.implementation_steps.map((step: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <div className="rounded-full bg-accent/20 p-1 mr-2 mt-0.5">
                      <Check className="h-3 w-3 text-accent" />
                    </div>
                    <span className="text-sm">{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="border-t border-border pt-4 mt-4">
            <h4 className="text-sm font-medium mb-2">Research Source</h4>
            {techniqueDetails?.journal ? (
              <a 
                href={getJournalSearchUrl(techniqueDetails.journal)}
                target="_blank"
                rel="noopener noreferrer" 
                className="text-sm text-accent hover:underline flex items-center mb-1"
              >
                <ExternalLink size={14} className="mr-1" />
                {techniqueDetails.journal}
              </a>
            ) : (
              <p className="text-sm text-muted-foreground mb-1">
                Journal of Neurodiversity
              </p>
            )}
            {techniqueDetails?.publication_date && (
              <p className="text-xs text-muted-foreground">
                Published: {new Date(techniqueDetails.publication_date).toLocaleDateString()}
              </p>
            )}
          </div>
          
          {techniqueDetails?.effectiveness_score && (
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Effectiveness Score</h4>
              <div className="w-full bg-secondary h-2 rounded-full">
                <div 
                  className="bg-accent h-2 rounded-full" 
                  style={{width: `${(techniqueDetails.effectiveness_score * 100)}%`}}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Based on research evidence
              </p>
            </div>
          )}
          
          <div className="border-t border-border pt-4 mt-4">
            <h4 className="text-sm font-medium mb-2">Expert Commentary 
              <span className="ml-1 text-accent font-medium">🔜</span>
            </h4>
            <p className="text-sm text-muted-foreground">
              Expert analysis and practical application insights coming soon.
            </p>
          </div>
        </div>
        
        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

// Helper functions
const getCategoryColorClass = (category?: string): string => {
  const categoryColors: Record<string, string> = {
    focus: 'bg-blue-500/10 text-blue-600',
    organization: 'bg-purple-500/10 text-purple-600',
    sensory: 'bg-green-500/10 text-green-600',
    social: 'bg-yellow-500/10 text-yellow-600',
  };
  
  return category ? categoryColors[category] || '' : '';
};

const formatCategoryName = (category?: string): string => {
  if (!category) return '';
  return category.charAt(0).toUpperCase() + category.slice(1);
};

export default TechniqueCardDetails;
