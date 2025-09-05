'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Icons } from '@/components/ui/icons';

export function BrandStory() {
  const brandValues = [
    {
      icon: <Icons.star className="h-8 w-8" />,
      title: "Authenticity",
      description: "Every piece tells a story of genuine street culture and urban expression."
    },
    {
      icon: <Icons.users className="h-8 w-8" />,
      title: "Community",
      description: "We're more than a brand - we're a movement of creatives and dreamers."
    },
    {
      icon: <Icons.award className="h-8 w-8" />,
      title: "Quality",
      description: "Premium materials and craftsmanship in every thread, every stitch."
    },
    {
      icon: <Icons.heart className="h-8 w-8" />,
      title: "Passion",
      description: "Driven by the raw energy and creativity of street culture worldwide."
    }
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Content Side */}
          <div className="space-y-8">
            <div>
              <Badge variant="outline" className="mb-4">
                Our Story
              </Badge>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                Born from the <span className="text-primary">Streets</span>
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground mb-6">
                THE BLACKEGE emerged from the vibrant streets of India, where creativity 
                meets rebellion. We're not just another streetwear brand - we're a 
                cultural movement that celebrates authenticity and self-expression.
              </p>
              <p className="text-lg text-muted-foreground mb-8">
                From underground artists to street performers, from skaters to hip-hop 
                heads - we design for those who dare to be different. Every piece in 
                our collection carries the soul of street culture.
              </p>
              <Button asChild size="lg" variant="outline">
                <Link href="/about">
                  <Icons.arrowRight className="mr-2 h-5 w-5" />
                  Learn More About Us
                </Link>
              </Button>
            </div>
          </div>

          {/* Image Side */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-black to-gray-900 p-8">
              <Image
                src="/black-streetwear-lifestyle-urban-culture.png"
                alt="THE BLACKEGE Brand Story"
                width={600}
                height={400}
                className="rounded-xl object-cover w-full h-[400px]"
                fallback="/placeholder.jpg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-xl" />
              <div className="absolute bottom-8 left-8 text-white">
                <h3 className="text-2xl font-bold mb-2">Street Culture</h3>
                <p className="text-white/80">Authentic. Raw. Unfiltered.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Brand Values */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">What We Stand For</h3>
            <p className="text-lg text-muted-foreground">
              Our core values drive everything we do
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {brandValues.map((value, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex justify-center text-primary mb-4">
                    {value.icon}
                  </div>
                  <h4 className="text-xl font-semibold mb-3">{value.title}</h4>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
