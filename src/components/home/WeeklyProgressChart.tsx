
import React from 'react';
import { format } from 'date-fns';

interface ProgressDay {
  date: string;
  completed: boolean;
  value: number;
}

interface WeeklyProgressChartProps {
  data: ProgressDay[];
}

const WeeklyProgressChart = ({ data }: WeeklyProgressChartProps) => {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-3">Weekly Progress</h3>
      <div className="flex space-x-2 mb-3">
        {data.map((day, i) => (
          <div key={i} className="flex-1">
            <div className="flex flex-col items-center">
              <div 
                className={`w-full h-24 rounded-t-lg ${day.completed ? 'bg-accent' : 'bg-secondary'}`} 
                style={{ 
                  height: `${day.value}%`, 
                  opacity: day.completed ? 1 : 0.5,
                  transition: 'all 0.3s ease' 
                }}
              ></div>
              <div className={`text-xs mt-2 ${
                format(new Date(), 'EEE') === day.date ? 'font-bold' : 'text-muted-foreground'
              }`}>
                {day.date}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="text-right text-sm text-muted-foreground">
        <div className="inline-flex items-center">
          <span className="w-2 h-2 bg-accent rounded-full mr-2"></span>
          <span>Completed</span>
        </div>
      </div>
    </div>
  );
};

export default WeeklyProgressChart;
