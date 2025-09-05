'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Icons } from '@/components/ui/icons';
import { QuickViewModal } from '@/components/ui/quick-view-modal';
import { cn } from '@/lib/utils';
import { formatPrice } from '@/lib/currency-utils';

interface ProductImage {
  url: string;
  alt?: string;
}

interface Product {
  id: string | number;
  name: string;
  description?: string;
  price: number;
  salePrice?: number;
  originalPrice?: number;
  category: string;
  inventory?: number;
  images?: ProductImage[] | string[]; // Support both formats
  image?: string; // Fallback single image
  sizes?: string[];
  colors?: string[];
  tags?: string[];
  isNew?: boolean;
  isSale?: boolean;
  inStock?: boolean;
  stockQuantity?: number;
}

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product, options?: { size?: string; color?: string; quantity?: number }) => void;
  onAddToWishlist?: (product: Product) => void;
  onBuyNow?: (product: Product, options?: { size?: string; color?: string; quantity?: number }) => void;
  isInWishlist?: (productId: string) => boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showQuickView?: boolean;
  showBuyNow?: boolean;
}

export function ProductCard({
  product,
  onAddToCart,
  onAddToWishlist,
  onBuyNow,
  isInWishlist,
  className,
  size = 'md',
  showQuickView = true,
  showBuyNow = true,
}: ProductCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Normalize images to consistent format
  const images = React.useMemo(() => {
    if (product.images && product.images.length > 0) {
      return product.images.map((img) => 
        typeof img === 'string' 
          ? { url: img, alt: product.name }
          : img
      );
    }
    return product.image 
      ? [{ url: product.image, alt: product.name }]
      : [{ url: '/placeholder.jpg', alt: product.name }];
  }, [product.images, product.image, product.name]);

  // Auto-cycle images on hover (if multiple images)
  useEffect(() => {
    if (!isHovered || images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 1500);

    return () => clearInterval(interval);
  }, [isHovered, images.length]);

  // Reset image index when hover ends
  useEffect(() => {
    if (!isHovered) {
      setCurrentImageIndex(0);
    }
  }, [isHovered]);

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Transform product for QuickViewModal
    const transformedProduct = {
      id: product.id.toString(),
      name: product.name,
      description: product.description || `Premium ${product.category.toLowerCase()} from THE BLACKEGE collection. Crafted with attention to detail and authentic urban style.`,
      price: product.originalPrice || product.price,
      salePrice: product.salePrice || (product.isSale ? product.price : undefined),
      category: product.category,
      inventory: product.inventory || product.stockQuantity || 10,
      media: images,
      sizes: product.sizes,
      colors: product.colors,
      tags: product.tags || ['Premium Quality', 'Streetwear', 'Urban Style']
    };
    
    setIsQuickViewOpen(true);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart?.(product);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onBuyNow?.(product);
  };

  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToWishlist?.(product);
  };

  const handleQuickViewAddToCart = (product: any, selectedOptions?: { size?: string; color?: string; quantity?: number }) => {
    onAddToCart?.(product, selectedOptions);
  };

  const handleQuickViewWishlist = (product: any) => {
    onAddToWishlist?.(product);
  };

  const isProductInWishlist = isInWishlist ? isInWishlist(product.id.toString()) : false;
  const isOutOfStock = product.inventory === 0 || product.stockQuantity === 0 || product.inStock === false;
  const discountPercentage = product.salePrice && product.price 
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : product.originalPrice && product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const cardSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  return (
    <>
      <Card 
        className={cn(
          "group overflow-hidden border-border bg-card hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-primary/10",
          isOutOfStock && "opacity-75",
          className
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CardContent className="p-0">
          {/* Image Section */}
          <div className="relative aspect-square overflow-hidden">
            <Link href={`/product/${product.id}`}>
              <Image
                src={images[currentImageIndex]?.url || '/placeholder.jpg'}
                alt={images[currentImageIndex]?.alt || product.name}
                fill
                className="object-cover transition-all duration-700 group-hover:scale-110"
                priority={currentImageIndex === 0}
              />
            </Link>
            
            {/* Gradient Overlay on Hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />
            
            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-1">
              {product.isNew && (
                <Badge className="bg-blue-500/90 text-white font-semibold text-xs">
                  NEW
                </Badge>
              )}
              {(product.isSale || product.salePrice) && discountPercentage > 0 && (
                <Badge className="bg-red-500/90 text-white font-semibold text-xs">
                  -{discountPercentage}%
                </Badge>
              )}
              {isOutOfStock && (
                <Badge className="bg-gray-500/90 text-white font-semibold text-xs">
                  OUT OF STOCK
                </Badge>
              )}
            </div>

            {/* Action Buttons - Top Right */}
            <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
              {onAddToWishlist && (
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-10 w-10 bg-black/60 hover:bg-black/80 text-white border-0 shadow-lg backdrop-blur-sm transition-all duration-200"
                  onClick={handleAddToWishlist}
                >
                  <Icons.heart 
                    className={cn(
                      "h-4 w-4 transition-all duration-200",
                      isProductInWishlist ? "fill-current text-red-400" : "text-white hover:text-red-400"
                    )} 
                  />
                </Button>
              )}
              
              {showQuickView && (
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-10 w-10 bg-black/60 hover:bg-black/80 text-white border-0 shadow-lg backdrop-blur-sm transition-all duration-200"
                  onClick={handleQuickView}
                >
                  <Icons.search className="h-4 w-4 text-white hover:text-primary transition-colors duration-200" />
                </Button>
              )}
            </div>

            {/* Image Indicators */}
            {images.length > 1 && (
              <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1">
                {images.map((_, index) => (
                  <div
                    key={index}
                    className={cn(
                      "w-1.5 h-1.5 rounded-full transition-all duration-200",
                      currentImageIndex === index ? "bg-white" : "bg-white/40"
                    )}
                  />
                ))}
              </div>
            )}

            {/* Quick Action Buttons - Bottom (Mobile Friendly) */}
            <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
              <div className="flex gap-2 w-full">
                {onAddToCart && (
                  <Button
                    className="flex-1 bg-blue-500/90 hover:bg-blue-600 text-white font-semibold transition-all duration-200 text-xs px-2"
                    size="sm"
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                  >
                    <Icons.shoppingCart className="mr-1 h-3 w-3" />
                    Add to Cart
                  </Button>
                )}
                
                {showBuyNow && onBuyNow && (
                  <Button
                    variant="secondary"
                    className="flex-1 bg-white/90 hover:bg-white text-black font-semibold transition-all duration-200 text-xs px-2"
                    size="sm"
                    onClick={handleBuyNow}
                    disabled={isOutOfStock}
                  >
                    Buy Now
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="p-4">
            <Link href={`/product/${product.id}`} className="block group-hover:text-primary transition-colors">
              <Badge variant="outline" className="mb-2 text-xs">
                {product.category}
              </Badge>
              
              <h3 className={cn(
                "font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors",
                cardSizes[size]
              )}>
                {product.name}
              </h3>
              
              <div className="flex items-center gap-2 mb-3">
                {product.salePrice || (product.isSale && product.originalPrice) ? (
                  <>
                    <span className={cn(
                      "font-bold text-red-600",
                      size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-lg' : 'text-base'
                    )}>
                      {formatPrice(product.salePrice || product.price)}
                    </span>
                    <span className="text-sm text-muted-foreground line-through">
                      {formatPrice(product.originalPrice || product.price)}
                    </span>
                  </>
                ) : (
                  <span className={cn(
                    "font-bold",
                    size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-lg' : 'text-base'
                  )}>
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>
            </Link>

            {/* Stock Status */}
            {(product.inventory !== undefined || product.stockQuantity !== undefined) && (
              <div className="flex items-center justify-between mb-3">
                <Badge variant={isOutOfStock ? 'destructive' : 'default'} className="text-xs">
                  {isOutOfStock ? 'Out of Stock' : 'In Stock'}
                </Badge>
                
                {!isOutOfStock && (product.inventory! <= 5 || product.stockQuantity! <= 5) && (
                  <span className="text-xs text-orange-600 font-medium">
                    Only {product.inventory || product.stockQuantity} left!
                  </span>
                )}
              </div>
            )}

            {/* Mobile Action Buttons */}
            <div className="flex gap-2 md:hidden">
              {onAddToCart && (
                <Button
                  className="flex-1"
                  size="sm"
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                >
                  <Icons.shoppingCart className="mr-2 h-4 w-4" />
                  Add to Cart
                </Button>
              )}
              
              {onAddToWishlist && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleAddToWishlist}
                  className={cn(
                    "transition-all duration-200",
                    isProductInWishlist ? "text-red-500 border-red-500 bg-red-50" : ""
                  )}
                >
                  <Icons.heart 
                    className={cn(
                      "h-4 w-4",
                      isProductInWishlist ? "fill-current" : ""
                    )} 
                  />
                </Button>
              )}
              
              {showQuickView && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleQuickView}
                >
                  <Icons.search className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick View Modal */}
      <QuickViewModal
        product={{
          id: product.id.toString(),
          name: product.name,
          description: product.description || `Premium ${product.category.toLowerCase()} from THE BLACKEGE collection.`,
          price: product.originalPrice || product.price,
          salePrice: product.salePrice || (product.isSale ? product.price : undefined),
          category: product.category,
          inventory: product.inventory || product.stockQuantity || 10,
          media: images,
          sizes: product.sizes,
          colors: product.colors,
          tags: product.tags || ['Premium Quality', 'Streetwear']
        }}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
        onAddToCart={handleQuickViewAddToCart}
        onAddToWishlist={handleQuickViewWishlist}
        isInWishlist={(id) => isInWishlist ? isInWishlist(id) : false}
      />
    </>
  );
}
