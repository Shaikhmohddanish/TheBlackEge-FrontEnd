'use client';

import React from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { companyDetails } from '@/lib/config/company-details';
import { FileText, CheckCircle, Shield, Building2, MapPin, Phone, Mail } from 'lucide-react';

export default function GSTCompliancePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-2">GST Compliance</h1>
            <p className="text-lg text-gray-600">Official GST registration and compliance information</p>
          </div>

          {/* GST Registration Certificate */}
          <Card className="border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-800">
                <FileText className="h-5 w-5" />
                GST Registration Certificate
              </CardTitle>
              <CardDescription>Form GST REG-06 - Registration Certificate</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Registration Number</label>
                    <p className="text-xl font-mono font-bold text-green-800">{companyDetails.gstin}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Legal Name</label>
                    <p className="text-lg font-semibold">{companyDetails.legalName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Trade Name</label>
                    <p className="text-lg font-semibold text-blue-600">{companyDetails.tradeName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Constitution of Business</label>
                    <p className="text-lg">{companyDetails.businessType}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Date of Liability</label>
                    <p className="text-lg">{companyDetails.dateOfLiability}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Period of Validity</label>
                    <p className="text-lg">From: {companyDetails.registrationPeriod.from}</p>
                    <p className="text-lg">To: {companyDetails.registrationPeriod.to}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Type of Registration</label>
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      Regular
                    </Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Particulars of Approving</label>
                    <p className="text-lg">{companyDetails.address.state}</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Address Details */}
              <div className="space-y-4">
                <h4 className="font-semibold text-lg">Address of Principal Place of Business</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm leading-relaxed">
                    <strong>Floor No.:</strong> 3rd Floor<br />
                    <strong>Building No./Flat No.:</strong> {companyDetails.address.flat}<br />
                    <strong>Name Of Premises/Building:</strong> {companyDetails.address.building}<br />
                    <strong>Road/Street:</strong> {companyDetails.address.road}<br />
                    <strong>Nearby Landmark:</strong> Mumbra<br />
                    <strong>Locality/Sub Locality:</strong> {companyDetails.address.locality}<br />
                    <strong>City/Town/Village:</strong> {companyDetails.address.city}<br />
                    <strong>District:</strong> {companyDetails.address.district}<br />
                    <strong>State:</strong> {companyDetails.address.state}<br />
                    <strong>PIN Code:</strong> {companyDetails.address.pincode}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* MSME Registration */}
          <Card className="border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-800">
                <Building2 className="h-5 w-5" />
                MSME Registration (Udyam)
              </CardTitle>
              <CardDescription>Ministry of Micro, Small and Medium Enterprises</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Udyam Registration Number</label>
                    <p className="text-xl font-mono font-bold text-blue-800">{companyDetails.udyamRegistrationNumber}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Type of Enterprise</label>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      {companyDetails.enterpriseType}
                    </Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Major Activity</label>
                    <p className="text-lg">{companyDetails.majorActivity}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Social Category</label>
                    <p className="text-lg">{companyDetails.socialCategory}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Date of Incorporation</label>
                    <p className="text-lg">{companyDetails.dateOfIncorporation}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Date of Commencement</label>
                    <p className="text-lg">{companyDetails.dateOfCommencement}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Industry Classification</label>
                    <p className="text-sm">
                      NIC 2 Digit: {companyDetails.industryCode.nic2Digit} - {companyDetails.industryCode.nic2DigitDesc}<br />
                      NIC 4 Digit: {companyDetails.industryCode.nic4Digit} - {companyDetails.industryCode.nic4DigitDesc}<br />
                      NIC 5 Digit: {companyDetails.industryCode.nic5Digit} - {companyDetails.industryCode.nic5DigitDesc}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Compliance Status */}
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-800">
                <Shield className="h-5 w-5" />
                Compliance Status
              </CardTitle>
              <CardDescription>Current compliance and registration status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-semibold text-green-800">GST Registered</p>
                      <p className="text-sm text-green-600">Active since {companyDetails.dateOfLiability}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-semibold text-green-800">MSME Registered</p>
                      <p className="text-sm text-green-600">Micro enterprise classification</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-semibold text-green-800">Tax Compliant</p>
                      <p className="text-sm text-green-600">All returns filed on time</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-semibold text-green-800">Business Active</p>
                      <p className="text-sm text-green-600">Operations ongoing since {companyDetails.dateOfCommencement}</p>
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
                Contact Information
              </CardTitle>
              <CardDescription>How to reach us for compliance queries</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-gray-600">{companyDetails.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="font-medium">Mobile</p>
                      <p className="text-gray-600">{companyDetails.mobile}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Address</p>
                      <p className="text-sm text-gray-600 leading-relaxed">
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
          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="pt-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-yellow-800 mb-2">Important Notice</h3>
                <p className="text-yellow-700 text-sm leading-relaxed">
                  The registration certificate is required to be prominently displayed at all places of business in the State. 
                  This is a system generated digitally signed Registration Certificate issued based on the approval of application 
                  granted on {companyDetails.dateOfLiability} by the jurisdictional authority.
                </p>
                <div className="mt-4 flex justify-center gap-4">
                  <Badge variant="outline" className="border-yellow-300 text-yellow-700">
                    GST Compliant
                  </Badge>
                  <Badge variant="outline" className="border-yellow-300 text-yellow-700">
                    MSME Registered
                  </Badge>
                  <Badge variant="outline" className="border-yellow-300 text-yellow-700">
                    Tax Compliant
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
