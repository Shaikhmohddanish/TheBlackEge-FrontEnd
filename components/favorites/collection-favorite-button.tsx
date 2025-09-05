'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth-context';
import { 
  toggleCollectionFavorite, 
  checkCollectionFavorite,
  type FavoriteResponse 
} from '@/lib/api/favorites';
import { cn } from '@/lib/utils';

interface CollectionFavoriteButtonProps {
  collectionId: number;
  initialFavorited?: boolean;
  initialCount?: number;
  showCount?: boolean;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'ghost' | 'outline';
  className?: string;
}

export function CollectionFavoriteButton({
  collectionId,
  initialFavorited = false,
  initialCount = 0,
  showCount = true,
  showText = true,
  size = 'md',
  variant = 'outline',
  className
}: CollectionFavoriteButtonProps) {
  const [isFavorited, setIsFavorited] = useState(initialFavorited);
  const [favoriteCount, setFavoriteCount] = useState(initialCount);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Load initial favorite status for authenticated users
    if (isAuthenticated) {
      checkFavoriteStatus();
    }
  }, [collectionId, isAuthenticated]);

  const checkFavoriteStatus = async () => {
    try {
      const result = await checkCollectionFavorite(collectionId);
      setIsFavorited(result.isFavorited);
      setFavoriteCount(result.favoriteCount);
    } catch (error) {
      console.error('Failed to check collection favorite status:', error);
    }
  };

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast({
        title: 'Login Required',
        description: 'Please login to add collections to your favorites.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const result: FavoriteResponse = await toggleCollectionFavorite(collectionId);
      setIsFavorited(result.isFavorited || false);
      setFavoriteCount(result.favoriteCount);
      
      toast({
        title: result.isFavorited ? 'Collection Added to Favorites' : 'Collection Removed from Favorites',
        description: result.message,
      });
    } catch (error) {
      console.error('Failed to toggle collection favorite:', error);
      toast({
        title: 'Error',
        description: 'Failed to update collection favorites. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return showText ? 'h-8 px-3 text-xs' : 'h-8 w-8';
      case 'lg':
        return showText ? 'h-12 px-6 text-base' : 'h-12 w-12';
      default:
        return showText ? 'h-10 px-4 text-sm' : 'h-10 w-10';
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'sm':
        return 'h-3 w-3';
      case 'lg':
        return 'h-5 w-5';
      default:
        return 'h-4 w-4';
    }
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Button
        variant={isFavorited ? 'default' : variant}
        size={showText ? undefined : 'icon'}
        className={cn(
          getSizeClasses(),
          'transition-all duration-200',
          isFavorited && variant === 'outline' && 'border-primary bg-primary/10 text-primary hover:bg-primary/20'
        )}
        onClick={handleToggleFavorite}
        disabled={isLoading}
        title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
      >
        {isLoading ? (
          <Icons.spinner className={cn(getIconSize(), 'animate-spin', showText && 'mr-2')} />
        ) : (
          <Icons.heart 
            className={cn(
              getIconSize(),
              'transition-all duration-200',
              showText && 'mr-2',
              isFavorited ? 'fill-current' : ''
            )}
          />
        )}
        
        {showText && !isLoading && (
          <span>
            {isFavorited ? 'Favorited' : 'Add to Favorites'}
          </span>
        )}
      </Button>
      
      {showCount && favoriteCount > 0 && (
        <span className="text-sm text-muted-foreground">
          {favoriteCount} {favoriteCount === 1 ? 'person' : 'people'} favorited this collection
        </span>
      )}
    </div>
  );
}
