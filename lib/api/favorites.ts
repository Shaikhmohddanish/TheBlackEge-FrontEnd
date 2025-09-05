// Favorites API functions
import { API_BASE_URL, handleAPIResponse, tokenManager } from '../api-client';

export interface FavoriteResponse {
  success: boolean;
  message: string;
  productId?: number;
  collectionId?: number;
  favoriteCount: number;
  isFavorited?: boolean;
}

export interface FavoriteCheckResponse {
  productId?: number;
  collectionId?: number;
  isFavorited: boolean;
  favoriteCount: number;
}

export interface FavoriteProduct {
  id: number;
  name: string;
  price: number;
  salePrice?: number;
  imageUrl: string;
  categories: string[];
  stockQuantity: number;
  createdAt: string;
}

export interface FavoriteCollection {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  totalProducts: number;
  favoriteCount: number;
  isFavorited: boolean;
}

// Product Favorites APIs

// Add product to favorites
export const addProductToFavorites = async (productId: number): Promise<FavoriteResponse> => {
  try {
    const token = tokenManager.getToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_BASE_URL}/favorites/products/${productId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    return await handleAPIResponse(response);
  } catch (error) {
    console.error('Failed to add product to favorites:', error);
    throw error;
  }
};

// Remove product from favorites
export const removeProductFromFavorites = async (productId: number): Promise<FavoriteResponse> => {
  try {
    const token = tokenManager.getToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_BASE_URL}/favorites/products/${productId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    return await handleAPIResponse(response);
  } catch (error) {
    console.error('Failed to remove product from favorites:', error);
    throw error;
  }
};

// Toggle product favorite status
export const toggleProductFavorite = async (productId: number): Promise<FavoriteResponse> => {
  try {
    const token = tokenManager.getToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_BASE_URL}/favorites/products/${productId}/toggle`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    return await handleAPIResponse(response);
  } catch (error) {
    console.error('Failed to toggle product favorite:', error);
    throw error;
  }
};

// Check if product is favorited
export const checkProductFavorite = async (productId: number): Promise<FavoriteCheckResponse> => {
  try {
    const token = tokenManager.getToken();
    if (!token) {
      return { productId, isFavorited: false, favoriteCount: 0 };
    }

    const response = await fetch(`${API_BASE_URL}/favorites/products/${productId}/check`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    return await handleAPIResponse(response);
  } catch (error) {
    console.error('Failed to check product favorite status:', error);
    return { productId, isFavorited: false, favoriteCount: 0 };
  }
};

// Get user's favorite products
export const getFavoriteProducts = async (): Promise<FavoriteProduct[]> => {
  try {
    const token = tokenManager.getToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_BASE_URL}/favorites`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    return await handleAPIResponse(response);
  } catch (error) {
    console.error('Failed to get favorite products:', error);
    throw error;
  }
};

// Get user's favorite product IDs
export const getFavoriteProductIds = async (): Promise<number[]> => {
  try {
    const token = tokenManager.getToken();
    if (!token) {
      return [];
    }

    const response = await fetch(`${API_BASE_URL}/favorites/products/ids`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    return await handleAPIResponse(response);
  } catch (error) {
    console.error('Failed to get favorite product IDs:', error);
    return [];
  }
};

// Get product favorite count (public)
export const getProductFavoriteCount = async (productId: number): Promise<{ productId: number; favoriteCount: number }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/favorites/products/${productId}/count`, {
      method: 'GET',
    });

    return await handleAPIResponse(response);
  } catch (error) {
    console.error('Failed to get product favorite count:', error);
    return { productId, favoriteCount: 0 };
  }
};

// Collection Favorites APIs

// Add collection to favorites
export const addCollectionToFavorites = async (collectionId: number): Promise<FavoriteResponse> => {
  try {
    const token = tokenManager.getToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_BASE_URL}/favorites/collections/${collectionId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    return await handleAPIResponse(response);
  } catch (error) {
    console.error('Failed to add collection to favorites:', error);
    throw error;
  }
};

// Remove collection from favorites
export const removeCollectionFromFavorites = async (collectionId: number): Promise<FavoriteResponse> => {
  try {
    const token = tokenManager.getToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_BASE_URL}/favorites/collections/${collectionId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    return await handleAPIResponse(response);
  } catch (error) {
    console.error('Failed to remove collection from favorites:', error);
    throw error;
  }
};

// Toggle collection favorite status
export const toggleCollectionFavorite = async (collectionId: number): Promise<FavoriteResponse> => {
  try {
    const token = tokenManager.getToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_BASE_URL}/favorites/collections/${collectionId}/toggle`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    return await handleAPIResponse(response);
  } catch (error) {
    console.error('Failed to toggle collection favorite:', error);
    throw error;
  }
};

// Check if collection is favorited
export const checkCollectionFavorite = async (collectionId: number): Promise<FavoriteCheckResponse> => {
  try {
    const token = tokenManager.getToken();
    if (!token) {
      return { collectionId, isFavorited: false, favoriteCount: 0 };
    }

    const response = await fetch(`${API_BASE_URL}/favorites/collections/${collectionId}/check`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    return await handleAPIResponse(response);
  } catch (error) {
    console.error('Failed to check collection favorite status:', error);
    return { collectionId, isFavorited: false, favoriteCount: 0 };
  }
};

// Get user's favorite collections
export const getFavoriteCollections = async (): Promise<FavoriteCollection[]> => {
  try {
    const token = tokenManager.getToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_BASE_URL}/favorites/collections`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    return await handleAPIResponse(response);
  } catch (error) {
    console.error('Failed to get favorite collections:', error);
    throw error;
  }
};

// Get user's favorite collection IDs
export const getFavoriteCollectionIds = async (): Promise<number[]> => {
  try {
    const token = tokenManager.getToken();
    if (!token) {
      return [];
    }

    const response = await fetch(`${API_BASE_URL}/favorites/collections/ids`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    return await handleAPIResponse(response);
  } catch (error) {
    console.error('Failed to get favorite collection IDs:', error);
    return [];
  }
};
