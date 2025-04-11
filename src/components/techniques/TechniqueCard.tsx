
import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, BookOpen, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';

interface TechniqueCardProps {
  id: string;
  title: string;
  description: string;
  category: 'focus' | 'organization' | 'sensory' | 'social';
  source?: string;
  researchBased?: boolean;
}

const categoryColors = {
  focus: 'bg-blue-500/10 text-blue-600',
  organization: 'bg-purple-500/10 text-purple-600',
  sensory: 'bg-green-500/10 text-green-600',
  social: 'bg-yellow-500/10 text-yellow-600',
};

const TechniqueCard = ({
  id,
  title,
  description,
  category,
  source,
  researchBased = false,
}: TechniqueCardProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [feedbackSubmitted, setFeedbackSubmitted] = useState<string | null>(null);

  // Get existing interactions for this technique
  const { data: interactionStats, refetch } = useQuery({
    queryKey: ['techniqueInteractionStats', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('technique_interactions')
        .select('feedback')
        .eq('technique_id', id);
        
      if (error) throw error;
      
      const helpfulCount = data?.filter(i => i.feedback === 'helpful').length || 0;
      const notHelpfulCount = data?.filter(i => i.feedback === 'not-helpful').length || 0;
      
      return { helpfulCount, notHelpfulCount };
    },
    enabled: !!id,
  });

  // Check if user has interacted with this technique
  const { data: userInteraction } = useQuery({
    queryKey: ['userTechniqueInteraction', id, user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('technique_interactions')
        .select('feedback')
        .eq('technique_id', id)
        .eq('user_id', user.id)
        .single();
        
      if (error && error.code !== 'PGRST116') return null;
      return data;
    },
    enabled: !!id && !!user,
  });

  const handleFeedback = async (feedback: 'helpful' | 'not-helpful') => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to provide feedback",
        variant: "destructive",
      });
      return;
    }

    // If user already gave this feedback, remove it (toggle)
    const shouldRemove = userInteraction?.feedback === feedback;
    
    try {
      if (shouldRemove) {
        await supabase
          .from('technique_interactions')
          .delete()
          .eq('technique_id', id)
          .eq('user_id', user.id);
          
        setFeedbackSubmitted(null);
      } else {
        // Upsert to handle both insert and update cases
        await supabase
          .from('technique_interactions')
          .upsert({
            user_id: user.id,
            technique_id: id,
            technique_title: title,
            feedback: feedback,
            created_at: new Date().toISOString(),
          }, { onConflict: 'user_id,technique_id' });
          
        setFeedbackSubmitted(feedback);
      }
      
      // Refetch stats after updating
      refetch();
      
      toast({
        title: shouldRemove ? "Feedback removed" : "Feedback submitted",
        description: shouldRemove 
          ? "Your feedback has been removed" 
          : `You marked this technique as ${feedback}`,
      });
    } catch (error) {
      console.error("Error saving feedback:", error);
      toast({
        title: "Error",
        description: "Failed to save your feedback",
        variant: "destructive",
      });
    }
  };

  // Use feedback from server or local state
  const currentFeedback = userInteraction?.feedback || feedbackSubmitted;

  return (
    <div className="glass-card h-full flex flex-col">
      <div className="p-6 flex-grow">
        <div className="flex justify-between items-start mb-3">
          <span className={`text-xs font-medium px-2.5 py-0.5 rounded ${categoryColors[category]}`}>
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </span>
          {researchBased && (
            <span className="bg-accent/10 text-accent text-xs font-medium px-2.5 py-0.5 rounded">
              Research-based
            </span>
          )}
        </div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground text-sm mb-4">{description}</p>
        {source && (
          <p className="text-xs text-muted-foreground flex items-center mt-auto">
            <ExternalLink size={12} className="mr-1" /> {source}
          </p>
        )}
      </div>
      
      <div className="border-t border-border/40 p-4">
        <div className="flex justify-between items-center">
          <div className="flex space-x-3">
            <Button 
              variant="ghost" 
              size="sm"
              className={`flex items-center ${currentFeedback === 'helpful' ? 'bg-accent/20 text-accent' : ''}`}
              onClick={() => handleFeedback('helpful')}
            >
              <ThumbsUp className="h-4 w-4 mr-1" />
              <span className="text-xs">{interactionStats?.helpfulCount || 0}</span>
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm"
              className={`flex items-center ${currentFeedback === 'not-helpful' ? 'bg-destructive/20 text-destructive' : ''}`}
              onClick={() => handleFeedback('not-helpful')}
            >
              <ThumbsDown className="h-4 w-4 mr-1" />
              <span className="text-xs">{interactionStats?.notHelpfulCount || 0}</span>
            </Button>
          </div>
          
          <Button variant="outline" size="sm" className="flex items-center">
            <BookOpen className="h-4 w-4 mr-1" />
            <span className="text-xs">Details</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TechniqueCard;
