'use client';

import React from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { companyDetails } from '@/lib/config/company-details';
import { FileText, Shield, AlertTriangle, CheckCircle, Phone, Mail, MapPin } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-2">Terms and Conditions</h1>
            <p className="text-lg text-gray-600">Please read these terms carefully before using our services</p>
            <p className="text-sm text-gray-500 mt-2">Last updated: {new Date().toLocaleDateString()}</p>
          </div>

          {/* Company Information */}
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-800">
                <FileText className="h-5 w-5" />
                Company Information
              </CardTitle>
            </CardHeader>
            <CardContent className='text-black'>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="font-semibold">{companyDetails.tradeName}</p>
                  <p className="text-sm text-gray-600">Legal Name: {companyDetails.legalName}</p>
                  <p className="text-sm text-gray-600">GSTIN: {companyDetails.gstin}</p>
                  <p className="text-sm text-gray-600">Business Type: {companyDetails.businessType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">
                    {companyDetails.address.flat}, {companyDetails.address.building}<br />
                    {companyDetails.address.road}, {companyDetails.address.locality}<br />
                    {companyDetails.address.city}, {companyDetails.address.state} - {companyDetails.address.pincode}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Acceptance of Terms */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                1. Acceptance of Terms
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement. 
                If you do not agree to abide by the above, please do not use this service.
              </p>
            </CardContent>
          </Card>

          {/* Product Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                2. Product Information and Pricing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Pricing and Taxes</h4>
                <p className="text-gray-700 leading-relaxed">
                  The prices of products displayed on our website are inclusive of applicable taxes but exclude customs duties. 
                  All applicable customs duties shall be borne by the customer for international orders.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Product Descriptions</h4>
                <p className="text-gray-700 leading-relaxed">
                  We strive to provide accurate product descriptions, images, and specifications. However, we do not warrant that 
                  product descriptions or other content is accurate, complete, reliable, current, or error-free.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Availability</h4>
                <p className="text-gray-700 leading-relaxed">
                  Product availability is subject to change without notice. We reserve the right to discontinue any product at any time.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Orders and Payment */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                3. Orders and Payment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Order Processing</h4>
                <p className="text-gray-700 leading-relaxed">
                  All orders are subject to acceptance and availability. We reserve the right to refuse or cancel your order at any time 
                  for certain reasons including but not limited to: product or service availability, errors in the description or price 
                  of the product or service, or error in your order.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Payment Methods</h4>
                <p className="text-gray-700 leading-relaxed">
                  We accept various payment methods including credit cards, debit cards, net banking, UPI, and Cash on Delivery (COD) 
                  for select regions. Payment must be received before order processing.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Cash on Delivery (COD)</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700 mb-2">
                    <strong>Additional Details:</strong> Select Cash on Delivery for a convenient payment option. Pay in cash when your 
                    order is delivered right to your doorstep. Available for select regions only. Please ensure someone is available 
                    to receive and pay for the delivery.
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>Payment Instructions:</strong> Thank you for choosing Cash on Delivery. Please prepare the exact amount in 
                    cash to make the payment smoother for our delivery partner. In case of any issues, feel free to contact our 
                    customer support team.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shipping and Delivery */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                4. Shipping and Delivery
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Delivery Timeframes</h4>
                <p className="text-gray-700 leading-relaxed">
                  We aim to process and ship orders within 2-3 business days. Delivery times vary by location and shipping method selected.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Shipping Charges</h4>
                <p className="text-gray-700 leading-relaxed">
                  Shipping charges will be borne by the customer unless otherwise specified. Free shipping may be available for orders 
                  above a certain value.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Delivery Address</h4>
                <p className="text-gray-700 leading-relaxed">
                  Please ensure that the delivery address provided is accurate and complete. We are not responsible for delays or 
                  non-delivery due to incorrect address information.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Returns and Exchanges */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                5. Returns, Exchanges, and Refunds
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Replacements and Exchanges */}
              <div>
                <h4 className="font-semibold mb-3 text-lg">Replacements and Exchanges</h4>
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h5 className="font-semibold text-green-800 mb-2">India</h5>
                      <p className="text-sm text-green-700">30 days replacements from the date of product delivered</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h5 className="font-semibold text-blue-800 mb-2">International</h5>
                      <p className="text-sm text-blue-700">30 days replacements from the date of product delivered</p>
                    </div>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      <strong>Important:</strong> Shipping charges for replacement requests will be borne by THE BLACKEGE. 
                      Exchanges will be processed only for the same amount as the original order value or a higher amount.
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Returns and Refunds */}
              <div>
                <h4 className="font-semibold mb-3 text-lg">Returns and Refunds</h4>
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h5 className="font-semibold text-green-800 mb-2">India</h5>
                      <p className="text-sm text-green-700">30 days returns from the date of product delivered</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h5 className="font-semibold text-blue-800 mb-2">International</h5>
                      <p className="text-sm text-blue-700">30 days returns from the date of product delivery</p>
                    </div>
                  </div>
                  
                  <div className="bg-red-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-red-800 mb-2">Shipping Charges for Returns</h5>
                    <p className="text-sm text-red-700 mb-2">
                      Shipping charges will be borne by the customer if you wish to return the piece. You will be charged Rs. 100 
                      which will be deducted from the refund amount.
                    </p>
                    <p className="text-sm text-red-700">
                      Shipping will be borne by THE BLACKEGE only under the following conditions:
                    </p>
                    <ul className="text-sm text-red-700 mt-2 ml-4 list-disc">
                      <li>If there is manufacturing defect in the piece</li>
                      <li>If the package is received damaged</li>
                    </ul>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-gray-800 mb-2">Refund Processing</h5>
                    <p className="text-sm text-gray-700">
                      Refunds will be processed within 2-3 business days after the product reaches our warehouse and runs through 
                      a quality check within 24 hours. Thereafter on approval, the refund will reflect in your original payment 
                      mode within 20 business days.
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
                <h4 className="font-semibold mb-3 text-lg">Return Conditions</h4>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="text-sm text-yellow-800 font-semibold mb-2">Please note:</p>
                  <ul className="text-sm text-yellow-700 ml-4 list-disc space-y-1">
                    <li>The product must be returned unused</li>
                    <li>All tags and labels should be attached</li>
                    <li>Original packaging should be intact</li>
                    <li>Products must be in original condition</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* User Responsibilities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                6. User Responsibilities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-gray-700 leading-relaxed">
                  By using our website, you agree to:
                </p>
                <ul className="text-gray-700 ml-4 list-disc space-y-2">
                  <li>Provide accurate and complete information when placing orders</li>
                  <li>Maintain the confidentiality of your account credentials</li>
                  <li>Use the website only for lawful purposes</li>
                  <li>Not attempt to gain unauthorized access to our systems</li>
                  <li>Respect intellectual property rights</li>
                  <li>Comply with all applicable laws and regulations</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Limitation of Liability */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                7. Limitation of Liability
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                To the fullest extent permitted by law, THE BLACKEGE shall not be liable for any indirect, incidental, special, 
                consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other 
                intangible losses, resulting from your use of the website or services.
              </p>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="border-green-200 bg-green-50 text-black">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-800">
                <Phone className="h-5 w-5" />
                Contact Information
              </CardTitle>
              <CardDescription>For any inquiries regarding these terms</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-sm text-green-700">{companyDetails.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium">Phone</p>
                      <p className="text-sm text-green-700">{companyDetails.mobile}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Address</p>
                      <p className="text-sm text-green-700">
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

          {/* Footer Notice */}
          <Card className="border-gray-200">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  These terms and conditions are governed by the laws of India. Any disputes arising from these terms 
                  will be subject to the exclusive jurisdiction of the courts in {companyDetails.address.state}, India.
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  © {new Date().getFullYear()} {companyDetails.tradeName}. All rights reserved.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}