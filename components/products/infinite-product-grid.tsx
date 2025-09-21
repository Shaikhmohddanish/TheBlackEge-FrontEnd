'use client';

import React, { useRef, useEffect } from 'react';
import { Product } from '@/lib/api/products';
import { ProductCard } from '@/components/ui/product-card';
import { ProductGridShimmer, Shimmer } from '@/components/ui/shimmer';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RefreshCw, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InfiniteProductGridProps {
  products: Product[];
  loading: boolean;
  hasMore: boolean;
  error: string | null;
  onLoadMore: () => void;
  onRefresh: () => void;
  className?: string;
  showLoadMoreButton?: boolean;
  gridCols?: '1' | '2' | '3' | '4' | '5' | '6';
}

export const InfiniteProductGrid: React.FC<InfiniteProductGridProps> = ({
  products,
  loading,
  hasMore,
  error,
  onLoadMore,
  onRefresh,
  className,
  showLoadMoreButton = true,
  gridCols = '4',
}) => {
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Auto-load more when scrolling near bottom
  useEffect(() => {
    if (!showLoadMoreButton && loadMoreRef.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          const target = entries[0];
          if (target.isIntersecting && hasMore && !loading) {
            onLoadMore();
          }
        },
        {
          rootMargin: '100px',
          threshold: 0.1,
        }
      );

      observer.observe(loadMoreRef.current);

      return () => observer.disconnect();
    }
  }, [hasMore, loading, onLoadMore, showLoadMoreButton]);

  const gridColsClass = {
    '1': 'grid-cols-1',
    '2': 'grid-cols-1 sm:grid-cols-2',
    '3': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    '4': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    '5': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
    '6': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6',
  };

  if (error) {
    return (
      <div className={cn('space-y-4', className)}>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error}
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              className="ml-2"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Products Grid */}
      <div className={cn('grid gap-6', gridColsClass[gridCols])}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
        
        {/* Loading shimmer */}
        {loading && (
          <>
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={`shimmer-${index}`} className="group relative bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <Shimmer className="aspect-square w-full" />
                <div className="p-4 space-y-3">
                  <Shimmer className="h-4 w-3/4 rounded" />
                  <Shimmer className="h-5 w-1/2 rounded" />
                  <div className="flex items-center space-x-1">
                    <Shimmer className="h-4 w-16 rounded" />
                  </div>
                  <Shimmer className="h-9 w-full rounded-md" />
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Load More Button or Auto-load Trigger */}
      {hasMore && (
        <div ref={loadMoreRef} className="flex justify-center py-8">
          {showLoadMoreButton ? (
            <Button
              onClick={onLoadMore}
              disabled={loading}
              variant="outline"
              size="lg"
              className="min-w-[200px]"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Loading...
                </>
              ) : (
                'Load More Products'
              )}
            </Button>
          ) : (
            <div className="flex items-center justify-center space-x-2 text-gray-500">
              {loading && (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Loading more products...</span>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* No more products message */}
      {!hasMore && products.length > 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>You've reached the end of the product list</p>
          <Button
            variant="ghost"
            onClick={onRefresh}
            className="mt-2"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      )}

      {/* Empty state */}
      {!loading && products.length === 0 && !error && (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-white mb-2">No products found</h3>
          <p className="text-gray-500 mb-4">Try adjusting your search or filter criteria</p>
          <Button onClick={onRefresh} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      )}
    </div>
  );
};

// Loading skeleton for initial load
export const ProductGridSkeleton: React.FC<{ count?: number; gridCols?: '1' | '2' | '3' | '4' | '5' | '6' }> = ({ 
  count = 8, 
  gridCols = '4' 
}) => {
  const gridColsClass = {
    '1': 'grid-cols-1',
    '2': 'grid-cols-1 sm:grid-cols-2',
    '3': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    '4': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    '5': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
    '6': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6',
  };

  return (
    <div className={cn('grid gap-6', gridColsClass[gridCols])}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="group relative bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <Shimmer className="aspect-square w-full" />
          <div className="p-4 space-y-3">
            <Shimmer className="h-4 w-3/4 rounded" />
            <Shimmer className="h-5 w-1/2 rounded" />
            <div className="flex items-center space-x-1">
              <Shimmer className="h-4 w-16 rounded" />
            </div>
            <Shimmer className="h-9 w-full rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
};
