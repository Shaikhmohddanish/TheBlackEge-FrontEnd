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
import { trackOrderById, trackOrderByNumber, type OrderTracking } from '@/lib/api/tracking';
import { TrackingProgressBar } from '@/components/tracking/progress-bar';
import { TrackingTimeline } from '@/components/tracking/timeline';
import { TrackingStatusBadge } from '@/components/tracking/status-badge';

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [tracking, setTracking] = useState<OrderTracking | null>(null);
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
      const trackingData = await trackOrderById(orderId);
      setTracking(trackingData);
      toast({
        title: 'Success',
        description: 'Order tracking information loaded successfully',
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to track order';
      setError(errorMessage);
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
    if (!trackingNumber.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a tracking number',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const trackingData = await trackOrderByNumber(trackingNumber);
      setTracking(trackingData);
      toast({
        title: 'Success',
        description: 'Order tracking information loaded successfully',
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to track order';
      setError(errorMessage);
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
    setTrackingNumber('');
    setTracking(null);
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

          {!tracking ? (
            /* Search Form */
            <Card className="mb-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icons.search className="h-5 w-5" />
                  Find Your Order
                </CardTitle>
                <CardDescription>
                  Track your order using either your order ID or tracking number
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="order-id" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="order-id">Order ID</TabsTrigger>
                    <TabsTrigger value="tracking-number">Tracking Number</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="order-id" className="space-y-4">
                    <form onSubmit={handleTrackById} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="orderId">Order ID</Label>
                        <Input
                          id="orderId"
                          type="text"
                          placeholder="Enter your order ID (e.g., 123)"
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
                  
                  <TabsContent value="tracking-number" className="space-y-4">
                    <form onSubmit={handleTrackByNumber} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="trackingNumber">Tracking Number</Label>
                        <Input
                          id="trackingNumber"
                          type="text"
                          placeholder="Enter tracking number (e.g., 1Z999AA1234567890)"
                          value={trackingNumber}
                          onChange={(e) => setTrackingNumber(e.target.value)}
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
            /* Tracking Results */
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

              {/* Order Header */}
              <Card className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl">
                        Order #{tracking.orderNumber}
                      </CardTitle>
                      <CardDescription className="text-base">
                        Order ID: {tracking.orderId}
                      </CardDescription>
                    </div>
                    <TrackingStatusBadge 
                      status={tracking.currentStatus} 
                      size="lg"
                    />
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Progress Bar */}
                  <TrackingProgressBar
                    percentage={tracking.progressPercentage}
                    status={tracking.currentStatus}
                  />

                  {/* Tracking Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {tracking.trackingNumber && (
                      <div>
                        <h4 className="font-medium text-foreground mb-2">Tracking Number</h4>
                        <div className="flex items-center gap-2">
                          <code className="bg-muted px-2 py-1 rounded text-sm">
                            {tracking.trackingNumber}
                          </code>
                          {tracking.trackingUrl && (
                            <Button
                              variant="outline"
                              size="sm"
                              asChild
                            >
                              <a 
                                href={tracking.trackingUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                              >
                                Track with {tracking.carrier}
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                    )}

                    {tracking.currentLocation && (
                      <div>
                        <h4 className="font-medium text-foreground mb-2">Current Location</h4>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Icons.user className="h-4 w-4" />
                          {tracking.currentLocation}
                        </div>
                      </div>
                    )}

                    {tracking.estimatedDeliveryDate && (
                      <div>
                        <h4 className="font-medium text-foreground mb-2">Estimated Delivery</h4>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Icons.shoppingCart className="h-4 w-4" />
                          {new Date(tracking.estimatedDeliveryDate).toLocaleDateString()}
                        </div>
                      </div>
                    )}

                    {tracking.actualDeliveryDate && (
                      <div>
                        <h4 className="font-medium text-foreground mb-2">Delivered On</h4>
                        <div className="flex items-center gap-2 text-green-600">
                          <Icons.shoppingCart className="h-4 w-4" />
                          {new Date(tracking.actualDeliveryDate).toLocaleDateString()}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Timeline */}
              <Card className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <CardContent className="pt-6">
                  <TrackingTimeline events={tracking.trackingEvents} />
                </CardContent>
              </Card>

              {/* Shipping Address */}
              {tracking.shippingAddress && (
                <Card className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Icons.user className="h-5 w-5" />
                      Shipping Address
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-muted p-4 rounded-lg">
                      <pre className="text-sm text-foreground whitespace-pre-wrap">
                        {tracking.shippingAddress.formattedAddress}
                      </pre>
                      {tracking.shippingAddress.phoneNumber && (
                        <div className="mt-2 text-sm text-muted-foreground">
                          Phone: {tracking.shippingAddress.phoneNumber}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
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
