'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Icons } from '@/components/ui/icons';
import { getProductsByCategory, getCategories } from '@/lib/api/products';
import type { Product } from '@/lib/api/products';
import { useCart } from '@/hooks/use-cart';
import { useWishlist } from '@/hooks/use-wishlist';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/loading-spinner';
import { formatPrice } from '@/lib/currency-utils';

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'createdAt'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { toast } = useToast();

  // Decode and format category name
  const categoryName = decodeURIComponent(params.slug).replace(/-/g, ' ');
  const formattedCategoryName = categoryName.split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  useEffect(() => {
    const loadCategoryData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Load categories and products in parallel
        const [categoriesData, productsData] = await Promise.all([
          getCategories(),
          getProductsByCategory(formattedCategoryName, 0, 12)
        ]);

        setCategories(categoriesData);
        
        // Check if category exists
        if (!categoriesData.some(cat => 
          cat.toLowerCase().replace(/\s+/g, '-') === params.slug.toLowerCase()
        )) {
          setError('Category not found');
          return;
        }

        setProducts(productsData.products);
        setTotalPages(productsData.totalPages);
        setCurrentPage(productsData.currentPage);
        setTotalElements(productsData.totalElements);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load category');
        console.error('Failed to load category:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadCategoryData();
  }, [params.slug, formattedCategoryName]);

  const handlePageChange = async (page: number) => {
    try {
      setIsLoading(true);
      const productsData = await getProductsByCategory(formattedCategoryName, page, 12);
      setProducts(productsData.products);
      setCurrentPage(productsData.currentPage);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load products.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = async (product: Product) => {
    try {
      await addToCart(product.id, 1);
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
    }
  };

  const handleWishlistToggle = async (product: Product) => {
    try {
      if (isInWishlist(product.id)) {
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
    }
  };

  // Category descriptions and hero images
  const getCategoryInfo = (category: string) => {
    const categoryLower = category.toLowerCase();
    
    const categoryInfo = {
      't-shirts': {
        description: 'Essential streetwear tees that define urban culture with premium comfort and style.',
        heroImage: '/black-streetwear-t-shirt-urban-design.png',
        features: ['Premium Cotton', 'Urban Designs', 'Comfortable Fit', 'Durable Quality']
      },
      'hoodies': {
        description: 'Cozy streetwear hoodies perfect for layering and making a statement.',
        heroImage: '/dark-hoodie-streetwear-minimalist-design.png',
        features: ['Soft Fleece Interior', 'Adjustable Hood', 'Kangaroo Pocket', 'Ribbed Cuffs']
      },
      'jackets': {
        description: 'Urban outerwear that combines functionality with cutting-edge street style.',
        heroImage: '/black-streetwear-jacket-urban-fashion.png',
        features: ['Weather Resistant', 'Multiple Pockets', 'Versatile Styling', 'Premium Materials']
      },
      'accessories': {
        description: 'Complete your streetwear look with our premium urban accessories.',
        heroImage: '/black-cap-streetwear-accessories-urban.png',
        features: ['Premium Materials', 'Urban Aesthetic', 'Versatile Styles', 'Quality Construction']
      },
      'pants': {
        description: 'Comfortable and stylish streetwear pants for the modern urban lifestyle.',
        heroImage: '/dark-streetwear-pants-urban-style.png',
        features: ['Comfortable Fit', 'Durable Fabric', 'Modern Cut', 'Versatile Styling']
      }
    };

    return categoryInfo[categoryLower as keyof typeof categoryInfo] || {
      description: `Discover our premium ${category.toLowerCase()} collection, crafted for the modern streetwear enthusiast.`,
      heroImage: '/placeholder.jpg',
      features: ['Premium Quality', 'Urban Style', 'Comfortable Fit', 'Modern Design']
    };
  };

  const categoryInfo = getCategoryInfo(formattedCategoryName);

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <div className="container mx-auto px-4 py-8 max-w-4xl">
            <Card>
              <CardContent className="p-8 text-center">
                <Icons.search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h2 className="text-2xl font-bold mb-2">Category Not Found</h2>
                <p className="text-muted-foreground mb-6">
                  The category "{formattedCategoryName}" doesn't exist or has no products.
                </p>
                <div className="flex gap-4 justify-center">
                  <Button onClick={() => router.back()}>
                    Go Back
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/shop">
                      Browse All Products
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="relative py-20 px-4 bg-gradient-to-r from-primary/10 to-secondary/10 overflow-hidden">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                {/* Breadcrumb */}
                <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
                  <Link href="/" className="hover:text-primary">Home</Link>
                  <Icons.shoppingCart className="h-4 w-4" />
                  <Link href="/shop" className="hover:text-primary">Shop</Link>
                  <Icons.shoppingCart className="h-4 w-4" />
                  <span>{formattedCategoryName}</span>
                </div>

                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  {formattedCategoryName}
                </h1>
                <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                  {categoryInfo.description}
                </p>

                {/* Features */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  {categoryInfo.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Icons.star className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-4">
                  <Button size="lg">
                    Shop Collection
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <Link href="/collections">
                      View All Collections
                    </Link>
                  </Button>
                </div>
              </div>

              <div className="relative">
                <Image
                  src={categoryInfo.heroImage}
                  alt={formattedCategoryName}
                  width={500}
                  height={600}
                  className="rounded-lg object-cover w-full max-w-md mx-auto"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-7xl">
            {isLoading ? (
              <LoadingSpinner text="Loading products..." />
            ) : (
              <>
                {/* Results Header */}
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">
                      {formattedCategoryName} Collection
                    </h2>
                    <p className="text-muted-foreground">
                      {totalElements} products found
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="name">Name</SelectItem>
                        <SelectItem value="price">Price</SelectItem>
                        <SelectItem value="createdAt">Newest</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
                    >
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </Button>
                  </div>
                </div>

                {products.length === 0 ? (
                  <div className="text-center py-16">
                    <Icons.search className="mx-auto h-16 w-16 text-muted-foreground mb-6" />
                    <h3 className="text-2xl font-bold mb-4">No Products Found</h3>
                    <p className="text-lg text-muted-foreground mb-8">
                      We don't have any products in the {formattedCategoryName} category yet.
                    </p>
                    <Button asChild>
                      <Link href="/shop">Browse All Products</Link>
                    </Button>
                  </div>
                ) : (
                  <>
                    {/* Products Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
                      {products.map((product) => (
                        <Card key={product.id} className="group hover:shadow-lg transition-shadow">
                          <CardContent className="p-0">
                            <div className="relative aspect-square overflow-hidden rounded-t-lg">
                              <Link href={`/product/${product.id}`}>
                                <Image
                                  src={product.media?.[0]?.url || '/placeholder.jpg'}
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
                              <Button
                                variant="ghost"
                                size="sm"
                                className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                                onClick={() => handleWishlistToggle(product)}
                              >
                                <Icons.heart 
                                  className={`h-4 w-4 ${isInWishlist(product.id) ? 'fill-current text-red-500' : ''}`} 
                                />
                              </Button>
                            </div>
                            
                            <div className="p-4">
                              <h3 className="font-medium text-gray-900 mb-1 line-clamp-2">
                                <Link href={`/product/${product.id}`} className="hover:text-primary">
                                  {product.name}
                                </Link>
                              </h3>
                              
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center space-x-2">
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
                                    <span className="font-semibold text-gray-900">
                                      {formatPrice(product.price)}
                                    </span>
                                  )}
                                </div>
                                <Badge variant={product.inventory > 0 ? 'default' : 'destructive'}>
                                  {product.inventory > 0 ? 'In Stock' : 'Out of Stock'}
                                </Badge>
                              </div>
                              
                              <Button
                                className="w-full"
                                onClick={() => handleAddToCart(product)}
                                disabled={product.inventory <= 0}
                              >
                                <Icons.shoppingCart className="mr-2 h-4 w-4" />
                                Add to Cart
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex justify-center items-center space-x-2">
                        <Button
                          variant="outline"
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 0}
                        >
                          Previous
                        </Button>
                        
                        {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                          const pageNumber = currentPage <= 2 ? i : currentPage - 2 + i;
                          if (pageNumber >= totalPages) return null;
                          
                          return (
                            <Button
                              key={pageNumber}
                              variant={pageNumber === currentPage ? 'default' : 'outline'}
                              onClick={() => handlePageChange(pageNumber)}
                              className="w-10 h-10"
                            >
                              {pageNumber + 1}
                            </Button>
                          );
                        })}
                        
                        <Button
                          variant="outline"
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages - 1}
                        >
                          Next
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </section>

        {/* Related Categories */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-2xl font-bold mb-4">Explore Other Categories</h2>
              <p className="text-muted-foreground">
                Discover more streetwear essentials
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {categories
                .filter(cat => cat !== formattedCategoryName)
                .slice(0, 8)
                .map((category) => (
                  <Link
                    key={category}
                    href={`/category/${category.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <Card className="group hover:shadow-md transition-shadow">
                      <CardContent className="p-6 text-center">
                        <h3 className="font-medium group-hover:text-primary transition-colors">
                          {category}
                        </h3>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
