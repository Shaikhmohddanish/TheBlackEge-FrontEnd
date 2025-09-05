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
import { 
  getAdminOrders,
  searchAdminOrders,
  getOrdersByStatus,
  updateOrderStatus,
  getAdminOrderById,
  cancelOrder,
  bulkUpdateOrderStatus,
  getValidStatusTransitions,
  getStatusColor,
  getStatusDisplayName,
  type AdminOrder,
  type OrdersResponse,
  type OrderStatusUpdateRequest,
  OrderStatus
} from '@/lib/api/admin-orders';
import { formatPrice } from '@/lib/currency-utils';

export function OrderManagement() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(20);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'ALL'>('ALL');
  const [selectedOrders, setSelectedOrders] = useState<number[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [isOrderDetailOpen, setIsOrderDetailOpen] = useState(false);
  const [isStatusUpdateOpen, setIsStatusUpdateOpen] = useState(false);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortDir, setSortDir] = useState('desc');

  const { toast } = useToast();

  // Status update form state
  const [statusUpdateForm, setStatusUpdateForm] = useState<{
    orderId: number | null;
    status: OrderStatus;
    notes: string;
  }>({
    orderId: null,
    status: OrderStatus.PENDING,
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load orders on mount and when filters change
  useEffect(() => {
    loadOrders();
  }, [currentPage, sortBy, sortDir, statusFilter]);

  const loadOrders = async () => {
    try {
      setIsLoading(true);
      let response: OrdersResponse;

      if (searchQuery.trim()) {
        response = await searchAdminOrders(searchQuery, currentPage, pageSize);
      } else if (statusFilter !== 'ALL') {
        response = await getOrdersByStatus(statusFilter as OrderStatus, currentPage, pageSize);
      } else {
        response = await getAdminOrders(currentPage, pageSize, sortBy, sortDir);
      }

      setOrders(response.orders);
      setTotalElements(response.totalElements);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Failed to load orders:', error);
      toast({
        title: 'Error',
        description: 'Failed to load orders. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    setCurrentPage(0);
    await loadOrders();
  };

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status as OrderStatus | 'ALL');
    setCurrentPage(0);
  };

  const handleViewOrder = async (orderId: number) => {
    try {
      const order = await getAdminOrderById(orderId);
      setSelectedOrder(order);
      setIsOrderDetailOpen(true);
    } catch (error) {
      console.error('Failed to load order details:', error);
      toast({
        title: 'Error',
        description: 'Failed to load order details.',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateOrderStatus = (order: AdminOrder) => {
    setStatusUpdateForm({
      orderId: order.id,
      status: order.status,
      notes: ''
    });
    setIsStatusUpdateOpen(true);
  };

  const handleSubmitStatusUpdate = async () => {
    if (!statusUpdateForm.orderId) return;

    try {
      setIsSubmitting(true);
      const statusUpdate: OrderStatusUpdateRequest = {
        status: statusUpdateForm.status,
        notes: statusUpdateForm.notes.trim() || undefined
      };

      await updateOrderStatus(statusUpdateForm.orderId, statusUpdate);
      
      toast({
        title: 'Success',
        description: `Order status updated to ${getStatusDisplayName(statusUpdateForm.status)}.`,
      });

      setIsStatusUpdateOpen(false);
      setStatusUpdateForm({ orderId: null, status: OrderStatus.PENDING, notes: '' });
      await loadOrders();
    } catch (error) {
      console.error('Failed to update order status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update order status. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelOrder = async (orderId: number, reason: string) => {
    try {
      await cancelOrder(orderId, reason);
      toast({
        title: 'Success',
        description: 'Order cancelled successfully.',
      });
      await loadOrders();
    } catch (error) {
      console.error('Failed to cancel order:', error);
      toast({
        title: 'Error',
        description: 'Failed to cancel order. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleBulkStatusUpdate = async (status: OrderStatus) => {
    if (selectedOrders.length === 0) return;

    try {
      const statusUpdate: OrderStatusUpdateRequest = { status };
      await bulkUpdateOrderStatus(selectedOrders, statusUpdate);
      
      toast({
        title: 'Success',
        description: `${selectedOrders.length} orders updated to ${getStatusDisplayName(status)}.`,
      });

      setSelectedOrders([]);
      await loadOrders();
    } catch (error) {
      console.error('Failed to bulk update orders:', error);
      toast({
        title: 'Error',
        description: 'Failed to update orders. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleSelectOrder = (orderId: number) => {
    setSelectedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleSelectAll = () => {
    if (selectedOrders.length === orders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(orders.map(order => order.id));
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getOrderTotal = (order: AdminOrder) => {
    return order.items.reduce((total, item) => total + item.totalPrice, 0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Order Management</h2>
          <p className="text-muted-foreground">
            Manage customer orders, update statuses, and track fulfillment.
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-sm">
            {totalElements} total orders
          </Badge>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="flex gap-2">
                <Input
                  placeholder="Search by order number, customer name, or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button onClick={handleSearch} variant="outline">
                  <Icons.search className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Statuses</SelectItem>
                  {Object.values(OrderStatus).map(status => (
                    <SelectItem key={status} value={status}>
                      {getStatusDisplayName(status)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt">Sort by Date</SelectItem>
                  <SelectItem value="orderNumber">Sort by Order #</SelectItem>
                  <SelectItem value="totalAmount">Sort by Amount</SelectItem>
                  <SelectItem value="status">Sort by Status</SelectItem>
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
          {selectedOrders.length > 0 && (
            <div className="flex items-center gap-2 mt-4 p-3 bg-muted rounded-lg">
              <span className="text-sm font-medium">
                {selectedOrders.length} order(s) selected
              </span>
              <div className="flex gap-2 ml-auto">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkStatusUpdate(OrderStatus.CONFIRMED)}
                >
                  Mark Confirmed
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkStatusUpdate(OrderStatus.PROCESSING)}
                >
                  Mark Processing
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkStatusUpdate(OrderStatus.SHIPPED)}
                >
                  Mark Shipped
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <LoadingSpinner size="lg" />
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-20">
              <Icons.shoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No orders found</h3>
              <p className="text-muted-foreground">
                {searchQuery || statusFilter !== 'ALL' 
                  ? 'No orders match your search criteria.' 
                  : 'No orders have been placed yet.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b">
                  <tr className="text-left">
                    <th className="p-4">
                      <Checkbox
                        checked={selectedOrders.length === orders.length}
                        onCheckedChange={handleSelectAll}
                      />
                    </th>
                    <th className="p-4 font-medium">Order</th>
                    <th className="p-4 font-medium">Customer</th>
                    <th className="p-4 font-medium">Amount</th>
                    <th className="p-4 font-medium">Status</th>
                    <th className="p-4 font-medium">Date</th>
                    <th className="p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b hover:bg-muted/50">
                      <td className="p-4">
                        <Checkbox
                          checked={selectedOrders.includes(order.id)}
                          onCheckedChange={() => handleSelectOrder(order.id)}
                        />
                      </td>
                      <td className="p-4">
                        <div>
                          <div className="font-medium">#{order.orderNumber}</div>
                          <div className="text-sm text-muted-foreground">
                            {order.items.length} item(s)
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div>
                          <div className="font-medium">{order.customerName}</div>
                          <div className="text-sm text-muted-foreground">{order.customerEmail}</div>
                        </div>
                      </td>
                      <td className="p-4 font-medium">{formatPrice(order.totalAmount)}</td>
                      <td className="p-4">
                        <Badge variant={getStatusColor(order.status) as any}>
                          {getStatusDisplayName(order.status)}
                        </Badge>
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewOrder(order.id)}
                          >
                            <Icons.star className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUpdateOrderStatus(order)}
                          >
                            <Icons.repeatIcon className="w-4 h-4" />
                          </Button>
                          {(order.status === OrderStatus.PENDING || order.status === OrderStatus.CONFIRMED) && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button size="sm" variant="destructive">
                                  <Icons.x className="w-4 h-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Cancel Order</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to cancel order #{order.orderNumber}? 
                                    This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => handleCancelOrder(order.id, 'Cancelled by admin')}
                                  >
                                    Cancel Order
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
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
            Showing {currentPage * pageSize + 1} to {Math.min((currentPage + 1) * pageSize, totalElements)} of {totalElements} orders
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

      {/* Order Detail Modal */}
      <Dialog open={isOrderDetailOpen} onOpenChange={setIsOrderDetailOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>
              Complete order information and history
            </DialogDescription>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-6">
              {/* Order Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-medium mb-2">Order Info</h3>
                    <div className="space-y-1 text-sm">
                      <div><strong>Order #:</strong> {selectedOrder.orderNumber}</div>
                      <div><strong>Date:</strong> {formatDate(selectedOrder.createdAt)}</div>
                      <div><strong>Status:</strong> 
                        <Badge className="ml-2" variant={getStatusColor(selectedOrder.status) as any}>
                          {getStatusDisplayName(selectedOrder.status)}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-medium mb-2">Customer</h3>
                    <div className="space-y-1 text-sm">
                      <div><strong>Name:</strong> {selectedOrder.customerName}</div>
                      <div><strong>Email:</strong> {selectedOrder.customerEmail}</div>
                      {selectedOrder.customerPhone && (
                        <div><strong>Phone:</strong> {selectedOrder.customerPhone}</div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-medium mb-2">Payment</h3>
                    <div className="space-y-1 text-sm">
                      <div><strong>Total:</strong> {formatPrice(selectedOrder.totalAmount)}</div>
                      <div><strong>Method:</strong> {selectedOrder.paymentMethod || 'N/A'}</div>
                      <div><strong>Status:</strong> {selectedOrder.paymentStatus || 'N/A'}</div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Order Items */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                            {item.productImage ? (
                              <img
                                src={item.productImage}
                                alt={item.productName}
                                className="w-full h-full object-cover rounded-lg"
                              />
                            ) : (
                              <Icons.star className="w-6 h-6 text-muted-foreground" />
                            )}
                          </div>
                          <div>
                            <div className="font-medium">{item.productName}</div>
                            <div className="text-sm text-muted-foreground">
                              SKU: {item.productSku} • Qty: {item.quantity}
                            </div>
                            {item.variantName && (
                              <div className="text-sm text-muted-foreground">
                                Variant: {item.variantName}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{formatPrice(item.totalPrice)}</div>
                          <div className="text-sm text-muted-foreground">
                            {formatPrice(item.unitPrice)} each
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Addresses */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Shipping Address</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm space-y-1">
                      <div>{selectedOrder.shippingAddress.fullName}</div>
                      <div>{selectedOrder.shippingAddress.addressLine1}</div>
                      {selectedOrder.shippingAddress.addressLine2 && (
                        <div>{selectedOrder.shippingAddress.addressLine2}</div>
                      )}
                      <div>
                        {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.postalCode}
                      </div>
                      <div>{selectedOrder.shippingAddress.country}</div>
                      {selectedOrder.shippingAddress.phoneNumber && (
                        <div>{selectedOrder.shippingAddress.phoneNumber}</div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Billing Address</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm space-y-1">
                      <div>{selectedOrder.billingAddress.fullName}</div>
                      <div>{selectedOrder.billingAddress.addressLine1}</div>
                      {selectedOrder.billingAddress.addressLine2 && (
                        <div>{selectedOrder.billingAddress.addressLine2}</div>
                      )}
                      <div>
                        {selectedOrder.billingAddress.city}, {selectedOrder.billingAddress.state} {selectedOrder.billingAddress.postalCode}
                      </div>
                      <div>{selectedOrder.billingAddress.country}</div>
                      {selectedOrder.billingAddress.phoneNumber && (
                        <div>{selectedOrder.billingAddress.phoneNumber}</div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Notes */}
              {selectedOrder.notes && (
                <Card>
                  <CardHeader>
                    <CardTitle>Order Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{selectedOrder.notes}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Status Update Modal */}
      <Dialog open={isStatusUpdateOpen} onOpenChange={setIsStatusUpdateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Order Status</DialogTitle>
            <DialogDescription>
              Change the status of this order and add optional notes.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="status">New Status</Label>
              <Select 
                value={statusUpdateForm.status} 
                onValueChange={(value) => setStatusUpdateForm(prev => ({ ...prev, status: value as OrderStatus }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(OrderStatus).map(status => (
                    <SelectItem key={status} value={status}>
                      {getStatusDisplayName(status)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={statusUpdateForm.notes}
                onChange={(e) => setStatusUpdateForm(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Add any notes about this status update..."
                rows={3}
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsStatusUpdateOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmitStatusUpdate} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Icons.spinner className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Status'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
