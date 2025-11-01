// Orders API functions
import { makeAuthenticatedRequest, handleAPIResponse, API_BASE_URL, tokenManager } from '../api-client';

export interface Address {
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phoneNumber?: string;
}

export interface OrderItem {
  id?: string;
  productId: string;
  productName?: string;
  quantity: number;
  price?: number;
  total?: number;
  variantId?: string;
  variantName?: string;
  imageUrl?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  totalAmount: number;
  status: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  items: OrderItem[];
  shippingAddress: Address;
  billingAddress?: Address;
  couponCode?: string;
  discount?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderData {
  items: Array<{
    productId: string;
    quantity: number;
    variantId?: string;
  }>;
  shippingAddress: Address;
  billingAddress?: Address;
  couponCode?: string;
  notes?: string;
}

export interface OrdersResponse {
  orders: Order[];
  totalPages: number;
  totalElements: number;
  currentPage: number;
  size: number;
}

// Create Order
export const createOrder = async (orderData: CreateOrderData): Promise<Order> => {
  try {
    const response = await makeAuthenticatedRequest(`${API_BASE_URL}/orders`, {
      method: 'POST',
      body: JSON.stringify({
        items: orderData.items,
        shippingAddress: orderData.shippingAddress,
        billingAddress: orderData.billingAddress || orderData.shippingAddress,
        couponCode: orderData.couponCode,
        notes: orderData.notes,
      }),
    });

    return await handleAPIResponse(response);
  } catch (error) {
    throw error;
  }
};

// Get User Orders
export const getUserOrders = async (page = 0, size = 10): Promise<OrdersResponse> => {
  try {
    const user = tokenManager.getUser();
    if (!user) throw new Error('User not authenticated');

    const url = `${API_BASE_URL}/orders/user/${user.id}?page=${page}&size=${size}`;
    const response = await makeAuthenticatedRequest(url);
    const data = await handleAPIResponse(response);

    return {
      orders: data.content,
      totalPages: data.totalPages,
      totalElements: data.totalElements,
      currentPage: data.number,
      size: data.size,
    };
  } catch (error) {
    throw error;
  }
};

// Get Order by ID
export const getOrder = async (orderId: string): Promise<Order> => {
  try {
    const response = await makeAuthenticatedRequest(`${API_BASE_URL}/orders/${orderId}`);
    return await handleAPIResponse(response);
  } catch (error) {
    throw error;
  }
};

// Get Order by Order Number
export const getOrderByNumber = async (orderNumber: string): Promise<Order> => {
  try {
    const response = await makeAuthenticatedRequest(`${API_BASE_URL}/orders/number/${orderNumber}`);
    return await handleAPIResponse(response);
  } catch (error) {
    throw error;
  }
};

// Cancel Order
export const cancelOrder = async (orderId: string, reason: string): Promise<string> => {
  try {
    const params = new URLSearchParams();
    params.append('reason', reason);

    const response = await makeAuthenticatedRequest(`${API_BASE_URL}/orders/${orderId}/cancel`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.text();
  } catch (error) {
    throw error;
  }
};

// Get All Orders (Admin Only)
export const getAllOrders = async (
  page = 0,
  size = 10,
  status?: string,
  search?: string
): Promise<OrdersResponse> => {
  try {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('size', size.toString());
    if (status) params.append('status', status);
    if (search) params.append('search', search);

    const url = `${API_BASE_URL}/orders?${params.toString()}`;
    const response = await makeAuthenticatedRequest(url);
    const data = await handleAPIResponse(response);

    return {
      orders: data.content,
      totalPages: data.totalPages,
      totalElements: data.totalElements,
      currentPage: data.number,
      size: data.size,
    };
  } catch (error) {
    throw error;
  }
};

// Update Order Status (Admin Only)
export const updateOrderStatus = async (
  orderId: string,
  status: Order['status']
): Promise<Order> => {
  try {
    const params = new URLSearchParams();
    params.append('status', status);

    const response = await makeAuthenticatedRequest(`${API_BASE_URL}/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    return await handleAPIResponse(response);
  } catch (error) {
    throw error;
  }
};
