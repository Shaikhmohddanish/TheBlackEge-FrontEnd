'use client';

import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Icons } from '@/components/ui/icons';
import { ProfessionalSearchBar } from './professional-search-bar';
import { getPopularCategories, getTrendingSearches } from '@/lib/api/search';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface HeroSearchSectionProps {
  className?: string;
  title?: string;
  subtitle?: string;
  showCategories?: boolean;
  showTrending?: boolean;
}

export function HeroSearchSection({
  className,
  title = "Find Your Perfect Style",
  subtitle = "Discover premium streetwear, exclusive drops, and trending fashion from top brands",
  showCategories = true,
  showTrending = true
}: HeroSearchSectionProps) {
  const [popularCategories, setPopularCategories] = useState<string[]>([]);
  const [trendingSearches, setTrendingSearches] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const router = useRouter();

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        const promises = [];
        if (showCategories) {
          promises.push(getPopularCategories(6));
        }
        if (showTrending) {
          promises.push(getTrendingSearches(8));
        }
        
        const results = await Promise.all(promises);
        
        if (showCategories) {
          setPopularCategories(results[0] || []);
        }
        if (showTrending) {
          setTrendingSearches(results[showCategories ? 1 : 0] || []);
        }
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [showCategories, showTrending]);

  const handleCategoryClick = (category: string) => {
    router.push(`/search?q=${encodeURIComponent(category)}&categories=${encodeURIComponent(category)}`);
  };

  const handleTrendingClick = (query: string) => {
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <section className={cn(
      "relative py-20 px-4 sm:px-6 lg:px-8",
      "bg-gradient-to-br from-background via-background to-muted/20",
      className
    )}>
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-small-black/[0.02] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] pointer-events-none" />
      
      <div className="relative max-w-4xl mx-auto text-center">
        {/* Title and Subtitle */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6">
            {title}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Professional Search Bar */}
        <div className="mb-12">
          <ProfessionalSearchBar
            variant="hero"
            placeholder="Search for streetwear, brands, styles, or collections..."
            showTrending={true}
            className="mx-auto"
          />
        </div>

        {/* Quick Actions */}
        <div className="space-y-8">
          {/* Popular Categories */}
          {showCategories && (
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Icons.star className="w-4 h-4" />
                <span>Popular Categories</span>
              </div>
              
              {isLoading ? (
                <div className="flex justify-center gap-2">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-8 w-20 bg-muted animate-pulse rounded-full"
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-wrap justify-center gap-3">
                  {popularCategories.map((category, index) => (
                    <Badge
                      key={category}
                      variant="secondary"
                      className={cn(
                        "cursor-pointer px-4 py-2 text-sm transition-all duration-200",
                        "hover:scale-105 hover:bg-primary hover:text-primary-foreground",
                        "border border-border/50 hover:border-primary/50"
                      )}
                      onClick={() => handleCategoryClick(category)}
                    >
                      {category}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Trending Searches */}
          {showTrending && (
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Icons.trendingUp className="w-4 h-4" />
                <span>Trending Now</span>
              </div>
              
              {isLoading ? (
                <div className="flex justify-center gap-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-6 w-16 bg-muted animate-pulse rounded-full"
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-wrap justify-center gap-2">
                  {trendingSearches.slice(0, 6).map((search, index) => (
                    <button
                      key={search}
                      onClick={() => handleTrendingClick(search)}
                      className={cn(
                        "text-sm text-muted-foreground hover:text-foreground",
                        "transition-colors duration-200 underline-offset-4",
                        "hover:underline"
                      )}
                    >
                      #{search}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Search Stats */}
        <div className="mt-12 pt-8 border-t border-border/30">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground mb-1">1000+</div>
              <div className="text-sm text-muted-foreground">Premium Products</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground mb-1">50+</div>
              <div className="text-sm text-muted-foreground">Top Brands</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground mb-1">24/7</div>
              <div className="text-sm text-muted-foreground">New Arrivals</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
