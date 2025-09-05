'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Icons } from '@/components/ui/icons';
import { cn } from '@/lib/utils';
import { formatPrice } from '@/lib/currency-utils';

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  salePrice?: number;
  category: string;
  inventory: number;
  media?: { url: string; alt?: string }[];
  sizes?: string[];
  colors?: string[];
  tags?: string[];
}

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, selectedOptions?: { size?: string; color?: string; quantity?: number }) => void;
  onAddToWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
}

export function QuickViewModal({
  product,
  isOpen,
  onClose,
  onAddToCart,
  onAddToWishlist,
  isInWishlist
}: QuickViewModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [isImageLoading, setIsImageLoading] = useState(true);

  // Reset states when product changes
  useEffect(() => {
    if (product) {
      setCurrentImageIndex(0);
      setSelectedSize(product.sizes?.[0] || '');
      setSelectedColor(product.colors?.[0] || '');
      setQuantity(1);
      setIsImageLoading(true);
    }
  }, [product]);

  // Auto-advance slider every 5 seconds when multiple images
  useEffect(() => {
    if (!product?.media || product.media.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % product.media!.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [product?.media]);

  if (!product) return null;

  const images = product.media && product.media.length > 0 
    ? product.media 
    : [{ url: '/placeholder.jpg', alt: product.name }];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
    setIsImageLoading(true);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    setIsImageLoading(true);
  };

  const goToSlide = (index: number) => {
    setCurrentImageIndex(index);
    setIsImageLoading(true);
  };

  const handleAddToCart = () => {
    onAddToCart(product, {
      size: selectedSize,
      color: selectedColor,
      quantity
    });
    onClose();
  };

  const handleAddToWishlist = () => {
    onAddToWishlist(product);
  };

  const handleBuyNow = () => {
    // Add to cart first, then redirect to checkout
    handleAddToCart();
    // Small delay to ensure cart is updated, then redirect
    setTimeout(() => {
      window.location.href = '/checkout';
    }, 100);
  };

  const discountPercentage = product.salePrice 
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-hidden p-0 bg-background">
        <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
          {/* Image Section */}
          <div className="relative bg-muted/30">
            {/* Main Image Container */}
            <div className="relative aspect-square lg:aspect-[4/5] overflow-hidden">
              <Image
                src={images[currentImageIndex].url}
                alt={images[currentImageIndex].alt || product.name}
                fill
                className={cn(
                  "object-cover transition-all duration-500 ease-in-out",
                  isImageLoading ? "scale-105 blur-sm" : "scale-100 blur-0"
                )}
                onLoad={() => setIsImageLoading(false)}
                priority
              />
              
              {/* Image Loading Overlay */}
              {isImageLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
                  <Icons.spinner className="h-8 w-8 text-muted-foreground" />
                </div>
              )}

              {/* Sale Badge */}
              {product.salePrice && (
                <Badge className="absolute top-4 left-4 bg-red-500 text-white font-semibold">
                  -{discountPercentage}%
                </Badge>
              )}

              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 h-14 w-14 rounded-full bg-white/80 hover:bg-white/90 text-black shadow-lg border border-white/50 hover:border-primary/50 backdrop-blur-sm transition-all duration-200 hover:scale-110"
                    onClick={prevImage}
                  >
                    <Icons.chevronLeft className="h-6 w-6 text-black" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 h-14 w-14 rounded-full bg-white/80 hover:bg-white/90 text-black shadow-lg border border-white/50 hover:border-primary/50 backdrop-blur-sm transition-all duration-200 hover:scale-110"
                    onClick={nextImage}
                  >
                    <Icons.chevronRight className="h-6 w-6 text-black" />
                  </Button>
                </>
              )}

              {/* Image Counter */}
              {images.length > 1 && (
                <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/70 text-white text-sm rounded-full">
                  {currentImageIndex + 1} / {images.length}
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {images.length > 1 && (
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent">
                <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={cn(
                        "relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 flex-shrink-0",
                        currentImageIndex === index 
                          ? "border-white scale-110" 
                          : "border-white/30 hover:border-white/60"
                      )}
                    >
                      <Image
                        src={image.url}
                        alt={image.alt || `${product.name} ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Slide Indicators */}
            {images.length > 1 && (
              <div className="absolute top-4 right-4 flex gap-1">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={cn(
                      "w-2 h-2 rounded-full transition-all duration-200",
                      currentImageIndex === index
                        ? "bg-white"
                        : "bg-white/40 hover:bg-white/60"
                    )}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Product Details Section */}
          <div className="flex flex-col h-full">
            <div className="p-6 space-y-6 flex-1 overflow-y-auto">
              {/* Header */}
              <div>
                <DialogHeader className="space-y-1 text-left">
                  <DialogTitle className="text-2xl lg:text-3xl font-bold leading-tight">
                    {product.name}
                  </DialogTitle>
                </DialogHeader>
                <p className="text-muted-foreground font-medium">{product.category}</p>
              </div>

              {/* Price */}
              <div className="flex items-center gap-3">
                {product.salePrice ? (
                  <>
                    <span className="text-3xl font-bold text-red-600">
                      {formatPrice(product.salePrice)}
                    </span>
                    <span className="text-xl text-muted-foreground line-through">
                      {formatPrice(product.price)}
                    </span>
                    <Badge className="bg-red-500 text-white">
                      Save {formatPrice(product.price - product.salePrice)}
                    </Badge>
                  </>
                ) : (
                  <span className="text-3xl font-bold">
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-2">
                <Badge variant={product.inventory > 0 ? 'default' : 'destructive'}>
                  {product.inventory > 0 ? '✓ In Stock' : '✗ Out of Stock'}
                </Badge>
                {product.inventory > 0 && product.inventory <= 10 && (
                  <span className="text-sm text-orange-600 font-medium">
                    Only {product.inventory} left!
                  </span>
                )}
              </div>

              {/* Description */}
              {product.description && (
                <div>
                  <h4 className="font-semibold mb-2">Description</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    {product.description}
                  </p>
                </div>
              )}

              {/* Size Selection */}
              {product.sizes && product.sizes.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3">Size</h4>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <Button
                        key={size}
                        variant={selectedSize === size ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedSize(size)}
                        className="min-w-[3rem]"
                      >
                        {size}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Selection */}
              {product.colors && product.colors.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3">Color</h4>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color) => (
                      <Button
                        key={color}
                        variant={selectedColor === color ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedColor(color)}
                        className="min-w-[4rem] capitalize"
                      >
                        {color}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div>
                <h4 className="font-semibold mb-3">Quantity</h4>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Icons.minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.min(product.inventory, quantity + 1))}
                    disabled={quantity >= product.inventory}
                  >
                    <Icons.plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Tags */}
              {product.tags && product.tags.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Features</h4>
                  <div className="flex flex-wrap gap-1">
                    {product.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="p-6 border-t bg-background/50 backdrop-blur-sm">
              <div className="space-y-3">
                {/* Primary Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Button
                    className="h-12 text-base font-semibold"
                    size="lg"
                    onClick={handleAddToCart}
                    disabled={product.inventory <= 0}
                  >
                    <Icons.shoppingCart className="mr-2 h-5 w-5" />
                    Add to Cart
                  </Button>
                  
                  <Button
                    className="h-12 text-base font-semibold bg-primary hover:bg-primary/90"
                    size="lg"
                    onClick={handleBuyNow}
                    disabled={product.inventory <= 0}
                  >
                    <Icons.arrowRight className="mr-2 h-5 w-5" />
                    Buy Now - {formatPrice((product.salePrice || product.price) * quantity)}
                  </Button>
                </div>
                
                {/* Secondary Action Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    onClick={handleAddToWishlist}
                    className="h-11"
                  >
                    <Icons.heart 
                      className={cn(
                        "mr-2 h-4 w-4",
                        isInWishlist(product.id) ? 'fill-current text-red-500' : ''
                      )} 
                    />
                    {isInWishlist(product.id) ? 'Saved' : 'Save'}
                  </Button>
                  
                  <Button variant="outline" asChild className="h-11">
                    <Link href={`/product/${product.id}`} onClick={onClose}>
                      <Icons.search className="mr-2 h-4 w-4" />
                      Full Details
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
