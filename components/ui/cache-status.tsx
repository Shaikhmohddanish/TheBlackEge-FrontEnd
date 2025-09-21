'use client';

import React from 'react';
import { Database, HardDrive, Clock, RefreshCw, CheckCircle, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export type CacheStatus = 'cache' | 'network' | 'loading' | 'error' | 'stale';

interface CacheStatusIndicatorProps {
  status: CacheStatus;
  lastUpdated?: Date;
  className?: string;
  showTimestamp?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function CacheStatusIndicator({
  status,
  lastUpdated,
  className,
  showTimestamp = false,
  size = 'md'
}: CacheStatusIndicatorProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'cache':
        return {
          icon: Database,
          label: 'Cached',
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          variant: 'default' as const
        };
      case 'network':
        return {
          icon: HardDrive,
          label: 'Network',
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          variant: 'secondary' as const
        };
      case 'loading':
        return {
          icon: RefreshCw,
          label: 'Loading',
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          variant: 'outline' as const
        };
      case 'error':
        return {
          icon: AlertTriangle,
          label: 'Error',
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          variant: 'destructive' as const
        };
      case 'stale':
        return {
          icon: Clock,
          label: 'Stale',
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          variant: 'secondary' as const
        };
      default:
        return {
          icon: Database,
          label: 'Unknown',
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          variant: 'outline' as const
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2'
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Badge
        variant={config.variant}
        className={cn(
          'flex items-center gap-1.5',
          config.bgColor,
          config.borderColor,
          config.color,
          sizeClasses[size]
        )}
      >
        <Icon 
          className={cn(
            iconSizes[size],
            status === 'loading' && 'animate-spin'
          )} 
        />
        <span>{config.label}</span>
      </Badge>
      
      {showTimestamp && lastUpdated && (
        <span className="text-xs text-gray-500">
          {lastUpdated.toLocaleTimeString()}
        </span>
      )}
    </div>
  );
}

interface CacheStatsProps {
  used: number;
  available: number;
  percentage: number;
  className?: string;
}

export function CacheStats({ used, available, percentage, className }: CacheStatsProps) {
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getUsageColor = (percentage: number) => {
    if (percentage < 50) return 'text-green-600';
    if (percentage < 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className={cn('space-y-1', className)}>
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">Cache Usage</span>
        <span className={getUsageColor(percentage)}>
          {percentage.toFixed(1)}%
        </span>
      </div>
      <div className="flex justify-between text-xs text-gray-500">
        <span>{formatBytes(used)} used</span>
        <span>{formatBytes(available)} available</span>
      </div>
    </div>
  );
}
