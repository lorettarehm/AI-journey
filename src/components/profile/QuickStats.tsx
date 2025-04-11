
import React from 'react';
import { Calendar, Clock, Settings } from 'lucide-react';
import FadeIn from '@/components/ui/FadeIn';

interface QuickStatsProps {
  assessmentCount: number;
  lastAssessmentDate: string | null;
}

const QuickStats = ({ assessmentCount, lastAssessmentDate }: QuickStatsProps) => {
  return (
    <FadeIn delay={0.3}>
      <div className="glass-card rounded-2xl p-6 mt-8">
        <h3 className="text-xl font-semibold mb-4">Quick Stats</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-border">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center mr-3">
                <Calendar size={16} className="text-accent" />
              </div>
              <span>Assessments Completed</span>
            </div>
            <span className="font-semibold">{assessmentCount}</span>
          </div>
          <div className="flex justify-between items-center pb-3 border-b border-border">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center mr-3">
                <Clock size={16} className="text-accent" />
              </div>
              <span>Last Assessment</span>
            </div>
            <span className="font-semibold">
              {lastAssessmentDate ? new Date(lastAssessmentDate).toLocaleDateString() : 'Never'}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center mr-3">
                <Settings size={16} className="text-accent" />
              </div>
              <span>Techniques Applied</span>
            </div>
            <span className="font-semibold">8</span>
          </div>
        </div>
      </div>
    </FadeIn>
  );
};

export default QuickStats;
