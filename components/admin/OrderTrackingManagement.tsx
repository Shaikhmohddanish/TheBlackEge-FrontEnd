'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Truck, MapPin, Calendar, Clock } from 'lucide-react';
import {
  TrackingEvent,
  TrackingEventType,
  AddTrackingEventRequest,
  UpdateTrackingInfoRequest,
  AdminOrder,
  addTrackingEvent,
  getOrderTrackingEvents,
  updateTrackingInfo,
  deleteTrackingEvent,
  getTrackingEventTypeDisplayName,
  getTrackingEventTypeColor
} from '@/lib/api/admin-orders';

interface OrderTrackingManagementProps {
  order: AdminOrder;
  onOrderUpdate: (updatedOrder: AdminOrder) => void;
  className?: string;
}

const OrderTrackingManagement: React.FC<OrderTrackingManagementProps> = ({
  order,
  onOrderUpdate,
  className = ''
}) => {
  const [trackingEvents, setTrackingEvents] = useState<TrackingEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddEventDialog, setShowAddEventDialog] = useState(false);
  const [showEditTrackingDialog, setShowEditTrackingDialog] = useState(false);
  const [deletingEventId, setDeletingEventId] = useState<string | null>(null);
  
  // Add tracking event form
  const [eventForm, setEventForm] = useState<AddTrackingEventRequest>({
    eventType: TrackingEventType.IN_TRANSIT,
    description: '',
    location: '',
    eventDate: ''
  });
  
  // Update tracking info form
  const [trackingForm, setTrackingForm] = useState<UpdateTrackingInfoRequest>({
    trackingNumber: order.trackingNumber || '',
    carrier: '',
    trackingUrl: '',
    estimatedDeliveryDate: order.estimatedDeliveryDate || '',
    notes: ''
  });
  
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadTrackingEvents();
  }, [order.id]);

  const loadTrackingEvents = async () => {
    try {
      setLoading(true);
      const events = await getOrderTrackingEvents(order.id);
      setTrackingEvents(events);
    } catch (error: any) {
      console.error('Failed to load tracking events:', error);
      toast.error('Failed to load tracking events');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTrackingEvent = async () => {
    if (!eventForm.description.trim()) {
      toast.error('Description is required');
      return;
    }

    try {
      setSubmitting(true);
      const updatedOrder = await addTrackingEvent(order.id, eventForm);
      
      toast.success('Tracking event added successfully');
      setShowAddEventDialog(false);
      setEventForm({
        eventType: TrackingEventType.IN_TRANSIT,
        description: '',
        location: '',
        eventDate: ''
      });
      
      onOrderUpdate(updatedOrder);
      await loadTrackingEvents();
    } catch (error: any) {
      console.error('Failed to add tracking event:', error);
      toast.error('Failed to add tracking event');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateTrackingInfo = async () => {
    try {
      setSubmitting(true);
      const updatedOrder = await updateTrackingInfo(order.id, trackingForm);
      
      toast.success('Tracking information updated successfully');
      setShowEditTrackingDialog(false);
      onOrderUpdate(updatedOrder);
    } catch (error: any) {
      console.error('Failed to update tracking info:', error);
      toast.error('Failed to update tracking information');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      await deleteTrackingEvent(order.id, eventId);
      toast.success('Tracking event deleted successfully');
      setDeletingEventId(null);
      await loadTrackingEvents();
    } catch (error: any) {
      console.error('Failed to delete tracking event:', error);
      toast.error('Failed to delete tracking event');
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Card className={`bg-black border-white text-white ${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Order Tracking
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`bg-black border-white text-white ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Truck className="h-5 w-5" />
          Order Tracking
        </CardTitle>
        <CardDescription className="text-gray-400">
          Manage tracking information and events for order #{order.orderNumber}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Current Tracking Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-900 rounded-lg border border-gray-700">
          <div>
            <Label className="text-sm font-medium text-gray-300">Tracking Number</Label>
            <p className="text-white mt-1">{order.trackingNumber || 'Not set'}</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-300">Estimated Delivery</Label>
            <p className="text-white mt-1">
              {order.estimatedDeliveryDate 
                ? formatDateTime(order.estimatedDeliveryDate) 
                : 'Not set'
              }
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Dialog open={showAddEventDialog} onOpenChange={setShowAddEventDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-black">
                <Plus className="h-4 w-4 mr-2" />
                Add Tracking Event
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-black border-white text-white">
              <DialogHeader>
                <DialogTitle>Add Tracking Event</DialogTitle>
                <DialogDescription className="text-gray-400">
                  Add a new tracking event for this order
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Event Type</Label>
                  <Select 
                    value={eventForm.eventType} 
                    onValueChange={(value) => setEventForm({...eventForm, eventType: value as TrackingEventType})}
                  >
                    <SelectTrigger className="border-white border-2 bg-black text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-black border-white text-white">
                      {Object.values(TrackingEventType).map((type) => (
                        <SelectItem key={type} value={type}>
                          {getTrackingEventTypeDisplayName(type)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={eventForm.description}
                    onChange={(e) => setEventForm({...eventForm, description: e.target.value})}
                    placeholder="Describe the tracking event..."
                    className="border-white border-2 bg-black text-white"
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={eventForm.location}
                    onChange={(e) => setEventForm({...eventForm, location: e.target.value})}
                    placeholder="City, State or facility name"
                    className="border-white border-2 bg-black text-white"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="eventDate">Event Date (optional)</Label>
                  <Input
                    id="eventDate"
                    type="datetime-local"
                    value={eventForm.eventDate}
                    onChange={(e) => setEventForm({...eventForm, eventDate: e.target.value})}
                    className="border-white border-2 bg-black text-white"
                  />
                  <p className="text-sm text-gray-400">Leave empty to use current time</p>
                </div>
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button 
                  onClick={handleAddTrackingEvent}
                  disabled={submitting}
                  className="bg-white text-black hover:bg-gray-200"
                >
                  {submitting ? 'Adding...' : 'Add Event'}
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setShowAddEventDialog(false)}
                  className="border-white text-white hover:bg-white hover:text-black"
                >
                  Cancel
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          
          <Dialog open={showEditTrackingDialog} onOpenChange={setShowEditTrackingDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-black">
                <Edit className="h-4 w-4 mr-2" />
                Update Tracking Info
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-black border-white text-white">
              <DialogHeader>
                <DialogTitle>Update Tracking Information</DialogTitle>
                <DialogDescription className="text-gray-400">
                  Update carrier and tracking details
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="trackingNumber">Tracking Number</Label>
                  <Input
                    id="trackingNumber"
                    value={trackingForm.trackingNumber}
                    onChange={(e) => setTrackingForm({...trackingForm, trackingNumber: e.target.value})}
                    placeholder="Enter tracking number"
                    className="border-white border-2 bg-black text-white"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="carrier">Carrier</Label>
                  <Input
                    id="carrier"
                    value={trackingForm.carrier}
                    onChange={(e) => setTrackingForm({...trackingForm, carrier: e.target.value})}
                    placeholder="FedEx, UPS, DHL, etc."
                    className="border-white border-2 bg-black text-white"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="trackingUrl">Tracking URL</Label>
                  <Input
                    id="trackingUrl"
                    value={trackingForm.trackingUrl}
                    onChange={(e) => setTrackingForm({...trackingForm, trackingUrl: e.target.value})}
                    placeholder="https://..."
                    className="border-white border-2 bg-black text-white"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="estimatedDelivery">Estimated Delivery Date</Label>
                  <Input
                    id="estimatedDelivery"
                    type="datetime-local"
                    value={trackingForm.estimatedDeliveryDate}
                    onChange={(e) => setTrackingForm({...trackingForm, estimatedDeliveryDate: e.target.value})}
                    className="border-white border-2 bg-black text-white"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={trackingForm.notes}
                    onChange={(e) => setTrackingForm({...trackingForm, notes: e.target.value})}
                    placeholder="Additional notes..."
                    className="border-white border-2 bg-black text-white"
                    rows={3}
                  />
                </div>
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button 
                  onClick={handleUpdateTrackingInfo}
                  disabled={submitting}
                  className="bg-white text-black hover:bg-gray-200"
                >
                  {submitting ? 'Updating...' : 'Update'}
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setShowEditTrackingDialog(false)}
                  className="border-white text-white hover:bg-white hover:text-black"
                >
                  Cancel
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Tracking Events Timeline */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Tracking Events</h3>
          
          {trackingEvents.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <Truck className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No tracking events yet</p>
              <p className="text-sm">Add the first tracking event to start tracking this order</p>
            </div>
          ) : (
            <div className="space-y-4">
              {trackingEvents
                .sort((a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime())
                .map((event) => (
                <div key={event.id} className="flex items-start gap-4 p-4 bg-gray-900 rounded-lg border border-gray-700">
                  <div className="flex-shrink-0">
                    <Badge 
                      variant="outline" 
                      className={`border-${getTrackingEventTypeColor(event.eventType)}-500 text-${getTrackingEventTypeColor(event.eventType)}-400`}
                    >
                      {getTrackingEventTypeDisplayName(event.eventType)}
                    </Badge>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium">{event.description}</p>
                    
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                      {event.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span>{event.location}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{formatDateTime(event.eventDate)}</span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>by {event.createdBy}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-shrink-0">
                    <AlertDialog open={deletingEventId === event.id} onOpenChange={(open) => !open && setDeletingEventId(null)}>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDeletingEventId(event.id)}
                        className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                      
                      <AlertDialogContent className="bg-black border-white text-white">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Tracking Event</AlertDialogTitle>
                          <AlertDialogDescription className="text-gray-400">
                            Are you sure you want to delete this tracking event? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="border-white text-white hover:bg-white hover:text-black">
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteEvent(event.id)}
                            className="bg-red-500 hover:bg-red-600"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderTrackingManagement;