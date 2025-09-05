'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Icons } from '@/components/ui/icons';
import { cn } from '@/lib/utils';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
}

const faqData: FAQItem[] = [
  // Shipping & Delivery
  {
    id: '1',
    question: 'How long does shipping take?',
    answer: 'We offer multiple shipping options:\n\n• Standard Shipping (5-7 business days) - Free on orders over $75\n• Express Shipping (2-3 business days) - $12.99\n• Overnight Shipping (1 business day) - $24.99\n\nAll orders are processed within 1-2 business days. You\'ll receive a tracking number once your order ships.',
    category: 'Shipping',
    tags: ['delivery', 'time', 'fast']
  },
  {
    id: '2',
    question: 'Do you ship internationally?',
    answer: 'Yes! We ship worldwide. International shipping times vary by location:\n\n• Canada: 7-14 business days\n• Europe: 10-21 business days\n• Asia: 14-28 business days\n• Australia: 14-21 business days\n\nInternational customers are responsible for any customs duties or taxes.',
    category: 'Shipping',
    tags: ['international', 'worldwide', 'customs']
  },
  {
    id: '3',
    question: 'Can I track my order?',
    answer: 'Absolutely! Once your order ships, you\'ll receive a tracking number via email. You can also track your order by:\n\n• Using our Track Order page\n• Logging into your account\n• Clicking the tracking link in your shipping email\n\nTracking updates every 24 hours.',
    category: 'Shipping',
    tags: ['tracking', 'order', 'status']
  },

  // Returns & Exchanges
  {
    id: '4',
    question: 'What is your return policy?',
    answer: 'We want you to love your THE BLACKEGE pieces! Our return policy:\n\n• 30-day return window from delivery date\n• Items must be unworn with original tags\n• Original packaging required\n• Free returns on defective items\n• Return shipping: $7.99 (deducted from refund)\n\nRefunds are processed within 5-7 business days after we receive your return.',
    category: 'Returns',
    tags: ['return', 'refund', 'exchange']
  },
  {
    id: '5',
    question: 'How do I exchange an item?',
    answer: 'Exchanges are easy:\n\n1. Log into your account and select "Return/Exchange"\n2. Choose the items you want to exchange\n3. Select your new size/color\n4. Print the prepaid return label\n5. Ship the original item back to us\n\nWe\'ll send your exchange item once we receive the original. Exchanges are free for size swaps within 14 days.',
    category: 'Returns',
    tags: ['exchange', 'size', 'swap']
  },
  {
    id: '6',
    question: 'Can I return sale items?',
    answer: 'Sale items can be returned within 14 days of delivery, but they must be in perfect condition. Sale items are final sale after 14 days.\n\n• Original tags must be attached\n• No signs of wear\n• Original packaging\n• Return shipping fees apply\n\nClearance items marked "Final Sale" cannot be returned.',
    category: 'Returns',
    tags: ['sale', 'clearance', 'final']
  },

  // Sizing & Fit
  {
    id: '7',
    question: 'How do I find my size?',
    answer: 'Finding the perfect fit is crucial for streetwear:\n\n• Check our detailed Size Guide for each product\n• Measure yourself with a tape measure\n• Compare with our size charts\n• Read customer reviews for fit insights\n• Contact our style team for personalized advice\n\nOur streetwear tends to run slightly oversized for that authentic urban look.',
    category: 'Sizing',
    tags: ['size', 'fit', 'measurements']
  },
  {
    id: '8',
    question: 'Do your clothes run big or small?',
    answer: 'THE BLACKEGE streetwear is designed with an authentic urban fit:\n\n• Hoodies: Slightly oversized for comfort\n• T-shirts: True to size with relaxed fit\n• Joggers: True to size with tapered leg\n• Jackets: Slightly oversized for layering\n\nWhen in doubt, size down for a more fitted look or size up for the classic oversized streetwear aesthetic.',
    category: 'Sizing',
    tags: ['fit', 'oversized', 'urban']
  },

  // Orders & Payment
  {
    id: '9',
    question: 'What payment methods do you accept?',
    answer: 'We accept all major payment methods:\n\n• Credit/Debit Cards: Visa, Mastercard, RuPay\n• UPI: PhonePe, Google Pay, Paytm, BHIM\n• Digital Wallets: Paytm, Amazon Pay, MobiKwik\n• Net Banking: All major Indian banks\n• Cash on Delivery: Available with ₹49 extra charge\n• EMI Options: Available on orders above ₹5,000\n\nAll payments are processed securely with 256-bit SSL encryption.',
    category: 'Payment',
    tags: ['payment', 'credit card', 'paypal']
  },
  {
    id: '10',
    question: 'Can I cancel or modify my order?',
    answer: 'Order changes depend on timing:\n\n• Within 1 hour: Full cancellation/modification available\n• 1-24 hours: Contact us immediately - we\'ll try our best\n• After 24 hours: Order likely processed and shipped\n\nFor urgent changes, call our customer service team at (555) 123-BLCK or use live chat.',
    category: 'Orders',
    tags: ['cancel', 'modify', 'change']
  },

  // Products & Quality
  {
    id: '11',
    question: 'What materials do you use?',
    answer: 'THE BLACKEGE is committed to quality streetwear:\n\n• Premium Cotton: 100% organic cotton for comfort\n• Heavyweight Fleece: 450gsm for durability\n• Sustainable Materials: Recycled polyester blends\n• High-Quality Prints: Water-based inks that last\n• Reinforced Stitching: Double-stitched for longevity\n\nAll materials are ethically sourced and environmentally conscious.',
    category: 'Products',
    tags: ['materials', 'quality', 'cotton']
  },
  {
    id: '12',
    question: 'How do I care for my THE BLACKEGE items?',
    answer: 'Proper care keeps your streetwear looking fresh:\n\n• Machine wash cold (30°C or below)\n• Turn garments inside out before washing\n• Use mild detergent, avoid bleach\n• Hang dry or tumble dry on low heat\n• Iron on low heat if needed\n\nFor graphic prints: Wash inside out and avoid direct ironing on designs.',
    category: 'Products',
    tags: ['care', 'washing', 'maintenance']
  },

  // Account & Website
  {
    id: '13',
    question: 'How do I create an account?',
    answer: 'Creating an account unlocks exclusive benefits:\n\n1. Click "Sign Up" in the top right corner\n2. Enter your email and create a password\n3. Verify your email address\n4. Complete your profile for personalized recommendations\n\nAccount benefits:\n• Order tracking and history\n• Faster checkout\n• Exclusive member discounts\n• Early access to new drops',
    category: 'Account',
    tags: ['account', 'signup', 'benefits']
  },
  {
    id: '14',
    question: 'I forgot my password. What should I do?',
    answer: 'No worries! Resetting your password is simple:\n\n1. Go to the login page\n2. Click "Forgot Password?"\n3. Enter your email address\n4. Check your email for reset instructions\n5. Create a new password\n\nIf you don\'t receive the email within 10 minutes, check your spam folder or contact support.',
    category: 'Account',
    tags: ['password', 'reset', 'login']
  },

  // Contact & Support
  {
    id: '15',
    question: 'How can I contact customer service?',
    answer: 'We\'re here to help! Multiple ways to reach us:\n\n• Live Chat: Available 24/7 on our website\n• Email: support@theblackege.com\n• Phone: (555) 123-BLCK (Mon-Fri, 9AM-6PM EST)\n• Social Media: @theblackege on Instagram/Twitter\n\nAverage response time: Under 2 hours during business hours.',
    category: 'Support',
    tags: ['contact', 'support', 'help']
  }
];

const categories = ['All', 'Shipping', 'Returns', 'Sizing', 'Payment', 'Orders', 'Products', 'Account', 'Support'];

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const filteredFAQs = faqData.filter(faq => {
    const matchesSearch = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const toggleItem = (id: string) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id);
    } else {
      newOpenItems.add(id);
    }
    setOpenItems(newOpenItems);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSelectedCategory('All');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in-up">
            <h1 className="font-heading font-bold text-4xl sm:text-5xl lg:text-6xl mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Got questions? We've got answers. Find everything you need to know about 
              THE BLACKEGE streetwear, orders, shipping, and more.
            </p>
          </div>

          {/* Search and Filters */}
          <div className="mb-8 space-y-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            {/* Search */}
            <div className="relative">
              <Icons.search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search FAQs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                  onClick={() => setSearchQuery('')}
                >
                  <Icons.x className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="text-sm"
                >
                  {category}
                  {category !== 'All' && (
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {faqData.filter(faq => faq.category === category).length}
                    </Badge>
                  )}
                </Button>
              ))}
            </div>
          </div>

          {/* Results Info */}
          <div className="mb-6 flex items-center justify-between animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <p className="text-sm text-muted-foreground">
              {filteredFAQs.length} question{filteredFAQs.length !== 1 ? 's' : ''} found
              {searchQuery && ` for "${searchQuery}"`}
              {selectedCategory !== 'All' && ` in ${selectedCategory}`}
            </p>
            {(searchQuery || selectedCategory !== 'All') && (
              <Button variant="outline" size="sm" onClick={clearSearch}>
                <Icons.x className="mr-2 h-4 w-4" />
                Clear Filters
              </Button>
            )}
          </div>

          {/* FAQ Items */}
          <div className="space-y-4">
            {filteredFAQs.length === 0 ? (
              <Card className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                <CardContent className="text-center py-12">
                  <Icons.search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No questions found</h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your search terms or browse different categories.
                  </p>
                  <Button onClick={clearSearch}>
                    <Icons.x className="mr-2 h-4 w-4" />
                    Clear Search
                  </Button>
                </CardContent>
              </Card>
            ) : (
              filteredFAQs.map((faq, index) => (
                <Card 
                  key={faq.id} 
                  className="animate-fade-in-up hover:shadow-md transition-shadow cursor-pointer"
                  style={{ animationDelay: `${0.3 + index * 0.05}s` }}
                  onClick={() => toggleItem(faq.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary" className="text-xs">
                            {faq.category}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg leading-relaxed pr-8">
                          {faq.question}
                        </CardTitle>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="shrink-0 h-8 w-8 p-0"
                      >
                        <Icons.chevronRight 
                          className={cn(
                            "h-4 w-4 transition-transform duration-200",
                            openItems.has(faq.id) ? "rotate-90" : ""
                          )}
                        />
                      </Button>
                    </div>
                  </CardHeader>
                  
                  {openItems.has(faq.id) && (
                    <CardContent className="pt-0">
                      <div className="prose prose-sm max-w-none">
                        <div className="text-muted-foreground whitespace-pre-line leading-relaxed">
                          {faq.answer}
                        </div>
                      </div>
                      
                      {faq.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-4 pt-4 border-t">
                          {faq.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  )}
                </Card>
              ))
            )}
          </div>

          {/* Contact Section */}
          <Card className="mt-12 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icons.messageCircle className="h-5 w-5" />
                Still Need Help?
              </CardTitle>
              <CardDescription>
                Can't find what you're looking for? Our customer support team is here to help.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                  <Icons.messageCircle className="h-6 w-6" />
                  <span className="font-medium">Live Chat</span>
                  <span className="text-sm text-muted-foreground">Available 24/7</span>
                </Button>
                
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2" asChild>
                  <a href="mailto:support@theblackege.com">
                    <Icons.mail className="h-6 w-6" />
                    <span className="font-medium">Email Support</span>
                    <span className="text-sm text-muted-foreground">support@theblackege.com</span>
                  </a>
                </Button>
                
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2" asChild>
                  <Link href="/contact">
                    <Icons.phone className="h-6 w-6" />
                    <span className="font-medium">Contact Form</span>
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
