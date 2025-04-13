
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

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
        <h3 className="text-xl font-semibold">Daily Assessment</h3>
        {hasAssessment && (
          <span className="text-xs text-muted-foreground">
            Last updated: {lastAssessmentDate}
          </span>
        )}
      </div>
      
      {hasAssessment ? (
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
        </div>
      ) : (
        <div className="mt-4 space-y-4">
          <p className="text-center text-sm text-muted-foreground">
            Complete your first assessment to see your personal data
          </p>
          <div className="flex justify-center">
            <Link to="/assessment">
              <Button size="sm" className="mt-2">
                Start Assessment
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default DailyCheckIn;
