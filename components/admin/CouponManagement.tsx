'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Trash2, Edit, Plus, Calendar } from 'lucide-react';
import { getAllCoupons, createCoupon, updateCoupon, deleteCoupon, type CouponDto } from '@/lib/api/admin';

interface CouponManagementProps {
  onUpdate?: () => void;
}

export function CouponManagement({ onUpdate }: CouponManagementProps) {
  const [coupons, setCoupons] = useState<CouponDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<CouponDto | null>(null);
  const [formData, setFormData] = useState<Partial<CouponDto> & { startDateStr: string; endDateStr: string }>({
    code: '',
    description: '',
    discountType: 'PERCENTAGE',
    discountValue: 0,
    minimumPurchaseAmount: 0,
    usageLimit: undefined,
    currentUsage: 0,
    active: true,
    startDateStr: '',
    endDateStr: ''
  });

  useEffect(() => {
    loadCoupons();
  }, []);

  const loadCoupons = async () => {
    try {
      setLoading(true);
      const response = await getAllCoupons();
      setCoupons(response.content);
    } catch (error) {
      console.error('Error loading coupons:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      const couponData = {
        ...formData,
        startDate: formData.startDateStr ? new Date(formData.startDateStr).toISOString() : new Date().toISOString(),
        endDate: formData.endDateStr ? new Date(formData.endDateStr).toISOString() : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      } as CouponDto;

      // Remove the temporary date strings
      delete (couponData as any).startDateStr;
      delete (couponData as any).endDateStr;

      if (editingCoupon) {
        await updateCoupon(editingCoupon.id!, couponData);
      } else {
        await createCoupon(couponData);
      }

      await loadCoupons();
      resetForm();
      onUpdate?.();
    } catch (error) {
      console.error('Error saving coupon:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (couponId: string) => {
    if (confirm('Are you sure you want to delete this coupon?')) {
      try {
        setLoading(true);
        await deleteCoupon(couponId);
        await loadCoupons();
        onUpdate?.();
      } catch (error) {
        console.error('Error deleting coupon:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      code: '',
      description: '',
      discountType: 'PERCENTAGE',
      discountValue: 0,
      minimumPurchaseAmount: 0,
      usageLimit: undefined,
      currentUsage: 0,
      active: true,
      startDateStr: '',
      endDateStr: ''
    });
    setEditingCoupon(null);
    setIsCreateOpen(false);
  };

  const openEdit = (coupon: CouponDto) => {
    setEditingCoupon(coupon);
    setFormData({
      ...coupon,
      startDateStr: coupon.startDate ? new Date(coupon.startDate).toISOString().split('T')[0] : '',
      endDateStr: coupon.endDate ? new Date(coupon.endDate).toISOString().split('T')[0] : ''
    });
    setIsCreateOpen(true);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No expiry';
    return new Date(dateString).toLocaleDateString();
  };

  const isExpired = (endDate?: string) => {
    if (!endDate) return false;
    return new Date(endDate) < new Date();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Manage Coupons</h3>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="w-4 h-4 mr-2" />
              Add Coupon
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="code">Coupon Code</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="SAVE10"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="10% off on all items"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="discountType">Discount Type</Label>
                  <Select 
                    value={formData.discountType} 
                    onValueChange={(value) => setFormData({ ...formData, discountType: value as 'PERCENTAGE' | 'FIXED_AMOUNT' })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PERCENTAGE">Percentage (%)</SelectItem>
                      <SelectItem value="FIXED_AMOUNT">Fixed Amount (₹)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="discountValue">Discount Value</Label>
                  <Input
                    id="discountValue"
                    type="number"
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: Number(e.target.value) })}
                    placeholder={formData.discountType === 'PERCENTAGE' ? '10' : '100'}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="minimumPurchase">Minimum Purchase Amount (₹)</Label>
                <Input
                  id="minimumPurchase"
                  type="number"
                  value={formData.minimumPurchaseAmount}
                  onChange={(e) => setFormData({ ...formData, minimumPurchaseAmount: Number(e.target.value) })}
                  placeholder="500"
                />
              </div>

              <div>
                <Label htmlFor="usageLimit">Usage Limit (Optional)</Label>
                <Input
                  id="usageLimit"
                  type="number"
                  value={formData.usageLimit || ''}
                  onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value ? Number(e.target.value) : undefined })}
                  placeholder="100"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDateStr">Valid From</Label>
                  <Input
                    id="startDateStr"
                    type="date"
                    value={formData.startDateStr}
                    onChange={(e) => setFormData({ ...formData, startDateStr: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="endDateStr">Valid Until</Label>
                  <Input
                    id="endDateStr"
                    type="date"
                    value={formData.endDateStr}
                    onChange={(e) => setFormData({ ...formData, endDateStr: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="active"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="rounded border border-gray-300"
                />
                <Label htmlFor="active">Active</Label>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button onClick={handleSubmit} disabled={loading}>
                  {loading ? 'Saving...' : editingCoupon ? 'Update' : 'Create'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading && !isCreateOpen ? (
        <div className="text-center py-8">Loading coupons...</div>
      ) : (
        <div className="grid gap-4">
          {coupons.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground">No coupons found. Create your first coupon!</p>
              </CardContent>
            </Card>
          ) : (
            coupons.map((coupon) => (
              <Card key={coupon.id} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{coupon.code}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {coupon.description}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {!coupon.active && <Badge variant="secondary">Inactive</Badge>}
                      {isExpired(coupon.endDate) && <Badge variant="destructive">Expired</Badge>}
                      {coupon.active && !isExpired(coupon.endDate) && <Badge variant="default">Active</Badge>}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Discount:</span> 
                        {coupon.discountType === 'PERCENTAGE' 
                          ? ` ${coupon.discountValue}%` 
                          : ` ₹${coupon.discountValue}`
                        }
                      </div>
                      <div>
                        <span className="font-medium">Min. Purchase:</span> ₹{coupon.minimumPurchaseAmount}
                      </div>
                      <div>
                        <span className="font-medium">Usage:</span> 
                        {coupon.usageLimit 
                          ? ` ${coupon.currentUsage || 0}/${coupon.usageLimit}` 
                          : ` ${coupon.currentUsage || 0} (unlimited)`
                        }
                      </div>
                      <div>
                        <span className="font-medium">Expires:</span> {formatDate(coupon.endDate)}
                      </div>
                    </div>
                    
                    <div className="flex justify-end space-x-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEdit(coupon)}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(coupon.id!)}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}