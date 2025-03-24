
import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from 'recharts';

interface StrengthData {
  area: string;
  value: number;
  fullMark: number;
}

interface StrengthsWeaknessChartProps {
  data: StrengthData[];
}

const StrengthsWeaknessChart = ({ data }: StrengthsWeaknessChartProps) => {
  return (
    <div className="glass-card rounded-2xl p-6 w-full">
      <h3 className="text-xl font-semibold mb-6">Your Cognitive Profile</h3>
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
            <PolarGrid stroke="#e5e7eb" />
            <PolarAngleAxis 
              dataKey="area" 
              tick={{ fill: '#6B7280', fontSize: 12 }}
            />
            <Radar
              name="Strengths"
              dataKey="value"
              stroke="#4338CA"
              fill="#4338CA"
              fillOpacity={0.3}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div>
          <h4 className="font-medium mb-2">Strengths to Leverage</h4>
          <ul className="space-y-2">
            {data
              .filter((item) => item.value >= 70)
              .map((strength) => (
                <li key={strength.area} className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-accent rounded-full"></span>
                  <span>{strength.area}</span>
                </li>
              ))}
          </ul>
        </div>
        <div>
          <h4 className="font-medium mb-2">Areas for Growth</h4>
          <ul className="space-y-2">
            {data
              .filter((item) => item.value < 70)
              .map((weakness) => (
                <li key={weakness.area} className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-muted-foreground rounded-full"></span>
                  <span>{weakness.area}</span>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default StrengthsWeaknessChart;
