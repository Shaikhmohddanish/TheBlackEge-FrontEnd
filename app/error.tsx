'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Icons } from '@/components/ui/icons';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left side - Image */}
          <div className="relative aspect-square max-w-md mx-auto h-96">
            <Image
              src="/dark-moody-streetwear-model-wearing-black-t-shirt-.png"
              alt="Streetwear Model"
              fill
              className="object-cover rounded-2xl opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-2xl" />
            <div className="absolute bottom-8 left-8 text-white">
              <h3 className="text-2xl font-bold mb-2">Technical Difficulties</h3>
              <p className="text-white/80">We're working on getting things back to normal</p>
            </div>
          </div>

          {/* Right side - Content */}
          <div className="text-center lg:text-left">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-red-500/10 rounded-full mb-6">
                <Icons.x className="h-10 w-10 text-red-500" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
                Something Went Wrong
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                We encountered an unexpected error. Our team has been notified and 
                we're working to fix the issue. Please try again or contact support 
                if the problem persists.
              </p>
            </div>

            {/* Error Details (Development Only) */}
            {process.env.NODE_ENV === 'development' && (
              <Card className="mb-8 text-left">
                <CardHeader>
                  <CardTitle className="text-red-600">Error Details (Development)</CardTitle>
                  <CardDescription>
                    This information is only visible in development mode
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <pre className="text-xs bg-muted p-4 rounded overflow-auto max-h-32">
                    {error.message}
                    {error.stack}
                  </pre>
                  {error.digest && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Error ID: {error.digest}
                    </p>
                  )}
                </CardContent>
              </Card>
            )}

            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button onClick={reset} size="lg" className="px-8">
                  <Icons.spinner className="mr-2 h-5 w-5" />
                  Try Again
                </Button>
                <Button variant="outline" size="lg" asChild className="px-8">
                  <Link href="/">
                    <Icons.user className="mr-2 h-5 w-5" />
                    Go Home
                  </Link>
                </Button>
              </div>

              <div className="pt-6">
                <p className="text-sm text-muted-foreground mb-4">
                  Need immediate assistance?
                </p>
                <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/contact">Contact Support</Link>
                  </Button>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/shop">Continue Shopping</Link>
                  </Button>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/account">My Account</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <Card className="mt-12">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Need Help?</h2>
              <p className="text-muted-foreground">
                Our support team is here to assist you
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4">
                  <Icons.user className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Live Chat</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Get instant help from our support team
                </p>
                <Button variant="outline" size="sm">
                  Start Chat
                </Button>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4">
                  <Icons.shoppingCart className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Email Support</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Send us a message and we'll respond within 24 hours
                </p>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/contact">Send Email</Link>
                </Button>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4">
                  <Icons.heart className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">FAQ</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Find answers to commonly asked questions
                </p>
                <Button variant="outline" size="sm">
                  View FAQ
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
