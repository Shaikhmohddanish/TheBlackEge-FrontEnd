'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  getUserWishlists,
  getDefaultWishlist,
  addToDefaultWishlist as addToWishlistAPI, 
  removeItemFromWishlist, 
  isProductInWishlist,
  deleteWishlist as clearWishlistAPI 
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
  const { isAuthenticated, user } = useAuth();

  const refreshWishlist = useCallback(async () => {
    // Don't fetch if not authenticated or no user
    if (!isAuthenticated || !user) {
      setWishlist(null);
      return;
    }

    // Extra check for token existence and validity before making API call
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      setWishlist(null);
      return;
    }
    
    // Import tokenManager dynamically to avoid SSR issues
    const { tokenManager } = await import('@/lib/api-client');
    if (tokenManager.isTokenExpired(token)) {
      setWishlist(null);
      setError('Your session has expired. Please log in again.');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const wishlistData = await getDefaultWishlist(user.id);
      setWishlist(wishlistData);
    } catch (err) {
      
      // Handle different types of errors
      if (err instanceof Error) {
        if (err.message.includes('401') || err.message.includes('Unauthorized') || err.message.includes('Authentication')) {
          setWishlist(null);
          setError('Authentication required. Please log in again.');
        } else if (err.message.includes('Network error') || err.message.includes('fetch')) {
          setWishlist(null);
          setError('Unable to connect to server. Please check your internet connection and try again.');
        } else {
          setWishlist(null);
          setError(`Failed to load wishlist: ${err.message}`);
        }
      } else {
        setWishlist(null);
        setError('An unexpected error occurred while loading your wishlist.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user]);

  const addToWishlist = useCallback(async (productId: string) => {
    if (!isAuthenticated || !user) {
      throw new Error('Please log in to add items to wishlist');
    }
    
    try {
      setIsLoading(true);
      setError(null);
      const updatedWishlist = await addToWishlistAPI(user.id, productId);
      setWishlist(updatedWishlist);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add item to wishlist';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user]);

  const removeFromWishlistHandler = useCallback(async (productId: string) => {
    if (!isAuthenticated || !wishlist?.id) {
      throw new Error('Please log in to remove items from wishlist');
    }

    try {
      setIsLoading(true);
      setError(null);
      const updatedWishlist = await removeItemFromWishlist(wishlist.id, productId);
      setWishlist(updatedWishlist);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to remove item from wishlist';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, wishlist?.id]);

  const clearWishlist = useCallback(async () => {
    if (!isAuthenticated || !wishlist?.id) {
      throw new Error('Please log in to clear wishlist');
    }

    try {
      setIsLoading(true);
      setError(null);
      await clearWishlistAPI(wishlist.id);
      setWishlist(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to clear wishlist';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, wishlist?.id]);

  const isInWishlist = useCallback((productId: string): boolean => {
    if (!wishlist) return false;
    return wishlist.items.some(item => item.productId === productId);
  }, [wishlist]);

  const checkIsInWishlist = useCallback(async (productId: string): Promise<boolean> => {
    try {
      if (!user) return false;
      return await isProductInWishlist(user.id, productId);
    } catch (err) {
      return false;
    }
  }, [user]);

  const getTotalItems = useCallback((): number => {
    return wishlist?.itemCount || 0;
  }, [wishlist]);

  // Load wishlist on mount and when authentication changes
  useEffect(() => {
    if (isAuthenticated) {
      // Add a small delay to ensure auth tokens are properly set
      const timeoutId = setTimeout(() => {
        refreshWishlist();
      }, 200);
      return () => clearTimeout(timeoutId);
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
