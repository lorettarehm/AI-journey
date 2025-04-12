
import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from 'recharts';
import { useTheme } from '@/contexts/ThemeContext';

interface StrengthData {
  area: string;
  value: number;
  fullMark: number;
}

interface RadarChartProps {
  data: StrengthData[];
}

const RadarChartComponent = ({ data }: RadarChartProps) => {
  const { colorScheme, customColor } = useTheme();
  
  // Determine the chart color based on the current theme
  const getChartColor = () => {
    switch (colorScheme) {
      case 'purple': return '#9b87f5';
      case 'blue': return '#0EA5E9';
      case 'green': return '#10B981';
      case 'orange': return '#F97316';
      case 'pink': return '#EC4899';
      case 'custom': return customColor;
      default: return '#9b87f5'; // Default purple
    }
  };

  const chartColor = getChartColor();

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
            stroke={chartColor}
            fill={chartColor}
            fillOpacity={0.3}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RadarChartComponent;
