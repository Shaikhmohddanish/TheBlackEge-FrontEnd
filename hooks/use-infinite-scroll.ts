import { useState, useEffect, useCallback, useRef } from 'react';

interface UseInfiniteScrollOptions {
  threshold?: number; // Distance from bottom to trigger load more (in pixels)
  rootMargin?: string; // Root margin for intersection observer
  enabled?: boolean; // Whether infinite scroll is enabled
}

interface UseInfiniteScrollReturn<T> {
  data: T[];
  loading: boolean;
  hasMore: boolean;
  error: string | null;
  loadMore: () => void;
  refresh: () => void;
  setData: (data: T[]) => void;
  setLoading: (loading: boolean) => void;
  setHasMore: (hasMore: boolean) => void;
  setError: (error: string | null) => void;
}

export function useInfiniteScroll<T>(
  fetchFunction: (page: number, size: number) => Promise<{
    content: T[];
    totalPages: number;
    totalElements: number;
    number: number;
    size: number;
  }>,
  options: UseInfiniteScrollOptions = {}
): UseInfiniteScrollReturn<T> {
  const {
    threshold = 100,
    rootMargin = '0px',
    enabled = true,
  } = options;

  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    setError(null);

    try {
      const result = await fetchFunction(currentPage, 12); // Default page size of 12
      
      if (isInitialLoad) {
        setData(result.content);
        setIsInitialLoad(false);
      } else {
        setData(prev => [...prev, ...result.content]);
      }

      setCurrentPage(prev => prev + 1);
      setHasMore(result.number < result.totalPages - 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [currentPage, loading, hasMore, fetchFunction, isInitialLoad]);

  const refresh = useCallback(() => {
    setData([]);
    setCurrentPage(0);
    setHasMore(true);
    setError(null);
    setIsInitialLoad(true);
    setLoading(false);
  }, []);

  // Set up intersection observer
  useEffect(() => {
    if (!enabled || !loadMoreRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasMore && !loading) {
          loadMore();
        }
      },
      {
        rootMargin,
        threshold: 0.1,
      }
    );

    observerRef.current.observe(loadMoreRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [enabled, hasMore, loading, loadMore, rootMargin]);

  // Load initial data
  useEffect(() => {
    if (isInitialLoad && enabled) {
      loadMore();
    }
  }, [isInitialLoad, enabled, loadMore]);

  return {
    data,
    loading,
    hasMore,
    error,
    loadMore,
    refresh,
    setData,
    setLoading,
    setHasMore,
    setError,
  };
}

// Hook for manual pagination (with load more button)
export function usePagination<T>(
  fetchFunction: (page: number, size: number) => Promise<{
    content: T[];
    totalPages: number;
    totalElements: number;
    number: number;
    size: number;
  }>,
  initialPageSize: number = 12
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const loadPage = useCallback(async (page: number, append: boolean = false) => {
    setLoading(true);
    setError(null);

    try {
      const result = await fetchFunction(page, initialPageSize);
      
      if (append) {
        setData(prev => [...prev, ...result.content]);
      } else {
        setData(result.content);
      }

      setCurrentPage(page);
      setTotalPages(result.totalPages);
      setTotalElements(result.totalElements);
      setHasMore(page < result.totalPages - 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [fetchFunction, initialPageSize]);

  const loadMore = useCallback(() => {
    if (hasMore && !loading) {
      loadPage(currentPage + 1, true);
    }
  }, [hasMore, loading, currentPage, loadPage]);

  const refresh = useCallback(() => {
    setData([]);
    setCurrentPage(0);
    setHasMore(true);
    setError(null);
    loadPage(0, false);
  }, [loadPage]);

  // Load initial data
  useEffect(() => {
    loadPage(0, false);
  }, [loadPage]);

  return {
    data,
    loading,
    hasMore,
    error,
    currentPage,
    totalPages,
    totalElements,
    loadMore,
    refresh,
    loadPage,
  };
}
