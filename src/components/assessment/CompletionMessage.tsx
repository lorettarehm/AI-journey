
import React from 'react';
import { Check } from 'lucide-react';
import FadeIn from '@/components/ui/FadeIn';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface CompletionMessageProps {
  onComplete: () => void;
  assessmentResults: Record<string, number>;
}

const CompletionMessage = ({ onComplete, assessmentResults }: CompletionMessageProps) => {
  const { toast } = useToast();
  const { user } = useAuth();

  const saveResults = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to save results",
        variant: "destructive"
      });
      return;
    }

    try {
      // Transform assessment answers into required metrics
      const results = {
        user_id: user.id,
        focus_level: assessmentResults['focus'] || 50,
        energy_level: assessmentResults['energy'] || 60,
        emotional_state: assessmentResults['emotional'] || 50,
        stress_level: assessmentResults['stress'] || 40,
        creativity_score: assessmentResults['creativity'] || 70,
        focus_duration: assessmentResults['duration'] || 50,
        task_switching: assessmentResults['switching'] || 60,
        emotional_regulation: assessmentResults['regulation'] || 50,
        organization: assessmentResults['organization'] || 55,
        time_awareness: assessmentResults['awareness'] || 45,
        pattern_recognition: assessmentResults['patterns'] || 75,
        problem_solving: assessmentResults['problem_solving'] || 70
      };

      await supabase.from('assessment_results').insert(results);
      
      toast({
        title: "Success!",
        description: "Your assessment results have been saved",
      });
      
      onComplete();
    } catch (error) {
      console.error("Error saving assessment results:", error);
      toast({
        title: "Error",
        description: "Failed to save your assessment results",
        variant: "destructive"
      });
    }
  };

  return (
    <FadeIn>
      <div className="glass-card rounded-2xl p-8 text-center max-w-2xl mx-auto">
        <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check size={32} className="text-accent" />
        </div>
        <h2 className="text-2xl font-bold mb-4">Assessment Completed!</h2>
        <p className="text-lg text-muted-foreground mb-8">
          Thank you for completing today's assessment. Your responses help us provide
          personalized recommendations to support your neurodivergent journey.
        </p>
        <button onClick={saveResults} className="btn-primary">
          View Your Profile
        </button>
      </div>
    </FadeIn>
  );
};

export default CompletionMessage;
