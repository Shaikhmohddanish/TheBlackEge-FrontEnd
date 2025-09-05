'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth-context';
import { 
  toggleProductFavorite, 
  checkProductFavorite, 
  getProductFavoriteCount,
  type FavoriteResponse 
} from '@/lib/api/favorites';
import { cn } from '@/lib/utils';

interface FavoriteButtonProps {
  productId: number;
  initialFavorited?: boolean;
  initialCount?: number;
  showCount?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'ghost' | 'outline';
  className?: string;
}

export function FavoriteButton({
  productId,
  initialFavorited = false,
  initialCount = 0,
  showCount = true,
  size = 'md',
  variant = 'ghost',
  className
}: FavoriteButtonProps) {
  const [isFavorited, setIsFavorited] = useState(initialFavorited);
  const [favoriteCount, setFavoriteCount] = useState(initialCount);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Load initial favorite status for authenticated users
    if (isAuthenticated) {
      checkFavoriteStatus();
    } else {
      // Load public favorite count
      loadFavoriteCount();
    }
  }, [productId, isAuthenticated]);

  const checkFavoriteStatus = async () => {
    try {
      const result = await checkProductFavorite(productId);
      setIsFavorited(result.isFavorited);
      setFavoriteCount(result.favoriteCount);
    } catch (error) {
      console.error('Failed to check favorite status:', error);
    }
  };

  const loadFavoriteCount = async () => {
    try {
      const result = await getProductFavoriteCount(productId);
      setFavoriteCount(result.favoriteCount);
    } catch (error) {
      console.error('Failed to load favorite count:', error);
    }
  };

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast({
        title: 'Login Required',
        description: 'Please login to add products to your favorites.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const result: FavoriteResponse = await toggleProductFavorite(productId);
      setIsFavorited(result.isFavorited || false);
      setFavoriteCount(result.favoriteCount);
      
      toast({
        title: result.isFavorited ? 'Added to Favorites' : 'Removed from Favorites',
        description: result.message,
      });
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      toast({
        title: 'Error',
        description: 'Failed to update favorites. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'h-8 w-8';
      case 'lg':
        return 'h-12 w-12';
      default:
        return 'h-10 w-10';
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'sm':
        return 'h-4 w-4';
      case 'lg':
        return 'h-6 w-6';
      default:
        return 'h-5 w-5';
    }
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Button
        variant={variant}
        size="icon"
        className={cn(
          getSizeClasses(),
          'transition-all duration-200 hover:scale-110',
          isFavorited && 'text-red-500 hover:text-red-600'
        )}
        onClick={handleToggleFavorite}
        disabled={isLoading}
        title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
      >
        {isLoading ? (
          <Icons.spinner className={cn(getIconSize(), 'animate-spin')} />
        ) : (
          <Icons.heart 
            className={cn(
              getIconSize(),
              'transition-all duration-200',
              isFavorited ? 'fill-current text-red-500' : 'text-muted-foreground hover:text-red-500'
            )}
          />
        )}
      </Button>
      
      {showCount && favoriteCount > 0 && (
        <span className="text-sm text-muted-foreground">
          {favoriteCount}
        </span>
      )}
    </div>
  );
}
