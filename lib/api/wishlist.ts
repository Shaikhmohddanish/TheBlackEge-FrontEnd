import { Product } from './products';

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

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

// Wishlist CRUD operations
export const createWishlist = async (
  userId: string,
  name: string,
  description?: string,
  isPublic: boolean = false
): Promise<Wishlist> => {
  const response = await fetch(`${API_BASE_URL}/api/wishlists`, {
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
  const response = await fetch(`${API_BASE_URL}/api/wishlists/user/${userId}`, {
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
  const response = await fetch(`${API_BASE_URL}/api/wishlists/user/${userId}/default`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch default wishlist');
  }

  return response.json();
};

export const getWishlistById = async (wishlistId: string): Promise<Wishlist> => {
  const response = await fetch(`${API_BASE_URL}/api/wishlists/${wishlistId}`, {
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
  const response = await fetch(`${API_BASE_URL}/api/wishlists/${wishlistId}`, {
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
  const response = await fetch(`${API_BASE_URL}/api/wishlists/${wishlistId}`, {
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
  const response = await fetch(`${API_BASE_URL}/api/wishlists/${wishlistId}/items`, {
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
  const response = await fetch(`${API_BASE_URL}/api/wishlists/${wishlistId}/items/${productId}`, {
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
  const response = await fetch(`${API_BASE_URL}/api/wishlists/add-to-wishlist`, {
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
  const response = await fetch(`${API_BASE_URL}/api/wishlists/add-to-default`, {
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
  const response = await fetch(`${API_BASE_URL}/api/wishlists/check/${userId}/${productId}`, {
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
  const response = await fetch(`${API_BASE_URL}/api/wishlists/search/${userId}?query=${encodeURIComponent(query)}`, {
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
  const response = await fetch(`${API_BASE_URL}/api/wishlists/public`);

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
  const response = await fetch(`${API_BASE_URL}/api/wishlists/${wishlistId}/set-default`, {
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
  const response = await fetch(`${API_BASE_URL}/api/wishlists/analytics/${userId}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch wishlist analytics');
  }

  return response.json();
};