'use client';

import React, { useState } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Icons } from '@/components/ui/icons';
import Link from 'next/link';

const returnReasons = [
  { id: 'size', label: 'Wrong Size', description: 'Item doesn\'t fit as expected' },
  { id: 'quality', label: 'Quality Issue', description: 'Defective or damaged item' },
  { id: 'description', label: 'Not as Described', description: 'Item differs from website description' },
  { id: 'change', label: 'Changed Mind', description: 'No longer want the item' },
  { id: 'duplicate', label: 'Duplicate Order', description: 'Ordered by mistake' },
  { id: 'other', label: 'Other', description: 'Different reason' }
];

const returnSteps = [
  {
    step: 1,
    title: 'Initiate Return',
    description: 'Log into your account and select the items you want to return',
    icon: Icons.user,
    details: [
      'Go to your order history',
      'Find the order you want to return',
      'Click "Return Items"',
      'Select items and reason for return'
    ]
  },
  {
    step: 2,
    title: 'Print Return Label',
    description: 'Download and print the prepaid return shipping label',
    icon: Icons.shoppingCart,
    details: [
      'Download the return label',
      'Print on standard 8.5x11" paper',
      'Cut along the dotted lines',
      'Keep the tracking portion for your records'
    ]
  },
  {
    step: 3,
    title: 'Package Items',
    description: 'Pack your items securely in the original packaging',
    icon: Icons.shoppingCart,
    details: [
      'Use original packaging when possible',
      'Include all tags and accessories',
      'Ensure items are clean and unworn',
      'Attach return label securely'
    ]
  },
  {
    step: 4,
    title: 'Drop Off Package',
    description: 'Drop off at any authorized shipping location',
    icon: Icons.shoppingCart,
    details: [
      'Take to UPS, FedEx, or USPS location',
      'Get receipt as proof of shipment',
      'Track your return online',
      'We\'ll process within 2-3 days of receipt'
    ]
  }
];

export default function ReturnsPage() {
  const [selectedTab, setSelectedTab] = useState('policy');

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 animate-fade-in-up">
            <h1 className="font-heading font-bold text-4xl sm:text-5xl lg:text-6xl mb-6">
              Returns & Exchanges
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Not completely satisfied with your THE BLACKEGE purchase? No worries. 
              We've got a simple return process to make things right.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="text-center animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icons.shoppingCart className="h-6 w-6" />
                </div>
                <div className="font-bold text-2xl mb-1">30 Days</div>
                <div className="text-sm text-muted-foreground">Return Window</div>
              </CardContent>
            </Card>
            
            <Card className="text-center animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icons.shoppingCart className="h-6 w-6" />
                </div>
                <div className="font-bold text-2xl mb-1">Free</div>
                <div className="text-sm text-muted-foreground">Returns on Defects</div>
              </CardContent>
            </Card>
            
            <Card className="text-center animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icons.shoppingCart className="h-6 w-6" />
                </div>
                <div className="font-bold text-2xl mb-1">5-7 Days</div>
                <div className="text-sm text-muted-foreground">Refund Processing</div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mb-16">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="policy">Return Policy</TabsTrigger>
              <TabsTrigger value="process">Return Process</TabsTrigger>
              <TabsTrigger value="exchanges">Exchanges</TabsTrigger>
              <TabsTrigger value="faq">FAQ</TabsTrigger>
            </TabsList>

            {/* Return Policy Tab */}
            <TabsContent value="policy" className="mt-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="animate-fade-in-up">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Icons.shoppingCart className="h-5 w-5 text-green-600" />
                      What Can Be Returned
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <Icons.shoppingCart className="h-4 w-4 text-green-600 mt-0.5" />
                        <div>
                          <div className="font-medium">Regular Items</div>
                          <div className="text-sm text-muted-foreground">
                            Full refund within 30 days, $7.99 return shipping
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <Icons.shoppingCart className="h-4 w-4 text-green-600 mt-0.5" />
                        <div>
                          <div className="font-medium">Defective Items</div>
                          <div className="text-sm text-muted-foreground">
                            Full refund + free return shipping
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <Icons.shoppingCart className="h-4 w-4 text-green-600 mt-0.5" />
                        <div>
                          <div className="font-medium">Wrong Item Sent</div>
                          <div className="text-sm text-muted-foreground">
                            Full refund + free return shipping + expedited replacement
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <Icons.shoppingCart className="h-4 w-4 text-orange-600 mt-0.5" />
                        <div>
                          <div className="font-medium">Sale Items</div>
                          <div className="text-sm text-muted-foreground">
                            14-day return window, must be in perfect condition
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Icons.x className="h-5 w-5 text-red-600" />
                      What Cannot Be Returned
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <Icons.x className="h-4 w-4 text-red-600 mt-0.5" />
                        <div>
                          <div className="font-medium">Worn Items</div>
                          <div className="text-sm text-muted-foreground">
                            Items showing signs of wear, washing, or damage
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <Icons.x className="h-4 w-4 text-red-600 mt-0.5" />
                        <div>
                          <div className="font-medium">Final Sale Items</div>
                          <div className="text-sm text-muted-foreground">
                            Items marked "Final Sale" at checkout
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <Icons.x className="h-4 w-4 text-red-600 mt-0.5" />
                        <div>
                          <div className="font-medium">Custom/Personalized</div>
                          <div className="text-sm text-muted-foreground">
                            Items with custom prints or personalization
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <Icons.x className="h-4 w-4 text-red-600 mt-0.5" />
                        <div>
                          <div className="font-medium">After 30 Days</div>
                          <div className="text-sm text-muted-foreground">
                            Returns initiated after 30-day window
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Return Conditions */}
              <Card className="mt-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <CardHeader>
                  <CardTitle>Return Conditions</CardTitle>
                  <CardDescription>
                    To ensure a smooth return process, please make sure your items meet these requirements:
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-medium text-green-600">✓ Required for Return</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <Icons.shoppingCart className="h-3 w-3 text-green-600" />
                          Original tags still attached
                        </li>
                        <li className="flex items-center gap-2">
                          <Icons.shoppingCart className="h-3 w-3 text-green-600" />
                          Items in original condition (unworn, unwashed)
                        </li>
                        <li className="flex items-center gap-2">
                          <Icons.shoppingCart className="h-3 w-3 text-green-600" />
                          Original packaging when possible
                        </li>
                        <li className="flex items-center gap-2">
                          <Icons.shoppingCart className="h-3 w-3 text-green-600" />
                          Return initiated within time window
                        </li>
                        <li className="flex items-center gap-2">
                          <Icons.shoppingCart className="h-3 w-3 text-green-600" />
                          Proof of purchase (order number)
                        </li>
                      </ul>
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="font-medium text-red-600">✗ Will Cause Return Denial</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <Icons.x className="h-3 w-3 text-red-600" />
                          Missing or removed tags
                        </li>
                        <li className="flex items-center gap-2">
                          <Icons.x className="h-3 w-3 text-red-600" />
                          Signs of wear or washing
                        </li>
                        <li className="flex items-center gap-2">
                          <Icons.x className="h-3 w-3 text-red-600" />
                          Stains, odors, or damage
                        </li>
                        <li className="flex items-center gap-2">
                          <Icons.x className="h-3 w-3 text-red-600" />
                          Returns after deadline
                        </li>
                        <li className="flex items-center gap-2">
                          <Icons.x className="h-3 w-3 text-red-600" />
                          Items from unauthorized sellers
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Return Process Tab */}
            <TabsContent value="process" className="mt-8">
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold mb-4">Simple 4-Step Return Process</h2>
                  <p className="text-muted-foreground">
                    Follow these easy steps to return your THE BLACKEGE items
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {returnSteps.map((step, index) => (
                    <Card 
                      key={step.step} 
                      className="animate-fade-in-up"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <CardHeader className="text-center">
                        <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4">
                          <step.icon className="h-6 w-6" />
                        </div>
                        <CardTitle className="text-lg">
                          Step {step.step}: {step.title}
                        </CardTitle>
                        <CardDescription>{step.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul className="text-xs space-y-1 text-muted-foreground">
                          {step.details.map((detail, idx) => (
                            <li key={idx} className="flex items-center gap-2">
                              <Icons.shoppingCart className="h-2 w-2" />
                              {detail}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Start Return Button */}
                <div className="text-center mt-12">
                  <Card className="max-w-md mx-auto">
                    <CardContent className="pt-6">
                      <h3 className="font-bold text-lg mb-2">Ready to Start a Return?</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Log into your account to begin the return process
                      </p>
                      <div className="space-y-3">
                        <Button size="lg" className="w-full" asChild>
                          <Link href="/account">
                            <Icons.user className="mr-2 h-4 w-4" />
                            Start Return Process
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <Link href="/contact">Need Help? Contact Support</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Exchanges Tab */}
            <TabsContent value="exchanges" className="mt-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="animate-fade-in-up">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Icons.shoppingCart className="h-5 w-5" />
                      Size Exchanges
                    </CardTitle>
                    <CardDescription>
                      Need a different size? We make it easy to get the perfect fit.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <div className="font-medium text-green-800 mb-2">Free Size Exchanges</div>
                      <div className="text-sm text-green-700">
                        Exchange for a different size within 14 days - no extra shipping charges!
                      </div>
                    </div>
                    
                    <div className="space-y-3 text-sm">
                      <div className="flex items-start gap-3">
                        <Icons.shoppingCart className="h-4 w-4 text-primary mt-0.5" />
                        <div>
                          <div className="font-medium">Same Style Exchange</div>
                          <div className="text-muted-foreground">
                            Exchange for the same item in a different size
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <Icons.shoppingCart className="h-4 w-4 text-primary mt-0.5" />
                        <div>
                          <div className="font-medium">Fast Processing</div>
                          <div className="text-muted-foreground">
                            New size ships as soon as we receive your return
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <Icons.shoppingCart className="h-4 w-4 text-primary mt-0.5" />
                        <div>
                          <div className="font-medium">Size Guide Help</div>
                          <div className="text-muted-foreground">
                            Use our detailed size guide to find your perfect fit
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Icons.shoppingCart className="h-5 w-5" />
                      Style Exchanges
                    </CardTitle>
                    <CardDescription>
                      Want to try a different style or color? Here's how it works.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <div className="font-medium text-blue-800 mb-2">Style Exchange Process</div>
                      <div className="text-sm text-blue-700">
                        Return original item and place new order. We'll refund the difference if applicable.
                      </div>
                    </div>
                    
                    <div className="space-y-3 text-sm">
                      <div className="flex items-start gap-3">
                        <Icons.shoppingCart className="h-4 w-4 text-primary mt-0.5" />
                        <div>
                          <div className="font-medium">Different Color/Style</div>
                          <div className="text-muted-foreground">
                            Return original and order new style separately
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <Icons.shoppingCart className="h-4 w-4 text-primary mt-0.5" />
                        <div>
                          <div className="font-medium">Price Difference</div>
                          <div className="text-muted-foreground">
                            We'll refund or charge the difference as needed
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <Icons.shoppingCart className="h-4 w-4 text-primary mt-0.5" />
                        <div>
                          <div className="font-medium">Contact Support</div>
                          <div className="text-muted-foreground">
                            Reach out for help with complex exchanges
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Exchange Timeline */}
              <Card className="mt-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <CardHeader>
                  <CardTitle>Exchange Timeline</CardTitle>
                  <CardDescription>
                    Here's what to expect when you exchange an item with us
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-medium">1</div>
                      <div className="font-medium text-sm">Initiate Exchange</div>
                      <div className="text-xs text-muted-foreground">Same day</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-medium">2</div>
                      <div className="font-medium text-sm">Ship Original</div>
                      <div className="text-xs text-muted-foreground">1-2 days</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-medium">3</div>
                      <div className="font-medium text-sm">We Process</div>
                      <div className="text-xs text-muted-foreground">2-3 days</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-medium">4</div>
                      <div className="font-medium text-sm">New Item Ships</div>
                      <div className="text-xs text-muted-foreground">Same day</div>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-muted rounded-lg">
                    <div className="text-sm">
                      <strong>Total Timeline:</strong> Most exchanges are completed within 7-10 business days from when you ship the original item back to us.
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* FAQ Tab */}
            <TabsContent value="faq" className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="animate-fade-in-up">
                  <CardHeader>
                    <CardTitle className="text-lg">How long do refunds take?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Refunds are processed within 5-7 business days after we receive your return. 
                      The time it takes to appear in your account depends on your bank or credit card company.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                  <CardHeader>
                    <CardTitle className="text-lg">Can I return items bought on sale?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Yes, but sale items have a shorter 14-day return window and must be in perfect condition. 
                      Items marked "Final Sale" cannot be returned.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                  <CardHeader>
                    <CardTitle className="text-lg">What if my item was damaged?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      If you received a damaged item, we'll provide a full refund plus free return shipping. 
                      Contact customer service immediately with photos of the damage.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                  <CardHeader>
                    <CardTitle className="text-lg">Can I return items without a receipt?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      You don't need a physical receipt, but you do need your order number. 
                      Check your email confirmation or log into your account to find it.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                  <CardHeader>
                    <CardTitle className="text-lg">Do you accept returns from international customers?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Yes, but international customers are responsible for return shipping costs. 
                      We recommend using a tracked shipping method for returns.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                  <CardHeader>
                    <CardTitle className="text-lg">What happens if you don't receive my return?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Always keep your shipping receipt and tracking number. If a return goes missing, 
                      we'll work with the carrier to locate it and resolve the issue.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          {/* Contact Section */}
          <Card className="animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icons.user className="h-5 w-5" />
                Need Help with Returns?
              </CardTitle>
              <CardDescription>
                Our customer service team is here to make your return experience smooth and hassle-free.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                  <Icons.user className="h-6 w-6" />
                  <span className="font-medium">Live Chat</span>
                  <span className="text-sm text-muted-foreground">Get instant help</span>
                </Button>
                
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2" asChild>
                  <Link href="/account">
                    <Icons.user className="h-6 w-6" />
                    <span className="font-medium">Start Return</span>
                    <span className="text-sm text-muted-foreground">In your account</span>
                  </Link>
                </Button>
                
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2" asChild>
                  <Link href="/contact">
                    <Icons.user className="h-6 w-6" />
                    <span className="font-medium">Contact Support</span>
                    <span className="text-sm text-muted-foreground">Email or phone</span>
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
