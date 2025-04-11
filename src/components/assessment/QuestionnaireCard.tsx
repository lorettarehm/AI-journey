
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Question } from './AssessmentData';

interface QuestionnaireCardProps {
  question: Question;
  onAnswer: (questionId: string, answer: number) => void;
  currentAnswer?: number;
}

const QuestionnaireCard = ({ question, onAnswer, currentAnswer }: QuestionnaireCardProps) => {
  const [selectedOption, setSelectedOption] = useState<number | undefined>(currentAnswer);
  const [animateAnswer, setAnimateAnswer] = useState(false);
  
  const handleSelect = (value: number) => {
    setSelectedOption(value);
    setAnimateAnswer(true);
    
    // Reset animation state after animation completes
    setTimeout(() => {
      setAnimateAnswer(false);
      onAnswer(question.id, value);
    }, 400);
  };
  
  return (
    <div className="glass-card rounded-2xl p-8 w-full max-w-2xl mx-auto transition-all duration-300">
      <h3 className="text-xl font-medium mb-6">{question.text}</h3>
      
      {question.type === 'scale' ? (
        <div className="mb-6">
          <div className="flex justify-between mb-2 text-sm text-muted-foreground">
            <span>{question.options[0].label}</span>
            <span>{question.options[question.options.length - 1].label}</span>
          </div>
          <div className="flex justify-between space-x-2">
            {question.options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={cn(
                  "flex-1 h-12 rounded-lg transition-all duration-300",
                  selectedOption === option.value 
                    ? "bg-accent scale-100" 
                    : "bg-secondary hover:bg-secondary/80",
                  animateAnswer && selectedOption === option.value && "scale-110"
                )}
                aria-label={`Select ${option.label}`}
              >
                <span className="sr-only">{option.label}</span>
              </button>
            ))}
          </div>
          <div className="flex justify-between mt-2">
            {question.options.map((option) => (
              <div 
                key={option.value} 
                className={cn(
                  "flex-1 text-center text-sm",
                  selectedOption === option.value && "font-medium text-accent"
                )}
              >
                {option.value}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {question.options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className={cn(
                "w-full p-4 text-left rounded-xl border transition-all duration-300",
                selectedOption === option.value 
                  ? "border-accent bg-accent/5" 
                  : "border-border bg-secondary hover:bg-secondary/80",
                animateAnswer && selectedOption === option.value && "scale-[1.02]"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
      
      <div className="text-center mt-8 text-sm text-muted-foreground">
        {question.source && (
          <p className="mb-1">
            <span className="font-medium">Source:</span> {question.source}
          </p>
        )}
        {question.category && (
          <p>
            <span className="font-medium">Category:</span> {question.category}
          </p>
        )}
      </div>
    </div>
  );
};

export default QuestionnaireCard;
