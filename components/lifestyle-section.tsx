'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Icons } from '@/components/ui/icons';

export function LifestyleSection() {
  const lifestyleContent = [
    {
      id: 1,
      title: "Street Art Vibes",
      description: "Where creativity meets fashion. Discover how our pieces complement the urban art scene.",
      image: "/black-streetwear-lifestyle-urban-culture.png",
      category: "Culture",
      tags: ["Art", "Street", "Urban"]
    },
    {
      id: 2,
      title: "Midnight Sessions",
      description: "From studio sessions to late-night adventures. Style that moves with your rhythm.",
      image: "/black-streetwear-with-neon-accents-premium.png",
      category: "Lifestyle",
      tags: ["Music", "Night", "Session"]
    },
    {
      id: 3,
      title: "Urban Explorer",
      description: "Navigate the city in style. Essential pieces for the modern street wanderer.",
      image: "/black-streetwear-hoodie-minimalist.png",
      category: "Adventure",
      tags: ["City", "Explore", "Style"]
    },
    {
      id: 4,
      title: "Community Vibes",
      description: "Building connections through shared style. See how our community rocks THE BLACKEGE.",
      image: "/dark-hoodie-streetwear-minimalist-design.png",
      category: "Community",
      tags: ["Friends", "Crew", "Together"]
    }
  ];

  const socialFeeds = [
    {
      platform: "Instagram",
      handle: "@theblackege",
      followers: "125K",
      icon: <Icons.instagram className="h-5 w-5" />
    },
    {
      platform: "YouTube",
      handle: "THE BLACKEGE",
      followers: "45K",
      icon: <Icons.youtube className="h-5 w-5" />
    },
    {
      platform: "TikTok",
      handle: "@blackege_official",
      followers: "89K",
      icon: <Icons.music className="h-5 w-5" />
    }
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            Lifestyle
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Live the <span className="text-primary">Street</span> Life
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            More than clothes - it's a way of life. See how THE BLACKEGE fits 
            into every aspect of urban culture and street lifestyle.
          </p>
        </div>

        {/* Lifestyle Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {lifestyleContent.map((content, index) => (
            <Card 
              key={content.id} 
              className="group overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              <div className="relative overflow-hidden">
                <Image
                  src={content.image}
                  alt={content.title}
                  width={600}
                  height={400}
                  className="w-full h-[300px] object-cover group-hover:scale-105 transition-transform duration-500"
                  fallback="/placeholder.jpg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <Badge variant="secondary" className="mb-2">
                    {content.category}
                  </Badge>
                  <div className="flex gap-2">
                    {content.tags.map((tag, tagIndex) => (
                      <Badge key={tagIndex} variant="outline" className="text-xs border-white/30 text-white">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-3">{content.title}</h3>
                <p className="text-muted-foreground mb-4">{content.description}</p>
                <Button variant="outline" size="sm">
                  <Icons.externalLink className="mr-2 h-4 w-4" />
                  Explore Look
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Social Media Section */}
        <div className="bg-gradient-to-r from-black to-gray-900 rounded-3xl p-8 md:p-12 text-white">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl md:text-4xl font-bold mb-6">
                Follow the <span className="text-primary">Movement</span>
              </h3>
              <p className="text-white/80 text-lg mb-8">
                Stay connected with the latest drops, styling tips, and behind-the-scenes 
                content. Join our community of street culture enthusiasts.
              </p>
              
              <div className="space-y-4">
                {socialFeeds.map((social, index) => (
                  <div key={index} className="flex items-center justify-between bg-white/10 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <div className="text-primary">
                        {social.icon}
                      </div>
                      <div>
                        <div className="font-semibold">{social.platform}</div>
                        <div className="text-sm text-white/70">{social.handle}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{social.followers}</div>
                      <div className="text-sm text-white/70">Followers</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Mock social media posts */}
              <div className="space-y-4">
                <div className="bg-white/10 rounded-lg p-4 text-center">
                  <Image
                    src="/black-streetwear-t-shirt-urban-design.png"
                    alt="Social Post 1"
                    width={200}
                    height={200}
                    className="w-full h-32 object-cover rounded mb-3"
                  />
                  <div className="text-sm">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Icons.heart className="h-4 w-4 text-red-500 fill-current" />
                      <span>2.3K</span>
                    </div>
                    <p className="text-xs text-white/70">"Street vibes only ✨"</p>
                  </div>
                </div>
                <div className="bg-white/10 rounded-lg p-4 text-center">
                  <Image
                    src="/black-streetwear-hoodie-minimalist.png"
                    alt="Social Post 2"
                    width={200}
                    height={200}
                    className="w-full h-32 object-cover rounded mb-3"
                  />
                  <div className="text-sm">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Icons.heart className="h-4 w-4 text-red-500 fill-current" />
                      <span>1.8K</span>
                    </div>
                    <p className="text-xs text-white/70">"Minimalist perfection 🖤"</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4 mt-8">
                <div className="bg-white/10 rounded-lg p-4 text-center">
                  <Image
                    src="/dark-hoodie-streetwear-minimalist-design.png"
                    alt="Social Post 3"
                    width={200}
                    height={200}
                    className="w-full h-32 object-cover rounded mb-3"
                  />
                  <div className="text-sm">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Icons.heart className="h-4 w-4 text-red-500 fill-current" />
                      <span>3.1K</span>
                    </div>
                    <p className="text-xs text-white/70">"Night mode activated 🌙"</p>
                  </div>
                </div>
                <div className="bg-white/10 rounded-lg p-4 text-center">
                  <div className="text-2xl mb-2">📸</div>
                  <div className="text-sm">
                    <p className="text-xs text-white/70 mb-2">"Tag us in your fits!"</p>
                    <p className="text-xs text-primary">#THEBLACKEGE</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
