import React from 'react';
import { Icons } from '@/components/ui/icons';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  className,
  text,
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div className={cn('flex flex-col items-center justify-center', className)}>
      <Icons.spinner className={cn('animate-spin text-gray-400', sizeClasses[size])} />
      {text && (
        <p className="mt-2 text-sm text-gray-600">{text}</p>
      )}
    </div>
  );
};

interface PageLoadingProps {
  text?: string;
}

export const PageLoading: React.FC<PageLoadingProps> = ({ text = 'Loading...' }) => (
  <div className="min-h-screen flex items-center justify-center">
    <LoadingSpinner size="lg" text={text} />
  </div>
);

interface SectionLoadingProps {
  text?: string;
  className?: string;
}

export const SectionLoading: React.FC<SectionLoadingProps> = ({ 
  text = 'Loading...', 
  className 
}) => (
  <div className={cn('flex items-center justify-center py-12', className)}>
    <LoadingSpinner text={text} />
  </div>
);
