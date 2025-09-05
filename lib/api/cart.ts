// Cart API functions
import { makeAuthenticatedRequest, handleAPIResponse, API_BASE_URL } from '../api-client';

export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  productImageUrl?: string;
  quantity: number;
  price: number;
  productVariantId?: string;
  variantName?: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  totalItems: number;
  totalPrice: number; // Note: backend uses totalPrice, not totalAmount
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
}

// Get User Cart
export const getCart = async (): Promise<Cart> => {
  try {
    const response = await makeAuthenticatedRequest(`${API_BASE_URL}/cart`);
    return await handleAPIResponse(response);
  } catch (error) {
    console.error('Failed to fetch cart:', error);
    throw error;
  }
};

// Add Item to Cart
export const addToCart = async (
  productId: string,
  quantity: number,
  variantId?: string
): Promise<Cart> => {
  try {
    const params = new URLSearchParams();
    params.append('productId', productId);
    params.append('quantity', quantity.toString());
    if (variantId) params.append('variantId', variantId);

    const response = await makeAuthenticatedRequest(`${API_BASE_URL}/cart/items?${params.toString()}`, {
      method: 'POST',
    });

    return await handleAPIResponse(response);
  } catch (error) {
    console.error('Failed to add to cart:', error);
    throw error;
  }
};

// Update Cart Item
export const updateCartItem = async (itemId: string, quantity: number): Promise<Cart> => {
  try {
    const params = new URLSearchParams();
    params.append('quantity', quantity.toString());

    const response = await makeAuthenticatedRequest(`${API_BASE_URL}/cart/items/${itemId}?${params.toString()}`, {
      method: 'PUT',
    });

    return await handleAPIResponse(response);
  } catch (error) {
    console.error('Failed to update cart item:', error);
    throw error;
  }
};

// Remove Cart Item
export const removeFromCart = async (itemId: string): Promise<Cart> => {
  try {
    const response = await makeAuthenticatedRequest(`${API_BASE_URL}/cart/items/${itemId}`, {
      method: 'DELETE',
    });

    return await handleAPIResponse(response);
  } catch (error) {
    console.error('Failed to remove from cart:', error);
    throw error;
  }
};

// Clear Cart
export const clearCart = async (): Promise<{ success: boolean }> => {
  try {
    const response = await makeAuthenticatedRequest(`${API_BASE_URL}/cart/clear`, {
      method: 'DELETE',
    });

    if (response.status === 204) {
      return { success: true };
    }

    throw new Error('Failed to clear cart');
  } catch (error) {
    console.error('Failed to clear cart:', error);
    throw error;
  }
};
