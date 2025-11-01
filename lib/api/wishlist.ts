import { Product } from './products';
import { API_BASE_URL } from '../api-client';

export interface WishlistItem {
  productId: string;
  productName: string;
  productImageId: string; // Cloudinary public ID
  productImageUrl: string; // Generated Cloudinary URL
  productPrice: number;
  productSlug: string;
  quantity: number;
  notes?: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  addedAt: string;
  updatedAt: string;
  isAvailable: boolean;
  variantId?: string;
  variantName?: string;
  category?: string;
  brand?: string;
}

export interface Wishlist {
  id: string;
  userId: string;
  name: string;
  description?: string;
  isPublic: boolean;
  isDefault: boolean;
  items: WishlistItem[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  itemCount: number;
  totalValue: number;
  isEmpty: boolean;
}

export interface WishlistAnalytics {
  totalItems: number;
  totalValue: number;
  wishlistCount: number;
}

// Wishlist CRUD operations
export const createWishlist = async (
  userId: string,
  name: string,
  description?: string,
  isPublic: boolean = false
): Promise<Wishlist> => {
  const response = await fetch(`${API_BASE_URL}/wishlists`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({ userId, name, description, isPublic }),
  });

  if (!response.ok) {
    throw new Error('Failed to create wishlist');
  }

  return response.json();
};

export const getUserWishlists = async (userId: string): Promise<Wishlist[]> => {
  const response = await fetch(`${API_BASE_URL}/wishlists/user/${userId}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch wishlists');
  }

  return response.json();
};

export const getDefaultWishlist = async (userId: string): Promise<Wishlist> => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
  if (!token) {
    throw new Error('Authentication token not found');
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/wishlists/user/${userId}/default`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      // Provide more detailed error information
      const errorText = await response.text();
      let errorMessage = `Failed to fetch default wishlist (${response.status})`;
      
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        // If not JSON, use the text or default message
        errorMessage = errorText || errorMessage;
      }
      
      throw new Error(errorMessage);
    }

    return response.json();
  } catch (error) {
    // Re-throw with more context if it's a network error
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to the server. Please check if the backend is running.');
    }
    throw error;
  }
};

export const getWishlistById = async (wishlistId: string): Promise<Wishlist> => {
  const response = await fetch(`${API_BASE_URL}/wishlists/${wishlistId}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch wishlist');
  }

  return response.json();
};

export const updateWishlist = async (
  wishlistId: string,
  name: string,
  description?: string,
  isPublic: boolean = false
): Promise<Wishlist> => {
  const response = await fetch(`${API_BASE_URL}/wishlists/${wishlistId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({ name, description, isPublic }),
  });

  if (!response.ok) {
    throw new Error('Failed to update wishlist');
  }

  return response.json();
};

export const deleteWishlist = async (wishlistId: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/wishlists/${wishlistId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to delete wishlist');
  }
};

// Wishlist item operations
export const addItemToWishlist = async (
  wishlistId: string,
  productId: string,
  quantity: number = 1,
  notes?: string,
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT' = 'MEDIUM'
): Promise<Wishlist> => {
  const response = await fetch(`${API_BASE_URL}/wishlists/${wishlistId}/items`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({ productId, quantity, notes, priority }),
  });

  if (!response.ok) {
    throw new Error('Failed to add item to wishlist');
  }

  return response.json();
};

export const removeItemFromWishlist = async (
  wishlistId: string,
  productId: string
): Promise<Wishlist> => {
  const response = await fetch(`${API_BASE_URL}/wishlists/${wishlistId}/items/${productId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to remove item from wishlist');
  }

  return response.json();
};

// Smart operations
export const addToWishlist = async (
  userId: string,
  productId: string,
  wishlistName?: string
): Promise<Wishlist> => {
  const response = await fetch(`${API_BASE_URL}/wishlists/add-to-wishlist`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({ userId, productId, wishlistName }),
  });

  if (!response.ok) {
    throw new Error('Failed to add product to wishlist');
  }

  return response.json();
};

export const addToDefaultWishlist = async (
  userId: string,
  productId: string
): Promise<Wishlist> => {
  const response = await fetch(`${API_BASE_URL}/wishlists/add-to-default`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({ userId, productId }),
  });

  if (!response.ok) {
    throw new Error('Failed to add product to default wishlist');
  }

  return response.json();
};

export const isProductInWishlist = async (
  userId: string,
  productId: string
): Promise<boolean> => {
  const response = await fetch(`${API_BASE_URL}/wishlists/check/${userId}/${productId}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  });

  if (!response.ok) {
    return false;
  }

  return response.json();
};

// Search and filtering
export const searchWishlists = async (
  userId: string,
  query: string
): Promise<Wishlist[]> => {
  const response = await fetch(`${API_BASE_URL}/wishlists/search/${userId}?query=${encodeURIComponent(query)}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to search wishlists');
  }

  return response.json();
};

export const getPublicWishlists = async (): Promise<Wishlist[]> => {
  const response = await fetch(`${API_BASE_URL}/wishlists/public`);

  if (!response.ok) {
    throw new Error('Failed to fetch public wishlists');
  }

  return response.json();
};

// Wishlist management
export const setDefaultWishlist = async (
  wishlistId: string,
  userId: string
): Promise<Wishlist> => {
  const response = await fetch(`${API_BASE_URL}/wishlists/${wishlistId}/set-default`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({ userId }),
  });

  if (!response.ok) {
    throw new Error('Failed to set default wishlist');
  }

  return response.json();
};

// Analytics
export const getWishlistAnalytics = async (userId: string): Promise<WishlistAnalytics> => {
  const response = await fetch(`${API_BASE_URL}/wishlists/analytics/${userId}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch wishlist analytics');
  }

  return response.json();
};