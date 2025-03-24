
import React from 'react';
import { cn } from '@/lib/utils';

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
}

const FadeIn = ({ 
  children, 
  delay = 0, 
  className = "",
  direction = 'up'
}: FadeInProps) => {
  
  const directionStyles = {
    up: 'translate-y-4',
    down: '-translate-y-4',
    left: 'translate-x-4',
    right: '-translate-x-4',
    none: ''
  };
  
  return (
    <div
      className={cn(
        'opacity-0 transform', 
        directionStyles[direction],
        className
      )}
      style={{
        animation: `fadeIn 0.8s ease-out ${delay}s forwards`
      }}
    >
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: ${direction === 'up' ? 'translateY(10px)' : 
                         direction === 'down' ? 'translateY(-10px)' : 
                         direction === 'left' ? 'translateX(10px)' : 
                         direction === 'right' ? 'translateX(-10px)' : 
                         'none'};
          }
          to {
            opacity: 1;
            transform: translateY(0) translateX(0);
          }
        }
      `}</style>
      {children}
    </div>
  );
};

export default FadeIn;
