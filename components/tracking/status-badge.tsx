'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { getStatusColor } from '@/lib/api/tracking';

interface StatusBadgeProps {
  status: string;
  displayName?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function TrackingStatusBadge({ 
  status, 
  displayName, 
  className,
  size = 'md' 
}: StatusBadgeProps) {
  const color = getStatusColor(status);
  
  const getVariantClass = (color: string) => {
    switch (color) {
      case 'green':
        return 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200';
      case 'blue':
        return 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200';
      case 'yellow':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200';
      case 'orange':
        return 'bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200';
      case 'red':
        return 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200';
      case 'gray':
        return 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200';
    }
  };

  const getSizeClass = (size: string) => {
    switch (size) {
      case 'sm':
        return 'text-xs px-2 py-1';
      case 'lg':
        return 'text-sm px-4 py-2';
      default:
        return 'text-sm px-3 py-1';
    }
  };

  return (
    <Badge 
      className={cn(
        'font-medium border transition-colors duration-200',
        getVariantClass(color),
        getSizeClass(size),
        className
      )}
    >
      {displayName || status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
    </Badge>
  );
}
