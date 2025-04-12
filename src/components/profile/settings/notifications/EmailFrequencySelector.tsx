
import React from 'react';
import { Label } from '@/components/ui/label';

interface EmailFrequencyOption {
  id: string;
  label: string;
}

interface EmailFrequencySelectorProps {
  selectedFrequency: string;
  onChange: (frequency: string) => void;
}

const EmailFrequencySelector = ({ selectedFrequency, onChange }: EmailFrequencySelectorProps) => {
  const frequencyOptions: EmailFrequencyOption[] = [
    { id: 'realtime', label: 'Real-time' },
    { id: 'daily', label: 'Daily digest' },
    { id: 'weekly', label: 'Weekly digest' },
    { id: 'none', label: 'No emails' },
  ];

  return (
    <div className="space-y-4">
      {frequencyOptions.map((option) => (
        <div key={option.id} className="flex items-center space-x-2">
          <input
            type="radio"
            id={option.id}
            name="emailFrequency"
            className="form-radio h-4 w-4 text-primary border-muted-foreground focus:ring-primary"
            checked={selectedFrequency === option.id}
            onChange={() => onChange(option.id)}
          />
          <Label htmlFor={option.id}>{option.label}</Label>
        </div>
      ))}
    </div>
  );
};

export default EmailFrequencySelector;
