'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Icons } from '@/components/ui/icons';
import { InfiniteProductGrid, ProductGridSkeleton } from '@/components/products/infinite-product-grid';
import { 
  getProducts, 
  searchProducts, 
  filterProducts, 
  getCategories,
  getProductsByCategory 
} from '@/lib/api/products';
import type { Product, ProductFilter } from '@/lib/api/products';
import { useCart } from '@/hooks/use-cart';
import { useWishlist } from '@/hooks/use-wishlist';
import { useToast } from '@/hooks/use-toast';
import { useInfiniteScroll } from '@/hooks/use-infinite-scroll';
import { debounce } from '@/lib/api-client';

export function EnhancedShopContentInfinite() {
  const [categories, setCategories] = useState<string[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [currentFilters, setCurrentFilters] = useState<ProductFilter>({});

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [onSaleOnly, setOnSaleOnly] = useState(false);
  const [newArrivals, setNewArrivals] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'createdAt' | 'popularity'>('popularity');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const router = useRouter();
  const searchParams = useSearchParams();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { toast } = useToast();

  // Create fetch function for infinite scroll
  const createFetchFunction = useCallback(() => {
    return async (page: number, size: number) => {
      try {
        let result;
        
        if (searchQuery.trim()) {
          result = await searchProducts(searchQuery, page, size);
        } else if (Object.keys(currentFilters).length > 0) {
          result = await filterProducts({ ...currentFilters, page, size });
        } else {
          result = await getProducts(page, size, sortBy, sortDirection);
        }

        // Transform the API response to match infinite scroll hook expectations
        return {
          content: result.products || [],
          totalPages: result.totalPages || 0,
          totalElements: result.totalElements || 0,
          number: result.currentPage || page,
          size: result.size || size,
        };
      } catch (error) {
        console.error('Failed to fetch products:', error);
        // Return empty result to prevent crashes
        return {
          content: [],
          totalPages: 0,
          totalElements: 0,
          number: page,
          size: size,
        };
      }
    };
  }, [searchQuery, currentFilters, sortBy, sortDirection]);

  // Infinite scroll hook
  const {
    data: products,
    loading,
    hasMore,
    error,
    loadMore,
    refresh,
  } = useInfiniteScroll(createFetchFunction(), {
    threshold: 100,
    enabled: true,
  });

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (query: string) => {
      if (query.trim()) {
        refresh(); // This will trigger the infinite scroll to reload with new search
      } else {
        refresh();
      }
    }, 300),
    [refresh]
  );

  const loadCategories = async () => {
    try {
      const categoriesData = await getCategories();
      setCategories(categoriesData);
    } catch (error) {
      console.error('Failed to load categories:', error);
      setCategories(['T-Shirts', 'Hoodies', 'Jackets', 'Pants', 'Accessories']);
    }
  };

  const applyFilters = async () => {
    const filters: ProductFilter = {
      keyword: searchQuery.trim() || undefined,
      categories: selectedCategories.length > 0 ? selectedCategories : undefined,
      minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
      maxPrice: priceRange[1] < 500 ? priceRange[1] : undefined,
      inStock: inStockOnly || undefined,
    };

    setCurrentFilters(filters);
    refresh(); // This will reload with new filters
  };

  // Filter options
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
  const colors = ['Black', 'White', 'Gray', 'Navy', 'Red', 'Green', 'Blue', 'Brown'];
  const brands = ['THE BLACKEGE', 'Urban Elite', 'Street Culture', 'Night Vision', 'Shadow Series'];

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategories([]);
    setSelectedSizes([]);
    setSelectedColors([]);
    setSelectedBrands([]);
    setPriceRange([0, 500]);
    setInStockOnly(false);
    setOnSaleOnly(false);
    setNewArrivals(false);
    setCurrentFilters({});
    refresh();
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

  // Load initial data
  useEffect(() => {
    const initializeData = async () => {
      setIsInitialLoading(true);
      await loadCategories();
      setIsInitialLoading(false);
    };
    
    initializeData();
  }, []);

  // Search is now handled through the auto-applying filters effect

  // Handle URL params
  useEffect(() => {
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    
    if (category) {
      setSelectedCategories([category]);
    }
    if (search) {
      setSearchQuery(search);
    }
  }, [searchParams]);

  // Auto-apply filters when filter values change
  useEffect(() => {
    const filters: ProductFilter = {
      keyword: searchQuery.trim() || undefined,
      categories: selectedCategories.length > 0 ? selectedCategories : undefined,
      minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
      maxPrice: priceRange[1] < 500 ? priceRange[1] : undefined,
      inStock: inStockOnly || undefined,
    };

    setCurrentFilters(filters);
    // Refresh the data when filters change
    refresh();
  }, [selectedCategories, priceRange, inStockOnly, refresh]);

  if (isInitialLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <div className="h-8 bg-gray-200 rounded w-48 mb-2 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-64 animate-pulse" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardContent className="p-6 space-y-6">
                <div className="h-6 bg-gray-200 rounded animate-pulse" />
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-4 bg-gray-200 rounded animate-pulse" />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-3">
            <ProductGridSkeleton count={12} gridCols="4" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Shop</h1>
        <p className="text-gray-600">Discover our premium streetwear collection</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-lg">Filters</h2>
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Clear All
                </Button>
              </div>

              {/* Search */}
              <div className="space-y-2">
                <Label>Search</Label>
                <div className="relative">
                  <Icons.search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Categories */}
              <div className="space-y-3">
                <Label className="font-medium">Categories</Label>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {categories.length > 0 ? categories.map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox
                        id={category}
                        checked={selectedCategories.includes(category)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedCategories([...selectedCategories, category]);
                          } else {
                            setSelectedCategories(selectedCategories.filter(c => c !== category));
                          }
                        }}
                      />
                      <Label htmlFor={category} className="text-sm cursor-pointer">
                        {category}
                      </Label>
                    </div>
                  )) : (
                    <p className="text-xs text-muted-foreground">No categories available</p>
                  )}
                </div>
              </div>

              {/* Brands */}
              <div className="space-y-3">
                <Label className="font-medium">Brands</Label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {brands.map((brand) => (
                    <div key={brand} className="flex items-center space-x-2">
                      <Checkbox
                        id={brand}
                        checked={selectedBrands.includes(brand)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedBrands([...selectedBrands, brand]);
                          } else {
                            setSelectedBrands(selectedBrands.filter(b => b !== brand));
                          }
                        }}
                      />
                      <Label htmlFor={brand} className="text-sm cursor-pointer">
                        {brand}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sizes */}
              <div className="space-y-3">
                <Label className="font-medium">Sizes</Label>
                <div className="grid grid-cols-4 gap-2">
                  {sizes.map((size) => (
                    <Button
                      key={size}
                      variant={selectedSizes.includes(size) ? "default" : "outline"}
                      size="sm"
                      className="h-8 text-xs"
                      onClick={() => {
                        if (selectedSizes.includes(size)) {
                          setSelectedSizes(selectedSizes.filter(s => s !== size));
                        } else {
                          setSelectedSizes([...selectedSizes, size]);
                        }
                      }}
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Colors */}
              <div className="space-y-3">
                <Label className="font-medium">Colors</Label>
                <div className="grid grid-cols-4 gap-2">
                  {colors.map((color) => (
                    <Button
                      key={color}
                      variant={selectedColors.includes(color) ? "default" : "outline"}
                      size="sm"
                      className="h-8 text-xs"
                      onClick={() => {
                        if (selectedColors.includes(color)) {
                          setSelectedColors(selectedColors.filter(c => c !== color));
                        } else {
                          setSelectedColors([...selectedColors, color]);
                        }
                      }}
                    >
                      {color}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="space-y-3">
                <Label className="font-medium">Price Range</Label>
                <div className="px-2">
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={500}
                    min={0}
                    step={10}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground mt-2">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>
              </div>

              {/* Filter Options */}
              <div className="space-y-3">
                <Label className="font-medium">Options</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="inStock"
                      checked={inStockOnly}
                      onCheckedChange={(checked) => setInStockOnly(checked as boolean)}
                    />
                    <Label htmlFor="inStock" className="text-sm cursor-pointer">
                      In stock only
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="onSale"
                      checked={onSaleOnly}
                      onCheckedChange={(checked) => setOnSaleOnly(checked as boolean)}
                    />
                    <Label htmlFor="onSale" className="text-sm cursor-pointer">
                      On sale
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="newArrivals"
                      checked={newArrivals}
                      onCheckedChange={(checked) => setNewArrivals(checked as boolean)}
                    />
                    <Label htmlFor="newArrivals" className="text-sm cursor-pointer">
                      New arrivals
                    </Label>
                  </div>
                </div>
              </div>

              <Button onClick={applyFilters} className="w-full">
                Apply Filters
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Products Grid */}
        <div className="lg:col-span-3">
          {/* Sort and Results Info */}
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600">
              {products.length} products loaded
              {hasMore && ' (scroll for more)'}
            </p>
            <div className="flex items-center space-x-4">
              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popularity">Most Popular</SelectItem>
                  <SelectItem value="createdAt">Newest First</SelectItem>
                  <SelectItem value="price">Price</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
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

          {/* Infinite Product Grid */}
          <InfiniteProductGrid
            products={products}
            loading={loading}
            hasMore={hasMore}
            error={error}
            onLoadMore={loadMore}
            onRefresh={refresh}
            gridCols="4"
            showLoadMoreButton={false} // Auto-load on scroll
          />
        </div>
      </div>
    </div>
  );
}
