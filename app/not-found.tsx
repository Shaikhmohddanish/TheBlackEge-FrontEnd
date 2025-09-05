import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Icons } from '@/components/ui/icons';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left side - Image */}
          <div className="relative aspect-square max-w-md mx-auto">
            <Image
              src="/urban-street-photography-dark-moody-aesthetic-graf.png"
              alt="Urban Street Art"
              fill
              className="object-cover rounded-2xl opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-2xl" />
            <div className="absolute bottom-8 left-8 text-white">
              <h3 className="text-2xl font-bold mb-2">Lost in the Streets?</h3>
              <p className="text-white/80">Even the best explorers take wrong turns</p>
            </div>
          </div>

          {/* Right side - Content */}
          <div className="text-center lg:text-left">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-6">
                <span className="text-4xl font-bold text-primary">404</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
                Page Not Found
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                The page you're looking for has moved, been deleted, or doesn't exist. 
                Let's get you back to exploring our streetwear collection.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button asChild size="lg" className="px-8">
                  <Link href="/">
                    <Icons.user className="mr-2 h-5 w-5" />
                    Back to Home
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild className="px-8">
                  <Link href="/shop">
                    <Icons.shoppingCart className="mr-2 h-5 w-5" />
                    Shop Collection
                  </Link>
                </Button>
              </div>

              <div className="pt-6">
                <p className="text-sm text-muted-foreground mb-4">
                  Or try one of these popular sections:
                </p>
                <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/collections">Collections</Link>
                  </Button>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/about">About Us</Link>
                  </Button>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/contact">Contact</Link>
                  </Button>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/account">My Account</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Popular Products Section */}
        <Card className="mt-12">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">While You're Here</h2>
              <p className="text-muted-foreground">
                Check out some of our most popular streetwear pieces
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  name: "Urban Essentials Tee",
                  image: "/black-streetwear-t-shirt-urban-design.png",
                  price: "₹2,499",
                  href: "/product/1"
                },
                {
                  name: "Night Vision Hoodie", 
                  image: "/dark-hoodie-streetwear-minimalist-design.png",
                  price: "₹3,999",
                  href: "/product/2"
                },
                {
                  name: "Neon Edge Collection",
                  image: "/black-streetwear-with-neon-accents-premium.png", 
                  price: "₹4,999",
                  href: "/collections/neon-edge"
                },
                {
                  name: "Street Accessories",
                  image: "/black-cap-streetwear-accessories-urban.png",
                  price: "₹1,599", 
                  href: "/collections/street-accessories"
                }
              ].map((product, index) => (
                <Link key={index} href={product.href}>
                  <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
                    <div className="relative aspect-square">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-sm mb-1 group-hover:text-primary transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-sm font-semibold">{product.price}</p>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
