
import React, { useState } from 'react';
import { Check, ThumbsDown, ThumbsUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface TechniqueCardProps {
  title: string;
  description: string;
  category: string;
  source: string;
  researchBased: boolean;
  id: string;
}

const TechniqueCard = ({
  title,
  description,
  category,
  source,
  researchBased,
  id
}: TechniqueCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const [feedback, setFeedback] = useState<'helpful' | 'not-helpful' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  
  const handleFeedback = async (value: 'helpful' | 'not-helpful') => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You need to be logged in to provide feedback",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Save feedback to Supabase
      await supabase.from('technique_interactions').insert({
        user_id: user.id,
        technique_id: id,
        technique_title: title,
        feedback: value
      });
      
      setFeedback(value);
      toast({
        title: "Feedback saved",
        description: "Thank you for your feedback!"
      });
    } catch (error) {
      console.error("Error saving feedback:", error);
      toast({
        title: "Error",
        description: "Failed to save your feedback",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="glass-card rounded-2xl overflow-hidden transition-all duration-300 shadow hover:shadow-md">
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <span className="bg-accent/10 text-accent text-xs px-3 py-1 rounded-full">
            {category}
          </span>
          {researchBased && (
            <span className="text-xs text-muted-foreground">Research-based</span>
          )}
        </div>
        <h3 className="text-xl font-semibold mb-3">{title}</h3>
        <p className={`text-muted-foreground mb-4 ${!expanded && 'line-clamp-3'}`}>
          {description}
        </p>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-accent text-sm font-medium hover:underline mb-4"
        >
          {expanded ? 'Show less' : 'Read more'}
        </button>
        
        {expanded && (
          <>
            <div className="border-t border-border my-4 pt-4">
              <h4 className="font-medium mb-2">How to implement:</h4>
              <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                <li>Start with 5 minutes per day</li>
                <li>Gradually increase duration as comfort grows</li>
                <li>Apply to one specific context first</li>
                <li>Track your results for 2 weeks</li>
              </ol>
            </div>
            
            <div className="text-sm text-muted-foreground mt-4">
              <p>Source: {source}</p>
            </div>
          </>
        )}
      </div>
      
      <div className="bg-secondary/50 p-4 flex justify-between items-center">
        <span className="text-sm text-muted-foreground">
          Was this helpful?
        </span>
        <div className="flex space-x-2">
          <button
            onClick={() => handleFeedback('helpful')}
            disabled={isSubmitting}
            className={`p-2 rounded-full transition-colors ${
              feedback === 'helpful' 
                ? 'bg-accent/20 text-accent' 
                : 'hover:bg-secondary text-muted-foreground'
            } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            aria-label="This was helpful"
          >
            {feedback === 'helpful' ? <Check size={18} /> : <ThumbsUp size={18} />}
          </button>
          <button
            onClick={() => handleFeedback('not-helpful')}
            disabled={isSubmitting}
            className={`p-2 rounded-full transition-colors ${
              feedback === 'not-helpful' 
                ? 'bg-destructive/20 text-destructive' 
                : 'hover:bg-secondary text-muted-foreground'
            } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            aria-label="This was not helpful"
          >
            <ThumbsDown size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TechniqueCard;
