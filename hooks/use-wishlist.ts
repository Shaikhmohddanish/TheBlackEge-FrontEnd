'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  getWishlist, 
  addToWishlist as addToWishlistAPI, 
  removeFromWishlist, 
  isProductInWishlist,
  clearWishlist as clearWishlistAPI 
} from '@/lib/api/wishlist';
import type { Wishlist, WishlistItem } from '@/lib/api/wishlist';
import { useAuth } from '@/contexts/auth-context';

interface UseWishlistReturn {
  wishlist: Wishlist | null;
  isLoading: boolean;
  error: string | null;
  addToWishlist: (productId: string) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  clearWishlist: () => Promise<void>;
  refreshWishlist: () => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  checkIsInWishlist: (productId: string) => Promise<boolean>;
  getTotalItems: () => number;
}

export const useWishlist = (): UseWishlistReturn => {
  const [wishlist, setWishlist] = useState<Wishlist | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  const refreshWishlist = useCallback(async () => {
    if (!isAuthenticated) {
      setWishlist(null);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const wishlistData = await getWishlist();
      setWishlist(wishlistData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch wishlist';
      setError(errorMessage);
      console.error('Failed to fetch wishlist:', err);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const addToWishlist = useCallback(async (productId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const updatedWishlist = await addToWishlistAPI(productId);
      setWishlist(updatedWishlist);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add item to wishlist';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const removeFromWishlistHandler = useCallback(async (productId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const updatedWishlist = await removeFromWishlist(productId);
      setWishlist(updatedWishlist);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to remove item from wishlist';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearWishlist = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      await clearWishlistAPI();
      setWishlist(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to clear wishlist';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const isInWishlist = useCallback((productId: string): boolean => {
    if (!wishlist) return false;
    return wishlist.items.some(item => item.productId === productId);
  }, [wishlist]);

  const checkIsInWishlist = useCallback(async (productId: string): Promise<boolean> => {
    try {
      return await isProductInWishlist(productId);
    } catch (err) {
      console.error('Failed to check if product is in wishlist:', err);
      return false;
    }
  }, []);

  const getTotalItems = useCallback((): number => {
    return wishlist?.totalItems || 0;
  }, [wishlist]);

  // Load wishlist on mount and when authentication changes
  useEffect(() => {
    if (isAuthenticated) {
      refreshWishlist();
    } else {
      setWishlist(null);
    }
  }, [isAuthenticated, refreshWishlist]);

  return {
    wishlist,
    isLoading,
    error,
    addToWishlist,
    removeFromWishlist: removeFromWishlistHandler,
    clearWishlist,
    refreshWishlist,
    isInWishlist,
    checkIsInWishlist,
    getTotalItems,
  };
};
