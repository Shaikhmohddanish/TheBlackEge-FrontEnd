'use client';

import React, { useState } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Icons } from '@/components/ui/icons';
import { useToast } from '@/hooks/use-toast';
import OrderTrackingDisplay from '@/components/order/OrderTrackingDisplay';
import { getAdminOrderById } from '@/lib/api/admin-orders';
import type { AdminOrder } from '@/lib/api/admin-orders';

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [order, setOrder] = useState<AdminOrder | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleTrackById = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter an order ID',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const orderData = await getAdminOrderById(orderId);
      setOrder(orderData);
      toast({
        title: 'Success',
        description: 'Order found successfully',
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Order not found';
      setError(errorMessage);
      setOrder(null);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTrackByNumber = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter an order number',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      // For simplicity, we'll search by order number by calling the search endpoint
      // In a real implementation, you might want a specific endpoint for this
      const { searchAdminOrders } = await import('@/lib/api/admin-orders');
      const searchResults = await searchAdminOrders(orderNumber, 0, 1);
      
      if (searchResults.orders.length > 0) {
        setOrder(searchResults.orders[0]);
        toast({
          title: 'Success',
          description: 'Order found successfully',
        });
      } else {
        throw new Error('Order not found');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Order not found';
      setError(errorMessage);
      setOrder(null);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setOrderId('');
    setOrderNumber('');
    setOrder(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in-up">
            <h1 className="font-heading font-bold text-4xl sm:text-5xl mb-6">
              Track Your Order
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Enter your order ID or tracking number to get real-time updates on your order status
            </p>
          </div>

          {!order ? (
            /* Search Form */
            <Card className="mb-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icons.search className="h-5 w-5" />
                  Find Your Order
                </CardTitle>
                <CardDescription>
                  Track your order using either your order ID or order number
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="order-id" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="order-id">Order ID</TabsTrigger>
                    <TabsTrigger value="order-number">Order Number</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="order-id" className="space-y-4">
                    <form onSubmit={handleTrackById} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="orderId">Order ID</Label>
                        <Input
                          id="orderId"
                          type="text"
                          placeholder="Enter your order ID"
                          value={orderId}
                          onChange={(e) => setOrderId(e.target.value)}
                          className="w-full"
                        />
                      </div>
                      <Button type="submit" disabled={loading} className="w-full">
                        {loading ? (
                          <>
                            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                            Tracking Order...
                          </>
                        ) : (
                          <>
                            <Icons.search className="mr-2 h-4 w-4" />
                            Track Order
                          </>
                        )}
                      </Button>
                    </form>
                  </TabsContent>
                  
                  <TabsContent value="order-number" className="space-y-4">
                    <form onSubmit={handleTrackByNumber} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="orderNumber">Order Number</Label>
                        <Input
                          id="orderNumber"
                          type="text"
                          placeholder="Enter order number (e.g., ORD-1234)"
                          value={orderNumber}
                          onChange={(e) => setOrderNumber(e.target.value)}
                          className="w-full"
                        />
                      </div>
                      <Button type="submit" disabled={loading} className="w-full">
                        {loading ? (
                          <>
                            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                            Tracking Order...
                          </>
                        ) : (
                          <>
                            <Icons.search className="mr-2 h-4 w-4" />
                            Track by Number
                          </>
                        )}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>

                {error && (
                  <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <div className="flex items-center gap-2 text-destructive">
                      <Icons.x className="h-4 w-4" />
                      <span className="font-medium">{error}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            /* Order Tracking Display */
            <div className="space-y-8">
              {/* Back Button */}
              <Button
                variant="outline"
                onClick={resetForm}
                className="animate-fade-in-up"
              >
                <Icons.search className="mr-2 h-4 w-4" />
                Search Another Order
              </Button>

              {/* Use the OrderTrackingDisplay component */}
              <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                <OrderTrackingDisplay 
                  orderId={order.id} 
                  orderNumber={order.orderNumber} 
                  orderStatus={order.status} 
                />
              </div>
            </div>
          )}

          {/* Help Section */}
          <Card className="mt-12 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icons.user className="h-5 w-5" />
                Need Help?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                If you're having trouble tracking your order or need additional assistance:
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="outline" asChild>
                  <a href="/contact">Contact Support</a>
                </Button>
                <Button variant="outline" asChild>
                  <a href="/account">View Order History</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
