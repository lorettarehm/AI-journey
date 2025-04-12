
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
  [key: string]: any;
}

interface LineChartDisplayProps {
  data: ChartData[];
  chartConfig: Record<string, { color: string }>;
  metrics?: string[];
}

const LineChartDisplay = ({ data, chartConfig, metrics }: LineChartDisplayProps) => {
  // If metrics aren't provided, use all available metrics from chartConfig
  const metricsToDisplay = metrics || Object.keys(chartConfig);

  return (
    <div className="h-80">
      <ChartContainer config={chartConfig}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis 
              dataKey="date" 
              stroke="var(--muted-foreground)"
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            <YAxis 
              domain={[0, 100]} 
              stroke="var(--muted-foreground)"
              tickLine={false}
              axisLine={false}
              dx={-10}
            />
            <Tooltip content={<ChartTooltipContent />} />
            <Legend />
            {metricsToDisplay.map((metric) => (
              <Line 
                key={metric}
                type="monotone" 
                dataKey={metric} 
                stroke={chartConfig[metric]?.color} 
                name={metric.charAt(0).toUpperCase() + metric.slice(1).replace(/([A-Z])/g, ' $1')} 
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
};

export default LineChartDisplay;
