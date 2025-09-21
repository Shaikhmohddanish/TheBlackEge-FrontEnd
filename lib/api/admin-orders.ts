import { makeAuthenticatedRequest, handleAPIResponse, API_BASE_URL } from '@/lib/api-client';

export interface AdminOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  status: OrderStatus;
  totalAmount: number;
  items: AdminOrderItem[];
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod?: string;
  paymentStatus?: string;
  notes?: string;
  trackingNumber?: string;
  estimatedDeliveryDate?: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface AdminOrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage?: string;
  productSku: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  variantId?: string;
  variantName?: string;
}

export interface Address {
  id?: string;
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phoneNumber?: string;
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
  RETURNED = 'RETURNED'
}

export interface OrdersResponse {
  orders: AdminOrder[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export interface OrderStatusUpdateRequest {
  status: OrderStatus;
  notes?: string;
}

/**
 * Admin Order Management API Client
 */

// Get all orders with pagination (Admin only)
export const getAdminOrders = async (
  page = 0,
  size = 10,
  sortBy = 'createdAt',
  sortDir = 'desc'
): Promise<OrdersResponse> => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      sortBy,
      sortDir,
    });

    const response = await makeAuthenticatedRequest(`${API_BASE_URL}/orders/admin?${params.toString()}`);
    const data = await handleAPIResponse(response);

    return {
      orders: data.content || [],
      totalElements: data.totalElements || 0,
      totalPages: data.totalPages || 0,
      currentPage: data.number || 0,
      pageSize: data.size || size,
    };
  } catch (error) {
    console.error('Failed to fetch admin orders:', error);
    throw error;
  }
};

// Get orders by status (Admin only)
export const getOrdersByStatus = async (
  status: OrderStatus,
  page = 0,
  size = 10
): Promise<OrdersResponse> => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });

    const response = await makeAuthenticatedRequest(`${API_BASE_URL}/orders/status/${status}?${params.toString()}`);
    const data = await handleAPIResponse(response);

    return {
      orders: data.content || [],
      totalElements: data.totalElements || 0,
      totalPages: data.totalPages || 0,
      currentPage: data.number || 0,
      pageSize: data.size || size,
    };
  } catch (error) {
    console.error('Failed to fetch orders by status:', error);
    throw error;
  }
};

// Search orders (Admin only)
export const searchAdminOrders = async (
  keyword: string,
  page = 0,
  size = 10
): Promise<OrdersResponse> => {
  try {
    const params = new URLSearchParams({
      keyword,
      page: page.toString(),
      size: size.toString(),
    });

    const response = await makeAuthenticatedRequest(`${API_BASE_URL}/orders/search?${params.toString()}`);
    const data = await handleAPIResponse(response);

    return {
      orders: data.content || [],
      totalElements: data.totalElements || 0,
      totalPages: data.totalPages || 0,
      currentPage: data.number || 0,
      pageSize: data.size || size,
    };
  } catch (error) {
    console.error('Failed to search admin orders:', error);
    throw error;
  }
};

// Update order status (Admin only)
export const updateOrderStatus = async (
  orderId: string,
  statusUpdate: OrderStatusUpdateRequest
): Promise<AdminOrder> => {
  try {
    const params = new URLSearchParams({
      status: statusUpdate.status,
    });

    if (statusUpdate.notes) {
      params.append('notes', statusUpdate.notes);
    }

    const response = await makeAuthenticatedRequest(`${API_BASE_URL}/orders/${orderId}/status?${params.toString()}`, {
      method: 'PATCH',
    });

    return await handleAPIResponse(response);
  } catch (error) {
    console.error('Failed to update order status:', error);
    throw error;
  }
};

// Get order by ID (Admin only)
export const getAdminOrderById = async (orderId: string): Promise<AdminOrder> => {
  try {
    const response = await makeAuthenticatedRequest(`${API_BASE_URL}/orders/${orderId}`);
    return await handleAPIResponse(response);
  } catch (error) {
    console.error('Failed to fetch admin order:', error);
    throw error;
  }
};

// Cancel order (Admin only)
export const cancelOrder = async (orderId: string, reason: string): Promise<void> => {
  try {
    const response = await makeAuthenticatedRequest(`${API_BASE_URL}/orders/${orderId}/cancel`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ reason }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Failed to cancel order:', error);
    throw error;
  }
};

// Update order (Admin only)
export const updateOrder = async (orderId: string, orderData: Partial<AdminOrder>): Promise<AdminOrder> => {
  try {
    const response = await makeAuthenticatedRequest(`${API_BASE_URL}/orders/${orderId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    return await handleAPIResponse(response);
  } catch (error) {
    console.error('Failed to update order:', error);
    throw error;
  }
};

// Bulk operations
export const bulkUpdateOrderStatus = async (
  orderIds: string[],
  statusUpdate: OrderStatusUpdateRequest
): Promise<void> => {
  try {
    const updatePromises = orderIds.map(id => updateOrderStatus(id, statusUpdate));
    await Promise.all(updatePromises);
  } catch (error) {
    console.error('Failed to bulk update order status:', error);
    throw error;
  }
};

// Order statistics (Admin only)
export const getOrderStatistics = async (): Promise<{
  totalOrders: number;
  pendingOrders: number;
  processingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
}> => {
  try {
    const response = await makeAuthenticatedRequest(`${API_BASE_URL}/orders/statistics`);
    return await handleAPIResponse(response);
  } catch (error) {
    console.error('Failed to fetch order statistics:', error);
    throw error;
  }
};

// Status transition validation
export const getValidStatusTransitions = (currentStatus: OrderStatus): OrderStatus[] => {
  const transitions: Record<OrderStatus, OrderStatus[]> = {
    [OrderStatus.PENDING]: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],
    [OrderStatus.CONFIRMED]: [OrderStatus.PROCESSING, OrderStatus.CANCELLED],
    [OrderStatus.PROCESSING]: [OrderStatus.SHIPPED, OrderStatus.CANCELLED],
    [OrderStatus.SHIPPED]: [OrderStatus.OUT_FOR_DELIVERY, OrderStatus.DELIVERED],
    [OrderStatus.OUT_FOR_DELIVERY]: [OrderStatus.DELIVERED],
    [OrderStatus.DELIVERED]: [OrderStatus.RETURNED],
    [OrderStatus.CANCELLED]: [],
    [OrderStatus.REFUNDED]: [],
    [OrderStatus.RETURNED]: [OrderStatus.REFUNDED],
  };

  return transitions[currentStatus] || [];
};

// Status display helpers
export const getStatusColor = (status: OrderStatus): string => {
  const colors: Record<OrderStatus, string> = {
    [OrderStatus.PENDING]: 'warning',
    [OrderStatus.CONFIRMED]: 'info',
    [OrderStatus.PROCESSING]: 'primary',
    [OrderStatus.SHIPPED]: 'primary',
    [OrderStatus.OUT_FOR_DELIVERY]: 'primary',
    [OrderStatus.DELIVERED]: 'success',
    [OrderStatus.CANCELLED]: 'destructive',
    [OrderStatus.REFUNDED]: 'secondary',
    [OrderStatus.RETURNED]: 'warning',
  };

  return colors[status] || 'secondary';
};

export const getStatusDisplayName = (status: OrderStatus): string => {
  const displayNames: Record<OrderStatus, string> = {
    [OrderStatus.PENDING]: 'Pending',
    [OrderStatus.CONFIRMED]: 'Confirmed',
    [OrderStatus.PROCESSING]: 'Processing',
    [OrderStatus.SHIPPED]: 'Shipped',
    [OrderStatus.OUT_FOR_DELIVERY]: 'Out for Delivery',
    [OrderStatus.DELIVERED]: 'Delivered',
    [OrderStatus.CANCELLED]: 'Cancelled',
    [OrderStatus.REFUNDED]: 'Refunded',
    [OrderStatus.RETURNED]: 'Returned',
  };

  return displayNames[status] || status;
};
