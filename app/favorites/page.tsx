'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Icons } from '@/components/ui/icons';
import { useAuth } from '@/contexts/auth-context';
import { useToast } from '@/hooks/use-toast';
import { formatPrice } from '@/lib/currency-utils';
import { useCart } from '@/hooks/use-cart';
import { useWishlist } from '@/hooks/use-wishlist';
import { 
  getFavoriteProducts, 
  getFavoriteCollections,
  removeProductFromFavorites,
  removeCollectionFromFavorites,
  type FavoriteProduct,
  type FavoriteCollection 
} from '@/lib/api/favorites';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<{
    products: FavoriteProduct[];
    collections: FavoriteCollection[];
  }>({
    products: [],
    collections: []
  });
  const [activeTab, setActiveTab] = useState('products');
  const [isLoading, setIsLoading] = useState(true);
  const [removingItems, setRemovingItems] = useState<Set<string>>(new Set());

  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    fetchFavorites();
  }, [isAuthenticated, router]);

  const fetchFavorites = async () => {
    setIsLoading(true);
    try {
      const [products, collections] = await Promise.all([
        getFavoriteProducts(),
        getFavoriteCollections()
      ]);
      
      setFavorites({ products, collections });
    } catch (error) {
      console.error('Failed to fetch favorites:', error);
      toast({
        title: 'Error',
        description: 'Failed to load your favorites. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveProduct = async (productId: number) => {
    const key = `product-${productId}`;
    setRemovingItems(prev => new Set(prev).add(key));
    
    try {
      await removeProductFromFavorites(productId);
      setFavorites(prev => ({
        ...prev,
        products: prev.products.filter(p => p.id !== productId)
      }));
      
      toast({
        title: 'Removed from Favorites',
        description: 'Product has been removed from your favorites.',
      });
    } catch (error) {
      console.error('Failed to remove product from favorites:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove product from favorites.',
        variant: 'destructive',
      });
    } finally {
      setRemovingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(key);
        return newSet;
      });
    }
  };

  const handleRemoveCollection = async (collectionId: number) => {
    const key = `collection-${collectionId}`;
    setRemovingItems(prev => new Set(prev).add(key));
    
    try {
      await removeCollectionFromFavorites(collectionId);
      setFavorites(prev => ({
        ...prev,
        collections: prev.collections.filter(c => c.id !== collectionId)
      }));
      
      toast({
        title: 'Removed from Favorites',
        description: 'Collection has been removed from your favorites.',
      });
    } catch (error) {
      console.error('Failed to remove collection from favorites:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove collection from favorites.',
        variant: 'destructive',
      });
    } finally {
      setRemovingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(key);
        return newSet;
      });
    }
  };

  const handleAddToCart = async (product: FavoriteProduct) => {
    try {
      await addToCart(product.id.toString(), 1);
      toast({
        title: 'Added to Cart',
        description: `${product.name} has been added to your cart.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add item to cart.',
        variant: 'destructive',
      });
    }
  };

  const handleAddToWishlist = async (product: FavoriteProduct) => {
    try {
      addToWishlist({
        id: product.id.toString(),
        name: product.name,
        price: product.salePrice || product.price,
        image: product.imageUrl,
        category: product.categories[0] || 'Product',
      });
      toast({
        title: 'Added to Wishlist',
        description: `${product.name} has been added to your wishlist.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add item to wishlist.',
        variant: 'destructive',
      });
    }
  };

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Icons.spinner className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Loading your favorites...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">My Favorites</h1>
            <p className="text-muted-foreground">
              Manage your favorite products and collections
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 max-w-md">
              <TabsTrigger value="products">
                Products ({favorites.products.length})
              </TabsTrigger>
              <TabsTrigger value="collections">
                Collections ({favorites.collections.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="products" className="mt-6">
              {favorites.products.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <Icons.heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No Favorite Products</h3>
                    <p className="text-muted-foreground mb-6">
                      You haven't added any products to your favorites yet.
                    </p>
                    <Button asChild>
                      <Link href="/shop">
                        <Icons.shoppingCart className="mr-2 h-4 w-4" />
                        Browse Products
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {favorites.products.map((product) => (
                    <Card key={product.id} className="group hover:shadow-md transition-shadow">
                      <CardContent className="p-0">
                        <div className="relative aspect-square overflow-hidden rounded-t-lg">
                          <Link href={`/product/${product.id}`}>
                            <Image
                              src={product.imageUrl || '/placeholder.jpg'}
                              alt={product.name}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform"
                            />
                          </Link>
                          {product.salePrice && (
                            <Badge className="absolute top-2 left-2 bg-red-500">
                              Sale
                            </Badge>
                          )}
                        </div>
                        
                        <div className="p-4">
                          <h3 className="font-medium text-lg mb-1 line-clamp-2">
                            <Link href={`/product/${product.id}`} className="hover:text-primary">
                              {product.name}
                            </Link>
                          </h3>
                          
                          <div className="flex items-center gap-2 mb-2">
                            {product.categories.map((category, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {category}
                              </Badge>
                            ))}
                          </div>
                          
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                              {product.salePrice ? (
                                <>
                                  <span className="font-semibold text-red-600">
                                    {formatPrice(product.salePrice)}
                                  </span>
                                  <span className="text-sm text-muted-foreground line-through">
                                    {formatPrice(product.price)}
                                  </span>
                                </>
                              ) : (
                                <span className="font-semibold">
                                  {formatPrice(product.price)}
                                </span>
                              )}
                            </div>
                            <Badge variant={product.stockQuantity > 0 ? 'default' : 'destructive'}>
                              {product.stockQuantity > 0 ? 'In Stock' : 'Out of Stock'}
                            </Badge>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="grid grid-cols-2 gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleAddToCart(product)}
                                disabled={product.stockQuantity <= 0}
                              >
                                <Icons.shoppingCart className="mr-1 h-3 w-3" />
                                Add to Cart
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleAddToWishlist(product)}
                              >
                                <Icons.shoppingCart className="mr-1 h-3 w-3" />
                                Wishlist
                              </Button>
                            </div>
                            <Button
                              variant="destructive"
                              size="sm"
                              className="w-full"
                              onClick={() => handleRemoveProduct(product.id)}
                              disabled={removingItems.has(`product-${product.id}`)}
                            >
                              {removingItems.has(`product-${product.id}`) ? (
                                <Icons.spinner className="mr-2 h-3 w-3 animate-spin" />
                              ) : (
                                <Icons.x className="mr-2 h-3 w-3" />
                              )}
                              Remove from Favorites
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="collections" className="mt-6">
              {favorites.collections.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <Icons.shoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No Favorite Collections</h3>
                    <p className="text-muted-foreground mb-6">
                      You haven't added any collections to your favorites yet.
                    </p>
                    <Button asChild>
                      <Link href="/collections">
                        <Icons.shoppingCart className="mr-2 h-4 w-4" />
                        Browse Collections
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {favorites.collections.map((collection) => (
                    <Card key={collection.id} className="group hover:shadow-md transition-shadow">
                      <CardContent className="p-0">
                        <div className="relative aspect-video overflow-hidden rounded-t-lg">
                          <Link href={`/collections/${collection.id}`}>
                            <Image
                              src={collection.imageUrl || '/placeholder.jpg'}
                              alt={collection.name}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform"
                            />
                          </Link>
                        </div>
                        
                        <div className="p-6">
                          <h3 className="font-semibold text-xl mb-2">
                            <Link href={`/collections/${collection.id}`} className="hover:text-primary">
                              {collection.name}
                            </Link>
                          </h3>
                          
                          <p className="text-muted-foreground mb-4 line-clamp-3">
                            {collection.description}
                          </p>
                          
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-sm text-muted-foreground">
                              {collection.totalProducts} products
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {collection.favoriteCount} favorites
                            </span>
                          </div>
                          
                          <div className="space-y-2">
                            <Button asChild className="w-full">
                              <Link href={`/collections/${collection.id}`}>
                                <Icons.shoppingCart className="mr-2 h-4 w-4" />
                                View Collection
                              </Link>
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              className="w-full"
                              onClick={() => handleRemoveCollection(collection.id)}
                              disabled={removingItems.has(`collection-${collection.id}`)}
                            >
                              {removingItems.has(`collection-${collection.id}`) ? (
                                <Icons.spinner className="mr-2 h-3 w-3 animate-spin" />
                              ) : (
                                <Icons.x className="mr-2 h-3 w-3" />
                              )}
                              Remove from Favorites
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}
