
import React from 'react';
import RadarChartComponent from './charts/RadarChart';
import StrengthsWeaknessList from './charts/StrengthsWeaknessList';

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
      <RadarChartComponent data={data} />
      <StrengthsWeaknessList data={data} />
    </div>
  );
};

export default StrengthsWeaknessChart;
