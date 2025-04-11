
import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

interface ChartData {
  date: string;
  focus: number;
  energy: number;
  creativity: number;
  problemSolving: number;
  patternRecognition: number;
  [key: string]: any;
}

interface LineChartDisplayProps {
  data: ChartData[];
  chartConfig: Record<string, { color: string }>;
}

const LineChartDisplay = ({ data, chartConfig }: LineChartDisplayProps) => {
  return (
    <div className="h-80">
      <ChartContainer config={chartConfig}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={[0, 100]} />
            <Tooltip content={<ChartTooltipContent />} />
            <Legend />
            <Line type="monotone" dataKey="focus" stroke={chartConfig.focus.color} name="Focus" />
            <Line type="monotone" dataKey="energy" stroke={chartConfig.energy.color} name="Energy" />
            <Line type="monotone" dataKey="creativity" stroke={chartConfig.creativity.color} name="Creativity" />
            <Line type="monotone" dataKey="problemSolving" stroke={chartConfig.problemSolving.color} name="Problem Solving" />
            <Line type="monotone" dataKey="patternRecognition" stroke={chartConfig.patternRecognition.color} name="Pattern Recognition" />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
};

export default LineChartDisplay;
