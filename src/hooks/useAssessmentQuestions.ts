
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { sampleQuestions, fetchRandomQuestions, Question } from '@/components/assessment/AssessmentData';

export const useAssessmentQuestions = (count = 5) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const fetchedQuestions = await fetchRandomQuestions(count);
        setQuestions(fetchedQuestions);
      } catch (error) {
        console.error('Failed to load questions:', error);
        setQuestions(sampleQuestions);
        toast({
          title: "Failed to load questions",
          description: "Using default questions instead.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadQuestions();
  }, [count, toast]);
  
  return { questions, loading };
};
