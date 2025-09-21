'use client';

import React from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons';

export function SocialProof() {
  const testimonials = [
    {
      id: 1,
      name: "Arjun Sharma",
      location: "Mumbai",
      avatar: "/young-urban-male-portrait-streetwear.png",
      rating: 5,
      text: "THE BLACKEGE isn't just clothing, it's a statement. The quality is insane and the designs are straight fire. Been wearing them for 2 years now!",
      product: "Night Vision Hoodie",
      verified: true
    },
    {
      id: 2,
      name: "Priya Patel",
      location: "Bangalore", 
      avatar: "/young-urban-female-portrait-fashion.png",
      rating: 5,
      text: "Finally found a brand that understands street culture in India. The fit is perfect and the material feels premium. Worth every rupee!",
      product: "Urban Essentials Tee",
      verified: true
    },
    {
      id: 3,
      name: "Rohit Kumar",
      location: "Delhi",
      avatar: "/young-urban-male-portrait.png",
      rating: 5,
      text: "Ordered my first piece last month and now I'm obsessed. Fast delivery, amazing quality, and the customer service is top-notch.",
      product: "Tech Bomber Jacket",
      verified: true
    },
    {
      id: 4,
      name: "Sneha Gupta",
      location: "Pune",
      avatar: "/young-urban-female-portrait.png",
      rating: 5,
      text: "Love how THE BLACKEGE represents authentic street style. Their pieces help me express my personality perfectly. Highly recommended!",
      product: "Shadow Joggers",
      verified: true
    }
  ];

  const pressFeatures = [
    {
      outlet: "Vogue India",
      quote: "THE BLACKEGE is redefining Indian streetwear with authentic designs and premium quality.",
      logo: "📰"
    },
    {
      outlet: "GQ India",
      quote: "A brand that truly understands the pulse of Indian street culture and fashion.",
      logo: "📰"
    },
    {
      outlet: "Cosmopolitan",
      quote: "THE BLACKEGE brings international streetwear standards to Indian fashion enthusiasts.",
      logo: "📰"
    }
  ];

  const influencers = [
    {
      name: "Komal Pandey",
      handle: "@komalpandeyofficial",
      followers: "1.8M",
      quote: "Obsessed with my new THE BLACKEGE collection! 🖤",
      platform: "Instagram",
      likes: "42K",
      comments: "3K"
    },
    {
      name: "Masoom Minawala",
      handle: "@masoomminawala",
      followers: "1.2M", 
      quote: "Perfect streetwear vibes for every mood ✨",
      platform: "Instagram",
      likes: "38K",
      comments: "2K"
    },
    {
      name: "Aashna Shroff",
      handle: "@aashnashroff",
      followers: "950K",
      quote: "Quality that speaks for itself 👌",
      platform: "Instagram",
      likes: "45K",
      comments: "4K"
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            Social Proof
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            What People Are <span className="text-primary">Saying</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Don't just take our word for it. See what customers, influencers, 
            and fashion experts are saying about THE BLACKEGE.
          </p>
        </div>

        {/* Customer Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Image
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    width={48}
                    height={48}
                    className="rounded-full object-cover mr-3"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-sm">{testimonial.name}</h4>
                      {testimonial.verified && (
                        <Icons.badgeCheck className="h-4 w-4 text-blue-500" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{testimonial.location}</p>
                  </div>
                </div>
                
                <div className="flex items-center mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Icons.star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                
                <p className="text-sm text-muted-foreground mb-3 line-clamp-4">
                  "{testimonial.text}"
                </p>
                
                <Badge variant="secondary" className="text-xs">
                  {testimonial.product}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Press Features */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-center mb-8">Featured In</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pressFeatures.map((feature, index) => (
              <Card key={index} className="text-center p-6">
                <CardContent className="pt-6">
                  <div className="text-4xl mb-4">{feature.logo}</div>
                  <h4 className="font-bold mb-3">{feature.outlet}</h4>
                  <p className="text-sm text-muted-foreground italic">
                    "{feature.quote}"
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Influencer Love */}
        <div className="bg-gradient-to-r from-black via-gray-900 to-black rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="grid grid-cols-8 grid-rows-8 h-full w-full">
              {[...Array(64)].map((_, i) => (
                <div key={i} className="border border-white/20"></div>
              ))}
            </div>
          </div>
          
          <div className="relative z-10">
            <div className="text-center mb-12">
              <Badge variant="outline" className="mb-4 border-white/30 text-white">
                Celebrity Endorsements
              </Badge>
              <h3 className="text-3xl md:text-4xl font-bold mb-4">
                Influencer <span className="text-primary">Love</span>
              </h3>
              <p className="text-white/70 text-lg max-w-2xl mx-auto">
                Top fashion influencers and celebrities choose THE BLACKEGE for their authentic street style
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {influencers.map((influencer, index) => (
                <div key={index} className="group">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-primary/50 transition-all duration-300 hover:scale-105">
                    {/* Instagram Icon with Gradient */}
                    <div className="relative mb-6">
                      <div className="w-16 h-16 mx-auto bg-gradient-to-tr from-purple-500 via-pink-500 to-orange-500 rounded-2xl flex items-center justify-center">
                        <Icons.instagram className="h-8 w-8 text-white" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <Icons.badgeCheck className="h-4 w-4 text-white" />
                      </div>
                    </div>
                    
                    {/* Influencer Info */}
                    <div className="text-center mb-4">
                      <h4 className="font-bold text-lg mb-1">{influencer.name}</h4>
                      <p className="text-white/60 text-sm mb-3">{influencer.handle}</p>
                      <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-3 py-1">
                        <Icons.users className="h-3 w-3" />
                        <span className="text-xs font-medium">{influencer.followers} followers</span>
                      </div>
                    </div>
                    
                    {/* Quote */}
                    <div className="relative">
                      <div className="absolute -top-2 -left-2 text-4xl text-primary/50">"</div>
                      <p className="text-white/90 italic text-center relative z-10 px-4">
                        {influencer.quote}
                      </p>
                      <div className="absolute -bottom-4 -right-2 text-4xl text-primary/50 rotate-180">"</div>
                    </div>
                    
                    {/* Engagement Stats */}
                    <div className="flex justify-center items-center gap-4 mt-6 pt-4 border-t border-white/20">
                      <div className="flex items-center gap-1 text-xs text-white/60">
                        <Icons.heart className="h-3 w-3 text-red-400 fill-current" />
                        <span>{influencer.likes}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-white/60">
                        <Icons.messageCircle className="h-3 w-3" />
                        <span>{influencer.comments}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-white/60">
                        <Icons.star className="h-3 w-3 text-yellow-400 fill-current" />
                        <span>5.0</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Call to Action */}
            <div className="text-center mt-12">
              <p className="text-white/70 mb-4">Want to collaborate with us?</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="outline" className="border-white/30 text-white hover:bg-white hover:text-black">
                  <Icons.instagram className="mr-2 h-4 w-4" />
                  Follow Us
                </Button>
                <Button className="bg-primary hover:bg-primary/90">
                  <Icons.mail className="mr-2 h-4 w-4" />
                  Partnership Inquiry
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 text-center">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center">
              <Icons.star className="h-12 w-12 text-yellow-400 mb-3" />
              <div className="text-2xl font-bold">4.8/5</div>
              <div className="text-sm text-muted-foreground">Average Rating</div>
            </div>
            <div className="flex flex-col items-center">
              <Icons.users className="h-12 w-12 text-blue-500 mb-3" />
              <div className="text-2xl font-bold">50K+</div>
              <div className="text-sm text-muted-foreground">Happy Customers</div>
            </div>
            <div className="flex flex-col items-center">
              <Icons.messageCircle className="h-12 w-12 text-green-500 mb-3" />
              <div className="text-2xl font-bold">2.5K+</div>
              <div className="text-sm text-muted-foreground">Reviews</div>
            </div>
            <div className="flex flex-col items-center">
              <Icons.repeatIcon className="h-12 w-12 text-purple-500 mb-3" />
              <div className="text-2xl font-bold">85%</div>
              <div className="text-sm text-muted-foreground">Repeat Customers</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
