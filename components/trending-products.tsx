'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Icons } from '@/components/ui/icons';
import { ProductCard } from '@/components/ui/product-card';
import { getProducts } from '@/lib/api/products';
import type { Product } from '@/lib/api/products';

export function TrendingProducts() {
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTrendingProducts = async () => {
      try {
        setIsLoading(true);
        // Get recent products or featured products for trending
        const results = await getProducts(0, 8, 'createdAt', 'desc');
        setTrendingProducts(results.products || []);
      } catch (error) {
        console.error('Failed to load trending products:', error);
        setTrendingProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadTrendingProducts();
  }, []);

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Icons.trendingUp className="h-6 w-6 text-primary" />
            <Badge variant="outline" className="text-sm">
              Trending Now
            </Badge>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            What's <span className="text-primary">Trending</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover the hottest streetwear pieces that everyone's talking about. 
            From limited drops to customer favorites.
          </p>
        </div>

        {/* Trending Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {isLoading ? (
            // Loading skeleton
            Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))
          ) : trendingProducts.length > 0 ? (
            trendingProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={{
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  salePrice: product.salePrice,
                  images: product.media || [],
                  category: product.category,
                  inventory: product.stockQuantity || 0,
                  sizes: product.variants?.map(v => v.size).filter(Boolean) || [],
                  colors: product.variants?.map(v => v.color).filter(Boolean) || [],
                  description: product.description,
                  inStock: (product.stockQuantity || 0) > 0
                }}
                showQuickView={true}
                showFavorite={true}
                size="md"
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <Icons.package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500">No trending products available at the moment.</p>
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
            <Link href="/shop">
              <Icons.shoppingBag className="mr-2 h-5 w-5" />
              Shop All Trending
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
