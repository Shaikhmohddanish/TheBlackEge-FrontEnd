'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/auth-context';
import { useToast } from '@/hooks/use-toast';
import { RazorpayPayment } from '@/components/payment/razorpay-payment';
import { ShoppingCart, MapPin, CreditCard, Package, CheckCircle } from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  size?: string;
  color?: string;
}

export default function CheckoutPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [codAvailable, setCodAvailable] = useState(false);

  // Form data
  const [shippingAddress, setShippingAddress] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
  });

  const [billingAddress, setBillingAddress] = useState({
    sameAsShipping: true,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
  });

  const [orderNotes, setOrderNotes] = useState('');

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 1000 ? 0 : 100; // Free shipping above ₹1000
  const tax = subtotal * 0.18; // 18% GST
  const total = subtotal + shipping + tax;

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/checkout');
      return;
    }

    // Load cart items (mock data for now)
    setCartItems([
      {
        id: '1',
        name: 'THE BLACKEGE Signature Hoodie',
        price: 2999,
        quantity: 1,
        image: '/products/hoodie-1.jpg',
        size: 'M',
        color: 'Black',
      },
      {
        id: '2',
        name: 'THE BLACKEGE Classic T-Shirt',
        price: 1299,
        quantity: 2,
        image: '/products/tshirt-1.jpg',
        size: 'L',
        color: 'White',
      },
    ]);

    // Check COD availability based on location
    setCodAvailable(true);
    setIsLoading(false);
  }, [isAuthenticated, router]);

  const handlePaymentSuccess = (paymentData: any) => {
    toast({
      title: 'Order Placed Successfully!',
      description: 'Your order has been confirmed. You will receive a confirmation email shortly.',
    });
    
    // Redirect to order confirmation page
    router.push(`/order-confirmation?payment_id=${paymentData.paymentId}`);
  };

  const handlePaymentError = (error: string) => {
    toast({
      title: 'Payment Failed',
      description: error,
      variant: 'destructive',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading checkout...</p>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <Card>
            <CardContent className="p-12 text-center">
              <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
              <p className="text-gray-600 mb-6">Add some items to your cart to proceed with checkout.</p>
              <Button onClick={() => router.push('/shop')}>
                Continue Shopping
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Order Details */}
          <div className="space-y-6">
            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={shippingAddress.firstName}
                      onChange={(e) => setShippingAddress({...shippingAddress, firstName: e.target.value})}
                      required
                      className="border-white bg-gray-900/50 text-white placeholder:text-gray-400 focus:border-blue-400"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={shippingAddress.lastName}
                      onChange={(e) => setShippingAddress({...shippingAddress, lastName: e.target.value})}
                      required
                      className="border-white bg-gray-900/50 text-white placeholder:text-gray-400 focus:border-blue-400"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={shippingAddress.email}
                    onChange={(e) => setShippingAddress({...shippingAddress, email: e.target.value})}
                    required
                    className="border-white bg-gray-900/50 text-white placeholder:text-gray-400 focus:border-blue-400"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={shippingAddress.phone}
                    onChange={(e) => setShippingAddress({...shippingAddress, phone: e.target.value})}
                    required
                    className="border-white bg-gray-900/50 text-white placeholder:text-gray-400 focus:border-blue-400"
                  />
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={shippingAddress.address}
                    onChange={(e) => setShippingAddress({...shippingAddress, address: e.target.value})}
                    required
                    className="border-white bg-gray-900/50 text-white placeholder:text-gray-400 focus:border-blue-400"
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={shippingAddress.city}
                      onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
                      required
                      className="border-white bg-gray-900/50 text-white placeholder:text-gray-400 focus:border-blue-400"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={shippingAddress.state}
                      onChange={(e) => setShippingAddress({...shippingAddress, state: e.target.value})}
                      required
                      className="border-white bg-gray-900/50 text-white placeholder:text-gray-400 focus:border-blue-400"
                    />
                  </div>
                  <div>
                    <Label htmlFor="pincode">Pincode</Label>
                    <Input
                      id="pincode"
                      value={shippingAddress.pincode}
                      onChange={(e) => setShippingAddress({...shippingAddress, pincode: e.target.value})}
                      required
                      className="border-white bg-gray-900/50 text-white placeholder:text-gray-400 focus:border-blue-400"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Billing Address */}
            <Card>
              <CardHeader>
                <CardTitle>Billing Address</CardTitle>
                <CardDescription>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={billingAddress.sameAsShipping}
                      onChange={(e) => setBillingAddress({...billingAddress, sameAsShipping: e.target.checked})}
                    />
                    <span>Same as shipping address</span>
                  </label>
                </CardDescription>
              </CardHeader>
              {!billingAddress.sameAsShipping && (
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="billingFirstName">First Name</Label>
                      <Input
                        id="billingFirstName"
                        value={billingAddress.firstName}
                        onChange={(e) => setBillingAddress({...billingAddress, firstName: e.target.value})}
                        className="border-white bg-gray-900/50 text-white placeholder:text-gray-400 focus:border-blue-400"
                      />
                    </div>
                    <div>
                      <Label htmlFor="billingLastName">Last Name</Label>
                      <Input
                        id="billingLastName"
                        value={billingAddress.lastName}
                        onChange={(e) => setBillingAddress({...billingAddress, lastName: e.target.value})}
                        className="border-white bg-gray-900/50 text-white placeholder:text-gray-400 focus:border-blue-400"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="billingEmail">Email</Label>
                    <Input
                      id="billingEmail"
                      type="email"
                      value={billingAddress.email}
                      onChange={(e) => setBillingAddress({...billingAddress, email: e.target.value})}
                      className="border-white bg-gray-900/50 text-white placeholder:text-gray-400 focus:border-blue-400"
                    />
                  </div>
                  <div>
                    <Label htmlFor="billingPhone">Phone</Label>
                    <Input
                      id="billingPhone"
                      value={billingAddress.phone}
                      onChange={(e) => setBillingAddress({...billingAddress, phone: e.target.value})}
                      className="border-white bg-gray-900/50 text-white placeholder:text-gray-400 focus:border-blue-400"
                    />
                  </div>
                  <div>
                    <Label htmlFor="billingAddress">Address</Label>
                    <Textarea
                      id="billingAddress"
                      value={billingAddress.address}
                      onChange={(e) => setBillingAddress({...billingAddress, address: e.target.value})}
                      className="border-white bg-gray-900/50 text-white placeholder:text-gray-400 focus:border-blue-400"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="billingCity">City</Label>
                      <Input
                        id="billingCity"
                        value={billingAddress.city}
                        onChange={(e) => setBillingAddress({...billingAddress, city: e.target.value})}
                        className="border-white bg-gray-900/50 text-white placeholder:text-gray-400 focus:border-blue-400"
                      />
                    </div>
                    <div>
                      <Label htmlFor="billingState">State</Label>
                      <Input
                        id="billingState"
                        value={billingAddress.state}
                        onChange={(e) => setBillingAddress({...billingAddress, state: e.target.value})}
                        className="border-white bg-gray-900/50 text-white placeholder:text-gray-400 focus:border-blue-400"
                      />
                    </div>
                    <div>
                      <Label htmlFor="billingPincode">Pincode</Label>
                      <Input
                        id="billingPincode"
                        value={billingAddress.pincode}
                        onChange={(e) => setBillingAddress({...billingAddress, pincode: e.target.value})}
                        className="border-white bg-gray-900/50 text-white placeholder:text-gray-400 focus:border-blue-400"
                      />
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Order Notes */}
            <Card>
              <CardHeader>
                <CardTitle>Order Notes</CardTitle>
                <CardDescription>Any special instructions for your order</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Special delivery instructions, gift message, etc."
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                />
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Order Summary & Payment */}
          <div className="space-y-6">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <Package className="h-8 w-8 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-gray-600">
                        {item.size && `Size: ${item.size}`}
                        {item.color && ` • Color: ${item.color}`}
                      </p>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">₹{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                ))}

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (GST)</span>
                    <span>₹{tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>₹{total.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="razorpay"
                      checked={paymentMethod === 'razorpay'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span>Online Payment (Cards, UPI, Net Banking)</span>
                  </label>
                  {codAvailable && (
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={paymentMethod === 'cod'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      <span>Cash on Delivery (COD)</span>
                    </label>
                  )}
                </div>

                {paymentMethod === 'razorpay' && (
                  <RazorpayPayment
                    amount={total}
                    currency="INR"
                    description={`Order for ${cartItems.length} item(s)`}
                    customerEmail={shippingAddress.email}
                    customerPhone={shippingAddress.phone}
                    customerName={`${shippingAddress.firstName} ${shippingAddress.lastName}`}
                    orderId={`ORDER_${Date.now()}`}
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                  />
                )}

                {paymentMethod === 'cod' && (
                  <div className="space-y-4">
                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>
                        Cash on Delivery is available for your location. 
                        You will pay ₹{total.toLocaleString()} when your order is delivered.
                      </AlertDescription>
                    </Alert>
                    <Button
                      onClick={() => {
                        toast({
                          title: 'Order Placed Successfully!',
                          description: 'Your COD order has been confirmed. You will receive a confirmation email shortly.',
                        });
                        router.push('/order-confirmation?payment_method=cod');
                      }}
                      className="w-full"
                      size="lg"
                    >
                      Place COD Order
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      </main>
      <Footer />
    </div>
  );
}