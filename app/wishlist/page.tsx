'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Icons } from '@/components/ui/icons';
import { useWishlist } from '@/hooks/use-wishlist';
import { useCart } from '@/hooks/use-cart';
import { useAuth } from '@/contexts/auth-context';
import { useToast } from '@/hooks/use-toast';
import { formatPrice } from '@/lib/currency-utils';

export default function WishlistPage() {
  const { wishlist, isLoading, removeFromWishlist, clearWishlist, getTotalItems } = useWishlist();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleRemoveFromWishlist = async (productId: string) => {
    try {
      await removeFromWishlist(productId);
      toast({
        title: 'Removed from wishlist',
        description: 'Item has been removed from your wishlist.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to remove item from wishlist.',
        variant: 'destructive',
      });
    }
  };

  const handleAddToCart = async (productId: string, productName: string) => {
    try {
      await addToCart(productId, 1);
      toast({
        title: 'Added to cart',
        description: `${productName} has been added to your cart.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add item to cart.',
        variant: 'destructive',
      });
    }
  };

  const handleClearWishlist = async () => {
    try {
      await clearWishlist();
      toast({
        title: 'Wishlist cleared',
        description: 'All items have been removed from your wishlist.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to clear wishlist.',
        variant: 'destructive',
      });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center py-12">
          <Icons.heart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Your Wishlist</h1>
          <p className="text-gray-600 mb-6">Please sign in to view your wishlist</p>
          <Button onClick={() => router.push('/login')}>
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center py-12">
          <Icons.spinner className="mx-auto h-8 w-8 animate-spin text-gray-400 mb-4" />
          <p className="text-gray-600">Loading your wishlist...</p>
        </div>
      </div>
    );
  }

  if (!wishlist || wishlist.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center py-12">
          <Icons.heart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Your Wishlist is Empty</h1>
          <p className="text-gray-600 mb-6">Save items you love to your wishlist</p>
          <Button onClick={() => router.push('/shop')}>
            Start Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Wishlist</h1>
          <p className="text-gray-600">{getTotalItems()} items saved</p>
        </div>
        {wishlist.items.length > 0 && (
          <Button
            variant="outline"
            onClick={handleClearWishlist}
            className="text-red-600 hover:text-red-700"
          >
            Clear All
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {wishlist.items.map((item) => (
          <Card key={item.id} className="group hover:shadow-lg transition-shadow">
            <CardContent className="p-0">
              <div className="relative aspect-square overflow-hidden rounded-t-lg">
                <Image
                  src={item.product.media?.[0]?.url || '/placeholder.jpg'}
                  alt={item.product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform"
                />
                {item.product.salePrice && (
                  <Badge className="absolute top-2 left-2 bg-red-500">
                    Sale
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                  onClick={() => handleRemoveFromWishlist(item.productId)}
                >
                  <Icons.x className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="p-4">
                <h3 className="font-medium text-gray-900 mb-1 line-clamp-2">
                  <Link
                    href={`/product/${item.productId}`}
                    className="hover:text-blue-600"
                  >
                    {item.product.name}
                  </Link>
                </h3>
                
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                  {item.product.description}
                </p>
                
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    {item.product.salePrice ? (
                      <>
                        <span className="font-semibold text-red-600">
                          {formatPrice(item.product.salePrice)}
                        </span>
                        <span className="text-sm text-gray-500 line-through">
                          {formatPrice(item.product.price)}
                        </span>
                      </>
                    ) : (
                      <span className="font-semibold text-gray-900">
                        {formatPrice(item.product.price)}
                      </span>
                    )}
                  </div>
                  <Badge variant={item.product.inventory > 0 ? 'default' : 'destructive'}>
                    {item.product.inventory > 0 ? 'In Stock' : 'Out of Stock'}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <Button
                    className="w-full"
                    onClick={() => handleAddToCart(item.productId, item.product.name)}
                    disabled={item.product.inventory <= 0}
                  >
                    <Icons.shoppingCart className="mr-2 h-4 w-4" />
                    Add to Cart
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => router.push(`/product/${item.productId}`)}
                  >
                    View Details
                  </Button>
                </div>
                
                <p className="text-xs text-gray-500 mt-2">
                  Added {new Date(item.addedAt).toLocaleDateString()}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
