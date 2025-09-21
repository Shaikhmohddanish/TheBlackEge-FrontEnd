'use client';

import React from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Truck, 
  RotateCcw, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  MapPin,
  Package,
  Shield,
  Phone,
  Mail
} from 'lucide-react';
import { companyDetails } from '@/lib/config/company-details';

export default function ShippingReturnsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="space-y-8">
            {/* Header */}
            <div className="text-center">
              <h1 className="text-4xl font-bold text-white mb-2">Shipping & Returns</h1>
              <p className="text-lg text-gray-600">Everything you need to know about shipping and returns</p>
            </div>

          {/* Shipping Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Shipping Information
              </CardTitle>
              <CardDescription>Delivery details and shipping options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg">Processing Time</h4>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-800">
                      We aim to process and ship orders within <strong>2-3 business days</strong> from the date of order confirmation.
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg">Delivery Timeframes</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-green-600" />
                      <span className="text-sm">India: 3-7 business days</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">International: 7-14 business days</span>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-semibold text-lg">Shipping Charges</h4>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>Note:</strong> Shipping charges will be borne by the customer unless otherwise specified. 
                    Free shipping may be available for orders above a certain value. Check our current promotions for details.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-lg">Delivery Address</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700">
                    Please ensure that the delivery address provided is accurate and complete. We are not responsible for 
                    delays or non-delivery due to incorrect address information. If you need to change your delivery 
                    address, please contact us immediately after placing your order.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Returns and Exchanges */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RotateCcw className="h-5 w-5" />
                Returns & Exchanges
              </CardTitle>
              <CardDescription>Our return and exchange policies</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Return Timeframes */}
              <div>
                <h4 className="font-semibold text-lg mb-4">Return Timeframes</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      India
                    </h5>
                    <p className="text-sm text-green-700">
                      <strong>Returns:</strong> 30 days from the date of product delivery<br />
                      <strong>Exchanges:</strong> 30 days from the date of product delivery
                    </p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      International
                    </h5>
                    <p className="text-sm text-blue-700">
                      <strong>Returns:</strong> 30 days from the date of product delivery<br />
                      <strong>Exchanges:</strong> 30 days from the date of product delivery
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Exchange Policy */}
              <div>
                <h4 className="font-semibold text-lg mb-4">Exchange Policy</h4>
                <div className="space-y-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-green-800 mb-2">Exchange Conditions</h5>
                    <ul className="text-sm text-green-700 space-y-1 ml-4 list-disc">
                      <li>Exchanges will be processed only for the same amount as the original order value or a higher amount</li>
                      <li>Shipping charges for replacement requests will be borne by THE BLACKEGE</li>
                      <li>Product must be returned unused with all tags and labels attached</li>
                      <li>Original packaging should be intact</li>
                    </ul>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Return Policy */}
              <div>
                <h4 className="font-semibold text-lg mb-4">Return Policy</h4>
                <div className="space-y-4">
                  <div className="bg-red-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-red-800 mb-2">Return Shipping Charges</h5>
                    <p className="text-sm text-red-700 mb-2">
                      <strong>Customer Responsibility:</strong> Shipping charges will be borne by the customer if you wish to return the piece. 
                      You will be charged <strong>Rs. 100</strong> which will be deducted from the refund amount.
                    </p>
                    <p className="text-sm text-red-700">
                      <strong>THE BLACKEGE Responsibility:</strong> Shipping will be borne by THE BLACKEGE only under the following conditions:
                    </p>
                    <ul className="text-sm text-red-700 mt-2 ml-4 list-disc">
                      <li>If there is manufacturing defect in the piece</li>
                      <li>If the package is received damaged</li>
                    </ul>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Refund Process */}
              <div>
                <h4 className="font-semibold text-lg mb-4">Refund Process</h4>
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-gray-800 mb-2">Standard Refund Process</h5>
                    <p className="text-sm text-gray-700">
                      Refunds will be processed within <strong>2-3 business days</strong> after the product reaches our warehouse 
                      and runs through a quality check within 24 hours. Thereafter on approval, the refund will reflect in your 
                      original payment mode within <strong>20 business days</strong>.
                    </p>
                  </div>
                  
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-orange-800 mb-2">Cancelled Orders</h5>
                    <p className="text-sm text-orange-700">
                      If an order is canceled after the product has been shipped from our warehouse, the refund will be then processed 
                      only after it reaches back to our warehouse and runs through the quality check. On approval, it will then follow 
                      the standard refund procedure as mentioned above.
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Return Conditions */}
              <div>
                <h4 className="font-semibold text-lg mb-4">Return Conditions</h4>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h5 className="font-semibold text-yellow-800 mb-2">Important Requirements</h5>
                  <ul className="text-sm text-yellow-700 space-y-1 ml-4 list-disc">
                    <li>The product must be returned unused</li>
                    <li>All tags and labels should be attached</li>
                    <li>Original packaging should be intact</li>
                    <li>Products must be in original condition</li>
                    <li>No signs of wear or damage</li>
                    <li>All accessories and documentation included</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quality Assurance */}
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-800">
                <Shield className="h-5 w-5" />
                Quality Assurance
              </CardTitle>
              <CardDescription>Our commitment to quality</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-semibold text-green-800">Quality Check</p>
                      <p className="text-sm text-green-700">Every returned item undergoes thorough quality inspection</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-semibold text-green-800">Fast Processing</p>
                      <p className="text-sm text-green-700">Quality checks completed within 24 hours</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-semibold text-green-800">Secure Handling</p>
                      <p className="text-sm text-green-700">Your items are handled with care and security</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-semibold text-green-800">Transparent Process</p>
                      <p className="text-sm text-green-700">Clear communication throughout the process</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Need Help?
              </CardTitle>
              <CardDescription>Contact us for any shipping or return queries</CardDescription>
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
                  <div className="flex items-start gap-3">
                    <Package className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Return Address</p>
                      <p className="text-sm text-gray-600">
                        {companyDetails.address.flat}, {companyDetails.address.building}<br />
                        {companyDetails.address.road}, {companyDetails.address.locality}<br />
                        {companyDetails.address.city}, {companyDetails.address.state} - {companyDetails.address.pincode}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Important Notice */}
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="pt-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-orange-800 mb-2">Important Notice</h3>
                <p className="text-orange-700 text-sm leading-relaxed">
                  For any other inquiries regarding shipping, returns, or exchanges, please contact us via EMAIL or WHATSAPP. 
                  Our customer support team is available to assist you with any questions or concerns.
                </p>
                <div className="mt-4 flex justify-center gap-4 flex-wrap">
                  <Badge variant="outline" className="border-orange-300 text-orange-700">
                    30-Day Returns
                  </Badge>
                  <Badge variant="outline" className="border-orange-300 text-orange-700">
                    Quality Guaranteed
                  </Badge>
                  <Badge variant="outline" className="border-orange-300 text-orange-700">
                    Fast Processing
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      </main>
      <Footer />
    </div>
  );
}
