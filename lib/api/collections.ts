// Collections API functions
import { API_BASE_URL, handleAPIResponse, tokenManager } from '../api-client';

export interface Collection {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  active: boolean;
  featured: boolean;
  totalProducts: number;
  favoriteCount: number;
  isFavorited: boolean;
  createdAt: string;
  products?: CollectionProduct[];
}

export interface CollectionProduct {
  id: number;
  name: string;
  price: number;
  salePrice?: number;
  imageUrl: string;
  category?: string;
  stockQuantity?: number;
}

export interface CollectionsResponse {
  content: Collection[];
  pageable: {
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
  };
}

// Get all collections
export const getCollections = async (page = 0, size = 10): Promise<CollectionsResponse> => {
  try {
    const token = tokenManager.getToken();
    const headers: HeadersInit = {};
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/collections?page=${page}&size=${size}`, {
      method: 'GET',
      headers,
    });

    return await handleAPIResponse(response);
  } catch (error) {
    console.error('Failed to get collections:', error);
    throw error;
  }
};

// Get collection by ID with products
export const getCollectionById = async (collectionId: number): Promise<Collection> => {
  try {
    const token = tokenManager.getToken();
    const headers: HeadersInit = {};
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/collections/${collectionId}`, {
      method: 'GET',
      headers,
    });

    return await handleAPIResponse(response);
  } catch (error) {
    console.error('Failed to get collection:', error);
    throw error;
  }
};

// Get featured collections
export const getFeaturedCollections = async (): Promise<Collection[]> => {
  try {
    const token = tokenManager.getToken();
    const headers: HeadersInit = {};
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/collections/featured`, {
      method: 'GET',
      headers,
    });

    return await handleAPIResponse(response);
  } catch (error) {
    console.error('Failed to get featured collections:', error);
    throw error;
  }
};

// Search collections
export const searchCollections = async (
  keyword: string, 
  page = 0, 
  size = 10
): Promise<CollectionsResponse> => {
  try {
    const token = tokenManager.getToken();
    const headers: HeadersInit = {};
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const params = new URLSearchParams({
      keyword,
      page: page.toString(),
      size: size.toString(),
    });

    const response = await fetch(`${API_BASE_URL}/collections/search?${params}`, {
      method: 'GET',
      headers,
    });

    return await handleAPIResponse(response);
  } catch (error) {
    console.error('Failed to search collections:', error);
    throw error;
  }
};

// Get collection products
export const getCollectionProducts = async (
  collectionId: number,
  page = 0,
  size = 20
): Promise<{
  products: CollectionProduct[];
  totalPages: number;
  totalElements: number;
  currentPage: number;
}> => {
  try {
    const token = tokenManager.getToken();
    const headers: HeadersInit = {};
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(
      `${API_BASE_URL}/collections/${collectionId}/products?page=${page}&size=${size}`,
      {
        method: 'GET',
        headers,
      }
    );

    return await handleAPIResponse(response);
  } catch (error) {
    console.error('Failed to get collection products:', error);
    throw error;
  }
};
