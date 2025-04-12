
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export type SkeletonSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';
export type SkeletonVariant = 'card' | 'rectangle' | 'circle' | 'text';

export interface LoadingSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Size of the skeleton
   * @default 'md'
   */
  size?: SkeletonSize;
  
  /**
   * Variant of the skeleton
   * @default 'card'
   */
  variant?: SkeletonVariant;
  
  /**
   * Whether to show the skeleton inside a card
   * @default true
   */
  withCard?: boolean;
  
  /**
   * Number of skeleton lines to show (only for text variant)
   * @default 3
   */
  lines?: number;
  
  /**
   * Width of the skeleton, overrides size
   */
  width?: string | number;
  
  /**
   * Height of the skeleton, overrides size
   */
  height?: string | number;
  
  /**
   * Intensity of the pulse animation
   * @default 'default'
   */
  pulseIntensity?: 'light' | 'default' | 'strong';
  
  /**
   * Custom classname for the skeleton
   */
  skeletonClassName?: string;
}

const sizeMappings = {
  sm: 'h-16',
  md: 'h-32',
  lg: 'h-48',
  xl: 'h-64',
  full: 'h-full',
};

const widthMappings = {
  sm: 'w-24',
  md: 'w-full',
  lg: 'w-full',
  xl: 'w-full',
  full: 'w-full',
};

const LoadingSkeleton = ({
  size = 'md',
  variant = 'card',
  withCard = true,
  lines = 3,
  width,
  height,
  pulseIntensity = 'default',
  className,
  skeletonClassName,
  ...props
}: LoadingSkeletonProps) => {
  const heightClass = height ? `h-[${typeof height === 'number' ? `${height}px` : height}]` : sizeMappings[size];
  const widthClass = width ? `w-[${typeof width === 'number' ? `${width}px` : width}]` : widthMappings[size];
  
  const pulseClass = {
    light: 'animate-pulse opacity-70',
    default: 'animate-pulse',
    strong: 'animate-pulse opacity-90',
  }[pulseIntensity];
  
  const renderSkeletonContent = () => {
    switch (variant) {
      case 'circle':
        return (
          <Skeleton 
            className={cn(
              'rounded-full aspect-square', 
              heightClass, 
              pulseClass,
              skeletonClassName
            )} 
          />
        );
      case 'text':
        return (
          <div className={cn('flex flex-col gap-2', widthClass)}>
            {Array.from({ length: lines }).map((_, i) => (
              <Skeleton 
                key={i} 
                className={cn(
                  'h-4', 
                  i === lines - 1 && lines > 1 ? 'w-3/4' : 'w-full', 
                  pulseClass,
                  skeletonClassName
                )} 
              />
            ))}
          </div>
        );
      case 'rectangle':
        return (
          <Skeleton 
            className={cn(
              heightClass, 
              widthClass, 
              pulseClass,
              skeletonClassName
            )} 
          />
        );
      case 'card':
      default:
        return (
          <div className={cn('space-y-4', widthClass)}>
            <Skeleton className={cn('h-8 w-3/4', pulseClass, skeletonClassName)} />
            <Skeleton className={cn('h-24', pulseClass, skeletonClassName)} />
            <div className="space-y-2">
              <Skeleton className={cn('h-4 w-full', pulseClass, skeletonClassName)} />
              <Skeleton className={cn('h-4 w-5/6', pulseClass, skeletonClassName)} />
              <Skeleton className={cn('h-4 w-4/6', pulseClass, skeletonClassName)} />
            </div>
          </div>
        );
    }
  };
  
  if (withCard) {
    return (
      <Card className={className} {...props}>
        <CardContent className="p-6">
          {renderSkeletonContent()}
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className={className} {...props}>
      {renderSkeletonContent()}
    </div>
  );
};

export default LoadingSkeleton;
