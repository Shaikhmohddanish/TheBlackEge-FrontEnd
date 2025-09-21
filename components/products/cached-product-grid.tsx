'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Product } from '@/lib/api/products';
import { ProductCard } from '@/components/ui/product-card';
import { ProductGridShimmer, Shimmer } from '@/components/ui/shimmer';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RefreshCw, AlertCircle, Database, HardDrive } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useBrowserCache } from '@/hooks/use-browser-cache';
import { cachedProductAPI } from '@/lib/api/cached-api-client';

interface CachedProductGridProps {
  initialProducts?: Product[];
  searchParams?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    sortBy?: string;
    sortDir?: 'asc' | 'desc';
  };
  className?: string;
  showLoadMoreButton?: boolean;
  autoLoadMore?: boolean;
  onProductsChange?: (products: Product[]) => void;
}

export function CachedProductGrid({
  initialProducts = [],
  searchParams = {},
  className,
  showLoadMoreButton = true,
  autoLoadMore = true,
  onProductsChange
}: CachedProductGridProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cacheStatus, setCacheStatus] = useState<'cache' | 'network' | 'loading'>('loading');

  const {
    data: cachedData,
    loading: cacheLoading,
    error: cacheError,
    invalidate: invalidateCache,
    refetch: refetchCache
  } = useBrowserCache(
    `products:${JSON.stringify(searchParams)}`,
    'products',
    () => cachedProductAPI.getProducts({
      ...searchParams,
      page,
      limit: searchParams.limit || 20,
      useCache: true
    }),
    {
      enabled: true,
      refetchOnMount: false
    }
  );

  // Load more products
  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    setError(null);

    try {
      const nextPage = page + 1;
      const result = await cachedProductAPI.getProducts({
        ...searchParams,
        page: nextPage,
        limit: searchParams.limit || 20,
        useCache: true
      });

      if (result.products.length === 0) {
        setHasMore(false);
      } else {
        setProducts(prev => [...prev, ...result.products]);
        setPage(nextPage);
        setCacheStatus('cache');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products');
      setCacheStatus('network');
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore, searchParams]);

  // Refresh all products
  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    setPage(1);
    setHasMore(true);

    try {
      // Invalidate cache and fetch fresh data
      await invalidateCache();
      const result = await cachedProductAPI.getProducts({
        ...searchParams,
        page: 1,
        limit: searchParams.limit || 20,
        useCache: false
      });

      setProducts(result.products);
      setHasMore(result.page < result.totalPages);
      setCacheStatus('network');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh products');
    } finally {
      setLoading(false);
    }
  }, [searchParams, invalidateCache]);

  // Load initial data
  useEffect(() => {
    if (cachedData) {
      setProducts(cachedData.products);
      setHasMore(cachedData.page < cachedData.totalPages);
      setCacheStatus('cache');
    }
  }, [cachedData]);

  // Handle cache errors
  useEffect(() => {
    if (cacheError) {
      setError(cacheError.message);
      setCacheStatus('network');
    }
  }, [cacheError]);

  // Notify parent of products change
  useEffect(() => {
    onProductsChange?.(products);
  }, [products, onProductsChange]);

  // Auto load more when scrolling
  useEffect(() => {
    if (!autoLoadMore || !hasMore || loading) return;

    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop >= 
          document.documentElement.offsetHeight - 1000) {
        loadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [autoLoadMore, hasMore, loading, loadMore]);

  if (cacheLoading && products.length === 0) {
    return (
      <div className={cn('space-y-4', className)}>
        <ProductGridShimmer />
      </div>
    );
  }

  if (error && products.length === 0) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {error}
          <Button
            onClick={refresh}
            variant="outline"
            size="sm"
            className="ml-2"
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Cache Status Indicator */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          {cacheStatus === 'cache' && (
            <>
              <Database className="h-4 w-4 text-green-600" />
              <span>Loaded from cache</span>
            </>
          )}
          {cacheStatus === 'network' && (
            <>
              <HardDrive className="h-4 w-4 text-blue-600" />
              <span>Loaded from network</span>
            </>
          )}
          {cacheStatus === 'loading' && (
            <>
              <RefreshCw className="h-4 w-4 animate-spin text-gray-600" />
              <span>Loading...</span>
            </>
          )}
        </div>
        
        <Button
          onClick={refresh}
          variant="outline"
          size="sm"
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Shimmer className="h-48 w-full rounded-lg" />
              <Shimmer className="h-4 w-3/4" />
              <Shimmer className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      )}

      {/* Load More Button */}
      {showLoadMoreButton && hasMore && !loading && (
        <div className="flex justify-center">
          <Button
            onClick={loadMore}
            variant="outline"
            size="lg"
            className="w-full max-w-md"
          >
            Load More Products
          </Button>
        </div>
      )}

      {/* No More Products */}
      {!hasMore && products.length > 0 && (
        <div className="text-center text-gray-500 py-8">
          No more products to load
        </div>
      )}

      {/* Error State */}
      {error && products.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error}
            <Button
              onClick={loadMore}
              variant="outline"
              size="sm"
              className="ml-2"
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
