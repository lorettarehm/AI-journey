
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

interface RadarChartProps {
  data: StrengthData[];
}

const RadarChartComponent = ({ data }: RadarChartProps) => {
  return (
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
  );
};

export default RadarChartComponent;
