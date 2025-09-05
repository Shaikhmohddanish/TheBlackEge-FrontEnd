'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  percentage: number;
  status: string;
  className?: string;
  showPercentage?: boolean;
}

export function TrackingProgressBar({ 
  percentage, 
  status, 
  className,
  showPercentage = true 
}: ProgressBarProps) {
  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return 'bg-green-500';
    if (percentage >= 70) return 'bg-blue-500';
    if (percentage >= 30) return 'bg-yellow-500';
    return 'bg-gray-400';
  };

  const getProgressGradient = (percentage: number) => {
    if (percentage >= 100) return 'from-green-400 to-green-600';
    if (percentage >= 70) return 'from-blue-400 to-blue-600';
    if (percentage >= 30) return 'from-yellow-400 to-yellow-600';
    return 'from-gray-300 to-gray-500';
  };

  return (
    <div className={cn('w-full', className)}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-foreground">
          {status}
        </span>
        {showPercentage && (
          <span className="text-sm text-muted-foreground">
            {percentage}%
          </span>
        )}
      </div>
      
      <div className="w-full bg-secondary rounded-full h-3 overflow-hidden">
        <div
          className={cn(
            'h-full rounded-full bg-gradient-to-r transition-all duration-700 ease-in-out',
            getProgressGradient(percentage)
          )}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
      
      <div className="flex justify-between text-xs text-muted-foreground mt-1">
        <span>Order Placed</span>
        <span>Delivered</span>
      </div>
    </div>
  );
}
