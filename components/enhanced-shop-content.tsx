'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Icons } from '@/components/ui/icons';
import { ProductCard } from '@/components/ui/product-card';
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
import { debounce } from '@/lib/api-client';
export function EnhancedShopContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

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

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (query: string) => {
      if (query.trim()) {
        try {
          setIsLoading(true);
          const results = await searchProducts(query, 0, 12);
          setProducts(results.products);
          setTotalPages(results.totalPages);
          setCurrentPage(results.currentPage);
          setTotalElements(results.totalElements);
        } catch (error) {
          toast({
            title: 'Search failed',
            description: 'Failed to search products. Please try again.',
            variant: 'destructive',
          });
        } finally {
          setIsLoading(false);
        }
      } else {
        loadProducts();
      }
    }, 300),
    []
  );

  const loadProducts = async (page = 0) => {
    try {
      setIsLoading(true);
      const results = await getProducts(page, 12, sortBy, sortDirection);
      setProducts(results.products);
      setTotalPages(results.totalPages);
      setCurrentPage(results.currentPage);
      setTotalElements(results.totalElements);
    } catch (error) {
      // Set empty state for graceful degradation
      setProducts([]);
      setTotalPages(0);
      setCurrentPage(0);
      setTotalElements(0);
      
      // Show user-friendly message only for real connection errors
      if (error instanceof Error && !error.message.includes('404') && !error.message.includes('Network')) {
        toast({
          title: 'Unable to load products',
          description: 'Please try again later or check your connection.',
          variant: 'destructive',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const categoriesData = await getCategories();
      setCategories(categoriesData);
    } catch (error) {
      // Provide fallback categories for better UX
      setCategories(['T-Shirts', 'Hoodies', 'Jackets', 'Pants', 'Accessories']);
    }
  };

  const applyFilters = async () => {
    try {
      setIsLoading(true);
      const filters: ProductFilter = {
        keyword: searchQuery.trim() || undefined,
        categories: selectedCategories.length > 0 ? selectedCategories : undefined,
        minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
        maxPrice: priceRange[1] < 500 ? priceRange[1] : undefined,
        inStock: inStockOnly || undefined,
        page: 0,
        size: 12,
      };

      const results = await filterProducts(filters);
      setProducts(results.products);
      setTotalPages(results.totalPages);
      setCurrentPage(results.currentPage);
      setTotalElements(results.totalElements);
    } catch (error) {
      toast({
        title: 'Filter failed',
        description: 'Failed to apply filters. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
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
    loadProducts();
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



  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (searchQuery.trim()) {
      debouncedSearch(searchQuery);
    } else {
      loadProducts(page);
    }
  };

  // Load initial data
  useEffect(() => {
    loadProducts();
    loadCategories();
  }, [sortBy, sortDirection]);

  // Handle search
  useEffect(() => {
    if (searchQuery.trim()) {
      debouncedSearch(searchQuery);
    }
  }, [searchQuery, debouncedSearch]);

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
              {totalElements} products found
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

          {/* Loading State */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-0">
                    <div className="aspect-square bg-gray-200 rounded-t-lg" />
                    <div className="p-4 space-y-2">
                      <div className="h-4 bg-gray-200 rounded" />
                      <div className="h-4 bg-gray-200 rounded w-2/3" />
                      <div className="h-6 bg-gray-200 rounded w-1/3" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <Icons.shoppingCart className="mx-auto h-16 w-16 text-gray-300 mb-6" />
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {searchQuery || selectedCategories.length > 0 ? 'No products found' : 'Store Coming Soon'}
                </h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {searchQuery || selectedCategories.length > 0 
                    ? 'Try adjusting your search or filter criteria to find what you\'re looking for.' 
                    : 'We\'re currently setting up our amazing streetwear collection. Check back soon for the latest drops and exclusive pieces.'
                  }
                </p>
                <div className="space-y-3">
                  {searchQuery || selectedCategories.length > 0 ? (
                    <Button onClick={clearFilters} size="lg">
                      <Icons.x className="mr-2 h-4 w-4" />
                      Clear Filters
                    </Button>
                  ) : (
                    <div className="space-y-3">
                      <Button size="lg" onClick={() => window.location.reload()}>
                        <Icons.search className="mr-2 h-4 w-4" />
                        Refresh Store
                      </Button>
                      <div className="text-sm text-muted-foreground">
                        <p>In the meantime, check out:</p>
                        <div className="flex justify-center gap-4 mt-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href="/collections">Collections</Link>
                          </Button>
                          <Button variant="outline" size="sm" asChild>
                            <Link href="/about">About Us</Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Products Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={{
                      id: product.id,
                      name: product.name,
                      description: product.description,
                      price: product.price,
                      salePrice: product.salePrice,
                      category: product.category,
                      inventory: product.inventory,
                      images: product.media,
                      sizes: product.sizes,
                      colors: product.colors,
                      tags: product.tags,
                      inStock: product.inventory > 0
                    }}
                    onAddToCart={handleAddToCart}
                    onAddToWishlist={handleWishlistToggle}
                    onBuyNow={handleAddToCart} // Can be customized for direct buy
                    isInWishlist={isInWishlist}
                    showQuickView={true}
                    showBuyNow={true}
                  />
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
                  
                  {[...Array(totalPages)].map((_, i) => (
                    <Button
                      key={i}
                      variant={i === currentPage ? 'default' : 'outline'}
                      onClick={() => handlePageChange(i)}
                      className="w-10 h-10"
                    >
                      {i + 1}
                    </Button>
                  ))}
                  
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
        </div>
      </div>


    </div>
  );
}
