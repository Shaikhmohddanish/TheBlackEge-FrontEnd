import { makeAuthenticatedRequest } from '../api-client';

// Types for order tracking
export interface TrackingEvent {
  id: number;
  orderId: number;
  eventType: string;
  eventTypeDisplayName: string;
  description: string;
  location: string;
  eventDate: string;
  createdAt: string;
  createdBy: string;
}

export interface ShippingAddress {
  id: number;
  orderId: number;
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phoneNumber?: string;
  formattedAddress: string;
}

export interface OrderTracking {
  orderId: number;
  orderNumber: string;
  trackingNumber?: string;
  carrier?: string;
  trackingUrl?: string;
  estimatedDeliveryDate?: string;
  actualDeliveryDate?: string;
  currentStatus: string;
  currentLocation?: string;
  progressPercentage: number;
  trackingEvents: TrackingEvent[];
  shippingAddress?: ShippingAddress;
}

export interface UpdateTrackingRequest {
  trackingNumber?: string;
  carrier?: string;
  trackingUrl?: string;
  estimatedDeliveryDate?: string;
  currentLocation?: string;
}

export interface AddTrackingEventRequest {
  eventType: string;
  description: string;
  location: string;
}

export interface MarkDeliveredRequest {
  deliveryDate: string;
  location: string;
  deliveredTo: string;
}

// Public APIs (No Authentication Required)

/**
 * Track order by order ID
 */
export async function trackOrderById(orderId: number | string): Promise<OrderTracking> {
  const response = await fetch(`/api/tracking/order/${orderId}`);
  
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Order not found');
    }
    throw new Error(`Failed to track order: ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * Track order by tracking number
 */
export async function trackOrderByNumber(trackingNumber: string): Promise<OrderTracking> {
  const response = await fetch(`/api/tracking/number/${encodeURIComponent(trackingNumber)}`);
  
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Tracking number not found');
    }
    throw new Error(`Failed to track order: ${response.statusText}`);
  }
  
  return response.json();
}

// Admin APIs (Requires Admin Authentication)

/**
 * Update tracking information for an order (Admin only)
 */
export async function updateOrderTracking(
  orderId: number | string,
  trackingData: UpdateTrackingRequest
): Promise<void> {
  await makeAuthenticatedRequest(`/api/admin/tracking/${orderId}`, {
    method: 'PUT',
    body: JSON.stringify(trackingData),
  });
}

/**
 * Add a tracking event to an order (Admin only)
 */
export async function addTrackingEvent(
  orderId: number | string,
  eventData: AddTrackingEventRequest
): Promise<TrackingEvent> {
  const response = await makeAuthenticatedRequest(`/api/admin/tracking/${orderId}/events`, {
    method: 'POST',
    body: JSON.stringify(eventData),
  });
  
  return response.json();
}

/**
 * Mark order as delivered (Admin only)
 */
export async function markOrderAsDelivered(
  orderId: number | string,
  deliveryData: MarkDeliveredRequest
): Promise<void> {
  await makeAuthenticatedRequest(`/api/admin/tracking/${orderId}/delivered`, {
    method: 'POST',
    body: JSON.stringify(deliveryData),
  });
}

// Utility functions

/**
 * Get progress percentage based on event type
 */
export function getProgressPercentage(eventType: string): number {
  const progressMap: Record<string, number> = {
    'ORDER_PLACED': 10,
    'PAYMENT_CONFIRMED': 20,
    'ORDER_PROCESSING': 30,
    'ORDER_SHIPPED': 50,
    'IN_TRANSIT': 70,
    'OUT_FOR_DELIVERY': 90,
    'DELIVERED': 100,
    'DELIVERY_ATTEMPTED': 85,
    'RETURNED_TO_SENDER': 0,
    'CANCELLED': 0,
    'REFUNDED': 0,
  };
  
  return progressMap[eventType] || 0;
}

/**
 * Get status color based on event type
 */
export function getStatusColor(eventType: string): string {
  const colorMap: Record<string, string> = {
    'ORDER_PLACED': 'blue',
    'PAYMENT_CONFIRMED': 'green',
    'ORDER_PROCESSING': 'yellow',
    'ORDER_SHIPPED': 'blue',
    'IN_TRANSIT': 'blue',
    'OUT_FOR_DELIVERY': 'orange',
    'DELIVERED': 'green',
    'DELIVERY_ATTEMPTED': 'yellow',
    'RETURNED_TO_SENDER': 'red',
    'EXCEPTION': 'red',
    'CANCELLED': 'red',
    'REFUNDED': 'gray',
  };
  
  return colorMap[eventType] || 'gray';
}

/**
 * Check if order status is final (no more updates expected)
 */
export function isFinalStatus(eventType: string): boolean {
  const finalStatuses = ['DELIVERED', 'RETURNED_TO_SENDER', 'CANCELLED', 'REFUNDED'];
  return finalStatuses.includes(eventType);
}

/**
 * Format tracking event for display
 */
export function formatTrackingEvent(event: TrackingEvent): string {
  const date = new Date(event.eventDate).toLocaleString();
  return `${date} - ${event.eventTypeDisplayName} at ${event.location}`;
}
