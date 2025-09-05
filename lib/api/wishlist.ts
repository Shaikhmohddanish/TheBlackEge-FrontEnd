// Wishlist API functions
import { makeAuthenticatedRequest, handleAPIResponse, API_BASE_URL } from '../api-client';
import { Product } from './products';

export interface WishlistItem {
  id: string;
  productId: string;
  product: Product;
  addedAt: string;
}

export interface Wishlist {
  id: string;
  userId: string;
  items: WishlistItem[];
  totalItems: number;
  updatedAt: string;
}

// Get User Wishlist
export const getWishlist = async (): Promise<Wishlist> => {
  try {
    const response = await makeAuthenticatedRequest(`${API_BASE_URL}/wishlist`);
    return await handleAPIResponse(response);
  } catch (error) {
    console.error('Failed to fetch wishlist:', error);
    throw error;
  }
};

// Add to Wishlist
export const addToWishlist = async (productId: string): Promise<Wishlist> => {
  try {
    const response = await makeAuthenticatedRequest(`${API_BASE_URL}/wishlist/products/${productId}`, {
      method: 'POST',
    });

    return await handleAPIResponse(response);
  } catch (error) {
    console.error('Failed to add to wishlist:', error);
    throw error;
  }
};

// Remove from Wishlist
export const removeFromWishlist = async (productId: string): Promise<Wishlist> => {
  try {
    const response = await makeAuthenticatedRequest(`${API_BASE_URL}/wishlist/products/${productId}`, {
      method: 'DELETE',
    });

    return await handleAPIResponse(response);
  } catch (error) {
    console.error('Failed to remove from wishlist:', error);
    throw error;
  }
};

// Check if Product in Wishlist
export const isProductInWishlist = async (productId: string): Promise<boolean> => {
  try {
    const response = await makeAuthenticatedRequest(`${API_BASE_URL}/wishlist/products/${productId}/check`);
    const result = await handleAPIResponse(response);
    return result.inWishlist || false;
  } catch (error) {
    console.error('Failed to check wishlist:', error);
    return false;
  }
};

// Clear Wishlist
export const clearWishlist = async (): Promise<{ success: boolean }> => {
  try {
    const response = await makeAuthenticatedRequest(`${API_BASE_URL}/wishlist/clear`, {
      method: 'DELETE',
    });

    if (response.status === 204) {
      return { success: true };
    }

    throw new Error('Failed to clear wishlist');
  } catch (error) {
    console.error('Failed to clear wishlist:', error);
    throw error;
  }
};
