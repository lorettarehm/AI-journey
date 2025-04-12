
import React from 'react';
import { Brain, Clock, Target, CheckSquare } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface TechniqueNutshellProps {
  id: string;
  title: string;
}

const TechniqueNutshell: React.FC<TechniqueNutshellProps> = ({ id, title }) => {
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

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center">
          <Brain className="h-4 w-4 mr-1" />
          <span className="text-xs">Nutshell</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0">
        <Card className="border-0 shadow-none">
          <CardContent className="p-4">
            <h4 className="font-medium text-sm mb-3">{title} in a Nutshell</h4>
            
            <div className="space-y-3 text-sm">
              {techniqueDetails?.category && (
                <div className="flex items-start">
                  <Brain className="h-4 w-4 text-accent mr-2 mt-0.5" />
                  <div>
                    <p className="font-medium">Category</p>
                    <p className="text-muted-foreground">
                      {techniqueDetails.category.charAt(0).toUpperCase() + techniqueDetails.category.slice(1)}
                    </p>
                  </div>
                </div>
              )}
              
              {techniqueDetails?.difficulty_level && (
                <div className="flex items-start">
                  <Clock className="h-4 w-4 text-accent mr-2 mt-0.5" />
                  <div>
                    <p className="font-medium">Difficulty</p>
                    <p className="text-muted-foreground">
                      {techniqueDetails.difficulty_level.charAt(0).toUpperCase() + techniqueDetails.difficulty_level.slice(1)}
                    </p>
                  </div>
                </div>
              )}
              
              {techniqueDetails?.target_condition && techniqueDetails.target_condition.length > 0 && (
                <div className="flex items-start">
                  <Target className="h-4 w-4 text-accent mr-2 mt-0.5" />
                  <div>
                    <p className="font-medium">Best for</p>
                    <p className="text-muted-foreground">
                      {techniqueDetails.target_condition.map(condition => 
                        condition.charAt(0).toUpperCase() + condition.slice(1)
                      ).join(', ')}
                    </p>
                  </div>
                </div>
              )}
              
              {techniqueDetails?.implementation_steps && techniqueDetails.implementation_steps.length > 0 && (
                <div className="flex items-start">
                  <CheckSquare className="h-4 w-4 text-accent mr-2 mt-0.5" />
                  <div>
                    <p className="font-medium">Quick Implementation</p>
                    <p className="text-muted-foreground">
                      {techniqueDetails.implementation_steps[0]}
                      {techniqueDetails.implementation_steps.length > 1 && "..."}
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="mt-3 pt-3 border-t text-xs text-muted-foreground">
              <p>Open Details for full implementation steps</p>
            </div>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
};

export default TechniqueNutshell;
