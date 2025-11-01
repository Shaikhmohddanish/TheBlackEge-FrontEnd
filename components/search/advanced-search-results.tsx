'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Icons } from '@/components/ui/icons';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { SearchAPI, type SearchFilters, type SearchResult, type Product } from '@/lib/api/search';
import { ProfessionalSearchBar } from './professional-search-bar';
import { ProductCard } from '@/components/ui/product-card';
import { LoadingSpinner } from '@/components/loading-spinner';
import { useToast } from '@/hooks/use-toast';

interface AdvancedSearchResultsProps {
  initialQuery?: string;
  className?: string;
}

export function AdvancedSearchResults({ initialQuery = '', className }: AdvancedSearchResultsProps) {
  // State
  const [searchResult, setSearchResult] = useState<SearchResult>({
    products: [],
    totalElements: 0,
    totalPages: 0,
    currentPage: 0,
    filters: {
      categories: [],
      brands: [],
      colors: [],
      sizes: [],
      priceRange: [0, 1000]
    }
  });
  
  const [filters, setFilters] = useState<SearchFilters>({});
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState('relevance');
  const [sortDir, setSortDir] = useState('desc');
  const [currentPage, setCurrentPage] = useState(0);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  // Get search parameters from URL
  const query = searchParams.get('q') || initialQuery;
  
  // Load available filters
  useEffect(() => {
    const loadFilters = async () => {
      try {
        const availableFilters = await SearchAPI.getAvailableFilters(query);
        setSearchResult(prev => ({ ...prev, filters: availableFilters }));
      } catch (error) {
      }
    };

    loadFilters();
  }, [query]);

  // Perform search
  const performSearch = useCallback(async () => {
    try {
      setIsLoading(true);
      
      const result = await SearchAPI.searchProducts(
        query,
        filters,
        currentPage,
        12,
        sortBy,
        sortDir
      );
      
      setSearchResult(prev => ({ ...result, filters: prev.filters }));
    } catch (error) {
      toast({
        title: 'Search failed',
        description: 'Failed to search products. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [query, filters, currentPage, sortBy, sortDir, toast]);

  // Perform search when dependencies change
  useEffect(() => {
    if (query) {
      performSearch();
    }
  }, [performSearch, query]);

  // Update URL when filters change
  const updateURL = useCallback(() => {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (filters.categories?.length) {
      filters.categories.forEach(cat => params.append('categories', cat));
    }
    if (filters.brand) params.set('brand', filters.brand);
    if (filters.color) params.set('color', filters.color);
    if (filters.size) params.set('size', filters.size);
    if (filters.minPrice !== undefined) params.set('minPrice', filters.minPrice.toString());
    if (filters.maxPrice !== undefined) params.set('maxPrice', filters.maxPrice.toString());
    if (filters.inStock !== undefined) params.set('inStock', filters.inStock.toString());
    
    router.replace(`/search?${params.toString()}`, { scroll: false });
  }, [query, filters, router]);

  // Filter handlers
  const handleCategoryFilter = (category: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      categories: checked
        ? [...(prev.categories || []), category]
        : (prev.categories || []).filter(c => c !== category)
    }));
    setCurrentPage(0);
  };

  const handleBrandFilter = (brand: string) => {
    setFilters(prev => ({ ...prev, brand: brand === 'all' ? undefined : brand }));
    setCurrentPage(0);
  };

  const handleColorFilter = (color: string) => {
    setFilters(prev => ({ ...prev, color: color === 'all' ? undefined : color }));
    setCurrentPage(0);
  };

  const handleSizeFilter = (size: string) => {
    setFilters(prev => ({ ...prev, size: size === 'all' ? undefined : size }));
    setCurrentPage(0);
  };

  const handlePriceFilter = (priceRange: [number, number]) => {
    setFilters(prev => ({
      ...prev,
      minPrice: priceRange[0],
      maxPrice: priceRange[1]
    }));
    setCurrentPage(0);
  };

  const handleInStockFilter = (inStock: boolean) => {
    setFilters(prev => ({ ...prev, inStock }));
    setCurrentPage(0);
  };

  const clearAllFilters = () => {
    setFilters({});
    setCurrentPage(0);
  };

  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy);
    setCurrentPage(0);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filter panel component
  const FilterPanel = ({ isMobile = false }) => (
    <div className="space-y-6">
      {/* Categories */}
      {searchResult.filters.categories.length > 0 && (
        <div>
          <h3 className="font-semibold text-sm text-foreground mb-3">Categories</h3>
          <div className="space-y-2">
            {searchResult.filters.categories.map(category => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox
                  id={`category-${category}`}
                  checked={filters.categories?.includes(category) || false}
                  onCheckedChange={(checked) => handleCategoryFilter(category, checked as boolean)}
                />
                <label
                  htmlFor={`category-${category}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {category}
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Price Range */}
      <div>
        <h3 className="font-semibold text-sm text-foreground mb-3">Price Range</h3>
        <div className="space-y-4">
          <Slider
            value={[filters.minPrice || 0, filters.maxPrice || 1000]}
            min={searchResult.filters.priceRange[0]}
            max={searchResult.filters.priceRange[1]}
            step={10}
            onValueChange={handlePriceFilter}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>${filters.minPrice || 0}</span>
            <span>${filters.maxPrice || 1000}</span>
          </div>
        </div>
      </div>

      {/* Brand */}
      {searchResult.filters.brands.length > 0 && (
        <div>
          <h3 className="font-semibold text-sm text-foreground mb-3">Brand</h3>
          <Select value={filters.brand || 'all'} onValueChange={handleBrandFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All Brands" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Brands</SelectItem>
              {searchResult.filters.brands.map(brand => (
                <SelectItem key={brand} value={brand}>{brand}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Color */}
      {searchResult.filters.colors.length > 0 && (
        <div>
          <h3 className="font-semibold text-sm text-foreground mb-3">Color</h3>
          <div className="grid grid-cols-3 gap-2">
            {searchResult.filters.colors.map(color => (
              <Badge
                key={color}
                variant={filters.color === color ? "default" : "secondary"}
                className="cursor-pointer justify-center"
                onClick={() => handleColorFilter(filters.color === color ? 'all' : color)}
              >
                {color}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Size */}
      {searchResult.filters.sizes.length > 0 && (
        <div>
          <h3 className="font-semibold text-sm text-foreground mb-3">Size</h3>
          <div className="grid grid-cols-4 gap-2">
            {searchResult.filters.sizes.map(size => (
              <Badge
                key={size}
                variant={filters.size === size ? "default" : "secondary"}
                className="cursor-pointer justify-center"
                onClick={() => handleSizeFilter(filters.size === size ? 'all' : size)}
              >
                {size}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* In Stock */}
      <div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="in-stock"
            checked={filters.inStock || false}
            onCheckedChange={handleInStockFilter}
          />
          <label
            htmlFor="in-stock"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
          >
            In Stock Only
          </label>
        </div>
      </div>

      {/* Clear Filters */}
      {Object.keys(filters).length > 0 && (
        <Button
          variant="outline"
          size="sm"
          onClick={clearAllFilters}
          className="w-full"
        >
          Clear All Filters
        </Button>
      )}
    </div>
  );

  if (!query) {
    return (
      <div className={cn("min-h-screen flex items-center justify-center", className)}>
        <div className="text-center">
          <Icons.search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Start Your Search</h2>
          <p className="text-muted-foreground mb-6">
            Enter a search term to find your perfect streetwear
          </p>
          <ProfessionalSearchBar variant="inline" />
        </div>
      </div>
    );
  }

  return (
    <div className={cn("min-h-screen bg-background", className)}>
      {/* Search Header */}
      <div className="border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1">
              <ProfessionalSearchBar
                variant="inline"
                placeholder="Search streetwear, brands, collections..."
              />
            </div>
            
            {/* Mobile Filter Button */}
            <Sheet open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="lg:hidden">
                  <Icons.filter className="w-4 h-4 mr-2" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <FilterPanel isMobile={true} />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Results Info and Sort */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {isLoading ? (
                "Searching..."
              ) : (
                `${searchResult.totalElements} results for "${query}"`
              )}
            </div>
            
            <Select value={sortBy} onValueChange={handleSortChange}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Best Match</SelectItem>
                <SelectItem value="price">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Desktop Filters Sidebar */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <h2 className="font-semibold text-lg mb-4">Filters</h2>
                <FilterPanel />
              </CardContent>
            </Card>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <LoadingSpinner size="lg" />
              </div>
            ) : searchResult.products.length > 0 ? (
              <div className="space-y-6">
                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {searchResult.products.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {searchResult.totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-8">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage === 0}
                      onClick={() => handlePageChange(currentPage - 1)}
                    >
                      <Icons.chevronLeft className="w-4 h-4" />
                      Previous
                    </Button>
                    
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, searchResult.totalPages) }).map((_, i) => {
                        const page = i + Math.max(0, currentPage - 2);
                        if (page >= searchResult.totalPages) return null;
                        
                        return (
                          <Button
                            key={page}
                            variant={page === currentPage ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(page)}
                          >
                            {page + 1}
                          </Button>
                        );
                      })}
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage >= searchResult.totalPages - 1}
                      onClick={() => handlePageChange(currentPage + 1)}
                    >
                      Next
                      <Icons.chevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-20">
                <Icons.searchX className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No results found</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your search or filters to find what you're looking for.
                </p>
                <Button onClick={clearAllFilters} variant="outline">
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
