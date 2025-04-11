
import React from 'react';

interface ChartEmptyStateProps {
  message: string;
}

const ChartEmptyState = ({ message }: ChartEmptyStateProps) => {
  return (
    <div className="bg-accent/5 rounded-lg p-8 text-center">
      <p>{message}</p>
    </div>
  );
};

export default ChartEmptyState;
