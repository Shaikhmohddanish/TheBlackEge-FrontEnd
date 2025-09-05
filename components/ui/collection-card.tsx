'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Icons } from '@/components/ui/icons';
import { CollectionFavoriteButton } from '@/components/favorites/collection-favorite-button';
import { cn } from '@/lib/utils';
import { formatPrice } from '@/lib/currency-utils';

interface Collection {
  id: string | number;
  name: string;
  description: string;
  category?: string;
  imageUrl?: string;
  hero?: string;
  image?: string;
  totalProducts?: number;
  productCount?: number;
  favoriteCount?: number;
  isFavorited?: boolean;
  startingPrice?: number;
  priceRange?: {
    min: number;
    max: number;
  };
  isNew?: boolean;
  isFeatured?: boolean;
}

interface CollectionCardProps {
  collection: Collection;
  onFavorite?: (collection: Collection) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showFavorite?: boolean;
  linkType?: 'slug' | 'id'; // For routing
}

export function CollectionCard({
  collection,
  onFavorite,
  className,
  size = 'md',
  showFavorite = true,
  linkType = 'id'
}: CollectionCardProps) {
  // Get the primary image
  const imageUrl = collection.imageUrl || collection.hero || collection.image || '/placeholder.jpg';
  
  // Generate slug from name for slug-based routing
  const slug = collection.name.toLowerCase().replace(/\s+/g, '-');
  const href = linkType === 'slug' ? `/collections/${slug}` : `/collections/${collection.id}`;
  
  // Calculate product count
  const productCount = collection.totalProducts || collection.productCount || 0;
  
  // Format starting price
  const formatStartingPrice = () => {
    if (collection.startingPrice) {
      return `From ${formatPrice(collection.startingPrice)}`;
    }
    if (collection.priceRange) {
      return `${formatPrice(collection.priceRange.min)} - ${formatPrice(collection.priceRange.max)}`;
    }
    return null;
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onFavorite?.(collection);
  };

  const cardSizes = {
    sm: {
      title: 'text-lg',
      description: 'text-sm',
      padding: 'p-3',
      aspectRatio: 'aspect-[4/3]'
    },
    md: {
      title: 'text-xl',
      description: 'text-sm',
      padding: 'p-4',
      aspectRatio: 'aspect-[4/3]'
    },
    lg: {
      title: 'text-2xl',
      description: 'text-base',
      padding: 'p-6',
      aspectRatio: 'aspect-[3/2]'
    }
  };

  const sizeConfig = cardSizes[size];

  return (
    <Card 
      className={cn(
        "group overflow-hidden border-border bg-card hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-primary/10",
        className
      )}
    >
      <CardContent className="p-0">
        {/* Image Section */}
        <div className={cn("relative overflow-hidden", sizeConfig.aspectRatio)}>
          <Link href={href}>
            <Image
              src={imageUrl}
              alt={collection.name}
              fill
              className="object-cover transition-all duration-700 group-hover:scale-110"
            />
          </Link>
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1">
            {collection.isNew && (
              <Badge className="bg-blue-500/90 text-white font-semibold text-xs">
                NEW
              </Badge>
            )}
            {collection.isFeatured && (
              <Badge className="bg-purple-500/90 text-white font-semibold text-xs">
                FEATURED
              </Badge>
            )}
            {collection.category && (
              <Badge className="bg-black/60 text-white text-xs">
                {collection.category}
              </Badge>
            )}
          </div>

          {/* Favorite Button */}
          {showFavorite && (
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
              {collection.id && typeof collection.id === 'number' ? (
                <CollectionFavoriteButton
                  collectionId={collection.id}
                  initialFavorited={collection.isFavorited}
                  initialCount={collection.favoriteCount}
                  size="sm"
                  showText={false}
                  showCount={false}
                  className="bg-black/60 hover:bg-black/80 text-white border-0 shadow-lg backdrop-blur-sm"
                />
              ) : (
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 bg-black/60 hover:bg-black/80 text-white border-0 shadow-lg backdrop-blur-sm transition-all duration-200"
                  onClick={handleFavorite}
                >
                  <Icons.heart 
                    className={cn(
                      "h-4 w-4 transition-all duration-200",
                      collection.isFavorited ? "fill-current text-red-400" : "text-white hover:text-red-400"
                    )} 
                  />
                </Button>
              )}
            </div>
          )}

          {/* Collection Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <div className="transform transition-all duration-300 group-hover:translate-y-0 translate-y-2">
              <h3 className={cn("font-bold mb-2 line-clamp-2", sizeConfig.title)}>
                {collection.name}
              </h3>
              
              <p className={cn(
                "text-white/90 mb-3 line-clamp-2 opacity-0 group-hover:opacity-100 transition-all duration-300",
                sizeConfig.description
              )}>
                {collection.description}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm">
                  {productCount > 0 && (
                    <span className="text-white/80">
                      {productCount} {productCount === 1 ? 'item' : 'items'}
                    </span>
                  )}
                  
                  {formatStartingPrice() && (
                    <>
                      {productCount > 0 && <span className="text-white/60">•</span>}
                      <span className="text-white/90 font-medium">
                        {formatStartingPrice()}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* View Collection Button */}
          <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
            <Button
              size="sm"
              className="bg-white text-black hover:bg-white/90 font-semibold transition-all duration-200"
              asChild
            >
              <Link href={href}>
                <Icons.chevronRight className="mr-1 h-4 w-4" />
                View Collection
              </Link>
            </Button>
          </div>
        </div>

        {/* Info Section (for larger cards) */}
        {size === 'lg' && (
          <div className={sizeConfig.padding}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <Link href={href} className="block group-hover:text-primary transition-colors">
                  <h4 className="font-semibold text-lg mb-1">{collection.name}</h4>
                  <p className="text-muted-foreground text-sm line-clamp-2 mb-2">
                    {collection.description}
                  </p>
                </Link>
                
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  {productCount > 0 && (
                    <span>{productCount} {productCount === 1 ? 'item' : 'items'}</span>
                  )}
                  
                  {formatStartingPrice() && (
                    <>
                      {productCount > 0 && <span>•</span>}
                      <span className="font-medium text-foreground">
                        {formatStartingPrice()}
                      </span>
                    </>
                  )}
                </div>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                className="ml-4"
                asChild
              >
                <Link href={href}>
                  View Collection
                  <Icons.chevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
