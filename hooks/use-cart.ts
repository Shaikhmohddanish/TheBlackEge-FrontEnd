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
    if (!isAuthenticated) {
      setCart(null);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const cartData = await getCart();
      setCart(cartData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch cart';
      setError(errorMessage);
      console.error('Failed to fetch cart:', err);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const addToCart = useCallback(async (
    productId: string, 
    quantity: number, 
    variantId?: string
  ) => {
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
  }, []);

  const updateItem = useCallback(async (itemId: string, quantity: number) => {
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
  }, []);

  const removeItem = useCallback(async (itemId: string) => {
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
  }, []);

  const clearCart = useCallback(async () => {
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
  }, []);

  const getItemQuantity = useCallback((productId: string, variantId?: string): number => {
    if (!cart) return 0;
    
    const item = cart.items.find(item => 
      item.productId === productId && 
      (variantId ? item.variantId === variantId : !item.variantId)
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
      refreshCart();
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
