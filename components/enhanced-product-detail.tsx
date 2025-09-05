'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Icons } from '@/components/ui/icons';
import { useCart } from '@/hooks/use-cart';
import { useWishlist } from '@/hooks/use-wishlist';
import { useAuth } from '@/contexts/auth-context';
import { useToast } from '@/hooks/use-toast';
import type { Product } from '@/lib/api/products';
import { formatPrice } from '@/lib/currency-utils';

interface EnhancedProductDetailProps {
  product: Product;
}

export function EnhancedProductDetail({ product }: EnhancedProductDetailProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);

  const { addToCart, getItemQuantity } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  const currentImageUrl = product.media?.[selectedImageIndex]?.url || '/placeholder.jpg';
  const isInStock = product.inventory > 0;
  const isProductInWishlist = isInWishlist(product.id);
  const cartQuantity = getItemQuantity(product.id);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast({
        title: 'Please sign in',
        description: 'You need to be signed in to add items to cart.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsAddingToCart(true);
      await addToCart(product.id, quantity);
      toast({
        title: 'Added to cart',
        description: `${product.name} has been added to your cart.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add item to cart.',
        variant: 'destructive',
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleWishlistToggle = async () => {
    if (!isAuthenticated) {
      toast({
        title: 'Please sign in',
        description: 'You need to be signed in to add items to wishlist.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsAddingToWishlist(true);
      if (isProductInWishlist) {
        await removeFromWishlist(product.id);
        toast({
          title: 'Removed from wishlist',
          description: `${product.name} has been removed from your wishlist.`,
        });
      } else {
        await addToWishlist(product.id);
        toast({
          title: 'Added to wishlist',
          description: `${product.name} has been added to your wishlist.`,
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update wishlist.',
        variant: 'destructive',
      });
    } finally {
      setIsAddingToWishlist(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
            <Image
              src={currentImageUrl}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
            {product.salePrice && (
              <Badge className="absolute top-4 left-4 bg-red-500">
                Sale
              </Badge>
            )}
            {!isInStock && (
              <Badge className="absolute top-4 right-4 bg-gray-500">
                Out of Stock
              </Badge>
            )}
          </div>

          {/* Image Thumbnails */}
          {product.media && product.media.length > 1 && (
            <div className="flex space-x-2 overflow-x-auto">
              {product.media.map((media, index) => (
                <button
                  key={media.id}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 ${
                    index === selectedImageIndex ? 'border-black' : 'border-gray-200'
                  }`}
                >
                  <Image
                    src={media.url}
                    alt={media.altText || product.name}
                    width={80}
                    height={80}
                    className="object-cover w-full h-full"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            <p className="text-gray-600 mb-4">{product.category}</p>
            
            <div className="flex items-center space-x-4 mb-4">
              {product.salePrice ? (
                <>
                  <span className="text-2xl font-bold text-red-600">
                    {formatPrice(product.salePrice)}
                  </span>
                  <span className="text-xl text-gray-500 line-through">
                    {formatPrice(product.price)}
                  </span>
                  <Badge className="bg-red-100 text-red-800">
                    Save {formatPrice(product.price - product.salePrice)}
                  </Badge>
                </>
              ) : (
                <span className="text-2xl font-bold text-gray-900">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>

            <div className="flex items-center space-x-4 mb-6">
              <Badge variant={isInStock ? 'default' : 'destructive'}>
                {isInStock ? `${product.inventory} in stock` : 'Out of stock'}
              </Badge>
              {product.isActive && (
                <Badge variant="secondary">Active</Badge>
              )}
            </div>
          </div>

          {/* Quantity and Add to Cart */}
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <label className="font-medium">Quantity:</label>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Icons.minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(Math.min(product.inventory, quantity + 1))}
                  disabled={quantity >= product.inventory}
                >
                  <Icons.plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex space-x-4">
              <Button
                className="flex-1"
                onClick={handleAddToCart}
                disabled={!isInStock || isAddingToCart}
              >
                {isAddingToCart && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
                <Icons.shoppingCart className="mr-2 h-4 w-4" />
                {cartQuantity > 0 ? `Add More (${cartQuantity} in cart)` : 'Add to Cart'}
              </Button>
              
              <Button
                variant="outline"
                onClick={handleWishlistToggle}
                disabled={isAddingToWishlist}
              >
                {isAddingToWishlist && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
                <Icons.heart 
                  className={`h-4 w-4 ${isProductInWishlist ? 'fill-current text-red-500' : ''}`} 
                />
              </Button>
            </div>
          </div>

          {/* Product Details Tabs */}
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="shipping">Shipping</TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  <p className="text-gray-700 leading-relaxed">{product.description}</p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="details" className="mt-4">
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-900">SKU</h4>
                      <p className="text-gray-600">{product.sku}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Category</h4>
                      <p className="text-gray-600">{product.category}</p>
                    </div>
                    {product.weight && (
                      <div>
                        <h4 className="font-medium text-gray-900">Weight</h4>
                        <p className="text-gray-600">{product.weight}g</p>
                      </div>
                    )}
                    {product.dimensions && (
                      <div>
                        <h4 className="font-medium text-gray-900">Dimensions</h4>
                        <p className="text-gray-600">{product.dimensions}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="shipping" className="mt-4">
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Icons.shoppingCart className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Free shipping on orders over $100</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Icons.shoppingCart className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">Standard delivery: 3-5 business days</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Icons.shoppingCart className="h-4 w-4 text-purple-600" />
                      <span className="text-sm">Express delivery: 1-2 business days</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Icons.shoppingCart className="h-4 w-4 text-gray-600" />
                      <span className="text-sm">30-day return policy</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
