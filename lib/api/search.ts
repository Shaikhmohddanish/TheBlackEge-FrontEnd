import { apiClient } from '@/lib/api-client';

export interface SearchSuggestion {
  text: string;
  type: 'PRODUCT' | 'CATEGORY' | 'BRAND' | 'TRENDING';
  description?: string;
  imageUrl?: string;
  productId?: number;
  searchCount?: number;
  relevanceScore?: number;
}

export interface SearchFilters {
  categories?: string[];
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  brand?: string;
  color?: string;
  size?: string;
}

export interface SearchResult {
  products: Product[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  filters: SearchFilterOptions;
}

export interface SearchFilterOptions {
  categories: string[];
  brands: string[];
  colors: string[];
  sizes: string[];
  priceRange: [number, number];
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  images: string[];
  categories: string[];
  brand?: string;
  colors?: string[];
  sizes?: string[];
  inStock: boolean;
  stockQuantity: number;
  isActive: boolean;
  averageRating?: number;
  reviewCount?: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Professional Search API Client
 * Provides Amazon/Flipkart-like search functionality
 */
export class SearchAPI {
  
  /**
   * Get search suggestions based on partial query
   */
  static async getSuggestions(query: string, limit = 8): Promise<SearchSuggestion[]> {
    if (!query || query.length < 2) return [];
    
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}/search/suggestions?q=${encodeURIComponent(query)}&limit=${limit}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data || [];
    } catch (error) {
      console.error('Failed to fetch search suggestions:', error);
      return [];
    }
  }

  /**
   * Advanced product search with filters
   */
  static async searchProducts(
    query?: string,
    filters: SearchFilters = {},
    page = 0,
    size = 12,
    sortBy = 'relevance',
    sortDir = 'desc'
  ): Promise<SearchResult> {
    try {
      const params = new URLSearchParams();
      
      if (query) params.append('q', query);
      if (filters.categories?.length) {
        filters.categories.forEach(cat => params.append('categories', cat));
      }
      if (filters.minPrice !== undefined) params.append('minPrice', filters.minPrice.toString());
      if (filters.maxPrice !== undefined) params.append('maxPrice', filters.maxPrice.toString());
      if (filters.inStock !== undefined) params.append('inStock', filters.inStock.toString());
      if (filters.brand) params.append('brand', filters.brand);
      if (filters.color) params.append('color', filters.color);
      if (filters.size) params.append('size', filters.size);
      
      params.append('page', page.toString());
      params.append('size', size.toString());
      params.append('sortBy', sortBy);
      params.append('sortDir', sortDir);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}/search/products?${params.toString()}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      return {
        products: data.content || [],
        totalElements: data.totalElements || 0,
        totalPages: data.totalPages || 0,
        currentPage: data.number || 0,
        filters: {
          categories: [],
          brands: [],
          colors: [],
          sizes: [],
          priceRange: [0, 1000]
        }
      };
    } catch (error) {
      console.error('Failed to search products:', error);
      throw error;
    }
  }

  /**
   * Get trending search queries
   */
  static async getTrendingSearches(limit = 10): Promise<string[]> {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}/search/trending?limit=${limit}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data || [];
    } catch (error) {
      console.error('Failed to fetch trending searches:', error);
      return [];
    }
  }

  /**
   * Get popular categories
   */
  static async getPopularCategories(limit = 8): Promise<string[]> {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}/search/popular-categories?limit=${limit}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data || [];
    } catch (error) {
      console.error('Failed to fetch popular categories:', error);
      return [];
    }
  }

  /**
   * Get available filters for search interface
   */
  static async getAvailableFilters(query?: string): Promise<SearchFilterOptions> {
    try {
      const params = query ? `?q=${encodeURIComponent(query)}` : '';
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}/search/filters${params}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      return {
        categories: data.categories || [],
        brands: data.brands || [],
        colors: data.colors || [],
        sizes: data.sizes || [],
        priceRange: data.priceRange ? [
          parseFloat(data.priceRange[0]),
          parseFloat(data.priceRange[1])
        ] : [0, 1000]
      };
    } catch (error) {
      console.error('Failed to fetch available filters:', error);
      return {
        categories: [],
        brands: [],
        colors: [],
        sizes: [],
        priceRange: [0, 1000]
      };
    }
  }

  /**
   * Get fast autocomplete suggestions
   */
  static async getAutocomplete(query: string, limit = 5): Promise<string[]> {
    if (!query || query.length < 2) return [];
    
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}/search/autocomplete?q=${encodeURIComponent(query)}&limit=${limit}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data || [];
    } catch (error) {
      console.error('Failed to fetch autocomplete:', error);
      return [];
    }
  }

  /**
   * Track search interaction for analytics
   */
  static async trackSearchInteraction(
    query: string,
    action: 'search' | 'click' | 'add_to_cart' | 'purchase',
    productId?: number
  ): Promise<void> {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}/search/track`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query,
            action,
            productId,
            timestamp: new Date().toISOString()
          })
        }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Failed to track search interaction:', error);
    }
  }

  /**
   * Get related searches
   */
  static async getRelatedSearches(query: string, limit = 5): Promise<string[]> {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}/search/related?q=${encodeURIComponent(query)}&limit=${limit}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data || [];
    } catch (error) {
      console.error('Failed to fetch related searches:', error);
      return [];
    }
  }
}

// Convenience functions for direct use
export const searchProducts = SearchAPI.searchProducts;
export const getSearchSuggestions = SearchAPI.getSuggestions;
export const getTrendingSearches = SearchAPI.getTrendingSearches;
export const getPopularCategories = SearchAPI.getPopularCategories;
export const getAvailableFilters = SearchAPI.getAvailableFilters;
export const getAutocomplete = SearchAPI.getAutocomplete;
export const trackSearchInteraction = SearchAPI.trackSearchInteraction;
export const getRelatedSearches = SearchAPI.getRelatedSearches;
