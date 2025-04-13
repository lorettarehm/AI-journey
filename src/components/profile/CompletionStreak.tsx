
import React from 'react';
import FadeIn from '@/components/ui/FadeIn';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format, isWithinInterval, subDays, startOfDay, endOfDay } from 'date-fns';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const CompletionStreak = () => {
  const { user } = useAuth();
  
  const { data: assessmentDates = [], isLoading } = useQuery({
    queryKey: ['assessmentDates', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('assessment_results')
        .select('completed_at')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false });
        
      if (error) throw error;
      
      return data?.map(assessment => assessment.completed_at) || [];
    },
    enabled: !!user
  });

  // Calculate streak based on consecutive days with assessments
  const calculateStreak = () => {
    if (!assessmentDates.length) return 0;
    
    let streak = 1;
    const today = new Date();
    
    // Check if there's an assessment today
    const hasAssessmentToday = assessmentDates.some(date => 
      isWithinInterval(new Date(date), {
        start: startOfDay(today),
        end: endOfDay(today)
      })
    );
    
    // If no assessment today, streak might be broken
    if (!hasAssessmentToday) {
      const yesterday = subDays(today, 1);
      const hasAssessmentYesterday = assessmentDates.some(date => 
        isWithinInterval(new Date(date), {
          start: startOfDay(yesterday),
          end: endOfDay(yesterday)
        })
      );
      
      // If no assessment yesterday either, streak is broken
      if (!hasAssessmentYesterday) {
        return 0;
      }
    }
    
    // Count consecutive days backward
    let currentDate = hasAssessmentToday ? today : subDays(today, 1);
    
    while (true) {
      const previousDate = subDays(currentDate, 1);
      
      const hasAssessmentOnPreviousDay = assessmentDates.some(date => 
        isWithinInterval(new Date(date), {
          start: startOfDay(previousDate),
          end: endOfDay(previousDate)
        })
      );
      
      if (hasAssessmentOnPreviousDay) {
        streak++;
        currentDate = previousDate;
      } else {
        break;
      }
    }
    
    return streak;
  };

  const streak = calculateStreak();
  
  // Generate last 7 days array for display
  const generateLastSevenDays = () => {
    return Array.from({ length: 7 }).map((_, index) => {
      const date = subDays(new Date(), 6 - index);
      const dateStr = format(date, 'yyyy-MM-dd');
      const dayLabel = format(date, 'EEE');
      const fullDate = format(date, 'dd/MM/yyyy');
      
      const hasAssessment = assessmentDates.some(assessmentDate => 
        format(new Date(assessmentDate), 'yyyy-MM-dd') === dateStr
      );
      
      return {
        date: dayLabel,
        fullDate: fullDate,
        hasAssessment
      };
    });
  };
  
  const lastSevenDays = generateLastSevenDays();

  if (isLoading) {
    return (
      <FadeIn delay={0.2}>
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-xl font-semibold mb-6">Completion Streak</h3>
          <div className="flex items-center justify-center mb-6">
            <div className="w-32 h-32 rounded-full border-8 border-secondary/50 flex items-center justify-center animate-pulse">
              <div className="bg-secondary/20 w-16 h-8 rounded"></div>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-2 mb-4">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
              <div key={i} className="aspect-square rounded-md flex items-center justify-center text-xs font-medium bg-secondary/20 animate-pulse"></div>
            ))}
          </div>
        </div>
      </FadeIn>
    );
  }

  return (
    <FadeIn delay={0.2}>
      <div className="glass-card rounded-2xl p-6">
        <h3 className="text-xl font-semibold mb-6">Completion Streak</h3>
        <div className="flex items-center justify-center mb-6">
          <div className={`w-32 h-32 rounded-full border-8 ${streak > 0 ? 'border-accent' : 'border-secondary/50'} flex items-center justify-center`}>
            <div className="text-center">
              <span className="block text-4xl font-bold">{streak}</span>
              <span className="text-sm text-muted-foreground">Days</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-2 mb-4">
          {lastSevenDays.map((day, i) => (
            <TooltipProvider key={i}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div 
                    className={`aspect-square rounded-md flex items-center justify-center text-xs font-medium cursor-help
                      ${day.hasAssessment 
                        ? 'bg-accent/10 text-accent' 
                        : 'bg-secondary/10 text-muted-foreground'}`}
                  >
                    {day.date}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{day.fullDate} - {day.hasAssessment ? 'Assessment completed' : 'No assessment'}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
        <div className="text-center text-muted-foreground text-sm">
          {streak > 0 
            ? `Great work! You've completed ${streak} day${streak === 1 ? '' : 's'} in a row.`
            : "Complete an assessment today to start your streak!"}
        </div>
      </div>
    </FadeIn>
  );
};

export default CompletionStreak;
