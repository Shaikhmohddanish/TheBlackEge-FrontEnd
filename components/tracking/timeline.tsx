'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { TrackingEvent, getStatusColor } from '@/lib/api/tracking';
import { Icons } from '@/components/ui/icons';

interface TimelineProps {
  events: TrackingEvent[];
  className?: string;
}

interface TimelineItemProps {
  event: TrackingEvent;
  isLast: boolean;
  isFirst: boolean;
}

function TimelineItem({ event, isLast, isFirst }: TimelineItemProps) {
  const color = getStatusColor(event.eventType);
  
  const getIconColor = (color: string) => {
    switch (color) {
      case 'green': return 'text-green-600 bg-green-100 border-green-200';
      case 'blue': return 'text-blue-600 bg-blue-100 border-blue-200';
      case 'yellow': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'orange': return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'red': return 'text-red-600 bg-red-100 border-red-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getIcon = (eventType: string) => {
    switch (eventType) {
      case 'ORDER_PLACED':
        return <Icons.shoppingCart className="h-4 w-4" />;
      case 'PAYMENT_CONFIRMED':
        return <Icons.shoppingCart className="h-4 w-4" />;
      case 'ORDER_PROCESSING':
        return <Icons.shoppingCart className="h-4 w-4" />;
      case 'ORDER_SHIPPED':
        return <Icons.shoppingCart className="h-4 w-4" />;
      case 'IN_TRANSIT':
        return <Icons.shoppingCart className="h-4 w-4" />;
      case 'OUT_FOR_DELIVERY':
        return <Icons.shoppingCart className="h-4 w-4" />;
      case 'DELIVERED':
        return <Icons.shoppingCart className="h-4 w-4" />;
      case 'DELIVERY_ATTEMPTED':
        return <Icons.shoppingCart className="h-4 w-4" />;
      case 'RETURNED_TO_SENDER':
        return <Icons.x className="h-4 w-4" />;
      case 'CANCELLED':
        return <Icons.x className="h-4 w-4" />;
      case 'REFUNDED':
        return <Icons.x className="h-4 w-4" />;
      default:
        return <Icons.shoppingCart className="h-4 w-4" />;
    }
  };

  return (
    <div className="relative flex items-start space-x-4 pb-6">
      {/* Timeline line */}
      {!isLast && (
        <div className="absolute left-4 top-10 w-0.5 h-full bg-border" />
      )}
      
      {/* Icon */}
      <div className={cn(
        'relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2',
        getIconColor(color)
      )}>
        {getIcon(event.eventType)}
      </div>
      
      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-foreground">
            {event.eventTypeDisplayName}
          </h4>
          <time className="text-xs text-muted-foreground">
            {new Date(event.eventDate).toLocaleString()}
          </time>
        </div>
        
        <p className="text-sm text-muted-foreground mt-1">
          {event.description}
        </p>
        
        {event.location && (
          <div className="flex items-center mt-2 text-xs text-muted-foreground">
            <Icons.user className="h-3 w-3 mr-1" />
            {event.location}
          </div>
        )}
        
        {event.createdBy && event.createdBy !== 'system' && (
          <div className="text-xs text-muted-foreground mt-1">
            Updated by {event.createdBy}
          </div>
        )}
      </div>
    </div>
  );
}

export function TrackingTimeline({ events, className }: TimelineProps) {
  if (!events || events.length === 0) {
    return (
      <div className={cn('text-center py-8', className)}>
        <Icons.shoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">No tracking events available</p>
      </div>
    );
  }

  // Sort events by date (most recent first)
  const sortedEvents = [...events].sort((a, b) => 
    new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime()
  );

  return (
    <div className={cn('space-y-0', className)}>
      <h3 className="text-lg font-semibold mb-6">Tracking History</h3>
      
      <div className="relative">
        {sortedEvents.map((event, index) => (
          <TimelineItem
            key={event.id}
            event={event}
            isFirst={index === 0}
            isLast={index === sortedEvents.length - 1}
          />
        ))}
      </div>
    </div>
  );
}
