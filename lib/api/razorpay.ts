/**
 * Razorpay API client for payment processing
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

export interface CreateOrderRequest {
  amount: number;
  currency: string;
  receipt?: string;
  description?: string;
  notes?: Record<string, any>;
  customerEmail?: string;
  customerPhone?: string;
  customerName?: string;
  customerId?: string;
  orderId?: string;
  productId?: string;
  productName?: string;
  quantity?: number;
  shippingAddress?: string;
  billingAddress?: string;
}

export interface CreateOrderResponse {
  id: string;
  entity: string;
  amount: number;
  currency: string;
  receipt: string;
  status: string;
  createdAt: number;
  description?: string;
  notes?: Record<string, any>;
  keyId: string;
  orderId?: string;
  customerId?: string;
  customerEmail?: string;
  customerPhone?: string;
  customerName?: string;
  shippingAddress?: string;
  billingAddress?: string;
  productId?: string;
  productName?: string;
  quantity?: number;
}

export interface PaymentDto {
  id: string;
  orderId: string;
  paymentId: string;
  signature: string;
  amount: number;
  currency: string;
  status: string;
  method?: string;
  description?: string;
  receipt?: string;
  notes?: Record<string, any>;
  customerId?: string;
  customerEmail?: string;
  customerPhone?: string;
  customerName?: string;
  createdAt: number;
  capturedAt?: number;
  failureReason?: string;
  errorCode?: string;
  errorDescription?: string;
  orderStatus?: string;
  refundId?: string;
  refundAmount?: number;
  refundStatus?: string;
  refundReason?: string;
}

export interface PaymentConfig {
  keyId: string;
  currency: string;
  timeout: number;
}

export interface PaymentVerificationData {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

/**
 * Create a new payment order
 */
export const createOrder = async (request: CreateOrderRequest): Promise<CreateOrderResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/payments/create-order`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error('Failed to create order');
  }

  return response.json();
};

/**
 * Verify payment signature
 */
export const verifyPayment = async (paymentData: PaymentVerificationData): Promise<{
  success: boolean;
  message: string;
  payment?: PaymentDto;
}> => {
  const response = await fetch(`${API_BASE_URL}/api/payments/verify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(paymentData),
  });

  if (!response.ok) {
    throw new Error('Failed to verify payment');
  }

  return response.json();
};

/**
 * Get payment details
 */
export const getPaymentDetails = async (paymentId: string): Promise<PaymentDto> => {
  const response = await fetch(`${API_BASE_URL}/api/payments/${paymentId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to get payment details');
  }

  return response.json();
};

/**
 * Capture payment
 */
export const capturePayment = async (paymentId: string, amount: number): Promise<PaymentDto> => {
  const response = await fetch(`${API_BASE_URL}/api/payments/${paymentId}/capture?amount=${amount}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to capture payment');
  }

  return response.json();
};

/**
 * Refund payment
 */
export const refundPayment = async (
  paymentId: string, 
  amount: number, 
  reason?: string
): Promise<PaymentDto> => {
  const url = new URL(`${API_BASE_URL}/api/payments/${paymentId}/refund`);
  url.searchParams.append('amount', amount.toString());
  if (reason) {
    url.searchParams.append('reason', reason);
  }

  const response = await fetch(url.toString(), {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to refund payment');
  }

  return response.json();
};

/**
 * Get payment configuration
 */
export const getPaymentConfig = async (): Promise<PaymentConfig> => {
  const response = await fetch(`${API_BASE_URL}/api/payments/config`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to get payment config');
  }

  return response.json();
};
