# Order Tracking Feature - UI Integration Guide

## 📋 Overview
This document provides the UI team with all necessary information to integrate the new **Order Tracking Feature** into the frontend application. The feature provides comprehensive order tracking capabilities with real-time status updates, delivery tracking, and event history.

---

## 🚀 New Features Added

### ✅ **Backend Updates Completed**
1. **Database Schema**: New tables for tracking events and shipping addresses
2. **Entity Models**: OrderTrackingEvent, ShippingAddress, TrackingEventType enum
3. **Service Layer**: OrderTrackingService with caching and business logic
4. **REST APIs**: Complete CRUD operations for order tracking
5. **GraphQL APIs**: Full GraphQL support with queries and mutations
6. **Security**: Role-based access control (Public read, Admin write)
7. **Caching**: Performance optimization with Caffeine cache

### 🎯 **UI Integration Required**
1. **Customer Order Tracking Page**: Public order lookup and status display
2. **Admin Tracking Management**: Admin panel for tracking updates
3. **Order Status Updates**: Enhanced order display with tracking info
4. **Delivery Progress Indicator**: Visual progress bar/timeline
5. **Tracking History**: Event timeline display

---

## 🔗 API Endpoints

### **Public APIs (No Authentication Required)**

#### 1. Track Order by Order ID
```http
GET /api/tracking/order/{orderId}
```

**Example Request:**
```javascript
// JavaScript/React Example
const trackOrder = async (orderId) => {
  try {
    const response = await fetch(`/api/tracking/order/${orderId}`);
    const trackingData = await response.json();
    return trackingData;
  } catch (error) {
    console.error('Error tracking order:', error);
  }
};

// Usage
const tracking = await trackOrder(123);
```

**Sample Response:**
```json
{
  "orderId": 123,
  "orderNumber": "ORD-20240901-001",
  "trackingNumber": "1Z999AA1234567890",
  "carrier": "UPS",
  "trackingUrl": "https://www.ups.com/track?tracknum=1Z999AA1234567890",
  "estimatedDeliveryDate": "2024-09-05T18:00:00",
  "actualDeliveryDate": null,
  "currentStatus": "IN_TRANSIT",
  "currentLocation": "Chicago, IL",
  "progressPercentage": 70,
  "trackingEvents": [
    {
      "id": 1,
      "orderId": 123,
      "eventType": "ORDER_PLACED",
      "eventTypeDisplayName": "Order Placed",
      "description": "Order has been placed successfully",
      "location": "Online",
      "eventDate": "2024-09-01T10:00:00",
      "createdAt": "2024-09-01T10:00:00",
      "createdBy": "customer"
    },
    {
      "id": 2,
      "orderId": 123,
      "eventType": "ORDER_SHIPPED",
      "eventTypeDisplayName": "Order Shipped",
      "description": "Order has been shipped via UPS",
      "location": "New York, NY",
      "eventDate": "2024-09-02T14:30:00",
      "createdAt": "2024-09-02T14:30:00",
      "createdBy": "admin"
    },
    {
      "id": 3,
      "orderId": 123,
      "eventType": "IN_TRANSIT",
      "eventTypeDisplayName": "In Transit",
      "description": "Package is in transit",
      "location": "Chicago, IL",
      "eventDate": "2024-09-03T09:15:00",
      "createdAt": "2024-09-03T09:15:00",
      "createdBy": "system"
    }
  ],
  "shippingAddress": {
    "id": 1,
    "orderId": 123,
    "fullName": "John Doe",
    "addressLine1": "123 Main St",
    "addressLine2": "Apt 4B",
    "city": "New York",
    "state": "NY",
    "postalCode": "10001",
    "country": "USA",
    "phoneNumber": "+1-555-0123",
    "formattedAddress": "John Doe, 123 Main St, Apt 4B, New York, NY 10001, USA"
  }
}
```

#### 2. Track Order by Tracking Number
```http
GET /api/tracking/number/{trackingNumber}
```

**Example Request:**
```javascript
const trackByNumber = async (trackingNumber) => {
  try {
    const response = await fetch(`/api/tracking/number/${trackingNumber}`);
    const trackingData = await response.json();
    return trackingData;
  } catch (error) {
    console.error('Error tracking by number:', error);
  }
};

// Usage
const tracking = await trackByNumber("1Z999AA1234567890");
```

### **Admin APIs (Requires Admin Authentication)**

#### 1. Update Tracking Information
```http
PUT /api/admin/tracking/{orderId}
Content-Type: application/json
Authorization: Bearer {admin_jwt_token}
```

**Request Body:**
```json
{
  "trackingNumber": "1Z999AA1234567890",
  "carrier": "UPS",
  "trackingUrl": "https://www.ups.com/track?tracknum=1Z999AA1234567890",
  "estimatedDeliveryDate": "2024-09-05T18:00:00",
  "currentLocation": "Chicago, IL"
}
```

**Example Request:**
```javascript
const updateTracking = async (orderId, trackingData, adminToken) => {
  try {
    const response = await fetch(`/api/admin/tracking/${orderId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify(trackingData)
    });
    return response.json();
  } catch (error) {
    console.error('Error updating tracking:', error);
  }
};
```

#### 2. Add Tracking Event
```http
POST /api/admin/tracking/{orderId}/events
Content-Type: application/json
Authorization: Bearer {admin_jwt_token}
```

**Request Body:**
```json
{
  "eventType": "IN_TRANSIT",
  "description": "Package is in transit",
  "location": "Chicago, IL"
}
```

**Example Request:**
```javascript
const addTrackingEvent = async (orderId, eventData, adminToken) => {
  try {
    const response = await fetch(`/api/admin/tracking/${orderId}/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify(eventData)
    });
    return response.json();
  } catch (error) {
    console.error('Error adding tracking event:', error);
  }
};
```

#### 3. Mark Order as Delivered
```http
POST /api/admin/tracking/{orderId}/delivered
Content-Type: application/json
Authorization: Bearer {admin_jwt_token}
```

**Request Body:**
```json
{
  "deliveryDate": "2024-09-05T16:30:00",
  "location": "Customer Address",
  "deliveredTo": "John Doe"
}
```

---

## 📊 Tracking Event Types & Status

### **Event Types Available:**
| Event Type | Display Name | Progress % | Order Status | Description |
|------------|--------------|------------|--------------|-------------|
| `ORDER_PLACED` | Order Placed | 10% | PENDING | Order has been placed |
| `PAYMENT_CONFIRMED` | Payment Confirmed | 20% | CONFIRMED | Payment processed |
| `ORDER_PROCESSING` | Processing | 30% | PROCESSING | Order being prepared |
| `ORDER_SHIPPED` | Shipped | 50% | SHIPPED | Order has been shipped |
| `IN_TRANSIT` | In Transit | 70% | SHIPPED | Package in transit |
| `OUT_FOR_DELIVERY` | Out for Delivery | 90% | SHIPPED | Out for delivery |
| `DELIVERED` | Delivered | 100% | DELIVERED | Package delivered |
| `DELIVERY_ATTEMPTED` | Delivery Attempted | 85% | SHIPPED | Delivery was attempted |
| `RETURNED_TO_SENDER` | Returned | 0% | RETURNED | Returned to sender |
| `EXCEPTION` | Exception | - | EXCEPTION | Delivery exception |
| `CANCELLED` | Cancelled | 0% | CANCELLED | Order cancelled |
| `REFUNDED` | Refunded | 0% | REFUNDED | Order refunded |

---

## 🎨 UI Components Needed

### 1. **Customer Order Tracking Page**
```javascript
// React Component Example
import React, { useState, useEffect } from 'react';

const OrderTrackingPage = ({ orderId }) => {
  const [tracking, setTracking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTracking = async () => {
      try {
        const response = await fetch(`/api/tracking/order/${orderId}`);
        const data = await response.json();
        setTracking(data);
      } catch (error) {
        console.error('Error fetching tracking:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTracking();
  }, [orderId]);

  if (loading) return <div>Loading tracking information...</div>;
  if (!tracking) return <div>Order not found</div>;

  return (
    <div className="order-tracking">
      <div className="tracking-header">
        <h2>Order #{tracking.orderNumber}</h2>
        <div className="tracking-number">
          Tracking: {tracking.trackingNumber}
          {tracking.trackingUrl && (
            <a href={tracking.trackingUrl} target="_blank" rel="noopener noreferrer">
              Track with {tracking.carrier}
            </a>
          )}
        </div>
      </div>

      <div className="progress-section">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${tracking.progressPercentage}%` }}
          ></div>
        </div>
        <div className="progress-text">
          {tracking.progressPercentage}% Complete - {tracking.currentStatus}
        </div>
      </div>

      <div className="delivery-info">
        <div className="current-location">
          📍 Current Location: {tracking.currentLocation}
        </div>
        <div className="estimated-delivery">
          📅 Estimated Delivery: {new Date(tracking.estimatedDeliveryDate).toLocaleDateString()}
        </div>
      </div>

      <div className="tracking-timeline">
        <h3>Tracking History</h3>
        {tracking.trackingEvents.map((event, index) => (
          <div key={event.id} className="timeline-item">
            <div className="timeline-date">
              {new Date(event.eventDate).toLocaleString()}
            </div>
            <div className="timeline-content">
              <div className="event-title">{event.eventTypeDisplayName}</div>
              <div className="event-description">{event.description}</div>
              <div className="event-location">📍 {event.location}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="shipping-address">
        <h3>Shipping Address</h3>
        <div className="address">
          {tracking.shippingAddress.formattedAddress}
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingPage;
```

### 2. **Admin Tracking Management Component**
```javascript
// Admin Component Example
import React, { useState } from 'react';

const AdminTrackingManager = ({ orderId, adminToken }) => {
  const [trackingData, setTrackingData] = useState({
    trackingNumber: '',
    carrier: '',
    trackingUrl: '',
    estimatedDeliveryDate: '',
    currentLocation: ''
  });

  const handleUpdateTracking = async () => {
    try {
      const response = await fetch(`/api/admin/tracking/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify(trackingData)
      });
      
      if (response.ok) {
        alert('Tracking information updated successfully!');
      }
    } catch (error) {
      console.error('Error updating tracking:', error);
    }
  };

  const handleAddEvent = async (eventType, description, location) => {
    try {
      const response = await fetch(`/api/admin/tracking/${orderId}/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          eventType,
          description,
          location
        })
      });
      
      if (response.ok) {
        alert('Tracking event added successfully!');
      }
    } catch (error) {
      console.error('Error adding event:', error);
    }
  };

  return (
    <div className="admin-tracking-manager">
      <h3>Update Tracking Information</h3>
      
      <div className="form-group">
        <label>Tracking Number:</label>
        <input
          type="text"
          value={trackingData.trackingNumber}
          onChange={(e) => setTrackingData({...trackingData, trackingNumber: e.target.value})}
        />
      </div>

      <div className="form-group">
        <label>Carrier:</label>
        <select
          value={trackingData.carrier}
          onChange={(e) => setTrackingData({...trackingData, carrier: e.target.value})}
        >
          <option value="">Select Carrier</option>
          <option value="UPS">UPS</option>
          <option value="FedEx">FedEx</option>
          <option value="USPS">USPS</option>
          <option value="DHL">DHL</option>
        </select>
      </div>

      <div className="form-group">
        <label>Current Location:</label>
        <input
          type="text"
          value={trackingData.currentLocation}
          onChange={(e) => setTrackingData({...trackingData, currentLocation: e.target.value})}
        />
      </div>

      <button onClick={handleUpdateTracking}>Update Tracking Info</button>

      <div className="quick-actions">
        <h4>Quick Actions</h4>
        <button onClick={() => handleAddEvent('ORDER_SHIPPED', 'Order has been shipped', 'Warehouse')}>
          Mark as Shipped
        </button>
        <button onClick={() => handleAddEvent('IN_TRANSIT', 'Package is in transit', 'Distribution Center')}>
          Add Transit Event
        </button>
        <button onClick={() => handleAddEvent('DELIVERED', 'Package delivered successfully', 'Customer Address')}>
          Mark as Delivered
        </button>
      </div>
    </div>
  );
};

export default AdminTrackingManager;
```

---

## 🎯 GraphQL Integration (Optional)

If your frontend uses GraphQL, here are the available operations:

### **GraphQL Queries:**
```graphql
# Track order by ID
query TrackOrder($orderId: ID!) {
  trackOrder(orderId: $orderId) {
    orderId
    orderNumber
    trackingNumber
    carrier
    currentStatus
    progressPercentage
    trackingEvents {
      eventType
      eventTypeDisplayName
      description
      location
      eventDate
    }
    shippingAddress {
      formattedAddress
    }
  }
}

# Track by tracking number
query TrackByNumber($trackingNumber: String!) {
  trackByTrackingNumber(trackingNumber: $trackingNumber) {
    orderId
    orderNumber
    currentStatus
    trackingEvents {
      eventType
      description
      eventDate
    }
  }
}
```

### **GraphQL Mutations (Admin Only):**
```graphql
# Update tracking information
mutation UpdateTracking($orderId: ID!, $input: OrderTrackingInput!) {
  updateOrderTracking(orderId: $orderId, input: $input)
}

# Add tracking event
mutation AddEvent($orderId: ID!, $input: TrackingEventInput!) {
  addTrackingEvent(orderId: $orderId, input: $input) {
    id
    eventType
    description
    location
    eventDate
  }
}

# Mark as delivered
mutation MarkDelivered($orderId: ID!) {
  markAsDelivered(orderId: $orderId)
}
```

---

## 📱 Mobile Responsive Considerations

### **CSS Classes Suggested:**
```css
.order-tracking {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.progress-bar {
  width: 100%;
  height: 10px;
  background-color: #e0e0e0;
  border-radius: 5px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #4CAF50, #8BC34A);
  transition: width 0.3s ease;
}

.timeline-item {
  display: flex;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.timeline-date {
  min-width: 150px;
  font-weight: bold;
  color: #666;
}

.timeline-content {
  flex: 1;
  margin-left: 20px;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .timeline-item {
    flex-direction: column;
  }
  
  .timeline-date {
    margin-bottom: 10px;
  }
  
  .timeline-content {
    margin-left: 0;
  }
}
```

---

## 🔒 Security Notes

1. **Public APIs**: No authentication required for order tracking
2. **Admin APIs**: Require valid JWT token with ADMIN role
3. **CORS**: Ensure CORS is configured for your frontend domain
4. **Rate Limiting**: Consider implementing rate limiting for public APIs

---

## 🧪 Testing

### **Test Data Available:**
You can use these test scenarios:

1. **Test Order IDs**: 1, 2, 3 (if sample data is loaded)
2. **Test Tracking Numbers**: "1Z999AA1234567890", "1Z888BB0987654321"
3. **Admin Token**: Use your existing admin JWT token

### **API Testing Commands:**
```bash
# Test public tracking
curl -X GET "http://localhost:8080/api/tracking/order/1"

# Test admin update (replace {token} with actual admin JWT)
curl -X PUT "http://localhost:8080/api/admin/tracking/1" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "trackingNumber": "1Z999AA1234567890",
    "carrier": "UPS",
    "currentLocation": "New York, NY"
  }'
```

---

## 📞 Support

If you need any clarification or encounter issues during implementation:

1. **API Endpoints**: All endpoints are documented above with examples
2. **Response Format**: JSON responses follow the exact structure shown
3. **Error Handling**: APIs return standard HTTP status codes
4. **Performance**: Caching is implemented on the backend for fast responses

---

## ✅ Implementation Checklist

### **For UI Team:**
- [ ] Create customer order tracking page
- [ ] Implement order tracking lookup (by ID and tracking number)
- [ ] Add progress indicator/timeline component
- [ ] Create admin tracking management interface
- [ ] Add tracking information to existing order pages
- [ ] Implement responsive design for mobile
- [ ] Add error handling for API calls
- [ ] Test with sample data

### **Integration Points:**
- [ ] Update existing order list to show tracking status
- [ ] Add "Track Order" buttons to order history
- [ ] Integrate with order details page
- [ ] Add tracking info to order confirmation emails
- [ ] Update admin dashboard with tracking management

---

This comprehensive guide provides everything needed to integrate the order tracking feature into your frontend application. The APIs are fully functional and ready for integration!
