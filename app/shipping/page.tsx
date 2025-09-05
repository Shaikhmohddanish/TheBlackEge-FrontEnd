'use client';

import React from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons';
import Link from 'next/link';

const shippingOptions = [
  {
    name: 'Standard Shipping',
    time: '5-7 Business Days',
    price: 'FREE on orders ₹2,500+',
    regularPrice: '₹99',
    description: 'Perfect for regular orders when you can wait a bit for that fresh streetwear.',
    icon: Icons.shoppingCart,
    features: ['Tracking included', 'Signature not required', 'Leave at door option']
  },
  {
    name: 'Express Shipping',
    time: '2-3 Business Days',
    price: '₹199',
    regularPrice: null,
    description: 'When you need your streetwear fix fast. Great for last-minute outfit needs.',
    icon: Icons.shoppingCart,
    features: ['Priority handling', 'Tracking included', 'Signature required']
  },
  {
    name: 'Same Day Delivery',
    time: 'Same Day (Metro Cities)',
    price: '₹299',
    regularPrice: null,
    description: 'Same day delivery within Delhi, Mumbai, Bangalore, Chennai, Hyderabad, and Pune.',
    icon: Icons.shoppingCart,
    features: ['Same day delivery', 'Available in metro cities', 'Tracking included', 'Order by 2 PM']
  }
];

const regionalShipping = [
  {
    region: 'North India (Delhi, Punjab, Haryana, UP)',
    time: '2-4 Business Days',
    price: '₹79',
    duties: 'No additional charges'
  },
  {
    region: 'West India (Mumbai, Gujarat, Rajasthan)',
    time: '3-5 Business Days',
    price: '₹99',
    duties: 'No additional charges'
  },
  {
    region: 'South India (Bangalore, Chennai, Hyderabad)',
    time: '3-6 Business Days',
    price: '₹129',
    duties: 'No additional charges'
  },
  {
    region: 'East India (Kolkata, Bhubaneswar)',
    time: '4-7 Business Days',
    price: '₹149',
    duties: 'No additional charges'
  },
  {
    region: 'Northeast India',
    time: '5-8 Business Days',
    price: '₹199',
    duties: 'No additional charges'
  },
  {
    region: 'Remote Areas & Islands',
    time: '7-10 Business Days',
    price: '₹299',
    duties: 'May require additional verification'
  }
];

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 animate-fade-in-up">
            <h1 className="font-heading font-bold text-4xl sm:text-5xl lg:text-6xl mb-6">
              Shipping Information
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Get your THE BLACKEGE streetwear delivered fast and secure. We ship worldwide 
              with multiple options to fit your needs and timeline.
            </p>
          </div>

          {/* Domestic Shipping Options */}
          <div className="mb-16">
            <h2 className="font-heading font-bold text-3xl mb-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              Domestic Shipping (India)
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {shippingOptions.map((option, index) => (
                <Card 
                  key={option.name} 
                  className="animate-fade-in-up hover:shadow-lg transition-shadow"
                  style={{ animationDelay: `${0.2 + index * 0.1}s` }}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <option.icon className="h-8 w-8 text-primary" />
                      {option.name === 'Standard Shipping' && (
                        <Badge className="bg-green-100 text-green-800">Most Popular</Badge>
                      )}
                    </div>
                    <CardTitle className="text-xl">{option.name}</CardTitle>
                    <CardDescription className="text-base">
                      {option.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Delivery Time:</span>
                      <Badge variant="outline">{option.time}</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Price:</span>
                      <div className="text-right">
                        <div className="font-semibold text-primary">{option.price}</div>
                        {option.regularPrice && (
                          <div className="text-xs text-muted-foreground">
                            Regular: {option.regularPrice}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="pt-2 border-t">
                      <h4 className="text-sm font-medium mb-2">Features:</h4>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        {option.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <Icons.shoppingCart className="h-3 w-3 text-green-600" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Regional Shipping */}
          <div className="mb-16">
            <h2 className="font-heading font-bold text-3xl mb-8 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
              Regional Shipping Across India
            </h2>
            
            <Card className="animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icons.shoppingCart className="h-5 w-5" />
                  All India Delivery
                </CardTitle>
                <CardDescription>
                  We ship THE BLACKEGE streetwear across India. Delivery times and costs vary by region.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {regionalShipping.map((region, index) => (
                    <div 
                      key={region.region}
                      className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                    >
                      <h4 className="font-semibold text-foreground mb-2">{region.region}</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Delivery:</span>
                          <span>{region.time}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Shipping:</span>
                          <span className="font-medium">{region.price}</span>
                        </div>
                        <div className="text-xs text-muted-foreground pt-1 border-t">
                          {region.duties}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">International Shipping Notes:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Customs duties and taxes are the responsibility of the recipient</li>
                    <li>• Delivery times may vary due to customs processing</li>
                    <li>• All international orders include tracking</li>
                    <li>• Orders over $200 USD include complimentary insurance</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Processing & Fulfillment */}
          <div className="mb-16">
            <h2 className="font-heading font-bold text-3xl mb-8 animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
              Processing & Fulfillment
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icons.shoppingCart className="h-5 w-5" />
                    Order Processing
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">1</div>
                      <div>
                        <div className="font-medium">Order Confirmation</div>
                        <div className="text-sm text-muted-foreground">Immediate email confirmation</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">2</div>
                      <div>
                        <div className="font-medium">Processing Time</div>
                        <div className="text-sm text-muted-foreground">1-2 business days</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">3</div>
                      <div>
                        <div className="font-medium">Shipping Notification</div>
                        <div className="text-sm text-muted-foreground">Email with tracking number</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">4</div>
                      <div>
                        <div className="font-medium">Delivery</div>
                        <div className="text-sm text-muted-foreground">Based on selected shipping method</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="animate-fade-in-up" style={{ animationDelay: '0.9s' }}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icons.shoppingCart className="h-5 w-5" />
                    Important Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3 text-sm">
                    <div>
                      <div className="font-medium mb-1">Business Days</div>
                      <div className="text-muted-foreground">Monday - Friday, excluding holidays</div>
                    </div>
                    
                    <div>
                      <div className="font-medium mb-1">Cut-off Time</div>
                      <div className="text-muted-foreground">Orders placed by 2 PM EST ship same day</div>
                    </div>
                    
                    <div>
                      <div className="font-medium mb-1">Weekend Orders</div>
                      <div className="text-muted-foreground">Processed on next business day</div>
                    </div>
                    
                    <div>
                      <div className="font-medium mb-1">Holiday Processing</div>
                      <div className="text-muted-foreground">May experience delays during peak seasons</div>
                    </div>
                    
                    <div>
                      <div className="font-medium mb-1">Address Changes</div>
                      <div className="text-muted-foreground">Contact us within 1 hour of ordering</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Tracking & Delivery */}
          <div className="mb-16">
            <h2 className="font-heading font-bold text-3xl mb-8 animate-fade-in-up" style={{ animationDelay: '1.0s' }}>
              Tracking & Delivery
            </h2>
            
            <Card className="animate-fade-in-up" style={{ animationDelay: '1.1s' }}>
              <CardHeader>
                <CardTitle>Stay Updated on Your Order</CardTitle>
                <CardDescription>
                  Track your THE BLACKEGE order every step of the way from our warehouse to your door.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Tracking Methods:</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <Icons.shoppingCart className="h-4 w-4 text-green-600" />
                      Email notifications with tracking links
                    </li>
                    <li className="flex items-center gap-2">
                      <Icons.shoppingCart className="h-4 w-4 text-green-600" />
                      SMS updates (optional)
                    </li>
                    <li className="flex items-center gap-2">
                      <Icons.shoppingCart className="h-4 w-4 text-green-600" />
                      Account dashboard tracking
                    </li>
                    <li className="flex items-center gap-2">
                      <Icons.shoppingCart className="h-4 w-4 text-green-600" />
                      Real-time carrier tracking
                    </li>
                  </ul>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium">Delivery Options:</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <Icons.shoppingCart className="h-4 w-4 text-blue-600" />
                      Standard doorstep delivery
                    </li>
                    <li className="flex items-center gap-2">
                      <Icons.shoppingCart className="h-4 w-4 text-blue-600" />
                      Signature required (Express/Overnight)
                    </li>
                    <li className="flex items-center gap-2">
                      <Icons.shoppingCart className="h-4 w-4 text-blue-600" />
                      Hold at carrier location
                    </li>
                    <li className="flex items-center gap-2">
                      <Icons.shoppingCart className="h-4 w-4 text-blue-600" />
                      Delivery instructions accepted
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* FAQ Section */}
          <div className="mb-16">
            <h2 className="font-heading font-bold text-3xl mb-8 animate-fade-in-up" style={{ animationDelay: '1.2s' }}>
              Shipping FAQ
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="animate-fade-in-up" style={{ animationDelay: '1.3s' }}>
                <CardHeader>
                  <CardTitle className="text-lg">Can I change my shipping address?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Yes, but only within 1 hour of placing your order. Contact customer service immediately 
                    if you need to change your address. Once processed, we cannot modify the shipping address.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="animate-fade-in-up" style={{ animationDelay: '1.4s' }}>
                <CardHeader>
                  <CardTitle className="text-lg">What if I miss my delivery?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    The carrier will attempt delivery 2-3 times. You can reschedule delivery online or 
                    pick up your package at the nearest carrier location. Check your tracking for options.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="animate-fade-in-up" style={{ animationDelay: '1.5s' }}>
                <CardHeader>
                  <CardTitle className="text-lg">Do you ship to PO Boxes?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    We can ship to PO Boxes using Standard Shipping only. Express and Overnight shipping 
                    require a physical address for signature confirmation.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="animate-fade-in-up" style={{ animationDelay: '1.6s' }}>
                <CardHeader>
                  <CardTitle className="text-lg">What about shipping insurance?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    All orders are automatically insured up to $100. Orders over $100 include full insurance 
                    coverage. We'll handle any claims for lost or damaged packages.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Contact Section */}
          <Card className="animate-fade-in-up" style={{ animationDelay: '1.7s' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icons.user className="h-5 w-5" />
                Need Help with Shipping?
              </CardTitle>
              <CardDescription>
                Our customer service team is here to help with any shipping questions or concerns.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                  <Icons.user className="h-6 w-6" />
                  <span className="font-medium">Live Chat</span>
                  <span className="text-sm text-muted-foreground">Instant help available</span>
                </Button>
                
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2" asChild>
                  <Link href="/track">
                    <Icons.search className="h-6 w-6" />
                    <span className="font-medium">Track Your Order</span>
                    <span className="text-sm text-muted-foreground">Real-time updates</span>
                  </Link>
                </Button>
                
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2" asChild>
                  <Link href="/contact">
                    <Icons.user className="h-6 w-6" />
                    <span className="font-medium">Contact Support</span>
                    <span className="text-sm text-muted-foreground">Get personalized help</span>
                  </Link>
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
