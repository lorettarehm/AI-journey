
import React from 'react';

interface StrengthData {
  area: string;
  value: number;
  fullMark: number;
}

interface StrengthsWeaknessListProps {
  data: StrengthData[];
}

const StrengthsWeaknessList = ({ data }: StrengthsWeaknessListProps) => {
  const strengths = data.filter((item) => item.value >= 70);
  const weaknesses = data.filter((item) => item.value < 70);

  return (
    <div className="mt-6 grid grid-cols-2 gap-4">
      <div>
        <h4 className="font-medium mb-2">Strengths to Leverage</h4>
        <ul className="space-y-2">
          {strengths.map((strength) => (
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
          {weaknesses.map((weakness) => (
            <li key={weakness.area} className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-muted-foreground rounded-full"></span>
              <span>{weakness.area}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default StrengthsWeaknessList;
