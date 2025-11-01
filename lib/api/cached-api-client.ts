/**
 * Enhanced API client with browser caching
 */

import { browserStorage } from '@/lib/storage/browser-storage';
import { Product, getProducts, getProductById, getProductBySlug } from './products';
import { Wishlist, WishlistItem, getDefaultWishlist, addToDefaultWishlist, removeItemFromWishlist } from './wishlist';
import { User, getCurrentUser } from './users';

// Cache keys
const CACHE_KEYS = {
  PRODUCTS: 'products',
  PRODUCT: 'product',
  USER: 'user',
  WISHLIST: 'wishlist',
  SEARCH: 'search',
} as const;

// Cache TTL in milliseconds
const CACHE_TTL = {
  PRODUCTS: 30 * 60 * 1000, // 30 minutes
  PRODUCT: 60 * 60 * 1000, // 1 hour
  USER: 2 * 60 * 60 * 1000, // 2 hours
  WISHLIST: 15 * 60 * 1000, // 15 minutes
  SEARCH: 10 * 60 * 1000, // 10 minutes
} as const;

/**
 * Cached API client for products
 */
export class CachedProductAPI {
  /**
   * Get products with caching
   */
  static async getProducts(options?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    sortBy?: string;
    sortDir?: 'asc' | 'desc';
    useCache?: boolean;
  }): Promise<{ products: Product[]; total: number; page: number; totalPages: number }> {
    const {
      page = 1,
      limit = 20,
      category,
      search,
      sortBy = 'createdAt',
      sortDir = 'desc',
      useCache = true
    } = options || {};

    const cacheKey = `products:${JSON.stringify({ page, limit, category, search, sortBy, sortDir })}`;

    // Try cache first
    if (useCache) {
      const cached = await browserStorage.get<{ products: Product[]; total: number; page: number; totalPages: number }>(
        cacheKey,
        'indexeddb'
      );
      if (cached) {
        return cached;
      }
    }

    // Fetch from API
    const result = await getProducts({ page, limit, category, search, sortBy, sortDir });

    // Cache the result
    if (useCache) {
      await browserStorage.set(cacheKey, result, 'indexeddb', ['products']);
    }

    return result;
  }

  /**
   * Get product by ID with caching
   */
  static async getProductById(id: string, useCache: boolean = true): Promise<Product> {
    const cacheKey = `product:${id}`;

    // Try cache first
    if (useCache) {
      const cached = await browserStorage.get<Product>(cacheKey, 'indexeddb');
      if (cached) {
        return cached;
      }
    }

    // Fetch from API
    const product = await getProductById(id);

    // Cache the result
    if (useCache) {
      await browserStorage.set(cacheKey, product, 'indexeddb', ['products']);
    }

    return product;
  }

  /**
   * Get product by slug with caching
   */
  static async getProductBySlug(slug: string, useCache: boolean = true): Promise<Product> {
    const cacheKey = `product:slug:${slug}`;

    // Try cache first
    if (useCache) {
      const cached = await browserStorage.get<Product>(cacheKey, 'indexeddb');
      if (cached) {
        return cached;
      }
    }

    // Fetch from API
    const product = await getProductBySlug(slug);

    // Cache the result
    if (useCache) {
      await browserStorage.set(cacheKey, product, 'indexeddb', ['products']);
    }

    return product;
  }

  /**
   * Invalidate product cache
   */
  static async invalidateProductCache(productId?: string): Promise<void> {
    if (productId) {
      // Invalidate specific product
      await browserStorage.delete(`product:${productId}`, 'indexeddb');
      await browserStorage.delete(`product:slug:${productId}`, 'indexeddb');
    }

    // Invalidate all product lists
    const keys = await this.getCacheKeys('products');
    for (const key of keys) {
      await browserStorage.delete(key, 'indexeddb');
    }
  }

  /**
   * Get cache keys for a tag
   */
  private static async getCacheKeys(tag: string): Promise<string[]> {
    // This is a simplified implementation
    // In a real app, you'd want to maintain an index of keys
    return [];
  }
}

/**
 * Cached API client for wishlist
 */
export class CachedWishlistAPI {
  /**
   * Get default wishlist with caching
   */
  static async getDefaultWishlist(userId: string, useCache: boolean = true): Promise<Wishlist> {
    const cacheKey = `wishlist:${userId}`;

    // Try cache first
    if (useCache) {
      const cached = await browserStorage.get<Wishlist>(cacheKey, 'indexeddb');
      if (cached) {
        return cached;
      }
    }

    // Fetch from API
    const wishlist = await getDefaultWishlist(userId);

    // Cache the result
    if (useCache) {
      await browserStorage.set(cacheKey, wishlist, 'indexeddb', ['wishlist']);
    }

    return wishlist;
  }

  /**
   * Add item to wishlist with optimistic updates
   */
  static async addToWishlist(
    userId: string, 
    productId: string, 
    options?: { 
      wishlistName?: string;
      useCache?: boolean;
    }
  ): Promise<Wishlist> {
    const { wishlistName, useCache = true } = options || {};
    const cacheKey = `wishlist:${userId}`;

    // Get current wishlist
    let wishlist = await this.getDefaultWishlist(userId, useCache);

    // Add item to wishlist
    const updatedWishlist = await addToDefaultWishlist(userId, productId);

    // Update cache
    if (useCache) {
      await browserStorage.set(cacheKey, updatedWishlist, 'indexeddb', ['wishlist']);
    }

    return updatedWishlist;
  }

  /**
   * Remove item from wishlist with optimistic updates
   */
  static async removeFromWishlist(
    userId: string, 
    productId: string, 
    wishlistId: string,
    useCache: boolean = true
  ): Promise<Wishlist> {
    const cacheKey = `wishlist:${userId}`;

    // Remove item from wishlist
    const updatedWishlist = await removeItemFromWishlist(wishlistId, productId);

    // Update cache
    if (useCache) {
      await browserStorage.set(cacheKey, updatedWishlist, 'indexeddb', ['wishlist']);
    }

    return updatedWishlist;
  }

  /**
   * Invalidate wishlist cache
   */
  static async invalidateWishlistCache(userId: string): Promise<void> {
    await browserStorage.delete(`wishlist:${userId}`, 'indexeddb');
  }
}

/**
 * Cached API client for user
 */
export class CachedUserAPI {
  /**
   * Get current user with caching
   */
  static async getCurrentUser(useCache: boolean = true): Promise<User | null> {
    const cacheKey = 'user:current';

    // Try cache first
    if (useCache) {
      const cached = await browserStorage.get<User>(cacheKey, 'localStorage');
      if (cached) {
        return cached;
      }
    }

    // Fetch from API
    const user = await getCurrentUser();

    // Cache the result
    if (useCache && user) {
      await browserStorage.set(cacheKey, user, 'localStorage', ['user']);
    }

    return user;
  }

  /**
   * Invalidate user cache
   */
  static async invalidateUserCache(): Promise<void> {
    await browserStorage.delete('user:current', 'localStorage');
  }
}

/**
 * Cached API client for search
 */
export class CachedSearchAPI {
  /**
   * Search products with caching
   */
  static async searchProducts(
    query: string, 
    options?: {
      page?: number;
      limit?: number;
      category?: string;
      sortBy?: string;
      sortDir?: 'asc' | 'desc';
      useCache?: boolean;
    }
  ): Promise<{ products: Product[]; total: number; page: number; totalPages: number }> {
    const {
      page = 1,
      limit = 20,
      category,
      sortBy = 'relevance',
      sortDir = 'desc',
      useCache = true
    } = options || {};

    const cacheKey = `search:${JSON.stringify({ query, page, limit, category, sortBy, sortDir })}`;

    // Try cache first
    if (useCache) {
      const cached = await browserStorage.get<{ products: Product[]; total: number; page: number; totalPages: number }>(
        cacheKey,
        'indexeddb'
      );
      if (cached) {
        return cached;
      }
    }

    // Fetch from API
    const result = await getProducts({ 
      page, 
      limit, 
      category, 
      search: query, 
      sortBy, 
      sortDir 
    });

    // Cache the result
    if (useCache) {
      await browserStorage.set(cacheKey, result, 'indexeddb', ['search']);
    }

    return result;
  }

  /**
   * Invalidate search cache
   */
  static async invalidateSearchCache(): Promise<void> {
    // Clear all search results
    const keys = await this.getSearchCacheKeys();
    for (const key of keys) {
      await browserStorage.delete(key, 'indexeddb');
    }
  }

  /**
   * Get search cache keys
   */
  private static async getSearchCacheKeys(): Promise<string[]> {
    // This is a simplified implementation
    return [];
  }
}

/**
 * Cache management utilities
 */
export class CacheManager {
  /**
   * Clear all caches
   */
  static async clearAllCaches(): Promise<void> {
    await Promise.all([
      browserStorage.clear('indexeddb'),
      browserStorage.clear('localStorage'),
      browserStorage.clear('sessionStorage'),
    ]);
  }

  /**
   * Clear cache by tag
   */
  static async clearCacheByTag(tag: string): Promise<void> {
    // This would need to be implemented with a proper key index
  }

  /**
   * Get cache statistics
   */
  static async getCacheStats(): Promise<Record<string, { used: number; available: number; percentage: number }>> {
    return await browserStorage.getStorageStats();
  }

  /**
   * Clean expired entries
   */
  static async cleanExpiredEntries(): Promise<number> {
    const results = await Promise.all([
      browserStorage.cleanExpired('indexeddb'),
      browserStorage.cleanExpired('localStorage'),
      browserStorage.cleanExpired('sessionStorage'),
    ]);
    return results.reduce((sum, count) => sum + count, 0);
  }
}

// Export the cached API clients
export const cachedProductAPI = CachedProductAPI;
export const cachedWishlistAPI = CachedWishlistAPI;
export const cachedUserAPI = CachedUserAPI;
export const cachedSearchAPI = CachedSearchAPI;
export const cacheManager = CacheManager;
