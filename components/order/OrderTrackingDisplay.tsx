'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Truck, MapPin, Calendar, Clock, ExternalLink, Package, CheckCircle } from 'lucide-react';
import {
  TrackingEvent,
  getOrderTrackingEvents,
  getTrackingEventTypeDisplayName,
  getTrackingEventTypeColor,
  TrackingEventType
} from '@/lib/api/admin-orders';

interface OrderTrackingDisplayProps {
  orderId: string;
  orderNumber: string;
  trackingNumber?: string;
  carrier?: string;
  trackingUrl?: string;
  estimatedDeliveryDate?: string;
  orderStatus: string;
  className?: string;
}

const OrderTrackingDisplay: React.FC<OrderTrackingDisplayProps> = ({
  orderId,
  orderNumber,
  trackingNumber,
  carrier,
  trackingUrl,
  estimatedDeliveryDate,
  orderStatus,
  className = ''
}) => {
  const [trackingEvents, setTrackingEvents] = useState<TrackingEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTrackingEvents();
  }, [orderId]);

  const loadTrackingEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const events = await getOrderTrackingEvents(orderId);
      setTrackingEvents(events);
    } catch (error: any) {
      console.error('Failed to load tracking events:', error);
      setError('Unable to load tracking information');
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      })
    };
  };

  const getProgressPercentage = () => {
    if (!trackingEvents.length) return 0;
    
    const milestones = [
      TrackingEventType.ORDER_PLACED,
      TrackingEventType.PAYMENT_CONFIRMED,
      TrackingEventType.ORDER_PROCESSING,
      TrackingEventType.ORDER_SHIPPED,
      TrackingEventType.IN_TRANSIT,
      TrackingEventType.OUT_FOR_DELIVERY,
      TrackingEventType.DELIVERED
    ];
    
    const latestEvent = trackingEvents
      .sort((a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime())[0];
    
    const currentIndex = milestones.indexOf(latestEvent.eventType);
    return currentIndex >= 0 ? ((currentIndex + 1) / milestones.length) * 100 : 10;
  };

  const isDelivered = trackingEvents.some(event => 
    event.eventType === TrackingEventType.DELIVERED
  );

  if (loading) {
    return (
      <Card className={`bg-white border-gray-200 ${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Order Tracking
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`bg-white border-gray-200 ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Truck className="h-5 w-5 text-blue-600" />
          Order Tracking
        </CardTitle>
        <CardDescription>
          Track your order #{orderNumber}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {error ? (
          <div className="text-center py-8">
            <Package className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600 mb-2">{error}</p>
            <Button 
              variant="outline" 
              onClick={loadTrackingEvents}
              className="text-blue-600 border-blue-600 hover:bg-blue-50"
            >
              Try Again
            </Button>
          </div>
        ) : (
          <>
            {/* Shipping Information */}
            {(trackingNumber || carrier || estimatedDeliveryDate) && (
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <h3 className="font-semibold text-gray-900 mb-3">Shipping Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {trackingNumber && (
                    <div>
                      <p className="text-sm font-medium text-gray-700">Tracking Number</p>
                      <p className="text-gray-900 font-mono">{trackingNumber}</p>
                    </div>
                  )}
                  
                  {carrier && (
                    <div>
                      <p className="text-sm font-medium text-gray-700">Carrier</p>
                      <p className="text-gray-900">{carrier}</p>
                    </div>
                  )}
                  
                  {estimatedDeliveryDate && (
                    <div>
                      <p className="text-sm font-medium text-gray-700">Estimated Delivery</p>
                      <p className="text-gray-900">{formatDateTime(estimatedDeliveryDate).date}</p>
                    </div>
                  )}
                  
                  <div>
                    <p className="text-sm font-medium text-gray-700">Order Status</p>
                    <Badge variant={isDelivered ? 'default' : 'secondary'} className="mt-1">
                      {isDelivered ? 'Delivered' : orderStatus}
                    </Badge>
                  </div>
                </div>
                
                {trackingUrl && (
                  <div className="pt-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.open(trackingUrl, '_blank')}
                      className="text-blue-600 border-blue-600 hover:bg-blue-50"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Track on Carrier Website
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Progress Bar */}
            {trackingEvents.length > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Order Progress</span>
                  <span>{Math.round(getProgressPercentage())}% Complete</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${getProgressPercentage()}%` }}
                  />
                </div>
              </div>
            )}

            <Separator />

            {/* Tracking Timeline */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tracking History</h3>
              
              {trackingEvents.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No tracking information available yet</p>
                  <p className="text-sm">Check back later for updates</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {trackingEvents
                    .sort((a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime())
                    .map((event, index) => {
                      const { date, time } = formatDateTime(event.eventDate);
                      const isLatest = index === 0;
                      const isDeliveredEvent = event.eventType === TrackingEventType.DELIVERED;
                      
                      return (
                        <div key={event.id} className="relative">
                          {/* Timeline line */}
                          {index < trackingEvents.length - 1 && (
                            <div className="absolute left-4 top-8 w-0.5 h-16 bg-gray-200" />
                          )}
                          
                          <div className="flex items-start gap-4">
                            {/* Timeline dot */}
                            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                              isLatest || isDeliveredEvent
                                ? 'bg-green-100 border-2 border-green-500' 
                                : 'bg-blue-100 border-2 border-blue-300'
                            }`}>
                              {isDeliveredEvent ? (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              ) : (
                                <div className={`w-2 h-2 rounded-full ${
                                  isLatest ? 'bg-green-500' : 'bg-blue-400'
                                }`} />
                              )}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <Badge 
                                      variant="outline"
                                      className={`text-xs ${
                                        isLatest || isDeliveredEvent
                                          ? 'border-green-500 text-green-700 bg-green-50'
                                          : 'border-blue-500 text-blue-700 bg-blue-50'
                                      }`}
                                    >
                                      {getTrackingEventTypeDisplayName(event.eventType)}
                                    </Badge>
                                    {isLatest && (
                                      <Badge variant="default" className="text-xs bg-blue-600">
                                        Latest
                                      </Badge>
                                    )}
                                  </div>
                                  
                                  <p className="text-gray-900 font-medium mb-1">{event.description}</p>
                                  
                                  <div className="flex items-center gap-4 text-sm text-gray-500">
                                    <div className="flex items-center gap-1">
                                      <Calendar className="h-3 w-3" />
                                      <span>{date}</span>
                                    </div>
                                    
                                    <div className="flex items-center gap-1">
                                      <Clock className="h-3 w-3" />
                                      <span>{time}</span>
                                    </div>
                                    
                                    {event.location && (
                                      <div className="flex items-center gap-1">
                                        <MapPin className="h-3 w-3" />
                                        <span>{event.location}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default OrderTrackingDisplay;