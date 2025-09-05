'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Icons } from '@/components/ui/icons';
import { useAuth } from '@/contexts/auth-context';
import { useToast } from '@/hooks/use-toast';
import { getProducts, createProduct, deleteProduct } from '@/lib/api/products';
import { getAllOrders, updateOrderStatus } from '@/lib/api/orders';
import { AdminTrackingManagement } from '@/components/admin/tracking-management';
import { AdminUserManagement } from '@/components/admin/user-management';
import { ProductManagement } from '@/components/admin/product-management';
import { OrderManagement } from '@/components/admin/order-management';
import { EmailTestingDashboard } from '@/components/admin/email-testing-dashboard';
import { EnhancedUserManagement } from '@/components/admin/enhanced-user-management';
import { getAllUsers, getDashboardSummary, type AdminUser, type DashboardSummary } from '@/lib/api/admin';
import type { Product } from '@/lib/api/products';
import type { Order } from '@/lib/api/orders';
import { formatPrice } from '@/lib/currency-utils';

export default function AdminDashboard() {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [dashboardSummary, setDashboardSummary] = useState<DashboardSummary | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);

  // Product form state
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: 0,
    category: '',
    inventory: 0,
    sku: '',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (!isAdmin) {
      router.push('/');
      toast({
        title: 'Access Denied',
        description: 'You do not have permission to access the admin dashboard.',
        variant: 'destructive',
      });
      return;
    }

    loadDashboardData();
  }, [isAuthenticated, isAdmin, router, toast]);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      const [productsData, ordersData, usersData, summaryData] = await Promise.all([
        getProducts(0, 50),
        getAllOrders(0, 50),
        getAllUsers(0, 50),
        getDashboardSummary(),
      ]);
      setProducts(productsData.products);
      setOrders(ordersData.orders);
      setUsers(usersData.users);
      setDashboardSummary(summaryData);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load dashboard data.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsCreatingProduct(true);
      const product = await createProduct({
        ...newProduct,
        isActive: true,
      });
      setProducts([product, ...products]);
      setNewProduct({
        name: '',
        description: '',
        price: 0,
        category: '',
        inventory: 0,
        sku: '',
      });
      toast({
        title: 'Product created',
        description: 'New product has been created successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create product.',
        variant: 'destructive',
      });
    } finally {
      setIsCreatingProduct(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      await deleteProduct(productId);
      setProducts(products.filter(p => p.id !== productId));
      toast({
        title: 'Product deleted',
        description: 'Product has been deleted successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete product.',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: Order['status']) => {
    try {
      const updatedOrder = await updateOrderStatus(orderId, status);
      setOrders(orders.map(order => 
        order.id === orderId ? updatedOrder : order
      ));
      toast({
        title: 'Order updated',
        description: 'Order status has been updated successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update order status.',
        variant: 'destructive',
      });
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED':
        return 'bg-blue-100 text-blue-800';
      case 'SHIPPED':
        return 'bg-purple-100 text-purple-800';
      case 'DELIVERED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <Icons.spinner className="mx-auto h-8 w-8 animate-spin text-gray-400 mb-4" />
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Manage your store products and orders</p>
      </div>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Icons.shoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardSummary?.totalProducts || products.length}</div>
            <p className="text-xs text-muted-foreground">
              {dashboardSummary?.lowStockProducts || 0} low stock
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Icons.shoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardSummary?.totalOrders || orders.length}</div>
            <p className="text-xs text-muted-foreground">
              {dashboardSummary?.pendingOrders || orders.filter(o => o.status === 'PENDING').length} pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Icons.users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardSummary?.totalUsers || users.length}</div>
            <p className="text-xs text-muted-foreground">
              {dashboardSummary?.activeUsers || 0} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <Icons.dollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPrice(dashboardSummary?.totalRevenue || orders.reduce((sum, order) => sum + order.totalAmount, 0))}
            </div>
            <p className="text-xs text-muted-foreground">
              {formatPrice(dashboardSummary?.averageOrderValue || 0)} avg order
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="products" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="email">Email Testing</TabsTrigger>
          <TabsTrigger value="tracking">Tracking</TabsTrigger>
          <TabsTrigger value="overview">Overview</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="mt-6">
          <ProductManagement />
        </TabsContent>

        <TabsContent value="orders" className="mt-6">
          <OrderManagement />
        </TabsContent>

        <TabsContent value="users" className="mt-6">
          <EnhancedUserManagement />
        </TabsContent>

        <TabsContent value="email" className="mt-6">
          <EmailTestingDashboard />
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Analytics & Reports</CardTitle>
              <CardDescription>
                View detailed analytics and performance metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {dashboardSummary && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Sales Performance</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {formatPrice(dashboardSummary.totalRevenue)}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {dashboardSummary.totalSales} total sales
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Avg: {formatPrice(dashboardSummary.averageOrderValue)}
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Inventory Status</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {dashboardSummary.totalProducts}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {dashboardSummary.lowStockProducts} low stock
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Top category: {dashboardSummary.topSellingCategory}
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Customer Activity</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {dashboardSummary.totalUsers}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {dashboardSummary.activeUsers} active users
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {dashboardSummary.pendingOrders} pending orders
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                )}

                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    📊 Advanced analytics coming soon!
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Full charts and reports will be available once you have more data.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tracking" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Tracking Management</CardTitle>
              <CardDescription>
                Manage tracking information and delivery status for orders
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AdminTrackingManagement onUpdate={loadDashboardData} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="overview" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Admin Overview</CardTitle>
              <CardDescription>
                System overview and quick actions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateProduct} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Product Name</Label>
                    <Input
                      id="name"
                      required
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sku">SKU</Label>
                    <Input
                      id="sku"
                      required
                      value={newProduct.sku}
                      onChange={(e) => setNewProduct({...newProduct, sku: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    required
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      min="0"
                      required
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({...newProduct, price: parseFloat(e.target.value) || 0})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      required
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="inventory">Inventory</Label>
                    <Input
                      id="inventory"
                      type="number"
                      min="0"
                      required
                      value={newProduct.inventory}
                      onChange={(e) => setNewProduct({...newProduct, inventory: parseInt(e.target.value) || 0})}
                    />
                  </div>
                </div>

                <Button type="submit" disabled={isCreatingProduct}>
                  {isCreatingProduct && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
                  Create Product
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
