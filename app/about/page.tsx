'use client';

import React from 'react';
import Image from 'next/image';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Icons } from '@/components/ui/icons';

export default function AboutPage() {
  const teamMembers = [
    {
      name: "Alex Chen",
      role: "Creative Director",
      image: "/young-urban-male-portrait-streetwear.png",
      bio: "Visionary behind THE BLACKEGE's artistic direction with 10+ years in street fashion."
    },
    {
      name: "Maya Rodriguez",
      role: "Head Designer",
      image: "/young-urban-female-portrait-fashion.png",
      bio: "Transforms street culture into wearable art, bringing authenticity to every piece."
    },
    {
      name: "Jordan Kim",
      role: "Brand Strategist",
      image: "/young-urban-male-portrait.png",
      bio: "Connects our brand with the global streetwear community and emerging trends."
    },
    {
      name: "Zoe Williams",
      role: "Sustainability Lead",
      image: "/young-urban-female-portrait.png",
      bio: "Ensures our streetwear meets the highest standards of ethical production."
    }
  ];

  const values = [
    {
      icon: <Icons.star className="h-8 w-8" />,
      title: "Authenticity",
      description: "Every piece tells a story of genuine street culture and urban expression."
    },
    {
      icon: <Icons.heart className="h-8 w-8" />,
      title: "Community",
      description: "We're more than a brand - we're a movement of creatives and dreamers."
    },
    {
      icon: <Icons.shoppingCart className="h-8 w-8" />,
      title: "Quality",
      description: "Premium materials and craftsmanship in every thread, every stitch."
    },
    {
      icon: <Icons.user className="h-8 w-8" />,
      title: "Innovation",
      description: "Pushing boundaries in design while respecting streetwear heritage."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="/urban-street-photography-dark-moody-aesthetic-graf.png"
              alt="Urban Street Photography"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/60" />
          </div>
          
          <div className="relative z-10 text-center text-white px-4 max-w-4xl">
            <Badge className="mb-6 bg-white/20 text-white border-white/30">
              EST. 2020
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
              THE BLACKEGE
            </h1>
            <p className="text-xl md:text-2xl mb-8 font-light">
              Where Authenticity Meets Visionary Artistry
            </p>
            <p className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed opacity-90">
              Born from the streets, crafted for the culture. We don't just make clothes - 
              we create statements that resonate with the urban soul.
            </p>
          </div>
        </section>

        {/* Brand Story Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Our Story
                </h2>
                <div className="space-y-6 text-lg leading-relaxed text-muted-foreground">
                  <p>
                    THE BLACKEGE was born in the underground scenes of urban creativity, 
                    where art meets rebellion and style transcends convention. Founded by 
                    a collective of artists, designers, and street culture enthusiasts, 
                    we saw a gap in authentic streetwear representation.
                  </p>
                  <p>
                    What started as custom pieces for local artists has evolved into a 
                    global movement. Every design carries the DNA of street culture - 
                    raw, unfiltered, and unapologetically authentic.
                  </p>
                  <p>
                    We believe fashion should be a canvas for self-expression, not 
                    mass conformity. Each piece in our collection is designed to 
                    empower individuals to express their unique identity while 
                    connecting with a larger community of creative souls.
                  </p>
                </div>
                <Button size="lg" className="mt-8">
                  Shop Our Story
                </Button>
              </div>
              
              <div className="relative">
                <Image
                  src="/streetwear-model-artistic-portrait-dark-aesthetic-.png"
                  alt="Streetwear Model"
                  width={600}
                  height={700}
                  className="rounded-lg object-cover w-full"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 px-4 bg-muted/30">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                What Drives Us
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Our core values shape every decision, every design, and every interaction 
                with our community.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
                  <CardContent className="space-y-4">
                    <div className="flex justify-center text-primary">
                      {value.icon}
                    </div>
                    <h3 className="text-xl font-semibold">{value.title}</h3>
                    <p className="text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Meet The Collective
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                The creative minds and cultural curators behind THE BLACKEGE movement.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map((member, index) => (
                <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative aspect-square">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                    <p className="text-primary font-medium mb-3">{member.role}</p>
                    <p className="text-sm text-muted-foreground">{member.bio}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Mission Statement */}
        <section className="py-20 px-4 bg-primary text-primary-foreground">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">
              Our Mission
            </h2>
            <p className="text-xl md:text-2xl leading-relaxed mb-8">
              "To elevate streetwear beyond fashion into a form of cultural expression, 
              creating pieces that empower individuals to authentically represent their 
              unique identity while connecting them to a global community of creatives."
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary">
                Join Our Community
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                Explore Collections
              </Button>
            </div>
          </div>
        </section>

        {/* Sustainability Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="relative">
                <Image
                  src="/dark-moody-streetwear-model-wearing-black-t-shirt-.png"
                  alt="Sustainable Fashion"
                  width={600}
                  height={500}
                  className="rounded-lg object-cover w-full"
                />
              </div>
              
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Conscious Creation
                </h2>
                <div className="space-y-6 text-lg leading-relaxed text-muted-foreground">
                  <p>
                    Street culture has always been about resourcefulness and authenticity. 
                    We honor this heritage by implementing sustainable practices throughout 
                    our production process.
                  </p>
                  <p>
                    From ethically sourced materials to fair labor practices, every piece 
                    is created with respect for both people and planet. Because true style 
                    shouldn't come at the cost of our future.
                  </p>
                </div>
                
                <div className="mt-8 space-y-4">
                  <div className="flex items-center space-x-3">
                    <Icons.heart className="h-5 w-5 text-primary" />
                    <span>100% Organic Cotton Options</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Icons.star className="h-5 w-5 text-primary" />
                    <span>Fair Trade Certified Production</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Icons.shoppingCart className="h-5 w-5 text-primary" />
                    <span>Carbon Neutral Shipping</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
