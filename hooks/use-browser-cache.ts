/**
 * React hooks for efficient browser caching
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { browserStorage, StorageType } from '@/lib/storage/browser-storage';

// Cache configuration for different data types
const CACHE_CONFIGS = {
  products: { storage: 'indexeddb' as StorageType, ttl: 30 * 60 * 1000 }, // 30 minutes
  user: { storage: 'localStorage' as StorageType, ttl: 2 * 60 * 60 * 1000 }, // 2 hours
  wishlist: { storage: 'indexeddb' as StorageType, ttl: 15 * 60 * 1000 }, // 15 minutes
  cart: { storage: 'sessionStorage' as StorageType, ttl: 60 * 60 * 1000 }, // 1 hour
  search: { storage: 'indexeddb' as StorageType, ttl: 10 * 60 * 1000 }, // 10 minutes
  analytics: { storage: 'indexeddb' as StorageType, ttl: 5 * 60 * 1000 }, // 5 minutes
} as const;

type CacheKey = keyof typeof CACHE_CONFIGS;

/**
 * Hook for caching data with automatic expiration
 */
export function useBrowserCache<T>(
  key: string,
  dataType: CacheKey,
  fetcher: () => Promise<T>,
  options?: {
    enabled?: boolean;
    refetchOnMount?: boolean;
    refetchInterval?: number;
    onError?: (error: Error) => void;
  }
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastFetched, setLastFetched] = useState<number | null>(null);
  
  const config = CACHE_CONFIGS[dataType];
  const cacheKey = `${dataType}:${key}`;
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchData = useCallback(async (force = false) => {
    if (!options?.enabled && !force) return;

    setLoading(true);
    setError(null);

    try {
      // Try to get from cache first
      if (!force) {
        const cachedData = await browserStorage.get<T>(cacheKey, config.storage);
        if (cachedData) {
          setData(cachedData);
          setLastFetched(Date.now());
          setLoading(false);
          return;
        }
      }

      // Fetch from API
      const freshData = await fetcher();
      
      // Cache the data
      await browserStorage.set(cacheKey, freshData, config.storage, [dataType]);
      
      setData(freshData);
      setLastFetched(Date.now());
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      options?.onError?.(error);
    } finally {
      setLoading(false);
    }
  }, [cacheKey, config.storage, dataType, fetcher, options]);

  // Initial load
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Refetch interval
  useEffect(() => {
    if (options?.refetchInterval && options.refetchInterval > 0) {
      intervalRef.current = setInterval(() => {
        fetchData();
      }, options.refetchInterval);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [options?.refetchInterval, fetchData]);

  // Refetch on mount
  useEffect(() => {
    if (options?.refetchOnMount) {
      fetchData(true);
    }
  }, [options?.refetchOnMount, fetchData]);

  const invalidate = useCallback(async () => {
    await browserStorage.delete(cacheKey, config.storage);
    setData(null);
    setLastFetched(null);
  }, [cacheKey, config.storage]);

  const refetch = useCallback(() => {
    fetchData(true);
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    lastFetched,
    invalidate,
    refetch,
    isStale: lastFetched ? Date.now() - lastFetched > config.ttl : true,
  };
}

/**
 * Hook for caching lists with pagination
 */
export function useBrowserCacheList<T>(
  key: string,
  dataType: CacheKey,
  fetcher: (page: number, limit: number) => Promise<{ data: T[]; total: number; page: number }>,
  options?: {
    page?: number;
    limit?: number;
    enabled?: boolean;
  }
) {
  const [data, setData] = useState<T[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [pages, setPages] = useState<Set<number>>(new Set());
  
  const config = CACHE_CONFIGS[dataType];
  const page = options?.page || 1;
  const limit = options?.limit || 20;
  const cacheKey = `${dataType}:${key}:page:${page}:limit:${limit}`;

  const fetchPage = useCallback(async (pageNum: number, force = false) => {
    if (!options?.enabled && !force) return;

    const pageCacheKey = `${dataType}:${key}:page:${pageNum}:limit:${limit}`;
    
    setLoading(true);
    setError(null);

    try {
      // Try to get from cache first
      if (!force) {
        const cachedData = await browserStorage.get<{ data: T[]; total: number; page: number }>(
          pageCacheKey, 
          config.storage
        );
        if (cachedData) {
          setData(prev => {
            const newData = [...prev];
            newData.splice((pageNum - 1) * limit, limit, ...cachedData.data);
            return newData;
          });
          setTotal(cachedData.total);
          setPages(prev => new Set([...prev, pageNum]));
          setLoading(false);
          return;
        }
      }

      // Fetch from API
      const freshData = await fetcher(pageNum, limit);
      
      // Cache the data
      await browserStorage.set(pageCacheKey, freshData, config.storage, [dataType]);
      
      setData(prev => {
        const newData = [...prev];
        newData.splice((pageNum - 1) * limit, limit, ...freshData.data);
        return newData;
      });
      setTotal(freshData.total);
      setPages(prev => new Set([...prev, pageNum]));
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
    } finally {
      setLoading(false);
    }
  }, [dataType, key, limit, config.storage, fetcher, options]);

  // Load current page
  useEffect(() => {
    if (!pages.has(page)) {
      fetchPage(page);
    }
  }, [page, pages, fetchPage]);

  const invalidate = useCallback(async () => {
    // Clear all pages for this list
    const keys = Array.from(pages).map(pageNum => 
      `${dataType}:${key}:page:${pageNum}:limit:${limit}`
    );
    
    for (const key of keys) {
      await browserStorage.delete(key, config.storage);
    }
    
    setData([]);
    setTotal(0);
    setPages(new Set());
  }, [dataType, key, limit, pages, config.storage]);

  const refetch = useCallback(() => {
    fetchPage(page, true);
  }, [fetchPage, page]);

  return {
    data,
    total,
    loading,
    error,
    pages: Array.from(pages),
    invalidate,
    refetch,
    hasPage: (pageNum: number) => pages.has(pageNum),
  };
}

/**
 * Hook for optimistic updates with rollback
 */
export function useOptimisticCache<T>(
  key: string,
  dataType: CacheKey,
  fetcher: () => Promise<T>,
  updater: (data: T) => Promise<T>,
  options?: {
    enabled?: boolean;
  }
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [optimisticData, setOptimisticData] = useState<T | null>(null);
  const [isOptimistic, setIsOptimistic] = useState(false);
  
  const config = CACHE_CONFIGS[dataType];
  const cacheKey = `${dataType}:${key}`;

  const fetchData = useCallback(async () => {
    if (!options?.enabled) return;

    setLoading(true);
    setError(null);

    try {
      // Try to get from cache first
      const cachedData = await browserStorage.get<T>(cacheKey, config.storage);
      if (cachedData) {
        setData(cachedData);
        setLoading(false);
        return;
      }

      // Fetch from API
      const freshData = await fetcher();
      
      // Cache the data
      await browserStorage.set(cacheKey, freshData, config.storage, [dataType]);
      
      setData(freshData);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
    } finally {
      setLoading(false);
    }
  }, [cacheKey, config.storage, dataType, fetcher, options]);

  const updateOptimistically = useCallback(async (updateFn: (data: T) => T) => {
    if (!data) return;

    // Set optimistic data
    const optimistic = updateFn(data);
    setOptimisticData(optimistic);
    setIsOptimistic(true);

    try {
      // Perform actual update
      const updatedData = await updater(optimistic);
      
      // Cache the updated data
      await browserStorage.set(cacheKey, updatedData, config.storage, [dataType]);
      
      setData(updatedData);
      setOptimisticData(null);
      setIsOptimistic(false);
    } catch (err) {
      // Rollback on error
      setOptimisticData(null);
      setIsOptimistic(false);
      const error = err instanceof Error ? err : new Error('Update failed');
      setError(error);
    }
  }, [data, updater, cacheKey, config.storage]);

  // Initial load
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const invalidate = useCallback(async () => {
    await browserStorage.delete(cacheKey, config.storage);
    setData(null);
    setOptimisticData(null);
    setIsOptimistic(false);
  }, [cacheKey, config.storage]);

  return {
    data: isOptimistic ? optimisticData : data,
    loading,
    error,
    isOptimistic,
    updateOptimistically,
    invalidate,
    refetch: fetchData,
  };
}

/**
 * Hook for cache statistics and management
 */
export function useCacheStats() {
  const [stats, setStats] = useState<Record<StorageType, { used: number; available: number; percentage: number }> | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const storageStats = await browserStorage.getStorageStats();
      setStats(storageStats);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }, []);

  const cleanExpired = useCallback(async (storageType?: StorageType) => {
    if (storageType) {
      return await browserStorage.cleanExpired(storageType);
    } else {
      const results = await Promise.all([
        browserStorage.cleanExpired('indexeddb'),
        browserStorage.cleanExpired('localStorage'),
        browserStorage.cleanExpired('sessionStorage'),
      ]);
      return results.reduce((sum, count) => sum + count, 0);
    }
  }, []);

  const clearAll = useCallback(async (storageType?: StorageType) => {
    if (storageType) {
      await browserStorage.clear(storageType);
    } else {
      await Promise.all([
        browserStorage.clear('indexeddb'),
        browserStorage.clear('localStorage'),
        browserStorage.clear('sessionStorage'),
      ]);
    }
    await fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    fetchStats,
    cleanExpired,
    clearAll,
  };
}
