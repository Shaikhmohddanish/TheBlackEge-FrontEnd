'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Icons } from '@/components/ui/icons';

export function FeaturesSection() {
  const features = [
    {
      icon: <Icons.truck className="h-12 w-12" />,
      title: "Free Shipping",
      description: "Free delivery on orders above ₹2,500 across India",
      highlight: "No Hidden Charges"
    },
    {
      icon: <Icons.rotateCounterClockwise className="h-12 w-12" />,
      title: "Easy Returns",
      description: "30-day hassle-free returns and exchanges",
      highlight: "Customer First"
    },
    {
      icon: <Icons.shield className="h-12 w-12" />,
      title: "Secure Payments",
      description: "256-bit SSL encryption with UPI, cards, and COD",
      highlight: "100% Safe"
    },
    {
      icon: <Icons.clock className="h-12 w-12" />,
      title: "Express Delivery",
      description: "Same-day delivery in major cities, 2-3 days nationwide",
      highlight: "Lightning Fast"
    },
    {
      icon: <Icons.star className="h-12 w-12" />,
      title: "Premium Quality",
      description: "Ethically sourced materials with superior craftsmanship",
      highlight: "Uncompromised"
    },
    {
      icon: <Icons.headphones className="h-12 w-12" />,
      title: "24/7 Support",
      description: "Round-the-clock customer support via chat, call, and email",
      highlight: "Always Here"
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            Why Choose Us
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            The <span className="text-primary">BLACKEGE</span> Experience
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            More than just streetwear - we deliver an unmatched shopping experience 
            that puts you first, every step of the way.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary/20"
            >
              <CardContent className="p-8 text-center">
                <div className="flex justify-center text-primary mb-6 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <Badge variant="secondary" className="mb-3 text-xs">
                  {feature.highlight}
                </Badge>
                <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-8 md:p-12">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to experience the difference?
            </h3>
            <p className="text-lg text-muted-foreground mb-6">
              Join thousands of satisfied customers who've made THE BLACKEGE their go-to streetwear destination.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Icons.star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span>4.8/5 Rating from 2,500+ customers</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Icons.users className="h-4 w-4" />
                <span>50,000+ Happy Customers</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
