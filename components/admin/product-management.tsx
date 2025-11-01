'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Icons } from '@/components/ui/icons';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { LoadingSpinner } from '@/components/loading-spinner';
import { ImageUploadManager } from '@/components/admin/image-upload-manager';
import { VariantStockManager } from '@/components/admin/variant-stock-manager';
import { 
  getAdminProducts, 
  searchAdminProducts, 
  createProduct, 
  updateProduct, 
  deleteProduct, 
  toggleProductStatus,
  bulkDeleteProducts,
  bulkUpdateProductStatus,
  validateProductData,
  type AdminProduct, 
  type ProductFormData,
  type ProductsResponse 
} from '@/lib/api/admin-products';
import { getActiveCategories, type Category } from '@/lib/api/admin-categories';
import { formatPrice } from '@/lib/currency-utils';

const defaultCategories = [
  'T-Shirts', 'Hoodies', 'Sweatshirts', 'Jackets', 'Pants', 'Shorts', 
  'Dresses', 'Skirts', 'Accessories', 'Shoes', 'Bags', 'Hats'
];

const defaultSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const defaultColors = [
  'Black', 'White', 'Gray', 'Red', 'Blue', 'Green', 'Yellow', 
  'Purple', 'Pink', 'Orange', 'Brown', 'Navy', 'Beige'
];

export function ProductManagement() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null);
  const [sortBy, setSortBy] = useState('id');
  const [sortDir, setSortDir] = useState('desc');

  // Categories state
  const [availableCategories, setAvailableCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: 0,
    categories: [],
    stockQuantity: 0,
    brand: '',
    colors: [],
    sizes: [],
    sku: '',
    weight: 0,
    dimensions: '',
    material: '',
    careInstructions: '',
    isActive: true,
    isFeatured: false,
    tags: [],
    seoTitle: '',
    seoDescription: '',
    images: [],
    variants: [] // Add variants support
  });

  // Image management state
  const [productImages, setProductImages] = useState<Array<{
    id: string;
    file?: File;
    url: string;
    preview: string;
  }>>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load products on mount and when filters change
  useEffect(() => {
    loadProducts();
    loadCategories();
  }, [currentPage, sortBy, sortDir]);

  const loadCategories = async () => {
    try {
      setLoadingCategories(true);
      const categories = await getActiveCategories();
      setAvailableCategories(categories);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load categories. Please try again.',
        variant: 'destructive',
      });
      setAvailableCategories([]);
    } finally {
      setLoadingCategories(false);
    }
  };

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      const response: ProductsResponse = searchQuery 
        ? await searchAdminProducts(searchQuery, currentPage, pageSize, sortBy, sortDir)
        : await getAdminProducts(currentPage, pageSize, sortBy, sortDir);

      setProducts(response.products);
      setTotalElements(response.totalElements);
      setTotalPages(response.totalPages);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load products. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    setCurrentPage(0);
    await loadProducts();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      categories: [],
      stockQuantity: 0,
      brand: '',
      colors: [],
      sizes: [],
      sku: '',
      weight: 0,
      dimensions: '',
      material: '',
      careInstructions: '',
      isActive: true,
      isFeatured: false,
      tags: [],
      seoTitle: '',
      seoDescription: '',
      images: [],
      variants: [] // Add variants support
    });
    setProductImages([]);
  };

  const handleCreateProduct = async () => {
    const errors = validateProductData(formData);
    if (errors.length > 0) {
      toast({
        title: 'Validation Error',
        description: errors.join(', '),
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsSubmitting(true);
      await createProduct(formData);
      toast({
        title: 'Success',
        description: 'Product created successfully.',
      });
      setIsCreateDialogOpen(false);
      resetForm();
      await loadProducts();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create product. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditProduct = (product: AdminProduct) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      categories: product.categories || [],
      stockQuantity: product.stockQuantity,
      brand: product.brand || '',
      colors: product.colors || [],
      sizes: product.sizes || [],
      sku: product.sku,
      weight: product.weight || 0,
      dimensions: product.dimensions || '',
      material: product.material || '',
      careInstructions: product.careInstructions || '',
      isActive: product.isActive,
      isFeatured: product.isFeatured || false,
      tags: product.tags || [],
      seoTitle: product.seoTitle || '',
      seoDescription: product.seoDescription || '',
      images: product.images || [],
      variants: product.variants || [] // Add variants support
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateProduct = async () => {
    if (!editingProduct) return;

    const errors = validateProductData(formData);
    if (errors.length > 0) {
      toast({
        title: 'Validation Error',
        description: errors.join(', '),
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsSubmitting(true);
      await updateProduct(editingProduct.id, formData);
      toast({
        title: 'Success',
        description: 'Product updated successfully.',
      });
      setIsEditDialogOpen(false);
      setEditingProduct(null);
      resetForm();
      await loadProducts();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update product. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await deleteProduct(id);
      toast({
        title: 'Success',
        description: 'Product deleted successfully.',
      });
      await loadProducts();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete product. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleToggleStatus = async (id: string, isActive: boolean) => {
    try {
      await toggleProductStatus(id, !isActive);
      toast({
        title: 'Success',
        description: `Product ${!isActive ? 'activated' : 'deactivated'} successfully.`,
      });
      await loadProducts();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update product status. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleBulkDelete = async () => {
    if (selectedProducts.length === 0) return;

    try {
      await bulkDeleteProducts(selectedProducts);
      toast({
        title: 'Success',
        description: `${selectedProducts.length} products deleted successfully.`,
      });
      setSelectedProducts([]);
      await loadProducts();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete products. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleBulkStatusUpdate = async (isActive: boolean) => {
    if (selectedProducts.length === 0) return;

    try {
      await bulkUpdateProductStatus(selectedProducts, isActive);
      toast({
        title: 'Success',
        description: `${selectedProducts.length} products ${isActive ? 'activated' : 'deactivated'} successfully.`,
      });
      setSelectedProducts([]);
      await loadProducts();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update product status. Please try again.',
        variant: 'destructive',
      });
    }
  };

    const handleSelectProduct = (productId: string) => {
    setSelectedProducts(prev => 
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products.map(p => p.id));
    }
  };

  const handleArrayInput = (field: keyof Pick<ProductFormData, 'categories' | 'colors' | 'sizes' | 'tags'>, value: string) => {
    const items = value.split(',').map(item => item.trim()).filter(Boolean);
    setFormData(prev => ({ ...prev, [field]: items }));
  };

  // Product form component
  const ProductForm = ({ isEdit = false }: { isEdit?: boolean }) => (
    <div className="space-y-6 max-h-[70vh] overflow-y-auto bg-black/90 p-6 rounded-lg">
      {/* Product Images Section */}
      <div className="space-y-4">
        <ImageUploadManager
          images={productImages}
          onImagesChange={(images) => {
            setProductImages(images);
            // Update form data with image URLs
            setFormData(prev => ({
              ...prev,
              images: images.map(img => img.url || img.preview)
            }));
          }}
          maxImages={8}
        />
      </div>

      <Separator className="bg-white/20" />

      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Basic Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-white">Product Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter product name"
              required
              className="border-white/30 bg-black/50 text-white placeholder:text-gray-400 focus:border-white/70"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sku" className="text-white">SKU *</Label>
            <Input
              id="sku"
              value={formData.sku}
              onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
              placeholder="Enter SKU"
              required
              className="border-white/30 bg-black/50 text-white placeholder:text-gray-400 focus:border-white/70"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="text-white">Description *</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Enter product description"
            rows={4}
            required
            className="border-white/30 bg-black/50 text-white placeholder:text-gray-400 focus:border-white/70"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="price" className="text-white">Price *</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
              placeholder="0.00"
              required
              className="border-white/30 bg-black/50 text-white placeholder:text-gray-400 focus:border-white/70"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="stockQuantity" className="text-white">
              Base Stock Quantity *
              <span className="text-xs text-gray-400 ml-2">
                (Used when no variants are defined)
              </span>
            </Label>
            <Input
              id="stockQuantity"
              type="number"
              min="0"
              value={formData.stockQuantity}
              onChange={(e) => setFormData(prev => ({ ...prev, stockQuantity: parseInt(e.target.value) || 0 }))}
              placeholder="0"
              required={!formData.variants || formData.variants.length === 0}
              disabled={formData.variants && formData.variants.length > 0}
              className="border-white/30 bg-black/50 text-white placeholder:text-gray-400 focus:border-white/70 disabled:opacity-50"
            />
            {formData.variants && formData.variants.length > 0 && (
              <p className="text-xs text-yellow-400">
                Stock is managed by variants below. Base stock is disabled.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="weight" className="text-white">Weight (kg)</Label>
            <Input
              id="weight"
              type="number"
              step="0.01"
              min="0"
              value={formData.weight}
              onChange={(e) => setFormData(prev => ({ ...prev, weight: parseFloat(e.target.value) || 0 }))}
              placeholder="0.00"
              className="border-white/30 bg-black/50 text-white placeholder:text-gray-400 focus:border-white/70"
            />
          </div>
        </div>
      </div>

      <Separator className="bg-white/20" />

      {/* Categories and Attributes */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Categories & Attributes</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-white">Categories *</Label>
            <div className="space-y-2">
              {loadingCategories ? (
                <div className="flex items-center space-x-2 p-3 border border-white/30 rounded-md">
                  <LoadingSpinner size="sm" />
                  <span className="text-gray-400">Loading categories...</span>
                </div>
              ) : availableCategories.length > 0 ? (
                <div className="max-h-32 overflow-y-auto space-y-1 p-2 border border-white/30 rounded-md bg-black/50">
                  {availableCategories.map((category) => (
                    <div key={category.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`category-${category.id}`}
                        checked={formData.categories.includes(category.name)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFormData(prev => ({
                              ...prev,
                              categories: [...prev.categories, category.name]
                            }));
                          } else {
                            setFormData(prev => ({
                              ...prev,
                              categories: prev.categories.filter(cat => cat !== category.name)
                            }));
                          }
                        }}
                        className="border-white/30 data-[state=checked]:bg-white data-[state=checked]:text-black"
                      />
                      <Label 
                        htmlFor={`category-${category.id}`} 
                        className="text-white text-sm cursor-pointer flex-1"
                      >
                        {category.parentName ? `${category.parentName} > ${category.name}` : category.name}
                      </Label>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-3 border border-white/30 rounded-md bg-black/50">
                  <p className="text-gray-400 text-sm">No categories available. Please create categories first.</p>
                  <Input
                    value={formData.categories.join(', ')}
                    onChange={(e) => handleArrayInput('categories', e.target.value)}
                    placeholder="Enter categories manually (comma-separated)"
                    className="mt-2 border-white/30 bg-black/50 text-white placeholder:text-gray-400 focus:border-white/70"
                  />
                </div>
              )}
              {formData.categories.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {formData.categories.map((category, index) => (
                    <Badge 
                      key={index} 
                      variant="secondary"
                      className="bg-white text-black hover:bg-gray-200 cursor-pointer"
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          categories: prev.categories.filter(cat => cat !== category)
                        }));
                      }}
                    >
                      {category} ×
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="brand" className="text-white">Brand</Label>
            <Input
              id="brand"
              value={formData.brand}
              onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
              placeholder="Enter brand name"
              className="border-white/30 bg-black/50 text-white placeholder:text-gray-400 focus:border-white/70"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="colors" className="text-white">Colors (comma-separated)</Label>
            <Input
              id="colors"
              value={formData.colors?.join(', ') || ''}
              onChange={(e) => handleArrayInput('colors', e.target.value)}
              placeholder="Black, White, Red"
              className="border-white/30 bg-black/50 text-white placeholder:text-gray-400 focus:border-white/70"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sizes" className="text-white">Sizes (comma-separated)</Label>
            <Input
              id="sizes"
              value={formData.sizes?.join(', ') || ''}
              onChange={(e) => handleArrayInput('sizes', e.target.value)}
              placeholder="S, M, L, XL"
              className="border-white/30 bg-black/50 text-white placeholder:text-gray-400 focus:border-white/70"
            />
          </div>
        </div>
      </div>

      <Separator className="bg-white/20" />

      {/* Product Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Product Details</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="material" className="text-white">Material</Label>
            <Input
              id="material"
              value={formData.material}
              onChange={(e) => setFormData(prev => ({ ...prev, material: e.target.value }))}
              placeholder="Cotton, Polyester, etc."
              className="border-white/30 bg-black/50 text-white placeholder:text-gray-400 focus:border-white/70"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dimensions" className="text-white">Dimensions</Label>
            <Input
              id="dimensions"
              value={formData.dimensions}
              onChange={(e) => setFormData(prev => ({ ...prev, dimensions: e.target.value }))}
              placeholder="Length x Width x Height"
              className="border-white/30 bg-black/50 text-white placeholder:text-gray-400 focus:border-white/70"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="careInstructions" className="text-white">Care Instructions</Label>
          <Textarea
            id="careInstructions"
            value={formData.careInstructions}
            onChange={(e) => setFormData(prev => ({ ...prev, careInstructions: e.target.value }))}
            placeholder="Machine wash cold, tumble dry low..."
            rows={2}
          />
        </div>
      </div>

      <Separator className="bg-white/20" />

      {/* Stock Management & Variants */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Stock Management & Variants</h3>
        
        <VariantStockManager
          variants={formData.variants || []}
          onVariantsChange={(variants) => {
            setFormData(prev => ({
              ...prev,
              variants,
              // Auto-calculate total stock from variants
              stockQuantity: variants.reduce((total, variant) => {
                if (variant.isUnlimitedStock) return total + 999999;
                return total + (variant.stockQuantity || 0);
              }, 0),
              // Update sizes and colors based on variants
              sizes: Array.from(new Set(variants.map(v => v.size))).filter(Boolean),
              colors: Array.from(new Set(variants.map(v => v.color))).filter(Boolean)
            }));
          }}
          availableSizes={defaultSizes}
          availableColors={defaultColors}
        />
      </div>

      <Separator className="bg-white/20" />

      {/* SEO & Marketing */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">SEO & Marketing</h3>
        
        <div className="space-y-2">
          <Label htmlFor="tags">Tags (comma-separated)</Label>
          <Input
            id="tags"
            value={formData.tags?.join(', ') || ''}
            onChange={(e) => handleArrayInput('tags', e.target.value)}
            placeholder="summer, casual, trending"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="seoTitle">SEO Title</Label>
            <Input
              id="seoTitle"
              value={formData.seoTitle}
              onChange={(e) => setFormData(prev => ({ ...prev, seoTitle: e.target.value }))}
              placeholder="SEO-friendly title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="seoDescription">SEO Description</Label>
            <Input
              id="seoDescription"
              value={formData.seoDescription}
              onChange={(e) => setFormData(prev => ({ ...prev, seoDescription: e.target.value }))}
              placeholder="SEO meta description"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked as boolean }))}
            />
            <Label htmlFor="isActive">Active</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isFeatured"
              checked={formData.isFeatured}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isFeatured: checked as boolean }))}
            />
            <Label htmlFor="isFeatured">Featured</Label>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Product Management</h2>
          <p className="text-muted-foreground">
            Manage your product catalog, inventory, and product information.
          </p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Icons.plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl bg-black/95 border-white/20 text-white">
            <DialogHeader>
              <DialogTitle className="text-white">Create New Product</DialogTitle>
              <DialogDescription className="text-gray-300">
                Add a new product to your catalog. Fill in all required fields marked with *.
              </DialogDescription>
            </DialogHeader>
            
            <ProductForm />
            
            <div className="flex justify-end space-x-2 pt-4 border-t border-white/20">
              <Button
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
                disabled={isSubmitting}
                className="border-white/30 text-white hover:bg-white/10 hover:border-white/50"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleCreateProduct} 
                disabled={isSubmitting}
                className="bg-white text-black hover:bg-gray-200 border border-white"
              >
                {isSubmitting ? (
                  <>
                    <Icons.spinner className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Product'
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="flex gap-2">
                <Input
                  placeholder="Search products by name, SKU, or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="border-white/30 bg-black/50 text-white placeholder:text-gray-400 focus:border-white/70"
                />
                <Button onClick={handleSearch} variant="outline" className="border-white/30 text-white hover:bg-white/10 hover:border-white/50">
                  <Icons.search className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40 border-white/30 bg-black/50 text-white focus:border-white/70">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="id">Sort by ID</SelectItem>
                  <SelectItem value="name">Sort by Name</SelectItem>
                  <SelectItem value="price">Sort by Price</SelectItem>
                  <SelectItem value="stockQuantity">Sort by Stock</SelectItem>
                  <SelectItem value="createdAt">Sort by Date</SelectItem>
                </SelectContent>
              </Select>
              
              <Button
                variant="outline"
                onClick={() => setSortDir(sortDir === 'asc' ? 'desc' : 'asc')}
              >
                {sortDir === 'asc' ? (
                  <Icons.chevronLeft className="w-4 h-4 rotate-90" />
                ) : (
                  <Icons.chevronRight className="w-4 h-4 rotate-90" />
                )}
              </Button>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedProducts.length > 0 && (
            <div className="flex items-center gap-2 mt-4 p-3 bg-muted rounded-lg">
              <span className="text-sm font-medium">
                {selectedProducts.length} product(s) selected
              </span>
              <div className="flex gap-2 ml-auto">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkStatusUpdate(true)}
                >
                  <Icons.plus className="w-4 h-4 mr-1" />
                  Activate
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkStatusUpdate(false)}
                >
                  <Icons.x className="w-4 h-4 mr-1" />
                  Deactivate
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="sm" variant="destructive">
                      <Icons.trash className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Products</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete {selectedProducts.length} product(s)? 
                        This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleBulkDelete}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <LoadingSpinner size="lg" />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <Icons.shoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No products found</h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery ? 'No products match your search.' : 'Get started by creating your first product.'}
              </p>
              {!searchQuery && (
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => resetForm()}>
                      <Icons.plus className="w-4 h-4 mr-2" />
                      Add Product
                    </Button>
                  </DialogTrigger>
                </Dialog>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b">
                  <tr className="text-left">
                    <th className="p-4">
                      <Checkbox
                        checked={selectedProducts.length === products.length}
                        onCheckedChange={handleSelectAll}
                      />
                    </th>
                    <th className="p-4 font-medium">Product</th>
                    <th className="p-4 font-medium">SKU</th>
                    <th className="p-4 font-medium">Price</th>
                    <th className="p-4 font-medium">Stock</th>
                    <th className="p-4 font-medium">Status</th>
                    <th className="p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b hover:bg-muted/50">
                      <td className="p-4">
                        <Checkbox
                          checked={selectedProducts.includes(product.id)}
                          onCheckedChange={() => handleSelectProduct(product.id)}
                        />
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                            {product.images && product.images.length > 0 ? (
                              <img
                                src={product.images[0]}
                                alt={product.name}
                                className="w-full h-full object-cover rounded-lg"
                              />
                            ) : (
              <Icons.star className="w-6 h-6 text-muted-foreground" />
                            )}
                          </div>
                          <div>
                            <div className="font-medium">{product.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {product.categories.slice(0, 2).join(', ')}
                              {product.categories.length > 2 && '...'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-mono text-sm">{product.sku}</td>
                      <td className="p-4 font-medium">{formatPrice(product.price)}</td>
                      <td className="p-4">
                        <Badge variant={product.stockQuantity > 10 ? 'default' : product.stockQuantity > 0 ? 'secondary' : 'destructive'}>
                          {product.stockQuantity} units
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Badge variant={product.isActive ? 'default' : 'secondary'}>
                            {product.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                          {product.isFeatured && (
                            <Badge variant="outline">Featured</Badge>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditProduct(product)}
                          >
                            <Icons.star className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleToggleStatus(product.id, product.isActive)}
                          >
                            {product.isActive ? (
                              <Icons.x className="w-4 h-4" />
                            ) : (
                              <Icons.plus className="w-4 h-4" />
                            )}
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="sm" variant="destructive">
                                <Icons.trash className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Product</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{product.name}"? 
                                  This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteProduct(product.id)}>
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {currentPage * pageSize + 1} to {Math.min((currentPage + 1) * pageSize, totalElements)} of {totalElements} products
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 0}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              <Icons.chevronLeft className="w-4 h-4" />
              Previous
            </Button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                const page = i + Math.max(0, currentPage - 2);
                if (page >= totalPages) return null;
                
                return (
                  <Button
                    key={page}
                    variant={page === currentPage ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page + 1}
                  </Button>
                );
              })}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages - 1}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
              <Icons.chevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Edit Product Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl bg-black/95 border-white/20 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">Edit Product</DialogTitle>
            <DialogDescription className="text-gray-300">
              Update product information. Fill in all required fields marked with *.
            </DialogDescription>
          </DialogHeader>
          
          <ProductForm isEdit={true} />
          
          <div className="flex justify-end space-x-2 pt-4 border-t border-white/20">
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
              disabled={isSubmitting}
              className="border-white/30 text-white hover:bg-white/10 hover:border-white/50"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleUpdateProduct} 
              disabled={isSubmitting}
              className="bg-white text-black hover:bg-gray-200 border border-white"
            >
              {isSubmitting ? (
                <>
                  <Icons.spinner className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Product'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
