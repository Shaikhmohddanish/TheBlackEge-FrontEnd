'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Search, MoreHorizontal, Eye, EyeOff, ArrowUpDown, Filter } from 'lucide-react';
import { CategoryImageUpload } from '@/components/admin/category-image-upload';
import { 
  Category, 
  CategoryFormData,
  CategoriesResponse,
  getAdminCategories,
  getCategoryHierarchy,
  createCategory,
  updateCategory,
  deleteCategory,
  toggleCategoryStatus,
  bulkDeleteCategories,
  searchCategories,
  validateCategoryData
} from '@/lib/api/admin-categories';

interface CategoryManagementProps {
  className?: string;
}

const CategoryManagement: React.FC<CategoryManagementProps> = ({ className }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [hierarchy, setHierarchy] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize] = useState(10);
  const [sortBy, setSortBy] = useState('sortOrder');
  const [sortDir, setSortDir] = useState('asc');

  // Form state
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    description: '',
    parentId: '',
    isActive: true,
    sortOrder: 0,
    seoTitle: '',
    seoDescription: ''
  });
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  
  // Image upload state
  const [categoryImageUrls, setCategoryImageUrls] = useState<Record<string, string>>({});

  // Load categories
  const loadCategories = async () => {
    try {
      setLoading(true);
      const response = await getAdminCategories(currentPage, pageSize, sortBy, sortDir);
      setCategories(response.categories);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
    } catch (error) {
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  // Load category hierarchy for parent selection
  const loadHierarchy = async () => {
    try {
      const hierarchyData = await getCategoryHierarchy();
      setHierarchy(hierarchyData);
    } catch (error) {
      toast.error('Failed to load category hierarchy');
    }
  };

  // Search categories
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadCategories();
      return;
    }

    try {
      setLoading(true);
      const response = await searchCategories(searchQuery, currentPage, pageSize);
      setCategories(response.categories);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
    } catch (error) {
      toast.error('Search failed');
    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      parentId: '',
      isActive: true,
      sortOrder: 0,
      seoTitle: '',
      seoDescription: ''
    });
    setFormErrors([]);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors = validateCategoryData(formData);
    if (errors.length > 0) {
      setFormErrors(errors);
      return;
    }

    setSubmitting(true);
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, formData);
        toast.success('Category updated successfully');
        setShowEditDialog(false);
      } else {
        await createCategory(formData);
        toast.success('Category created successfully');
        setShowAddDialog(false);
      }
      
      resetForm();
      setEditingCategory(null);
      loadCategories();
      loadHierarchy();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save category');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle edit
  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      parentId: category.parentId || '',
      isActive: category.isActive,
      sortOrder: category.sortOrder || 0,
      seoTitle: category.seoTitle || '',
      seoDescription: category.seoDescription || ''
    });
    
    // Store the current image URL for the image upload component
    setCategoryImageUrls(prev => ({
      ...prev,
      [category.id]: category.imageUrl || ''
    }));
    
    setShowEditDialog(true);
  };

  // Handle delete
  const handleDelete = async () => {
    if (!deletingCategory) return;

    try {
      await deleteCategory(deletingCategory.id);
      toast.success('Category deleted successfully');
      setShowDeleteDialog(false);
      setDeletingCategory(null);
      loadCategories();
      loadHierarchy();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete category');
    }
  };

  // Handle bulk delete
  const handleBulkDelete = async () => {
    if (selectedCategories.length === 0) return;

    try {
      await bulkDeleteCategories(selectedCategories);
      toast.success(`${selectedCategories.length} categories deleted successfully`);
      setSelectedCategories([]);
      loadCategories();
      loadHierarchy();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete categories');
    }
  };

  // Toggle category status
  const handleToggleStatus = async (category: Category) => {
    try {
      await toggleCategoryStatus(category.id, !category.isActive);
      toast.success(`Category ${!category.isActive ? 'activated' : 'deactivated'} successfully`);
      loadCategories();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update category status');
    }
  };

  // Handle sort
  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDir('asc');
    }
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle select all
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCategories(categories.map(cat => cat.id));
    } else {
      setSelectedCategories([]);
    }
  };

  // Flatten hierarchy for parent selection
  const flattenHierarchy = (cats: Category[], prefix = ''): { id: string; name: string }[] => {
    const result: { id: string; name: string }[] = [];
    
    cats.forEach(cat => {
      result.push({ id: cat.id, name: prefix + cat.name });
      if (cat.children && cat.children.length > 0) {
        result.push(...flattenHierarchy(cat.children, prefix + cat.name + ' > '));
      }
    });
    
    return result;
  };

  useEffect(() => {
    loadCategories();
    loadHierarchy();
  }, [currentPage, sortBy, sortDir]);

  const flatParents = flattenHierarchy(hierarchy);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Category Management</h2>
          <p className="text-muted-foreground">
            Manage product categories and their hierarchy
          </p>
        </div>
        <Button 
          onClick={() => setShowAddDialog(true)}
          className="bg-white text-black border-2 border-white hover:bg-black hover:text-white transition-all"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="border-white border-2 bg-black text-white">
        <CardContent className="pt-6">
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10 border-white border-2 bg-black text-white"
                />
              </div>
            </div>
            <Button 
              onClick={handleSearch}
              variant="outline"
              className="border-white border-2 text-white hover:bg-white hover:text-black"
            >
              Search
            </Button>
            {selectedCategories.length > 0 && (
              <Button 
                onClick={handleBulkDelete}
                variant="destructive"
                className="border-white border-2"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Selected ({selectedCategories.length})
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Categories Table */}
      <Card className="border-white border-2 bg-black text-white">
        <CardHeader>
          <CardTitle>Categories ({totalElements})</CardTitle>
          <CardDescription>
            Manage your product categories and their organization
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading categories...</div>
          ) : categories.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400">
                <h3 className="text-lg font-medium text-white mb-2">No Categories Found</h3>
                <p>Start by creating your first product category.</p>
                <Button 
                  onClick={() => setShowAddDialog(true)}
                  className="mt-4 bg-white text-black border-2 border-white hover:bg-black hover:text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Category
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedCategories.length === categories.length}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-800"
                      onClick={() => handleSort('name')}
                    >
                      Name <ArrowUpDown className="h-4 w-4 inline ml-1" />
                    </TableHead>
                    <TableHead>Parent</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Products</TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-800"
                      onClick={() => handleSort('sortOrder')}
                    >
                      Order <ArrowUpDown className="h-4 w-4 inline ml-1" />
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-800"
                      onClick={() => handleSort('updatedAt')}
                    >
                      Updated <ArrowUpDown className="h-4 w-4 inline ml-1" />
                    </TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedCategories.includes(category.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedCategories([...selectedCategories, category.id]);
                            } else {
                              setSelectedCategories(selectedCategories.filter(id => id !== category.id));
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{category.name}</TableCell>
                      <TableCell>{category.parentName || '-'}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={category.isActive ? 'default' : 'secondary'}
                          className={category.isActive ? 'bg-green-600' : 'bg-gray-600'}
                        >
                          {category.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>{category.productCount || 0}</TableCell>
                      <TableCell>{category.sortOrder || 0}</TableCell>
                      <TableCell>{new Date(category.updatedAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-black border-white text-white">
                            <DropdownMenuItem onClick={() => handleEdit(category)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleToggleStatus(category)}>
                              {category.isActive ? (
                                <><EyeOff className="h-4 w-4 mr-2" />Deactivate</>
                              ) : (
                                <><Eye className="h-4 w-4 mr-2" />Activate</>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => {
                                setDeletingCategory(category);
                                setShowDeleteDialog(true);
                              }}
                              className="text-red-400 hover:text-red-300"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-400">
                    Showing {currentPage * pageSize + 1} to {Math.min((currentPage + 1) * pageSize, totalElements)} of {totalElements} categories
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 0}
                      className="border-white text-white hover:bg-white hover:text-black"
                    >
                      Previous
                    </Button>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const page = currentPage < 3 ? i : currentPage - 2 + i;
                      if (page >= totalPages) return null;
                      
                      return (
                        <Button
                          key={page}
                          variant={page === currentPage ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(page)}
                          className={page === currentPage 
                            ? "bg-white text-black" 
                            : "border-white text-white hover:bg-white hover:text-black"
                          }
                        >
                          {page + 1}
                        </Button>
                      );
                    })}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage >= totalPages - 1}
                      className="border-white text-white hover:bg-white hover:text-black"
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Category Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="bg-black text-white border-white border-2 max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
            <DialogDescription>
              Create a new product category with all necessary details
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Category Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="border-white border-2 bg-black text-white"
                  placeholder="Enter category name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="parent">Parent Category</Label>
                <Select 
                  value={formData.parentId || '__root__'} 
                  onValueChange={(value) => setFormData({...formData, parentId: value === '__root__' ? '' : value})}
                >
                  <SelectTrigger className="border-white border-2 bg-black text-white">
                    <SelectValue placeholder="Select parent category" />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-white text-white">
                    <SelectItem value="__root__">No Parent (Root Category)</SelectItem>
                    {flatParents.map((parent) => (
                      <SelectItem key={parent.id} value={parent.id}>
                        {parent.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="border-white border-2 bg-black text-white"
                placeholder="Enter category description"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sortOrder">Sort Order</Label>
                <Input
                  id="sortOrder"
                  type="number"
                  value={formData.sortOrder}
                  onChange={(e) => setFormData({...formData, sortOrder: parseInt(e.target.value) || 0})}
                  className="border-white border-2 bg-black text-white"
                />
              </div>
              <div className="space-y-2">
                <CategoryImageUpload
                  categoryId={undefined} // No ID yet for new category
                  currentImageUrl=""
                  onImageUploaded={() => {
                    // Will be handled after category creation
                  }}
                  onImageDeleted={() => {
                    // Will be handled after category creation
                  }}
                />
                <p className="text-sm text-gray-400">
                  Save the category first, then you can upload an image by editing it.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">SEO Settings</h4>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="seoTitle">SEO Title</Label>
                  <Input
                    id="seoTitle"
                    value={formData.seoTitle}
                    onChange={(e) => setFormData({...formData, seoTitle: e.target.value})}
                    className="border-white border-2 bg-black text-white"
                    placeholder="Enter SEO title (60 chars max)"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="seoDescription">SEO Description</Label>
                  <Textarea
                    id="seoDescription"
                    value={formData.seoDescription}
                    onChange={(e) => setFormData({...formData, seoDescription: e.target.value})}
                    className="border-white border-2 bg-black text-white"
                    placeholder="Enter SEO description (160 chars max)"
                    rows={2}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({...formData, isActive: checked})}
              />
              <Label htmlFor="isActive">Active</Label>
            </div>

            {formErrors.length > 0 && (
              <div className="bg-red-900/20 border border-red-500 rounded p-3">
                <ul className="list-disc list-inside text-sm text-red-400">
                  {formErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex justify-end space-x-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowAddDialog(false)}
                className="border-white text-white hover:bg-white hover:text-black"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={submitting}
                className="bg-white text-black hover:bg-gray-200"
              >
                {submitting ? 'Creating...' : 'Create Category'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Category Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="bg-black text-white border-white border-2 max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>
              Update category information and settings
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Category Name *</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="border-white border-2 bg-black text-white"
                  placeholder="Enter category name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-parent">Parent Category</Label>
                <Select 
                  value={formData.parentId || '__root__'} 
                  onValueChange={(value) => setFormData({...formData, parentId: value === '__root__' ? '' : value})}
                >
                  <SelectTrigger className="border-white border-2 bg-black text-white">
                    <SelectValue placeholder="Select parent category" />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-white text-white">
                    <SelectItem value="__root__">No Parent (Root Category)</SelectItem>
                    {flatParents.filter(p => p.id !== editingCategory?.id).map((parent) => (
                      <SelectItem key={parent.id} value={parent.id}>
                        {parent.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="border-white border-2 bg-black text-white"
                placeholder="Enter category description"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-sortOrder">Sort Order</Label>
                <Input
                  id="edit-sortOrder"
                  type="number"
                  value={formData.sortOrder}
                  onChange={(e) => setFormData({...formData, sortOrder: parseInt(e.target.value) || 0})}
                  className="border-white border-2 bg-black text-white"
                />
              </div>
              <div className="space-y-2">
                <CategoryImageUpload
                  categoryId={editingCategory?.id}
                  currentImageUrl={categoryImageUrls[editingCategory?.id || ''] || editingCategory?.imageUrl || ''}
                  onImageUploaded={(imageUrl) => {
                    // Update the local state with new image URL
                    if (editingCategory) {
                      setCategoryImageUrls(prev => ({
                        ...prev,
                        [editingCategory.id]: imageUrl
                      }));
                      // Refresh categories to get updated data
                      loadCategories();
                    }
                  }}
                  onImageDeleted={() => {
                    // Clear the image URL from local state
                    if (editingCategory) {
                      setCategoryImageUrls(prev => {
                        const newUrls = { ...prev };
                        delete newUrls[editingCategory.id];
                        return newUrls;
                      });
                      // Refresh categories to get updated data
                      loadCategories();
                    }
                  }}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">SEO Settings</h4>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-seoTitle">SEO Title</Label>
                  <Input
                    id="edit-seoTitle"
                    value={formData.seoTitle}
                    onChange={(e) => setFormData({...formData, seoTitle: e.target.value})}
                    className="border-white border-2 bg-black text-white"
                    placeholder="Enter SEO title (60 chars max)"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-seoDescription">SEO Description</Label>
                  <Textarea
                    id="edit-seoDescription"
                    value={formData.seoDescription}
                    onChange={(e) => setFormData({...formData, seoDescription: e.target.value})}
                    className="border-white border-2 bg-black text-white"
                    placeholder="Enter SEO description (160 chars max)"
                    rows={2}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="edit-isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({...formData, isActive: checked})}
              />
              <Label htmlFor="edit-isActive">Active</Label>
            </div>

            {formErrors.length > 0 && (
              <div className="bg-red-900/20 border border-red-500 rounded p-3">
                <ul className="list-disc list-inside text-sm text-red-400">
                  {formErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex justify-end space-x-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowEditDialog(false)}
                className="border-white text-white hover:bg-white hover:text-black"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={submitting}
                className="bg-white text-black hover:bg-gray-200"
              >
                {submitting ? 'Updating...' : 'Update Category'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-black text-white border-white border-2">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deletingCategory?.name}"? This action cannot be undone.
              {deletingCategory?.productCount && deletingCategory.productCount > 0 && (
                <span className="text-yellow-400 block mt-2">
                  Warning: This category has {deletingCategory.productCount} products associated with it.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              onClick={() => setShowDeleteDialog(false)}
              className="border-white text-white hover:bg-white hover:text-black"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete Category
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CategoryManagement;