'use client';

import React, { useState } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Icons } from '@/components/ui/icons';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';

const cookieCategories = [
  {
    id: 'essential',
    name: 'Essential Cookies',
    description: 'Required for basic website functionality',
    required: true,
    cookies: [
      {
        name: 'session_id',
        purpose: 'Maintains your session while browsing',
        duration: 'Session',
        type: 'HTTP Cookie'
      },
      {
        name: 'cart_items',
        purpose: 'Stores items in your shopping cart',
        duration: '7 days',
        type: 'Local Storage'
      },
      {
        name: 'auth_token',
        purpose: 'Keeps you logged into your account',
        duration: '30 days',
        type: 'HTTP Cookie'
      },
      {
        name: 'csrf_token',
        purpose: 'Security protection against cross-site attacks',
        duration: 'Session',
        type: 'HTTP Cookie'
      }
    ]
  },
  {
    id: 'analytics',
    name: 'Analytics Cookies',
    description: 'Help us understand how visitors use our website',
    required: false,
    cookies: [
      {
        name: '_ga',
        purpose: 'Google Analytics - tracks unique visitors',
        duration: '2 years',
        type: 'HTTP Cookie'
      },
      {
        name: '_gid',
        purpose: 'Google Analytics - tracks session information',
        duration: '24 hours',
        type: 'HTTP Cookie'
      },
      {
        name: '_gat',
        purpose: 'Google Analytics - throttles request rate',
        duration: '1 minute',
        type: 'HTTP Cookie'
      },
      {
        name: 'hotjar_session',
        purpose: 'Hotjar - user behavior analytics',
        duration: '30 minutes',
        type: 'HTTP Cookie'
      }
    ]
  },
  {
    id: 'marketing',
    name: 'Marketing Cookies',
    description: 'Used to deliver relevant advertisements and track campaign performance',
    required: false,
    cookies: [
      {
        name: '_fbp',
        purpose: 'Facebook Pixel - tracks conversions and retargeting',
        duration: '90 days',
        type: 'HTTP Cookie'
      },
      {
        name: '_gcl_au',
        purpose: 'Google Ads - conversion tracking',
        duration: '90 days',
        type: 'HTTP Cookie'
      },
      {
        name: 'instagram_session',
        purpose: 'Instagram integration and social sharing',
        duration: '1 year',
        type: 'HTTP Cookie'
      },
      {
        name: 'email_campaign_id',
        purpose: 'Tracks email marketing campaign effectiveness',
        duration: '30 days',
        type: 'HTTP Cookie'
      }
    ]
  },
  {
    id: 'preferences',
    name: 'Preference Cookies',
    description: 'Remember your settings and preferences for a better experience',
    required: false,
    cookies: [
      {
        name: 'theme_preference',
        purpose: 'Remembers your dark/light mode preference',
        duration: '1 year',
        type: 'Local Storage'
      },
      {
        name: 'language_preference',
        purpose: 'Stores your preferred language setting',
        duration: '1 year',
        type: 'Local Storage'
      },
      {
        name: 'currency_preference',
        purpose: 'Remembers your preferred currency',
        duration: '90 days',
        type: 'HTTP Cookie'
      },
      {
        name: 'size_guide_dismissed',
        purpose: 'Remembers if you\'ve dismissed size guide prompts',
        duration: '30 days',
        type: 'Local Storage'
      }
    ]
  }
];

export default function CookiePolicyPage() {
  const [cookieSettings, setCookieSettings] = useState({
    essential: true,
    analytics: true,
    marketing: false,
    preferences: true
  });

  const handleCookieToggle = (category: string, enabled: boolean) => {
    if (category === 'essential') return; // Essential cookies cannot be disabled
    
    setCookieSettings(prev => ({
      ...prev,
      [category]: enabled
    }));
  };

  const saveSettings = () => {
    // In a real implementation, this would save to localStorage and update actual cookie consent
    // You would typically also reload the page or update tracking scripts here
  };

  const acceptAllCookies = () => {
    setCookieSettings({
      essential: true,
      analytics: true,
      marketing: true,
      preferences: true
    });
  };

  const rejectAllOptional = () => {
    setCookieSettings({
      essential: true,
      analytics: false,
      marketing: false,
      preferences: false
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 animate-fade-in-up">
            <h1 className="font-heading font-bold text-4xl sm:text-5xl lg:text-6xl mb-6">
              Cookie Policy
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Learn about how THE BLACKEGE uses cookies and similar technologies to improve 
              your shopping experience and provide personalized services.
            </p>
            <div className="flex items-center justify-center gap-4 mt-6 text-sm text-muted-foreground">
              <div>Last Updated: December 2024</div>
              <div>•</div>
              <div>Effective Date: December 2024</div>
            </div>
          </div>

          {/* Cookie Consent Manager */}
          <Card className="mb-12 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icons.shoppingCart className="h-5 w-5" />
                Cookie Preferences
              </CardTitle>
              <CardDescription>
                Manage your cookie preferences and control what data we collect
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {cookieCategories.map((category) => (
                  <div key={category.id} className="flex items-start justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium">{category.name}</h4>
                        {category.required && (
                          <Badge variant="secondary">Required</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {category.description}
                      </p>
                      <div className="text-xs text-muted-foreground">
                        {category.cookies.length} cookie{category.cookies.length !== 1 ? 's' : ''} in this category
                      </div>
                    </div>
                    <div className="ml-4">
                      <Switch
                        checked={cookieSettings[category.id as keyof typeof cookieSettings]}
                        onCheckedChange={(enabled) => handleCookieToggle(category.id, enabled)}
                        disabled={category.required}
                      />
                    </div>
                  </div>
                ))}
                
                <div className="flex flex-wrap gap-3 pt-4 border-t">
                  <Button onClick={acceptAllCookies}>
                    Accept All Cookies
                  </Button>
                  <Button variant="outline" className="text-white hover:text-white" onClick={rejectAllOptional}>
                    Reject Optional Cookies
                  </Button>
                  <Button variant="outline" className="text-white hover:text-white" onClick={saveSettings}>
                    Save Preferences
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Content */}
          <Tabs defaultValue="overview" className="mb-16">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="categories">Cookie Categories</TabsTrigger>
              <TabsTrigger value="management">Cookie Management</TabsTrigger>
              <TabsTrigger value="third-party">Third-Party Cookies</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="mt-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="animate-fade-in-up">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Icons.shoppingCart className="h-5 w-5" />
                      What Are Cookies?
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Cookies are small text files that are stored on your device when you visit our website. 
                      They help us provide you with a better shopping experience by remembering your preferences 
                      and enabling certain website features.
                    </p>
                    
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <Icons.shoppingCart className="h-4 w-4 text-green-600 mt-0.5" />
                        <div>
                          <div className="font-medium text-sm">Session Cookies</div>
                          <div className="text-xs text-muted-foreground">
                            Temporary cookies that expire when you close your browser
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <Icons.shoppingCart className="h-4 w-4 text-blue-600 mt-0.5" />
                        <div>
                          <div className="font-medium text-sm">Persistent Cookies</div>
                          <div className="text-xs text-muted-foreground">
                            Remain on your device for a specified period or until deleted
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <Icons.shoppingCart className="h-4 w-4 text-purple-600 mt-0.5" />
                        <div>
                          <div className="font-medium text-sm">First-Party Cookies</div>
                          <div className="text-xs text-muted-foreground">
                            Set directly by THE BLACKEGE website
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <Icons.shoppingCart className="h-4 w-4 text-orange-600 mt-0.5" />
                        <div>
                          <div className="font-medium text-sm">Third-Party Cookies</div>
                          <div className="text-xs text-muted-foreground">
                            Set by external services we use (analytics, advertising)
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Icons.user className="h-5 w-5" />
                      Why We Use Cookies
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      We use cookies to enhance your shopping experience and provide you with 
                      personalized services. Here's how cookies help us serve you better:
                    </p>
                    
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <Icons.shoppingCart className="h-4 w-4 text-green-600 mt-0.5" />
                        <div>
                          <div className="font-medium text-sm">Remember Your Preferences</div>
                          <div className="text-xs text-muted-foreground">
                            Keep your shopping cart, login status, and site preferences
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <Icons.shoppingCart className="h-4 w-4 text-blue-600 mt-0.5" />
                        <div>
                          <div className="font-medium text-sm">Improve Website Performance</div>
                          <div className="text-xs text-muted-foreground">
                            Analyze how you use our site to make it faster and better
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <Icons.shoppingCart className="h-4 w-4 text-purple-600 mt-0.5" />
                        <div>
                          <div className="font-medium text-sm">Personalize Your Experience</div>
                          <div className="text-xs text-muted-foreground">
                            Show relevant products and content based on your interests
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <Icons.shoppingCart className="h-4 w-4 text-orange-600 mt-0.5" />
                        <div>
                          <div className="font-medium text-sm">Provide Relevant Marketing</div>
                          <div className="text-xs text-muted-foreground">
                            Show you ads for products you might be interested in
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Cookie Categories Tab */}
            <TabsContent value="categories" className="mt-8">
              <div className="space-y-6">
                {cookieCategories.map((category, index) => (
                  <Card 
                    key={category.id}
                    className="animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <CardTitle className="text-lg">{category.name}</CardTitle>
                          {category.required && (
                            <Badge variant="secondary">Required</Badge>
                          )}
                        </div>
                        <Switch
                          checked={cookieSettings[category.id as keyof typeof cookieSettings]}
                          onCheckedChange={(enabled) => handleCookieToggle(category.id, enabled)}
                          disabled={category.required}
                        />
                      </div>
                      <CardDescription>{category.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left p-3 font-medium">Cookie Name</th>
                              <th className="text-left p-3 font-medium">Purpose</th>
                              <th className="text-left p-3 font-medium">Duration</th>
                              <th className="text-left p-3 font-medium">Type</th>
                            </tr>
                          </thead>
                          <tbody>
                            {category.cookies.map((cookie) => (
                              <tr key={cookie.name} className="border-b">
                                <td className="p-3 font-medium">{cookie.name}</td>
                                <td className="p-3">{cookie.purpose}</td>
                                <td className="p-3">{cookie.duration}</td>
                                <td className="p-3">
                                  <Badge variant="outline" className="text-xs">
                                    {cookie.type}
                                  </Badge>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Cookie Management Tab */}
            <TabsContent value="management" className="mt-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="animate-fade-in-up">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Icons.shoppingCart className="h-5 w-5" />
                      Browser Settings
                    </CardTitle>
                    <CardDescription>
                      Control cookies through your browser settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3 text-sm">
                      <div>
                        <div className="font-medium mb-1">Google Chrome</div>
                        <div className="text-muted-foreground">
                          Settings → Privacy and Security → Cookies and other site data
                        </div>
                      </div>
                      
                      <div>
                        <div className="font-medium mb-1">Mozilla Firefox</div>
                        <div className="text-muted-foreground">
                          Options → Privacy & Security → Cookies and Site Data
                        </div>
                      </div>
                      
                      <div>
                        <div className="font-medium mb-1">Safari</div>
                        <div className="text-muted-foreground">
                          Preferences → Privacy → Manage Website Data
                        </div>
                      </div>
                      
                      <div>
                        <div className="font-medium mb-1">Microsoft Edge</div>
                        <div className="text-muted-foreground">
                          Settings → Cookies and site permissions → Cookies and site data
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-muted rounded-lg">
                      <div className="text-sm">
                        <strong>Note:</strong> Disabling cookies may affect website functionality 
                        and your shopping experience.
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Icons.user className="h-5 w-5" />
                      Opt-Out Options
                    </CardTitle>
                    <CardDescription>
                      Additional ways to control tracking and advertising
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3 text-sm">
                      <div>
                        <div className="font-medium mb-1">Google Analytics</div>
                        <div className="text-muted-foreground">
                          Install the Google Analytics Opt-out Browser Add-on
                        </div>
                      </div>
                      
                      <div>
                        <div className="font-medium mb-1">Facebook Pixel</div>
                        <div className="text-muted-foreground">
                          Adjust your Facebook Ad Preferences settings
                        </div>
                      </div>
                      
                      <div>
                        <div className="font-medium mb-1">Network Advertising Initiative</div>
                        <div className="text-muted-foreground">
                          Use NAI's opt-out tool for behavioral advertising
                        </div>
                      </div>
                      
                      <div>
                        <div className="font-medium mb-1">Your Online Choices</div>
                        <div className="text-muted-foreground">
                          European opt-out tool for online behavioral advertising
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-muted rounded-lg">
                      <div className="text-sm">
                        <strong>Do Not Track:</strong> We respect browser Do Not Track signals 
                        and will not track users who have enabled this setting.
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Third-Party Cookies Tab */}
            <TabsContent value="third-party" className="mt-8">
              <div className="space-y-6">
                <Card className="animate-fade-in-up">
                  <CardHeader>
                    <CardTitle>Third-Party Services We Use</CardTitle>
                    <CardDescription>
                      External services that may set cookies on our website
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="font-medium">Analytics & Performance</h4>
                        <div className="space-y-3 text-sm">
                          <div className="flex items-start gap-3">
                            <Icons.shoppingCart className="h-4 w-4 text-blue-600 mt-0.5" />
                            <div>
                              <div className="font-medium">Google Analytics</div>
                              <div className="text-muted-foreground">Website usage statistics and insights</div>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-3">
                            <Icons.shoppingCart className="h-4 w-4 text-orange-600 mt-0.5" />
                            <div>
                              <div className="font-medium">Hotjar</div>
                              <div className="text-muted-foreground">User behavior analysis and heatmaps</div>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-3">
                            <Icons.shoppingCart className="h-4 w-4 text-green-600 mt-0.5" />
                            <div>
                              <div className="font-medium">Google PageSpeed Insights</div>
                              <div className="text-muted-foreground">Website performance monitoring</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h4 className="font-medium">Marketing & Advertising</h4>
                        <div className="space-y-3 text-sm">
                          <div className="flex items-start gap-3">
                            <Icons.shoppingCart className="h-4 w-4 text-blue-600 mt-0.5" />
                            <div>
                              <div className="font-medium">Facebook Pixel</div>
                              <div className="text-muted-foreground">Conversion tracking and retargeting</div>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-3">
                            <Icons.shoppingCart className="h-4 w-4 text-red-600 mt-0.5" />
                            <div>
                              <div className="font-medium">Google Ads</div>
                              <div className="text-muted-foreground">Advertising campaign tracking</div>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-3">
                            <Icons.shoppingCart className="h-4 w-4 text-purple-600 mt-0.5" />
                            <div>
                              <div className="font-medium">Instagram</div>
                              <div className="text-muted-foreground">Social media integration and sharing</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                  <CardHeader>
                    <CardTitle>Third-Party Privacy Policies</CardTitle>
                    <CardDescription>
                      Learn more about how our partners handle your data
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <Button variant="outline" className="text-white hover:text-white" className="h-auto p-4 flex flex-col items-center gap-2" asChild>
                        <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
                          <Icons.shoppingCart className="h-6 w-6" />
                          <span className="font-medium">Google Privacy Policy</span>
                          <span className="text-sm text-muted-foreground">Analytics & Ads</span>
                        </a>
                      </Button>
                      
                      <Button variant="outline" className="text-white hover:text-white" className="h-auto p-4 flex flex-col items-center gap-2" asChild>
                        <a href="https://www.facebook.com/privacy/policy/" target="_blank" rel="noopener noreferrer">
                          <Icons.shoppingCart className="h-6 w-6" />
                          <span className="font-medium">Facebook Privacy Policy</span>
                          <span className="text-sm text-muted-foreground">Pixel & Social</span>
                        </a>
                      </Button>
                      
                      <Button variant="outline" className="text-white hover:text-white" className="h-auto p-4 flex flex-col items-center gap-2" asChild>
                        <a href="https://www.hotjar.com/legal/policies/privacy/" target="_blank" rel="noopener noreferrer">
                          <Icons.shoppingCart className="h-6 w-6" />
                          <span className="font-medium">Hotjar Privacy Policy</span>
                          <span className="text-sm text-muted-foreground">User Analytics</span>
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          {/* Contact Section */}
          <Card className="animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icons.user className="h-5 w-5" />
                Questions About Cookies?
              </CardTitle>
              <CardDescription>
                Contact us if you have questions about our cookie policy or need help managing your preferences.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="text-white hover:text-white" className="h-auto p-4 flex flex-col items-center gap-2" asChild>
                  <a href="mailto:privacy@theblackege.com">
                    <Icons.user className="h-6 w-6" />
                    <span className="font-medium">Privacy Team</span>
                    <span className="text-sm text-muted-foreground">privacy@theblackege.com</span>
                  </a>
                </Button>
                
                <Button variant="outline" className="text-white hover:text-white" className="h-auto p-4 flex flex-col items-center gap-2" asChild>
                  <Link href="/contact">
                    <Icons.user className="h-6 w-6" />
                    <span className="font-medium">Contact Support</span>
                    <span className="text-sm text-muted-foreground">General inquiries</span>
                  </Link>
                </Button>
                
                <Button variant="outline" className="text-white hover:text-white" className="h-auto p-4 flex flex-col items-center gap-2" asChild>
                  <Link href="/privacy">
                    <Icons.shoppingCart className="h-6 w-6" />
                    <span className="font-medium">Privacy Policy</span>
                    <span className="text-sm text-muted-foreground">Full privacy details</span>
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
