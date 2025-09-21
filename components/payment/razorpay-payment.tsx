'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CreditCard, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { createOrder, verifyPayment, getPaymentConfig, CreateOrderRequest, PaymentConfig } from '@/lib/api/razorpay';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface RazorpayPaymentProps {
  amount: number;
  currency?: string;
  description?: string;
  customerEmail?: string;
  customerPhone?: string;
  customerName?: string;
  orderId?: string;
  productId?: string;
  productName?: string;
  quantity?: number;
  onSuccess?: (paymentData: any) => void;
  onError?: (error: string) => void;
  className?: string;
}

export function RazorpayPayment({
  amount,
  currency = 'INR',
  description,
  customerEmail,
  customerPhone,
  customerName,
  orderId,
  productId,
  productName,
  quantity = 1,
  onSuccess,
  onError,
  className
}: RazorpayPaymentProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [paymentConfig, setPaymentConfig] = useState<PaymentConfig | null>(null);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const { toast } = useToast();

  // Load Razorpay script
  useEffect(() => {
    const loadRazorpayScript = () => {
      return new Promise((resolve) => {
        if (window.Razorpay) {
          setRazorpayLoaded(true);
          resolve(true);
          return;
        }

        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => {
          setRazorpayLoaded(true);
          resolve(true);
        };
        script.onerror = () => {
          console.error('Failed to load Razorpay script');
          resolve(false);
        };
        document.body.appendChild(script);
      });
    };

    loadRazorpayScript();
  }, []);

  // Load payment configuration
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const config = await getPaymentConfig();
        setPaymentConfig(config);
      } catch (error) {
        console.error('Failed to load payment config:', error);
        toast({
          title: 'Error',
          description: 'Failed to load payment configuration',
          variant: 'destructive',
        });
      }
    };

    if (razorpayLoaded) {
      loadConfig();
    }
  }, [razorpayLoaded, toast]);

  const handlePayment = async () => {
    if (!razorpayLoaded || !paymentConfig) {
      toast({
        title: 'Error',
        description: 'Payment system is not ready. Please try again.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      // Create order
      const orderRequest: CreateOrderRequest = {
        amount,
        currency,
        description: description || `Payment for ${productName || 'order'}`,
        customerEmail,
        customerPhone,
        customerName,
        orderId,
        productId,
        productName,
        quantity,
      };

      const order = await createOrder(orderRequest);

      // Configure Razorpay options
      const options = {
        key: paymentConfig.keyId,
        amount: order.amount * 100, // Convert to paise
        currency: order.currency,
        name: 'THE BLACKEGE',
        description: order.description,
        image: '/logo.png',
        order_id: order.id,
        handler: async (response: any) => {
          setIsVerifying(true);
          try {
            // Verify payment
            const verificationResult = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verificationResult.success) {
              toast({
                title: 'Payment Successful',
                description: 'Your payment has been processed successfully.',
              });
              onSuccess?.(verificationResult.payment);
            } else {
              toast({
                title: 'Payment Failed',
                description: verificationResult.message || 'Payment verification failed.',
                variant: 'destructive',
              });
              onError?.(verificationResult.message || 'Payment verification failed');
            }
          } catch (error) {
            console.error('Payment verification failed:', error);
            toast({
              title: 'Payment Failed',
              description: 'Failed to verify payment. Please contact support.',
              variant: 'destructive',
            });
            onError?.('Payment verification failed');
          } finally {
            setIsVerifying(false);
          }
        },
        prefill: {
          name: customerName || '',
          email: customerEmail || '',
          contact: customerPhone || '',
        },
        notes: {
          order_id: orderId,
          product_id: productId,
          product_name: productName,
          quantity: quantity.toString(),
        },
        theme: {
          color: '#000000',
        },
        modal: {
          ondismiss: () => {
            setIsLoading(false);
          },
        },
      };

      // Open Razorpay checkout
      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error) {
      console.error('Payment failed:', error);
      toast({
        title: 'Payment Failed',
        description: 'Failed to initiate payment. Please try again.',
        variant: 'destructive',
      });
      onError?.('Failed to initiate payment');
    } finally {
      setIsLoading(false);
    }
  };

  if (!razorpayLoaded) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <span>Loading payment system...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!paymentConfig) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>
              Payment system is not available. Please try again later.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Payment
        </CardTitle>
        <CardDescription>
          Complete your payment securely with Razorpay
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Amount</Label>
          <div className="text-2xl font-bold">
            ₹{amount.toLocaleString()} {currency}
          </div>
        </div>

        {description && (
          <div className="space-y-2">
            <Label>Description</Label>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
        )}

        <div className="space-y-2">
          <Label>Payment Methods</Label>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span>Credit/Debit Cards</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span>Net Banking</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span>UPI</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span>Wallets</span>
          </div>
        </div>

        <Button
          onClick={handlePayment}
          disabled={isLoading || isVerifying}
          className="w-full"
          size="lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Processing...
            </>
          ) : isVerifying ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Verifying Payment...
            </>
          ) : (
            <>
              <CreditCard className="h-4 w-4 mr-2" />
              Pay ₹{amount.toLocaleString()}
            </>
          )}
        </Button>

        <div className="text-xs text-gray-500 text-center">
          Your payment is secured with 256-bit SSL encryption
        </div>
      </CardContent>
    </Card>
  );
}
