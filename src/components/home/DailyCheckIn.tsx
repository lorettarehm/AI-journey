
import React from 'react';
import { format } from 'date-fns';

interface DailyCheckInProps {
  focusLevel: number;
  energyLevel: number;
  lastAssessmentDate: string;
  hasAssessment: boolean;
}

const DailyCheckIn = ({ 
  focusLevel, 
  energyLevel, 
  lastAssessmentDate,
  hasAssessment 
}: DailyCheckInProps) => {
  return (
    <div className="bg-accent/10 rounded-2xl p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Daily Check-in</h3>
        {hasAssessment && (
          <span className="text-xs text-muted-foreground">
            Last updated: {lastAssessmentDate}
          </span>
        )}
      </div>
      <div className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground mb-2">How focused do you feel today?</p>
          <div className="w-full bg-secondary rounded-full h-2 mb-1">
            <div 
              className="bg-accent h-2 rounded-full transition-all duration-500 ease-in-out" 
              style={{ width: `${focusLevel}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Not at all</span>
            <span>Very focused</span>
          </div>
        </div>
        
        <div>
          <p className="text-sm text-muted-foreground mb-2">How is your energy level?</p>
          <div className="w-full bg-secondary rounded-full h-2 mb-1">
            <div 
              className="bg-accent h-2 rounded-full transition-all duration-500 ease-in-out" 
              style={{ width: `${energyLevel}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Low</span>
            <span>High</span>
          </div>
        </div>
        
        {!hasAssessment && (
          <div className="mt-4 text-center">
            <span className="text-sm text-accent font-medium">
              🔜 Complete your first assessment to see your data
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyCheckIn;
