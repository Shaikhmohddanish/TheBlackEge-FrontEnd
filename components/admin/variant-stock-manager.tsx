'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Icons } from '@/components/ui/icons';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface ProductVariant {
  id?: string;
  size: string;
  color: string;
  colorCode?: string;
  stockQuantity: number;
  reservedQuantity?: number;
  availableQuantity?: number;
  lowStockThreshold?: number;
  reorderPoint?: number;
  costPrice?: number;
  additionalPrice?: number;
  weight?: number;
  skuCode?: string;
  isActive?: boolean;
  isUnlimitedStock?: boolean;
  supplierCode?: string;
  barcode?: string;
}

interface VariantStockManagerProps {
  variants: ProductVariant[];
  onVariantsChange: (variants: ProductVariant[]) => void;
  availableSizes?: string[];
  availableColors?: string[];
}

const defaultSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'OS']; // OS = One Size
const defaultColors = [
  { name: 'Black', code: '#000000' },
  { name: 'White', code: '#FFFFFF' },
  { name: 'Gray', code: '#808080' },
  { name: 'Red', code: '#FF0000' },
  { name: 'Blue', code: '#0000FF' },
  { name: 'Green', code: '#008000' },
  { name: 'Yellow', code: '#FFFF00' },
  { name: 'Purple', code: '#800080' },
  { name: 'Pink', code: '#FFC0CB' },
  { name: 'Orange', code: '#FFA500' },
  { name: 'Brown', code: '#A52A2A' },
  { name: 'Navy', code: '#000080' },
  { name: 'Beige', code: '#F5F5DC' }
];

export function VariantStockManager({
  variants,
  onVariantsChange,
  availableSizes = defaultSizes,
  availableColors = defaultColors.map(c => c.name)
}: VariantStockManagerProps) {
  const [isAddVariantOpen, setIsAddVariantOpen] = useState(false);
  const [editingVariant, setEditingVariant] = useState<ProductVariant | null>(null);
  const [isEditVariantOpen, setIsEditVariantOpen] = useState(false);
  const [newVariant, setNewVariant] = useState<ProductVariant>({
    size: '',
    color: '',
    stockQuantity: 0,
    lowStockThreshold: 5,
    reorderPoint: 10,
    additionalPrice: 0,
    isActive: true,
    isUnlimitedStock: false
  });

  const { toast } = useToast();

  const getColorCode = (colorName: string) => {
    const colorInfo = defaultColors.find(c => c.name.toLowerCase() === colorName.toLowerCase());
    return colorInfo?.code || '#000000';
  };

  const getStockStatus = (variant: ProductVariant) => {
    if (variant.isUnlimitedStock) return { status: 'Unlimited', variant: 'default' };
    if (!variant.stockQuantity || variant.stockQuantity === 0) return { status: 'Out of Stock', variant: 'destructive' };
    if (variant.lowStockThreshold && variant.stockQuantity <= variant.lowStockThreshold) {
      return { status: 'Low Stock', variant: 'secondary' };
    }
    return { status: 'In Stock', variant: 'default' };
  };

  const handleAddVariant = () => {
    if (!newVariant.size || !newVariant.color) {
      toast({
        title: 'Validation Error',
        description: 'Size and color are required',
        variant: 'destructive',
      });
      return;
    }

    // Check for duplicate variants
    const isDuplicate = variants.some(
      variant => variant.size === newVariant.size && variant.color === newVariant.color
    );

    if (isDuplicate) {
      toast({
        title: 'Duplicate Variant',
        description: 'A variant with this size and color already exists',
        variant: 'destructive',
      });
      return;
    }

    const variantWithDefaults = {
      ...newVariant,
      id: `temp-${Date.now()}-${Math.random()}`,
      colorCode: getColorCode(newVariant.color),
      availableQuantity: newVariant.isUnlimitedStock ? 999999 : newVariant.stockQuantity,
      skuCode: generateSKU(newVariant.size, newVariant.color)
    };

    onVariantsChange([...variants, variantWithDefaults]);
    
    // Reset form
    setNewVariant({
      size: '',
      color: '',
      stockQuantity: 0,
      lowStockThreshold: 5,
      reorderPoint: 10,
      additionalPrice: 0,
      isActive: true,
      isUnlimitedStock: false
    });
    setIsAddVariantOpen(false);

    toast({
      title: 'Variant Added',
      description: `Added ${variantWithDefaults.size} ${variantWithDefaults.color} variant`,
    });
  };

  const handleEditVariant = (variant: ProductVariant) => {
    setEditingVariant({ ...variant });
    setIsEditVariantOpen(true);
  };

  const handleUpdateVariant = () => {
    if (!editingVariant) return;

    const updatedVariants = variants.map(variant => 
      variant.id === editingVariant.id ? {
        ...editingVariant,
        colorCode: getColorCode(editingVariant.color),
        availableQuantity: editingVariant.isUnlimitedStock ? 999999 : (editingVariant.stockQuantity - (editingVariant.reservedQuantity || 0))
      } : variant
    );

    onVariantsChange(updatedVariants);
    setIsEditVariantOpen(false);
    setEditingVariant(null);

    toast({
      title: 'Variant Updated',
      description: 'Variant has been updated successfully',
    });
  };

  const handleDeleteVariant = (variantId: string) => {
    const updatedVariants = variants.filter(variant => variant.id !== variantId);
    onVariantsChange(updatedVariants);

    toast({
      title: 'Variant Deleted',
      description: 'Variant has been removed',
    });
  };

  const handleBulkUpdateStock = (adjustment: number, reason: string) => {
    const updatedVariants = variants.map(variant => ({
      ...variant,
      stockQuantity: Math.max(0, variant.stockQuantity + adjustment),
      availableQuantity: variant.isUnlimitedStock ? 999999 : Math.max(0, (variant.stockQuantity + adjustment) - (variant.reservedQuantity || 0))
    }));

    onVariantsChange(updatedVariants);

    toast({
      title: 'Bulk Update Complete',
      description: `${reason}: ${adjustment > 0 ? '+' : ''}${adjustment} units`,
    });
  };

  const generateSKU = (size: string, color: string) => {
    const sizeCode = size.substring(0, 2).toUpperCase();
    const colorCode = color.substring(0, 3).toUpperCase();
    return `${sizeCode}-${colorCode}-${Date.now().toString().slice(-4)}`;
  };

  const getTotalStock = () => {
    return variants.reduce((total, variant) => {
      if (variant.isUnlimitedStock) return total + 999999;
      return total + variant.stockQuantity;
    }, 0);
  };

  const getLowStockCount = () => {
    return variants.filter(variant => {
      if (variant.isUnlimitedStock) return false;
      return variant.stockQuantity <= (variant.lowStockThreshold || 5);
    }).length;
  };

  const getOutOfStockCount = () => {
    return variants.filter(variant => !variant.isUnlimitedStock && variant.stockQuantity === 0).length;
  };

  return (
    <div className="space-y-6">
      {/* Stock Overview */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Stock Management</CardTitle>
              <CardDescription>
                Manage inventory for all product variants
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <Dialog open={isAddVariantOpen} onOpenChange={setIsAddVariantOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Icons.plus className="h-4 w-4 mr-2" />
                    Add Variant
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add New Variant</DialogTitle>
                    <DialogDescription>
                      Create a new size and color combination with stock details
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid grid-cols-2 gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="size">Size *</Label>
                      <Select
                        value={newVariant.size}
                        onValueChange={(value) => setNewVariant(prev => ({ ...prev, size: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select size" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableSizes.map(size => (
                            <SelectItem key={size} value={size}>{size}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="color">Color *</Label>
                      <Select
                        value={newVariant.color}
                        onValueChange={(value) => setNewVariant(prev => ({ 
                          ...prev, 
                          color: value, 
                          colorCode: getColorCode(value) 
                        }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select color" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableColors.map(color => (
                            <SelectItem key={color} value={color}>
                              <div className="flex items-center space-x-2">
                                <div 
                                  className="w-4 h-4 rounded-full border"
                                  style={{ backgroundColor: getColorCode(color) }}
                                />
                                <span>{color}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="stockQuantity">Stock Quantity *</Label>
                      <Input
                        id="stockQuantity"
                        type="number"
                        min="0"
                        value={newVariant.stockQuantity}
                        onChange={(e) => setNewVariant(prev => ({ 
                          ...prev, 
                          stockQuantity: parseInt(e.target.value) || 0 
                        }))}
                        disabled={newVariant.isUnlimitedStock}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="additionalPrice">Additional Price</Label>
                      <Input
                        id="additionalPrice"
                        type="number"
                        step="0.01"
                        min="0"
                        value={newVariant.additionalPrice}
                        onChange={(e) => setNewVariant(prev => ({ 
                          ...prev, 
                          additionalPrice: parseFloat(e.target.value) || 0 
                        }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lowStockThreshold">Low Stock Alert</Label>
                      <Input
                        id="lowStockThreshold"
                        type="number"
                        min="0"
                        value={newVariant.lowStockThreshold}
                        onChange={(e) => setNewVariant(prev => ({ 
                          ...prev, 
                          lowStockThreshold: parseInt(e.target.value) || 5 
                        }))}
                        disabled={newVariant.isUnlimitedStock}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="reorderPoint">Reorder Point</Label>
                      <Input
                        id="reorderPoint"
                        type="number"
                        min="0"
                        value={newVariant.reorderPoint}
                        onChange={(e) => setNewVariant(prev => ({ 
                          ...prev, 
                          reorderPoint: parseInt(e.target.value) || 10 
                        }))}
                        disabled={newVariant.isUnlimitedStock}
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="isUnlimitedStock"
                        checked={newVariant.isUnlimitedStock}
                        onCheckedChange={(checked) => setNewVariant(prev => ({ 
                          ...prev, 
                          isUnlimitedStock: checked as boolean,
                          stockQuantity: checked ? 999999 : 0
                        }))}
                      />
                      <Label htmlFor="isUnlimitedStock">Unlimited Stock</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="isActive"
                        checked={newVariant.isActive}
                        onCheckedChange={(checked) => setNewVariant(prev => ({ 
                          ...prev, 
                          isActive: checked as boolean 
                        }))}
                      />
                      <Label htmlFor="isActive">Active</Label>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2 pt-4">
                    <Button variant="outline" onClick={() => setIsAddVariantOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddVariant}>
                      Add Variant
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Stock Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Total Variants</p>
                  <p className="text-2xl font-bold text-blue-900">{variants.length}</p>
                </div>
                <Icons.package className="h-8 w-8 text-blue-600" />
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Total Stock</p>
                  <p className="text-2xl font-bold text-green-900">
                    {getTotalStock() === 999999 ? '∞' : getTotalStock().toLocaleString()}
                  </p>
                </div>
                <Icons.shoppingCart className="h-8 w-8 text-green-600" />
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-600">Low Stock</p>
                  <p className="text-2xl font-bold text-yellow-900">{getLowStockCount()}</p>
                </div>
                <Icons.shield className="h-8 w-8 text-yellow-600" />
              </div>
            </div>

            <div className="bg-red-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-600">Out of Stock</p>
                  <p className="text-2xl font-bold text-red-900">{getOutOfStockCount()}</p>
                </div>
                                  <Icons.x className="h-4 w-4" />
              </div>
            </div>
          </div>

          {/* Variants Table */}
          {variants.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Variant</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {variants.map((variant, index) => {
                  const stockStatus = getStockStatus(variant);
                  return (
                    <TableRow key={variant.id || index}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <div 
                            className="w-4 h-4 rounded-full border"
                            style={{ backgroundColor: variant.colorCode || getColorCode(variant.color) }}
                          />
                          <span className="font-medium">{variant.size}</span>
                          <span className="text-muted-foreground">•</span>
                          <span>{variant.color}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">
                            {variant.isUnlimitedStock ? '∞' : variant.stockQuantity?.toLocaleString()}
                          </div>
                          {variant.reservedQuantity && variant.reservedQuantity > 0 && (
                            <div className="text-xs text-muted-foreground">
                              Reserved: {variant.reservedQuantity}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={stockStatus.variant as any}>
                          {stockStatus.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {variant.additionalPrice && variant.additionalPrice > 0 ? (
                          <span className="text-green-600">+${variant.additionalPrice}</span>
                        ) : (
                          <span className="text-muted-foreground">Base price</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <code className="text-xs bg-muted px-1 py-0.5 rounded">
                          {variant.skuCode || 'Auto-generated'}
                        </code>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditVariant(variant)}
                          >
                            <Icons.edit className="h-3 w-3" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Icons.trash className="h-3 w-3 text-red-500" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Variant</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete the {variant.size} {variant.color} variant?
                                  This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteVariant(variant.id!)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <Icons.package className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No variants</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by adding a size and color variant.
              </p>
              <div className="mt-6">
                <Button onClick={() => setIsAddVariantOpen(true)}>
                  <Icons.plus className="h-4 w-4 mr-2" />
                  Add First Variant
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Variant Dialog */}
      <Dialog open={isEditVariantOpen} onOpenChange={setIsEditVariantOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Variant</DialogTitle>
            <DialogDescription>
              Update variant details and stock information
            </DialogDescription>
          </DialogHeader>
          
          {editingVariant && (
            <>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="editSize">Size</Label>
                  <Select
                    value={editingVariant.size}
                    onValueChange={(value) => setEditingVariant(prev => prev ? ({ ...prev, size: value }) : null)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {availableSizes.map(size => (
                        <SelectItem key={size} value={size}>{size}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="editColor">Color</Label>
                  <Select
                    value={editingVariant.color}
                    onValueChange={(value) => setEditingVariant(prev => prev ? ({ 
                      ...prev, 
                      color: value,
                      colorCode: getColorCode(value)
                    }) : null)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {availableColors.map(color => (
                        <SelectItem key={color} value={color}>
                          <div className="flex items-center space-x-2">
                            <div 
                              className="w-4 h-4 rounded-full border"
                              style={{ backgroundColor: getColorCode(color) }}
                            />
                            <span>{color}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="editStockQuantity">Stock Quantity</Label>
                  <Input
                    id="editStockQuantity"
                    type="number"
                    min="0"
                    value={editingVariant.stockQuantity}
                    onChange={(e) => setEditingVariant(prev => prev ? ({ 
                      ...prev, 
                      stockQuantity: parseInt(e.target.value) || 0 
                    }) : null)}
                    disabled={editingVariant.isUnlimitedStock}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="editAdditionalPrice">Additional Price</Label>
                  <Input
                    id="editAdditionalPrice"
                    type="number"
                    step="0.01"
                    value={editingVariant.additionalPrice}
                    onChange={(e) => setEditingVariant(prev => prev ? ({ 
                      ...prev, 
                      additionalPrice: parseFloat(e.target.value) || 0 
                    }) : null)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="editLowStockThreshold">Low Stock Alert</Label>
                  <Input
                    id="editLowStockThreshold"
                    type="number"
                    min="0"
                    value={editingVariant.lowStockThreshold}
                    onChange={(e) => setEditingVariant(prev => prev ? ({ 
                      ...prev, 
                      lowStockThreshold: parseInt(e.target.value) || 5 
                    }) : null)}
                    disabled={editingVariant.isUnlimitedStock}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="editReorderPoint">Reorder Point</Label>
                  <Input
                    id="editReorderPoint"
                    type="number"
                    min="0"
                    value={editingVariant.reorderPoint}
                    onChange={(e) => setEditingVariant(prev => prev ? ({ 
                      ...prev, 
                      reorderPoint: parseInt(e.target.value) || 10 
                    }) : null)}
                    disabled={editingVariant.isUnlimitedStock}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="editIsUnlimitedStock"
                    checked={editingVariant.isUnlimitedStock}
                    onCheckedChange={(checked) => setEditingVariant(prev => prev ? ({ 
                      ...prev, 
                      isUnlimitedStock: checked as boolean,
                      stockQuantity: checked ? 999999 : prev.stockQuantity
                    }) : null)}
                  />
                  <Label htmlFor="editIsUnlimitedStock">Unlimited Stock</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="editIsActive"
                    checked={editingVariant.isActive}
                    onCheckedChange={(checked) => setEditingVariant(prev => prev ? ({ 
                      ...prev, 
                      isActive: checked as boolean 
                    }) : null)}
                  />
                  <Label htmlFor="editIsActive">Active</Label>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsEditVariantOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateVariant}>
                  Update Variant
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}