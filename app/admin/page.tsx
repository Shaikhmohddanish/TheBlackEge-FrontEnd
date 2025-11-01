'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
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
import { ProductManagement } from '@/components/admin/product-management';
import { OrderManagement } from '@/components/admin/order-management';
import { CouponManagement } from '@/components/admin/CouponManagement';
import { EnhancedUserManagement } from '@/components/admin/enhanced-user-management';
import CategoryManagement from '@/components/admin/CategoryManagement';
import { getAllUsers, getDashboardSummary, type AdminUser, type DashboardSummary } from '@/lib/api/admin';

import type { Product } from '@/lib/api/products';
import type { Order } from '@/lib/api/orders';
import { formatPrice } from '@/lib/currency-utils';

export default function AdminDashboard() {
  const { user, isAuthenticated, isAdmin, isLoading: authLoading } = useAuth();
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
    stockQuantity: 0,
    categories: [] as string[],
  });

  useEffect(() => {
    // Don't do anything while auth is still loading
    if (authLoading) {
      return;
    }

    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (!isAdmin) {
      return;
    }

    loadDashboardData();
  }, [isAuthenticated, isAdmin, authLoading, router, toast, user]);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      
      const token = localStorage.getItem('token');
      
      try {
        const productsData = await getProducts(0, 50);
        setProducts(productsData.products);
      } catch (error) {
        setProducts([]);
      }
      
      try {
        const ordersData = await getAllOrders(0, 50);
        setOrders(ordersData.orders);
      } catch (error) {
        setOrders([]);
      }
      
      try {
        const usersData = await getAllUsers(0, 50);
        setUsers(usersData.users);
        
        try {
          const summaryData = await getDashboardSummary();
          
          const enhancedSummary = {
            ...summaryData,
            totalUsers: summaryData?.totalUsers || usersData.totalElements || usersData.users.length,
            activeUsers: summaryData?.activeUsers || usersData.users.filter((u: AdminUser) => u.enabled).length,
            totalProducts: summaryData?.totalProducts || products.length,
            totalOrders: summaryData?.totalOrders || orders.length,
          };
          
          setDashboardSummary(enhancedSummary);
        } catch (summaryError) {
          const fallbackSummary = {
            totalUsers: usersData.totalElements || usersData.users.length,
            activeUsers: usersData.users.filter((u: AdminUser) => u.enabled).length,
            totalProducts: products.length,
            totalOrders: orders.length,
            totalRevenue: 0,
            pendingOrders: 0,
            lowStockProducts: 0,
            totalSales: 0,
            averageOrderValue: 0,
            topSellingCategory: 'N/A',
          };
          
          setDashboardSummary(fallbackSummary);
        }
        
      } catch (usersError) {
        setUsers([]);
        
        try {
          const summaryData = await getDashboardSummary();
          setDashboardSummary(summaryData);
        } catch (summaryError) {
          setDashboardSummary({
            totalUsers: 0,
            activeUsers: 0,
            totalProducts: products.length,
            totalOrders: orders.length,
            totalRevenue: 0,
            pendingOrders: 0,
            lowStockProducts: 0,
            totalSales: 0,
            averageOrderValue: 0,
            topSellingCategory: 'N/A',
          });
        }
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load dashboard data.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

    const handleCreateProduct = async () => {
    // TODO: Fix product creation to match CreateProductData interface
    toast({
      title: 'Feature Coming Soon',
      description: 'Product creation form needs to be updated.',
      variant: 'default',
    });
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



  // Show loading while auth is being determined
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <Icons.spinner className="mx-auto h-8 w-8 animate-spin text-gray-400 mb-4" />
              <p className="text-gray-600">Loading authentication...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Access Denied</h1>
            <p className="text-gray-600 mb-8">You must be logged in to access the admin dashboard.</p>
            <Button onClick={() => router.push('/login')}>Login</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Admin Access Required</h1>
            <p className="text-gray-600 mb-4">You need admin privileges to access this dashboard.</p>
            
            <div className="space-x-4">
              <Button onClick={() => router.push('/account')}>Go to Account</Button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
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
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
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
              {dashboardSummary?.activeUsers || users.filter(u => u.enabled).length} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <Icons.trendingUp className="h-4 w-4 text-muted-foreground" />
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
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="tracking">Tracking</TabsTrigger>
          <TabsTrigger value="coupons">Coupons</TabsTrigger>
          <TabsTrigger value="overview">Overview</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="mt-6">
          <ProductManagement />
        </TabsContent>

        <TabsContent value="categories" className="mt-6">
          <CategoryManagement />
        </TabsContent>

        <TabsContent value="orders" className="mt-6">
          <OrderManagement />
        </TabsContent>

        <TabsContent value="users" className="mt-6">
          <EnhancedUserManagement />
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

        <TabsContent value="coupons" className="mt-6">
          <CouponManagement onUpdate={loadDashboardData} />
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
              <div className="space-y-4">
                <p className="text-gray-600">
                  Admin dashboard is available! You can access the following management features:
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">✅ User Management</h3>
                    <p className="text-sm text-gray-600">View and manage all users, roles, and permissions</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">✅ Product Management</h3>
                    <p className="text-sm text-gray-600">Add, edit, delete products with full CRUD operations</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">✅ Order Management</h3>
                    <p className="text-sm text-gray-600">Track and update order statuses</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">✅ Dashboard Analytics</h3>
                    <p className="text-sm text-gray-600">View sales, revenue, and system metrics</p>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-blue-600">
                    Use the tabs below to access specific management features.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </main>
      <Footer />
    </div>
  );
}
