'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Icons } from '@/components/ui/icons';
import { useToast } from '@/hooks/use-toast';
import { 
  trackOrderById, 
  updateOrderTracking, 
  addTrackingEvent, 
  markOrderAsDelivered,
  type OrderTracking,
  type UpdateTrackingRequest,
  type AddTrackingEventRequest,
  type MarkDeliveredRequest
} from '@/lib/api/tracking';
import { TrackingProgressBar } from '@/components/tracking/progress-bar';
import { TrackingTimeline } from '@/components/tracking/timeline';
import { TrackingStatusBadge } from '@/components/tracking/status-badge';

interface AdminTrackingManagementProps {
  orderId?: string;
  onUpdate?: () => void;
}

export function AdminTrackingManagement({ orderId: initialOrderId, onUpdate }: AdminTrackingManagementProps) {
  const [orderId, setOrderId] = useState(initialOrderId || '');
  const [tracking, setTracking] = useState<OrderTracking | null>(null);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const { toast } = useToast();

  // Form states
  const [trackingData, setTrackingData] = useState<UpdateTrackingRequest>({
    trackingNumber: '',
    carrier: '',
    trackingUrl: '',
    estimatedDeliveryDate: '',
    currentLocation: ''
  });

  const [eventData, setEventData] = useState<AddTrackingEventRequest>({
    eventType: '',
    description: '',
    location: ''
  });

  const [deliveryData, setDeliveryData] = useState<MarkDeliveredRequest>({
    deliveryDate: '',
    location: '',
    deliveredTo: ''
  });

  const eventTypes = [
    { value: 'ORDER_PLACED', label: 'Order Placed' },
    { value: 'PAYMENT_CONFIRMED', label: 'Payment Confirmed' },
    { value: 'ORDER_PROCESSING', label: 'Processing' },
    { value: 'ORDER_SHIPPED', label: 'Shipped' },
    { value: 'IN_TRANSIT', label: 'In Transit' },
    { value: 'OUT_FOR_DELIVERY', label: 'Out for Delivery' },
    { value: 'DELIVERED', label: 'Delivered' },
    { value: 'DELIVERY_ATTEMPTED', label: 'Delivery Attempted' },
    { value: 'RETURNED_TO_SENDER', label: 'Returned to Sender' },
    { value: 'EXCEPTION', label: 'Exception' },
    { value: 'CANCELLED', label: 'Cancelled' },
    { value: 'REFUNDED', label: 'Refunded' }
  ];

  const carriers = [
    { value: 'UPS', label: 'UPS' },
    { value: 'FedEx', label: 'FedEx' },
    { value: 'USPS', label: 'USPS' },
    { value: 'DHL', label: 'DHL' },
    { value: 'Other', label: 'Other' }
  ];

  const loadTracking = async (id: string) => {
    if (!id) return;
    
    setLoading(true);
    try {
      const trackingData = await trackOrderById(id);
      setTracking(trackingData);
      
      // Populate form with existing data
      setTrackingData({
        trackingNumber: trackingData.trackingNumber || '',
        carrier: trackingData.carrier || '',
        trackingUrl: trackingData.trackingUrl || '',
        estimatedDeliveryDate: trackingData.estimatedDeliveryDate 
          ? new Date(trackingData.estimatedDeliveryDate).toISOString().slice(0, 16)
          : '',
        currentLocation: trackingData.currentLocation || ''
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to load tracking data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) {
      loadTracking(orderId);
    }
  }, [orderId]);

  const handleLoadOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter an order ID',
        variant: 'destructive',
      });
      return;
    }
    await loadTracking(orderId);
  };

  const handleUpdateTracking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tracking) return;

    setUpdating(true);
    try {
      await updateOrderTracking(tracking.orderId, trackingData);
      await loadTracking(tracking.orderId.toString());
      onUpdate?.();
      toast({
        title: 'Success',
        description: 'Tracking information updated successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update tracking',
        variant: 'destructive',
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tracking || !eventData.eventType || !eventData.description) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    setUpdating(true);
    try {
      await addTrackingEvent(tracking.orderId, eventData);
      await loadTracking(tracking.orderId.toString());
      onUpdate?.();
      
      // Reset form
      setEventData({
        eventType: '',
        description: '',
        location: ''
      });
      
      toast({
        title: 'Success',
        description: 'Tracking event added successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to add tracking event',
        variant: 'destructive',
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleMarkDelivered = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tracking || !deliveryData.deliveryDate || !deliveryData.location) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    setUpdating(true);
    try {
      await markOrderAsDelivered(tracking.orderId, deliveryData);
      await loadTracking(tracking.orderId.toString());
      onUpdate?.();
      
      // Reset form
      setDeliveryData({
        deliveryDate: '',
        location: '',
        deliveredTo: ''
      });
      
      toast({
        title: 'Success',
        description: 'Order marked as delivered successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to mark as delivered',
        variant: 'destructive',
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleQuickAction = async (eventType: string, description: string, location: string) => {
    if (!tracking) return;

    setUpdating(true);
    try {
      await addTrackingEvent(tracking.orderId, {
        eventType,
        description,
        location
      });
      await loadTracking(tracking.orderId.toString());
      onUpdate?.();
      toast({
        title: 'Success',
        description: 'Tracking event added successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to add tracking event',
        variant: 'destructive',
      });
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Load Order */}
      {!initialOrderId && (
        <Card>
          <CardHeader>
            <CardTitle>Load Order for Tracking Management</CardTitle>
            <CardDescription>Enter an order ID to manage its tracking information</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLoadOrder} className="flex gap-4">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Enter Order ID"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                />
              </div>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  'Load Order'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Order Overview */}
      {tracking && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Order #{tracking.orderNumber}</CardTitle>
                <CardDescription>Order ID: {tracking.orderId}</CardDescription>
              </div>
              <TrackingStatusBadge status={tracking.currentStatus} size="lg" />
            </div>
          </CardHeader>
          <CardContent>
            <TrackingProgressBar
              percentage={tracking.progressPercentage}
              status={tracking.currentStatus}
            />
          </CardContent>
        </Card>
      )}

      {/* Management Interface */}
      {tracking && (
        <Tabs defaultValue="update-info" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="update-info">Update Info</TabsTrigger>
            <TabsTrigger value="add-event">Add Event</TabsTrigger>
            <TabsTrigger value="mark-delivered">Mark Delivered</TabsTrigger>
            <TabsTrigger value="quick-actions">Quick Actions</TabsTrigger>
          </TabsList>

          {/* Update Tracking Info */}
          <TabsContent value="update-info">
            <Card>
              <CardHeader>
                <CardTitle>Update Tracking Information</CardTitle>
                <CardDescription>Update carrier, tracking number, and delivery details</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateTracking} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="trackingNumber">Tracking Number</Label>
                      <Input
                        id="trackingNumber"
                        type="text"
                        value={trackingData.trackingNumber}
                        onChange={(e) => setTrackingData({...trackingData, trackingNumber: e.target.value})}
                        placeholder="e.g., 1Z999AA1234567890"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="carrier">Carrier</Label>
                      <Select
                        value={trackingData.carrier}
                        onValueChange={(value) => setTrackingData({...trackingData, carrier: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select carrier" />
                        </SelectTrigger>
                        <SelectContent>
                          {carriers.map((carrier) => (
                            <SelectItem key={carrier.value} value={carrier.value}>
                              {carrier.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="trackingUrl">Tracking URL</Label>
                      <Input
                        id="trackingUrl"
                        type="url"
                        value={trackingData.trackingUrl}
                        onChange={(e) => setTrackingData({...trackingData, trackingUrl: e.target.value})}
                        placeholder="https://..."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="estimatedDelivery">Estimated Delivery</Label>
                      <Input
                        id="estimatedDelivery"
                        type="datetime-local"
                        value={trackingData.estimatedDeliveryDate}
                        onChange={(e) => setTrackingData({...trackingData, estimatedDeliveryDate: e.target.value})}
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="currentLocation">Current Location</Label>
                      <Input
                        id="currentLocation"
                        type="text"
                        value={trackingData.currentLocation}
                        onChange={(e) => setTrackingData({...trackingData, currentLocation: e.target.value})}
                        placeholder="e.g., Chicago, IL"
                      />
                    </div>
                  </div>

                  <Button type="submit" disabled={updating}>
                    {updating ? (
                      <>
                        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      'Update Tracking Info'
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Add Tracking Event */}
          <TabsContent value="add-event">
            <Card>
              <CardHeader>
                <CardTitle>Add Tracking Event</CardTitle>
                <CardDescription>Add a new tracking event to the order timeline</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddEvent} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="eventType">Event Type</Label>
                    <Select
                      value={eventData.eventType}
                      onValueChange={(value) => setEventData({...eventData, eventType: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select event type" />
                      </SelectTrigger>
                      <SelectContent>
                        {eventTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="eventDescription">Description</Label>
                    <Textarea
                      id="eventDescription"
                      value={eventData.description}
                      onChange={(e) => setEventData({...eventData, description: e.target.value})}
                      placeholder="Describe what happened..."
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="eventLocation">Location</Label>
                    <Input
                      id="eventLocation"
                      type="text"
                      value={eventData.location}
                      onChange={(e) => setEventData({...eventData, location: e.target.value})}
                      placeholder="e.g., Distribution Center, Customer Address"
                    />
                  </div>

                  <Button type="submit" disabled={updating}>
                    {updating ? (
                      <>
                        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                        Adding Event...
                      </>
                    ) : (
                      'Add Event'
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Mark as Delivered */}
          <TabsContent value="mark-delivered">
            <Card>
              <CardHeader>
                <CardTitle>Mark as Delivered</CardTitle>
                <CardDescription>Mark the order as delivered and add delivery details</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleMarkDelivered} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="deliveryDate">Delivery Date & Time</Label>
                      <Input
                        id="deliveryDate"
                        type="datetime-local"
                        value={deliveryData.deliveryDate}
                        onChange={(e) => setDeliveryData({...deliveryData, deliveryDate: e.target.value})}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="deliveredTo">Delivered To</Label>
                      <Input
                        id="deliveredTo"
                        type="text"
                        value={deliveryData.deliveredTo}
                        onChange={(e) => setDeliveryData({...deliveryData, deliveredTo: e.target.value})}
                        placeholder="e.g., John Doe, Receptionist"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="deliveryLocation">Delivery Location</Label>
                      <Input
                        id="deliveryLocation"
                        type="text"
                        value={deliveryData.location}
                        onChange={(e) => setDeliveryData({...deliveryData, location: e.target.value})}
                        placeholder="e.g., Customer Address, Front Door"
                        required
                      />
                    </div>
                  </div>

                  <Button type="submit" disabled={updating}>
                    {updating ? (
                      <>
                        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                        Marking as Delivered...
                      </>
                    ) : (
                      'Mark as Delivered'
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Quick Actions */}
          <TabsContent value="quick-actions">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tracking updates with pre-filled information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Button
                    variant="outline"
                    onClick={() => handleQuickAction('ORDER_SHIPPED', 'Order has been shipped', 'Warehouse')}
                    disabled={updating}
                    className="h-auto p-4 flex flex-col items-center gap-2"
                  >
                    <Icons.shoppingCart className="h-6 w-6" />
                    <span>Mark as Shipped</span>
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => handleQuickAction('IN_TRANSIT', 'Package is in transit', 'Distribution Center')}
                    disabled={updating}
                    className="h-auto p-4 flex flex-col items-center gap-2"
                  >
                    <Icons.shoppingCart className="h-6 w-6" />
                    <span>In Transit</span>
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => handleQuickAction('OUT_FOR_DELIVERY', 'Out for delivery', 'Local Facility')}
                    disabled={updating}
                    className="h-auto p-4 flex flex-col items-center gap-2"
                  >
                    <Icons.shoppingCart className="h-6 w-6" />
                    <span>Out for Delivery</span>
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => handleQuickAction('DELIVERY_ATTEMPTED', 'Delivery attempted - customer not available', 'Customer Address')}
                    disabled={updating}
                    className="h-auto p-4 flex flex-col items-center gap-2"
                  >
                    <Icons.shoppingCart className="h-6 w-6" />
                    <span>Delivery Attempted</span>
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => handleQuickAction('EXCEPTION', 'Delivery exception occurred', 'Sorting Facility')}
                    disabled={updating}
                    className="h-auto p-4 flex flex-col items-center gap-2"
                  >
                    <Icons.x className="h-6 w-6" />
                    <span>Exception</span>
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => handleQuickAction('RETURNED_TO_SENDER', 'Package returned to sender', 'Return Center')}
                    disabled={updating}
                    className="h-auto p-4 flex flex-col items-center gap-2"
                  >
                    <Icons.x className="h-6 w-6" />
                    <span>Return to Sender</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {/* Current Timeline */}
      {tracking && tracking.trackingEvents.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <TrackingTimeline events={tracking.trackingEvents} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
