'use client';

import React from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { companyDetails, getFullAddress, getGSTDisplay, getUdyamDisplay, getIndustryDescription } from '@/lib/config/company-details';
import { Building2, MapPin, Phone, Mail, FileText, Award, Users, DollarSign } from 'lucide-react';

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-2">Legal Information</h1>
            <p className="text-lg text-gray-600">Official company details and registrations</p>
          </div>

          {/* Company Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Company Overview
              </CardTitle>
              <CardDescription>Basic business information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Legal Name</label>
                  <p className="text-lg font-semibold">{companyDetails.legalName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Trade Name</label>
                  <p className="text-lg font-semibold text-blue-600">{companyDetails.tradeName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Business Type</label>
                  <p className="text-lg">{companyDetails.businessType}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Constitution</label>
                  <p className="text-lg">{companyDetails.constitution}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Registration Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Registration Details
              </CardTitle>
              <CardDescription>Official government registrations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* GST Registration */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    GST Registered
                  </Badge>
                  <span className="text-sm text-gray-600">Goods and Services Tax</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">GSTIN</label>
                    <p className="text-lg font-mono font-semibold">{companyDetails.gstin}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">PAN</label>
                    <p className="text-lg font-mono font-semibold">{companyDetails.pan}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Registration Date</label>
                    <p className="text-lg">{companyDetails.dateOfLiability}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Jurisdictional Office</label>
                    <p className="text-lg">{companyDetails.jurisdictionalOffice}</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Udyam Registration */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    MSME Registered
                  </Badge>
                  <span className="text-sm text-gray-600">Ministry of Micro, Small and Medium Enterprises</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Udyam Registration Number</label>
                    <p className="text-lg font-mono font-semibold">{companyDetails.udyamRegistrationNumber}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Enterprise Type</label>
                    <p className="text-lg">{companyDetails.enterpriseType}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Major Activity</label>
                    <p className="text-lg">{companyDetails.majorActivity}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Registration Date</label>
                    <p className="text-lg">{companyDetails.dateOfIncorporation}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Business Address */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Business Address
              </CardTitle>
              <CardDescription>Principal place of business</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Complete Address</label>
                  <p className="text-lg leading-relaxed">{getFullAddress()}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Coordinates</label>
                    <p className="text-sm font-mono">
                      {companyDetails.coordinates.latitude}, {companyDetails.coordinates.longitude}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">State</label>
                    <p className="text-lg">{companyDetails.address.state}</p>
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
              <CardDescription>How to reach us</CardDescription>
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
                  <div>
                    <p className="font-medium">Bank Details</p>
                    <p className="text-sm text-gray-600">
                      {companyDetails.bank.name}<br />
                      IFSC: {companyDetails.bank.ifscCode}<br />
                      A/C: {companyDetails.bank.accountNumber}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Business Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Business Details
              </CardTitle>
              <CardDescription>Industry classification and operations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Industry Classification */}
              <div className="space-y-3">
                <h4 className="font-semibold">Industry Classification</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">NIC 2 Digit</label>
                    <p className="text-lg">{companyDetails.industryCode.nic2Digit} - {companyDetails.industryCode.nic2DigitDesc}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">NIC 4 Digit</label>
                    <p className="text-lg">{companyDetails.industryCode.nic4Digit} - {companyDetails.industryCode.nic4DigitDesc}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">NIC 5 Digit</label>
                    <p className="text-lg">{companyDetails.industryCode.nic5Digit} - {companyDetails.industryCode.nic5DigitDesc}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Activity</label>
                    <p className="text-lg">{companyDetails.majorActivity}</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Employment & Investment */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Employment
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Male</label>
                      <p className="text-lg font-semibold">{companyDetails.employment.male}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Female</label>
                      <p className="text-lg font-semibold">{companyDetails.employment.female}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Total</label>
                      <p className="text-lg font-semibold">{companyDetails.employment.total}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Investment & Turnover
                  </h4>
                  <div className="space-y-2">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Plant & Machinery</label>
                      <p className="text-lg font-semibold">₹{companyDetails.investment.plantAndMachinery.toLocaleString()}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Total Turnover</label>
                      <p className="text-lg font-semibold">₹{companyDetails.investment.totalTurnover.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Compliance Notice */}
          <Card className="border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-green-800 mb-2">Compliance Notice</h3>
                <p className="text-green-700">
                  This business is registered under GST and MSME schemes. 
                  All transactions are conducted in compliance with applicable laws and regulations.
                </p>
                <div className="mt-4 flex justify-center gap-4">
                  <Badge variant="outline" className="border-green-300 text-green-700">
                    GST Compliant
                  </Badge>
                  <Badge variant="outline" className="border-green-300 text-green-700">
                    MSME Registered
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
