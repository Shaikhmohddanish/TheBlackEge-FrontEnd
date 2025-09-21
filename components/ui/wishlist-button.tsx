'use client';

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { addToDefaultWishlist, removeItemFromWishlist, isProductInWishlist, getDefaultWishlist } from '@/lib/api/wishlist';
import { toast } from 'sonner';

interface WishlistButtonProps {
  productId: string;
  userId: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';
  showText?: boolean;
}

export function WishlistButton({ 
  productId, 
  userId, 
  className = '',
  size = 'md',
  variant = 'outline',
  showText = false
}: WishlistButtonProps) {
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    checkWishlistStatus();
  }, [productId, userId]);

  const checkWishlistStatus = async () => {
    try {
      setChecking(true);
      const inWishlist = await isProductInWishlist(userId, productId);
      setIsInWishlist(inWishlist);
    } catch (error) {
      console.error('Failed to check wishlist status:', error);
    } finally {
      setChecking(false);
    }
  };

  const handleToggleWishlist = async () => {
    if (loading) return;
    
    try {
      setLoading(true);
      
      if (isInWishlist) {
        // Remove from wishlist
        const defaultWishlist = await getDefaultWishlist(userId);
        await removeItemFromWishlist(defaultWishlist.id, productId);
        setIsInWishlist(false);
        toast.success('Removed from wishlist');
      } else {
        // Add to wishlist
        await addToDefaultWishlist(userId, productId);
        setIsInWishlist(true);
        toast.success('Added to wishlist');
      }
    } catch (error) {
      console.error('Failed to toggle wishlist:', error);
      toast.error('Failed to update wishlist');
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <Button
        variant={variant}
        size={size}
        disabled
        className={className}
      >
        <Heart className="h-4 w-4" />
        {showText && <span className="ml-2">Loading...</span>}
      </Button>
    );
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleToggleWishlist}
      disabled={loading}
      className={`${className} ${isInWishlist ? 'text-red-500 hover:text-red-600' : ''}`}
    >
      <Heart 
        className={`h-4 w-4 ${isInWishlist ? 'fill-current' : ''}`} 
      />
      {showText && (
        <span className="ml-2">
          {isInWishlist ? 'In Wishlist' : 'Add to Wishlist'}
        </span>
      )}
    </Button>
  );
}

// Quick add to wishlist button (smaller, for product cards)
export function QuickWishlistButton({ 
  productId, 
  userId, 
  className = ''
}: Omit<WishlistButtonProps, 'size' | 'variant' | 'showText'>) {
  return (
    <WishlistButton
      productId={productId}
      userId={userId}
      className={`h-8 w-8 p-0 ${className}`}
      size="sm"
      variant="ghost"
    />
  );
}

// Full wishlist button with text (for product pages)
export function FullWishlistButton({ 
  productId, 
  userId, 
  className = ''
}: Omit<WishlistButtonProps, 'size' | 'variant' | 'showText'>) {
  return (
    <WishlistButton
      productId={productId}
      userId={userId}
      className={className}
      size="lg"
      variant="outline"
      showText={true}
    />
  );
}
