"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Icons } from "@/components/ui/icons"
import { useWishlist } from "@/hooks/use-wishlist"
import { useToast } from "@/hooks/use-toast"
import { CollectionCard } from '@/components/ui/collection-card';
import { CollectionFavoriteButton } from "@/components/favorites/collection-favorite-button"
import Link from "next/link"

const collections = [
  {
    id: 1,
    name: "Urban Essentials",
    price: "From ₹2,499",
    image: "/black-streetwear-t-shirt-urban-design.png",
    category: "T-Shirts",
  },
  {
    id: 2,
    name: "Night Vision",
    price: "From ₹3,999",
    image: "/dark-hoodie-streetwear-minimalist-design.png",
    category: "Hoodies",
  },
  {
    id: 3,
    name: "Street Elite",
    price: "From ₹1,599",
    image: "/black-cap-streetwear-accessories-urban.png",
    category: "Accessories",
  },
  {
    id: 4,
    name: "Midnight Collection",
    price: "From ₹4,999",
    image: "/black-streetwear-jacket-urban-fashion.png",
    category: "Jackets",
  },
  {
    id: 5,
    name: "Shadow Series",
    price: "From ₹2,799",
    image: "/dark-streetwear-pants-urban-style.png",
    category: "Pants",
  },
  {
    id: 6,
    name: "Neon Edge",
    price: "From ₹4,999",
    image: "/black-streetwear-with-neon-accents-premium.png",
    category: "Limited Edition",
  },
  {
    id: 7,
    name: "Shadow Runners",
    price: "From ₹2,799",
    image: "/placeholder.jpg",
    category: "Joggers",
  },
  {
    id: 8,
    name: "Tech Wear Pro",
    price: "From ₹9,999",
    image: "/placeholder.jpg",
    category: "Tech",
  },
  {
    id: 9,
    name: "Vintage Vibes",
    price: "From ₹2,299",
    image: "/placeholder.jpg",
    category: "Vintage",
  },
  {
    id: 10,
    name: "Future Forward",
    price: "From ₹6,499",
    image: "/placeholder.jpg",
    category: "Future",
  },
  {
    id: 11,
    name: "Classic Street",
    price: "From ₹1,999",
    image: "/placeholder.jpg",
    category: "Classic",
  },
  {
    id: 12,
    name: "Premium Luxury",
    price: "From ₹12,999",
    image: "/placeholder.jpg",
    category: "Premium",
  },
]

export function FeaturedCollections() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const { toast } = useToast()

  const handleWishlistToggle = (item: any) => {
    try {
      if (isInWishlist(item.id.toString())) {
        removeFromWishlist(item.id.toString())
        toast({
          title: "Removed from wishlist",
          description: `${item.name} has been removed from your wishlist.`,
        })
      } else {
        addToWishlist({
          id: item.id.toString(),
          name: item.name,
          price: parseFloat(item.price.replace('From ₹', '').replace(',', '')),
          image: item.image,
          category: item.category,
        })
        toast({
          title: "Added to wishlist",
          description: `${item.name} has been added to your wishlist.`,
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    }
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.ceil(collections.length / 3))
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + Math.ceil(collections.length / 3)) % Math.ceil(collections.length / 3))
  }

  const visibleItems = collections.slice(currentSlide * 3, (currentSlide * 3) + 3)

  return (
    <section className="py-20 bg-card/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl mb-4">Featured Collections</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover our latest drops and signature pieces that define urban culture
          </p>
        </div>

        <div className="relative">
          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 hover:bg-background border border-border rounded-full p-3 transition-all duration-200 hover:scale-110 shadow-lg"
            style={{ marginLeft: '-20px' }}
          >
            <Icons.chevronLeft className="h-5 w-5" />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 hover:bg-background border border-border rounded-full p-3 transition-all duration-200 hover:scale-110 shadow-lg"
            style={{ marginRight: '-20px' }}
          >
            <Icons.chevronRight className="h-5 w-5" />
          </button>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {visibleItems.map((item, index) => (
              <CollectionCard
                key={item.id}
                collection={{
                  id: item.id,
                  name: item.name,
                  description: "Premium streetwear collection featuring authentic urban design and cutting-edge style",
                  category: item.category,
                  imageUrl: item.image,
                  productCount: Math.floor(Math.random() * 20) + 5, // Mock data
                  startingPrice: parseFloat(item.price.replace('From ₹', '').replace(',', '')),
                  isFeatured: true
                }}
                linkType="slug"
                showFavorite={true}
                size="md"
                onFavorite={handleWishlistToggle}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` } as any}
              />
            ))}
          </div>

          {/* Slide Indicators */}
          <div className="flex justify-center mt-8 space-x-2">
            {Array.from({ length: Math.ceil(collections.length / 3) }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                  currentSlide === index ? 'bg-primary' : 'bg-muted-foreground/30'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" size="lg" className="hover:bg-primary hover:text-primary-foreground transition-colors duration-200" asChild>
            <Link href="/shop">
              <Icons.shoppingCart className="mr-2 h-4 w-4" />
              View All Collections
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
