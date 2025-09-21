'use client';

import React from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  CreditCard, 
  Smartphone, 
  Banknote, 
  Shield, 
  CheckCircle, 
  AlertTriangle,
  Lock,
  Clock,
  Phone,
  Mail
} from 'lucide-react';
import { companyDetails } from '@/lib/config/company-details';

export default function PaymentPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-2">Payment Policy</h1>
            <p className="text-lg text-gray-600">Secure payment options and policies</p>
          </div>

          {/* Payment Methods */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Accepted Payment Methods
              </CardTitle>
              <CardDescription>Choose from our secure payment options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg">Online Payment Methods</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <CreditCard className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">Credit Cards</p>
                        <p className="text-sm text-gray-600">Visa, MasterCard, American Express</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <CreditCard className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium">Debit Cards</p>
                        <p className="text-sm text-gray-600">All major debit cards accepted</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Smartphone className="h-5 w-5 text-purple-600" />
                      <div>
                        <p className="font-medium">UPI</p>
                        <p className="text-sm text-gray-600">PhonePe, Google Pay, Paytm, BHIM</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Banknote className="h-5 w-5 text-orange-600" />
                      <div>
                        <p className="font-medium">Net Banking</p>
                        <p className="text-sm text-gray-600">All major banks supported</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg">Cash on Delivery (COD)</h4>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <Banknote className="h-5 w-5 text-blue-600" />
                      <span className="font-semibold text-blue-800">Available for Select Regions</span>
                    </div>
                    <p className="text-sm text-blue-700 mb-3">
                      Pay with cash when your order is delivered right to your doorstep. 
                      Available in select regions only.
                    </p>
                    <div className="space-y-2">
                      <p className="text-xs text-blue-600">
                        <strong>Additional Details:</strong> Select Cash on Delivery for a convenient payment option. 
                        Pay in cash when your order is delivered right to your doorstep. Available for select regions only. 
                        Please ensure someone is available to receive and pay for the delivery.
                      </p>
                      <p className="text-xs text-blue-600">
                        <strong>Payment Instructions:</strong> Thank you for choosing Cash on Delivery. Please prepare the exact 
                        amount in cash to make the payment smoother for our delivery partner. In case of any issues, feel free 
                        to contact our customer support team.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Security */}
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-800">
                <Shield className="h-5 w-5" />
                Payment Security
              </CardTitle>
              <CardDescription>Your payment information is protected</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Lock className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-semibold text-green-800">SSL Encryption</p>
                      <p className="text-sm text-green-700">All transactions are encrypted with 256-bit SSL</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-semibold text-green-800">PCI Compliance</p>
                      <p className="text-sm text-green-700">We follow PCI DSS standards for card security</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-semibold text-green-800">Secure Processing</p>
                      <p className="text-sm text-green-700">Payment processed through trusted gateways</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-semibold text-green-800">Fraud Protection</p>
                      <p className="text-sm text-green-700">Advanced fraud detection and prevention</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Process */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Payment Process
              </CardTitle>
              <CardDescription>How payments are processed</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-sm font-bold">1</span>
                    </div>
                    <h4 className="font-semibold mb-2 text-black">Select Payment</h4>
                    <p className="text-sm text-gray-600">Choose your preferred payment method</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-sm font-bold">2</span>
                    </div>
                    <h4 className="font-semibold mb-2 text-black">Secure Processing</h4>
                    <p className="text-sm text-gray-600">Payment is processed securely</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="bg-purple-600 text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-sm font-bold">3</span>
                    </div>
                    <h4 className="font-semibold mb-2 text-black">Order Confirmation</h4>
                    <p className="text-sm text-gray-600">Receive confirmation and tracking details</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* COD Specific Information */}
          <Card className="border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-800">
                <Banknote className="h-5 w-5" />
                Cash on Delivery (COD) Details
              </CardTitle>
              <CardDescription>Everything you need to know about COD</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-orange-800">COD Process</h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-orange-600 mt-0.5" />
                      <p className="text-sm text-orange-700">
                        Select "Cash on Delivery" during checkout
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-orange-600 mt-0.5" />
                      <p className="text-sm text-orange-700">
                        Ensure someone is available to receive the delivery
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-orange-600 mt-0.5" />
                      <p className="text-sm text-orange-700">
                        Prepare exact cash amount for payment
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-orange-600 mt-0.5" />
                      <p className="text-sm text-orange-700">
                        Pay the delivery partner upon receipt
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-semibold text-orange-800">Important Notes</h4>
                  <div className="space-y-3">
                    <div className="bg-white p-3 rounded-lg">
                      <p className="text-sm text-orange-700">
                        <strong>Availability:</strong> COD is available for select regions only. 
                        Check availability during checkout.
                      </p>
                    </div>
                    <div className="bg-white p-3 rounded-lg">
                      <p className="text-sm text-orange-700">
                        <strong>Payment:</strong> Please have the exact cash amount ready. 
                        Change may not be available.
                      </p>
                    </div>
                    <div className="bg-white p-3 rounded-lg">
                      <p className="text-sm text-orange-700">
                        <strong>Delivery:</strong> Someone must be present to receive and pay for the order.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Refund Policy */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Refund Policy
              </CardTitle>
              <CardDescription>How refunds are processed</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-lg">Refund Processing</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700 mb-3">
                    Refunds will be processed within <strong>2-3 business days</strong> after the product reaches our warehouse 
                    and runs through a quality check within 24 hours. Thereafter on approval, the refund will reflect in your 
                    original payment mode within <strong>20 business days</strong>.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <h5 className="font-semibold text-sm mb-2 text-black">Online Payments</h5>
                      <p className="text-xs text-gray-600">
                        Refunds will be credited to the same payment method used for the original transaction.
                      </p>
                    </div>
                    <div>
                      <h5 className="font-semibold text-sm mb-2">Cash on Delivery</h5>
                      <p className="text-xs text-gray-600">
                        Refunds for COD orders will be processed via bank transfer or other digital payment methods.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-semibold text-lg">Cancelled Orders</h4>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <p className="text-sm text-orange-700">
                    If an order is canceled after the product has been shipped from our warehouse, the refund will be then processed 
                    only after it reaches back to our warehouse and runs through the quality check. On approval, it will then follow 
                    the standard refund procedure as mentioned above.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Payment Support
              </CardTitle>
              <CardDescription>Need help with payments? Contact us</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="font-medium">Email Support</p>
                      <p className="text-sm text-gray-600">{companyDetails.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="font-medium">Phone Support</p>
                      <p className="text-sm text-gray-600">{companyDetails.mobile}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-sm mb-2 text-black">Payment Issues?</h5>
                    <p className="text-xs text-gray-600">
                      If you experience any payment issues or have questions about our payment methods, 
                      please don't hesitate to contact our support team.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Notice */}
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-red-800 mb-2">Security Notice</h3>
                <p className="text-red-700 text-sm leading-relaxed">
                  Never share your payment details with anyone. We will never ask for your card details, 
                  PIN, or OTP over phone, email, or any other communication channel. Always make payments 
                  only through our secure checkout process.
                </p>
                <div className="mt-4 flex justify-center gap-4 flex-wrap">
                  <Badge variant="outline" className="border-red-300 text-red-700">
                    Secure Payments
                  </Badge>
                  <Badge variant="outline" className="border-red-300 text-red-700">
                    SSL Encrypted
                  </Badge>
                  <Badge variant="outline" className="border-red-300 text-red-700">
                    PCI Compliant
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
