'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  getCart, 
  addToCart as addToCartAPI, 
  updateCartItem, 
  removeFromCart, 
  clearCart as clearCartAPI 
} from '@/lib/api/cart';
import type { Cart, CartItem } from '@/lib/api/cart';
import { useAuth } from '@/contexts/auth-context';

interface UseCartReturn {
  cart: Cart | null;
  isLoading: boolean;
  error: string | null;
  addToCart: (productId: string, quantity: number, variantId?: string) => Promise<void>;
  updateItem: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
  getItemQuantity: (productId: string, variantId?: string) => number;
  getTotalItems: () => number;
  getTotalAmount: () => number;
}

export const useCart = (): UseCartReturn => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  const refreshCart = useCallback(async () => {
    // Don't fetch if not authenticated or no user/token
    if (!isAuthenticated) {
      setCart(null);
      return;
    }

    // Extra check for token existence and validity before making API call
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      console.log('Cart: No token available, skipping cart fetch');
      setCart(null);
      return;
    }
    
    // Import tokenManager dynamically to avoid SSR issues
    const { tokenManager } = await import('@/lib/api-client');
    if (tokenManager.isTokenExpired(token)) {
      console.log('Cart: Token is expired, skipping cart fetch');
      setCart(null);
      setError('Your session has expired. Please log in again.');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const cartData = await getCart();
      setCart(cartData);
    } catch (err) {
      // Handle auth failures gracefully - don't clear auth but log the issue
      if (err instanceof Error && (err.message.includes('401') || err.message.includes('Unauthorized'))) {
        console.log('Cart fetch failed due to auth - backend rejected token but keeping user logged in');
        setCart(null); // Set null cart to avoid errors
        setError('Cart temporarily unavailable - please try refreshing');
      } else {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch cart';
        setError(errorMessage);
        console.error('Failed to fetch cart:', err);
      }
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const addToCart = useCallback(async (
    productId: string, 
    quantity: number, 
    variantId?: string
  ) => {
    if (!isAuthenticated) {
      throw new Error('Please log in to add items to cart');
    }

    try {
      setIsLoading(true);
      setError(null);
      const updatedCart = await addToCartAPI(productId, quantity, variantId);
      setCart(updatedCart);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add item to cart';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const updateItem = useCallback(async (itemId: string, quantity: number) => {
    if (!isAuthenticated) {
      throw new Error('Please log in to update cart items');
    }

    try {
      setIsLoading(true);
      setError(null);
      if (quantity <= 0) {
        await removeItem(itemId);
        return;
      }
      const updatedCart = await updateCartItem(itemId, quantity);
      setCart(updatedCart);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update cart item';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const removeItem = useCallback(async (itemId: string) => {
    if (!isAuthenticated) {
      throw new Error('Please log in to remove cart items');
    }

    try {
      setIsLoading(true);
      setError(null);
      const updatedCart = await removeFromCart(itemId);
      setCart(updatedCart);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to remove item from cart';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const clearCart = useCallback(async () => {
    if (!isAuthenticated) {
      throw new Error('Please log in to clear cart');
    }

    try {
      setIsLoading(true);
      setError(null);
      await clearCartAPI();
      setCart(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to clear cart';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const getItemQuantity = useCallback((productId: string, variantId?: string): number => {
    if (!cart) return 0;
    
    const item = cart.items.find(item => 
      item.productId === productId && 
      (variantId ? item.productVariantId === variantId : !item.productVariantId)
    );
    
    return item?.quantity || 0;
  }, [cart]);

  const getTotalItems = useCallback((): number => {
    return cart?.totalItems || 0;
  }, [cart]);

  const getTotalAmount = useCallback((): number => {
    return cart?.totalPrice || 0;
  }, [cart]);

  // Load cart on mount and when authentication changes
  useEffect(() => {
    if (isAuthenticated) {
      // Add a small delay to ensure auth tokens are properly set
      const timeoutId = setTimeout(() => {
        refreshCart();
      }, 200);
      return () => clearTimeout(timeoutId);
    } else {
      setCart(null);
    }
  }, [isAuthenticated, refreshCart]);

  return {
    cart,
    isLoading,
    error,
    addToCart,
    updateItem,
    removeItem,
    clearCart,
    refreshCart,
    getItemQuantity,
    getTotalItems,
    getTotalAmount,
  };
};
