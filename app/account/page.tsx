'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/auth-context';
import { useToast } from '@/hooks/use-toast';
import { formatPrice } from '@/lib/currency-utils';
import { getUserOrders } from '@/lib/api/orders';
import { trackOrderById, type OrderTracking } from '@/lib/api/tracking';
import { TrackingStatusBadge } from '@/components/tracking/status-badge';
import { Icons } from '@/components/ui/icons';
import type { Order } from '@/lib/api/orders';
import { PasswordChangeForm } from '@/components/auth/password-change-form';

export default function AccountPage() {
  const { user, logout, isAuthenticated, isLoading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderTracking, setOrderTracking] = useState<Record<string, OrderTracking>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [trackingLoading, setTrackingLoading] = useState<Record<string, boolean>>({});
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    // Wait for auth loading to complete before checking authentication
    if (authLoading) {
      return;
    }
    
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const ordersData = await getUserOrders(0, 10);
        setOrders(ordersData.orders);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
        toast({
          title: 'Error',
          description: 'Failed to load your orders',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated, authLoading, router, toast]);

  const loadOrderTracking = async (orderId: string) => {
    if (orderTracking[orderId] || trackingLoading[orderId]) return;

    setTrackingLoading(prev => ({ ...prev, [orderId]: true }));
    try {
      const tracking = await trackOrderById(orderId);
      setOrderTracking(prev => ({ ...prev, [orderId]: tracking }));
    } catch (error) {
      // Silently fail - tracking might not be available for all orders
      console.log(`No tracking data available for order ${orderId}`);
    } finally {
      setTrackingLoading(prev => ({ ...prev, [orderId]: false }));
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: 'Logged out',
        description: 'You have been successfully logged out.',
      });
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
      toast({
        title: 'Error',
        description: 'Failed to logout. Please try again.',
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

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">My Account</h1>
          <p className="text-gray-600">Manage your account and view your orders</p>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Your account details and personal information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>First Name</Label>
                  <Input value={user.firstName} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Last Name</Label>
                  <Input value={user.lastName} disabled />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Username</Label>
                <Input value={user.username} disabled />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input value={user.email} disabled />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Badge variant={user.roles?.includes('ROLE_ADMIN') ? 'default' : 'secondary'}>
                  {user.roles?.includes('ROLE_ADMIN') ? 'ADMIN' : 'USER'}
                </Badge>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Badge variant={user.enabled ? 'default' : 'destructive'}>
                  {user.enabled ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </CardContent>
          </Card>
          </TabsContent>

          <TabsContent value="orders" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Order History</CardTitle>
              <CardDescription>
                View and track your recent orders
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Loading orders...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No orders found</p>
                  <Button onClick={() => router.push('/shop')}>
                    Start Shopping
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => {
                    const tracking = orderTracking[order.id];
                    const isTrackingLoading = trackingLoading[order.id];
                    
                    return (
                      <div
                        key={order.id}
                        className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-semibold">Order #{order.orderNumber}</h3>
                            <p className="text-sm text-gray-600">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge className={getStatusColor(order.status)}>
                                {order.status}
                              </Badge>
                              {tracking && (
                                <TrackingStatusBadge 
                                  status={tracking.currentStatus} 
                                  size="sm"
                                />
                              )}
                            </div>
                            <p className="text-sm font-medium">
                              {formatPrice(order.totalAmount)}
                            </p>
                          </div>
                        </div>
                        
                        <div className="text-sm text-gray-600">
                          <p>{order.items.length} item(s)</p>
                          <p>Shipping to: {order.shippingAddress.city}, {order.shippingAddress.state}</p>
                          
                          {tracking && (
                            <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                              <div className="flex items-center gap-1">
                                <Icons.shoppingCart className="h-3 w-3" />
                                <span className="font-medium">
                                  {tracking.progressPercentage}% Complete
                                </span>
                                {tracking.trackingNumber && (
                                  <span className="text-gray-500">
                                    • #{tracking.trackingNumber}
                                  </span>
                                )}
                              </div>
                              {tracking.currentLocation && (
                                <div className="flex items-center gap-1 mt-1">
                                  <Icons.user className="h-3 w-3" />
                                  <span>{tracking.currentLocation}</span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        
                        <div className="mt-3 flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(`/account/orders/${order.id}`)}
                          >
                            View Details
                          </Button>
                          
                          {!tracking && !isTrackingLoading && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => loadOrderTracking(order.id)}
                            >
                              <Icons.search className="h-3 w-3 mr-1" />
                              Load Tracking
                            </Button>
                          )}
                          
                          {isTrackingLoading && (
                            <Button
                              variant="outline"
                              size="sm"
                              disabled
                            >
                              <Icons.spinner className="h-3 w-3 mr-1 animate-spin" />
                              Loading...
                            </Button>
                          )}
                          
                          {tracking && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => router.push(`/track?orderId=${order.id}`)}
                            >
                              <Icons.shoppingCart className="h-3 w-3 mr-1" />
                              Track Order
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

                  <TabsContent value="security" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Manage your password and account security
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PasswordChangeForm />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>
                Manage your account preferences and security
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium text-red-600 mb-2">Danger Zone</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Once you logout, you'll need to sign in again to access your account.
                </p>
                <Button variant="destructive" onClick={handleLogout}>
                  Sign Out
                </Button>
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
