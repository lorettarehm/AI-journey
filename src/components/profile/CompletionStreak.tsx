
import React from 'react';
import FadeIn from '@/components/ui/FadeIn';

const CompletionStreak = () => {
  return (
    <FadeIn delay={0.2}>
      <div className="glass-card rounded-2xl p-6">
        <h3 className="text-xl font-semibold mb-6">Completion Streak</h3>
        <div className="flex items-center justify-center mb-6">
          <div className="w-32 h-32 rounded-full border-8 border-accent flex items-center justify-center">
            <div className="text-center">
              <span className="block text-4xl font-bold">7</span>
              <span className="text-sm text-muted-foreground">Days</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-2 mb-4">
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
            <div 
              key={i} 
              className="aspect-square rounded-md flex items-center justify-center text-xs font-medium bg-accent/10 text-accent"
            >
              {day}
            </div>
          ))}
        </div>
        <div className="text-center text-muted-foreground text-sm">
          Great work! You've completed 7 days in a row.
        </div>
      </div>
    </FadeIn>
  );
};

export default CompletionStreak;
