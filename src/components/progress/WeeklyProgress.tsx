
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { subDays, format, startOfWeek, endOfWeek } from 'date-fns';
import { useMediaQuery } from '@/hooks/use-mobile';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';

interface AssessmentData {
  date: string;
  count: number;
  completed: boolean;
}

const WeeklyProgress = () => {
  const { user } = useAuth();
  const isMobile = useMediaQuery('(max-width: 640px)');
  
  const startDate = startOfWeek(new Date(), { weekStartsOn: 1 }); // Start from Monday
  const endDate = endOfWeek(new Date(), { weekStartsOn: 1 }); // End on Sunday
  
  const { data: weeklyData = [] } = useQuery({
    queryKey: ['weeklyProgress', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      // Fetch assessment results for the last 7 days
      const { data, error } = await supabase
        .from('assessment_results')
        .select('completed_at')
        .eq('user_id', user.id)
        .gte('completed_at', startDate.toISOString())
        .lte('completed_at', endDate.toISOString());
        
      if (error) throw error;
      
      // Create a map of dates to assessment counts
      const assessmentMap = data.reduce((acc: Record<string, number>, result) => {
        const date = format(new Date(result.completed_at), 'yyyy-MM-dd');
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {});
      
      // Generate the last 7 days
      const days = Array.from({ length: 7 }).map((_, i) => {
        const date = subDays(new Date(), 6 - i);
        const dateStr = format(date, 'yyyy-MM-dd');
        const dayLabel = format(date, 'EEE');
        
        return {
          date: dayLabel,
          count: assessmentMap[dateStr] || 0,
          completed: assessmentMap[dateStr] ? true : false
        };
      });
      
      return days;
    },
    enabled: !!user
  });

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Weekly Progress</CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info size={16} className="text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">Track your daily interaction with assessments and techniques</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-end h-32 mt-2">
          {weeklyData.map((day, i) => (
            <div key={i} className="flex flex-1 flex-col items-center">
              <div 
                className={`w-full mx-1 rounded-t-lg transition-all duration-300 ${
                  day.completed ? 'bg-accent' : 'bg-secondary'
                }`} 
                style={{ 
                  height: `${day.count ? Math.min(Math.max(day.count * 20, 20), 80) : 10}%`,
                  opacity: day.completed ? 1 : 0.5,
                }}
              ></div>
              <span className={`text-xs mt-2 ${
                format(new Date(), 'EEE') === day.date 
                  ? 'font-bold text-primary' 
                  : 'text-muted-foreground'
              }`}>
                {day.date}
              </span>
            </div>
          ))}
        </div>
        <div className="flex justify-end mt-4">
          <div className="flex items-center text-xs text-muted-foreground">
            <span className="w-3 h-3 bg-accent rounded-full mr-2"></span>
            <span>Completed</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklyProgress;
