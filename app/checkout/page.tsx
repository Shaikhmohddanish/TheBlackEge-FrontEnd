'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Icons } from '@/components/ui/icons';
import { useCart } from '@/hooks/use-cart';
import { useAuth } from '@/contexts/auth-context';
import { useToast } from '@/hooks/use-toast';
import { formatPrice } from '@/lib/currency-utils';
import { createOrder } from '@/lib/api/orders';
import type { Address } from '@/lib/api/orders';
import Image from 'next/image';

export default function CheckoutPage() {
  const { cart, isLoading: cartLoading, clearCart, getTotalAmount, getTotalItems } = useCart();
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [useBillingAsShipping, setUseBillingAsShipping] = useState(true);

  const [shippingAddress, setShippingAddress] = useState<Address>({
    fullName: user ? `${user.firstName} ${user.lastName}` : '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'USA',
    phoneNumber: '',
  });

  const [billingAddress, setBillingAddress] = useState<Address>({
    fullName: user ? `${user.firstName} ${user.lastName}` : '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'USA',
    phoneNumber: '',
  });

  const [orderNotes, setOrderNotes] = useState('');
  const [couponCode, setCouponCode] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/checkout');
      return;
    }

    if (!cart || cart.items.length === 0) {
      router.push('/cart');
      return;
    }
  }, [isAuthenticated, cart, router]);

  const handleAddressChange = (
    type: 'shipping' | 'billing',
    field: keyof Address,
    value: string
  ) => {
    if (type === 'shipping') {
      setShippingAddress(prev => ({ ...prev, [field]: value }));
    } else {
      setBillingAddress(prev => ({ ...prev, [field]: value }));
    }
  };

  const validateAddress = (address: Address): boolean => {
    return !!(
      address.fullName &&
      address.addressLine1 &&
      address.city &&
      address.state &&
      address.postalCode &&
      address.country
    );
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!cart || cart.items.length === 0) {
      toast({
        title: 'Error',
        description: 'Your cart is empty.',
        variant: 'destructive',
      });
      return;
    }

    if (!validateAddress(shippingAddress)) {
      toast({
        title: 'Error',
        description: 'Please fill in all required shipping address fields.',
        variant: 'destructive',
      });
      return;
    }

    if (!useBillingAsShipping && !validateAddress(billingAddress)) {
      toast({
        title: 'Error',
        description: 'Please fill in all required billing address fields.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsSubmitting(true);

      const orderData = {
        items: cart.items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          variantId: item.variantId,
        })),
        shippingAddress,
        billingAddress: useBillingAsShipping ? shippingAddress : billingAddress,
        couponCode: couponCode.trim() || undefined,
        notes: orderNotes.trim() || undefined,
      };

      const order = await createOrder(orderData);
      
      // Clear cart after successful order
      await clearCart();

      toast({
        title: 'Order placed successfully!',
        description: `Your order #${order.orderNumber} has been placed.`,
      });

      // Redirect to order confirmation
      router.push(`/account/orders/${order.id}`);
    } catch (error) {
      console.error('Order creation failed:', error);
      toast({
        title: 'Order failed',
        description: error instanceof Error ? error.message : 'Failed to place order. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated || cartLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <Icons.spinner className="mx-auto h-8 w-8 animate-spin text-gray-400 mb-4" />
            <p className="text-gray-600">Loading checkout...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return null;
  }

  const subtotal = getTotalAmount();
  const shipping = subtotal > 100 ? 0 : 10; // Free shipping over $100
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
        <p className="text-gray-600">Complete your order</p>
      </div>

      <form onSubmit={handleSubmitOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Form */}
          <div className="space-y-6">
            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle>Shipping Address</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="shippingFullName">Full Name *</Label>
                    <Input
                      id="shippingFullName"
                      required
                      value={shippingAddress.fullName}
                      onChange={(e) => handleAddressChange('shipping', 'fullName', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="shippingPhone">Phone Number</Label>
                    <Input
                      id="shippingPhone"
                      type="tel"
                      value={shippingAddress.phoneNumber || ''}
                      onChange={(e) => handleAddressChange('shipping', 'phoneNumber', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="shippingAddress1">Address Line 1 *</Label>
                  <Input
                    id="shippingAddress1"
                    required
                    value={shippingAddress.addressLine1}
                    onChange={(e) => handleAddressChange('shipping', 'addressLine1', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="shippingAddress2">Address Line 2</Label>
                  <Input
                    id="shippingAddress2"
                    value={shippingAddress.addressLine2 || ''}
                    onChange={(e) => handleAddressChange('shipping', 'addressLine2', e.target.value)}
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="shippingCity">City *</Label>
                    <Input
                      id="shippingCity"
                      required
                      value={shippingAddress.city}
                      onChange={(e) => handleAddressChange('shipping', 'city', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="shippingState">State *</Label>
                    <Input
                      id="shippingState"
                      required
                      value={shippingAddress.state}
                      onChange={(e) => handleAddressChange('shipping', 'state', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="shippingPostalCode">Postal Code *</Label>
                    <Input
                      id="shippingPostalCode"
                      required
                      value={shippingAddress.postalCode}
                      onChange={(e) => handleAddressChange('shipping', 'postalCode', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="shippingCountry">Country *</Label>
                    <Input
                      id="shippingCountry"
                      required
                      value={shippingAddress.country}
                      onChange={(e) => handleAddressChange('shipping', 'country', e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Billing Address */}
            <Card>
              <CardHeader>
                <CardTitle>Billing Address</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="useBillingAsShipping"
                    checked={useBillingAsShipping}
                    onCheckedChange={(checked) => setUseBillingAsShipping(checked as boolean)}
                  />
                  <Label htmlFor="useBillingAsShipping">
                    Same as shipping address
                  </Label>
                </div>

                {!useBillingAsShipping && (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="billingFullName">Full Name *</Label>
                        <Input
                          id="billingFullName"
                          required
                          value={billingAddress.fullName}
                          onChange={(e) => handleAddressChange('billing', 'fullName', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="billingPhone">Phone Number</Label>
                        <Input
                          id="billingPhone"
                          type="tel"
                          value={billingAddress.phoneNumber || ''}
                          onChange={(e) => handleAddressChange('billing', 'phoneNumber', e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="billingAddress1">Address Line 1 *</Label>
                      <Input
                        id="billingAddress1"
                        required
                        value={billingAddress.addressLine1}
                        onChange={(e) => handleAddressChange('billing', 'addressLine1', e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="billingAddress2">Address Line 2</Label>
                      <Input
                        id="billingAddress2"
                        value={billingAddress.addressLine2 || ''}
                        onChange={(e) => handleAddressChange('billing', 'addressLine2', e.target.value)}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="billingCity">City *</Label>
                        <Input
                          id="billingCity"
                          required
                          value={billingAddress.city}
                          onChange={(e) => handleAddressChange('billing', 'city', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="billingState">State *</Label>
                        <Input
                          id="billingState"
                          required
                          value={billingAddress.state}
                          onChange={(e) => handleAddressChange('billing', 'state', e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="billingPostalCode">Postal Code *</Label>
                        <Input
                          id="billingPostalCode"
                          required
                          value={billingAddress.postalCode}
                          onChange={(e) => handleAddressChange('billing', 'postalCode', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="billingCountry">Country *</Label>
                        <Input
                          id="billingCountry"
                          required
                          value={billingAddress.country}
                          onChange={(e) => handleAddressChange('billing', 'country', e.target.value)}
                        />
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Additional Information */}
            <Card>
              <CardHeader>
                <CardTitle>Additional Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="couponCode">Coupon Code</Label>
                  <Input
                    id="couponCode"
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="orderNotes">Order Notes</Label>
                  <Textarea
                    id="orderNotes"
                    placeholder="Special instructions for your order"
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Order Items */}
                <div className="space-y-3">
                  {cart.items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3">
                      <div className="relative w-12 h-12 rounded-md overflow-hidden">
                        <Image
                          src={item.imageUrl || '/placeholder.jpg'}
                          alt={item.productName}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-grow min-w-0">
                        <p className="text-sm font-medium truncate">{item.productName}</p>
                        {item.variantName && (
                          <p className="text-xs text-gray-600">{item.variantName}</p>
                        )}
                        <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-medium">{formatPrice(item.total)}</p>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Order Totals */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal ({getTotalItems()} items)</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>{formatPrice(tax)}</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
                  Place Order
                </Button>

                <div className="text-xs text-gray-600 text-center">
                  <p>By placing your order, you agree to our Terms & Conditions</p>
                  <p className="mt-1">🔒 Secure checkout with SSL encryption</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
