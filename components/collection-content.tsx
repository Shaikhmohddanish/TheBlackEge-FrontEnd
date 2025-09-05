"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ProductCard } from "@/components/ui/product-card"
import { ShoppingCart, Heart, Grid, List, ArrowLeft, Eye } from "lucide-react"
import Link from "next/link"
import { useCartStore } from "@/lib/cart-store"
import { getProductsByCategory } from '@/lib/api/products'
import type { Product } from '@/lib/api/products'



interface Collection {
  id: number
  name: string
  description: string
  category: string
  hero?: string
}

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "name", label: "Name" },
]

type CollectionContentProps = {
  collection: Collection
}

export function CollectionContent({ collection }: CollectionContentProps) {
  const [sortBy, setSortBy] = useState("featured")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [favorites, setFavorites] = useState<number[]>([])
  const addToCart = useCartStore((state) => state.addItem)

  // Load products based on collection category
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true)
        const results = await getProductsByCategory(collection.category, 0, 20)
        setProducts(results.products || [])
      } catch (error) {
        console.error('Failed to load collection products:', error)
        setProducts([])
      } finally {
        setIsLoading(false)
      }
    }

    loadProducts()
  }, [collection.category])

  const filteredProducts = products

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
      case "price-low":
        return (a.price || 0) - (b.price || 0)
      case "price-high":
        return (b.price || 0) - (a.price || 0)
      case "name":
        return a.name.localeCompare(b.name)
      default:
        return 0
    }
  })



  const handleAddToCart = (productId: string, size?: string, color?: string, qty?: number) => {
    const product = products.find((p) => p.id === productId)
    if (!product) return

    const cartItem = {
      id: parseInt(productId),
      name: product.name,
      price: product.price || 0,
      image: product.media?.[0]?.url || '/placeholder.jpg',
      size: size || product.variants?.[0]?.size || 'M',
      color: color || product.variants?.[0]?.color || 'Black',
      quantity: qty || 1,
    }

    addToCart(cartItem)
    console.log("Added to cart:", cartItem)
  }

  const toggleFavorite = (productId: number) => {
    setFavorites((prev) => (prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]))
    console.log("[v0] Toggled favorite for product:", productId)
  }



  const isInWishlist = (productId: string) => {
    return favorites.includes(parseInt(productId))
  }

  return (
    <div className="py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 animate-fade-in-up">
          <Link href="/shop">
            <Button variant="ghost" className="mb-4 hover-glow">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Shop
            </Button>
          </Link>
        </div>

        <div className="mb-16 animate-fade-in-up">
          <div className="relative overflow-hidden rounded-2xl bg-card/50 p-8 lg:p-16">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <Badge className="mb-4 bg-primary/20 text-primary border-primary/30">{collection.category}</Badge>
                <h1 className="font-heading font-bold text-4xl sm:text-5xl lg:text-6xl mb-6">{collection.name}</h1>
                <p className="text-xl text-muted-foreground mb-8 leading-relaxed">{collection.description}</p>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">
                    {sortedProducts.length} {sortedProducts.length === 1 ? "item" : "items"}
                  </span>
                  <span className="text-sm text-muted-foreground">•</span>
                  <span className="text-sm text-primary font-medium">Premium Quality</span>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-square overflow-hidden rounded-xl">
                  <img
                    src={collection.hero || "/placeholder.svg"}
                    alt={collection.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent rounded-xl" />
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8 flex items-center justify-between animate-fade-in-up">
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {sortedProducts.length} {sortedProducts.length === 1 ? "product" : "products"}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48 bg-card border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex border border-border rounded-md">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="rounded-r-none"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="animate-fade-in-up">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={{
                    id: product.id,
                    name: product.name,
                    description: product.description,
                    price: product.price || 0,
                    salePrice: product.salePrice,
                    category: product.category,
                    images: product.media || [],
                    sizes: product.variants?.map(v => v.size).filter(Boolean) || [],
                    colors: product.variants?.map(v => v.color).filter(Boolean) || [],
                    inventory: product.stockQuantity || 0,
                    inStock: (product.stockQuantity || 0) > 0
                  }}
                  onAddToCart={() => handleAddToCart(product.id, product.variants?.[0]?.size, product.variants?.[0]?.color, 1)}
                  onAddToWishlist={() => toggleFavorite(parseInt(product.id))}
                  onBuyNow={() => handleAddToCart(product.id, product.variants?.[0]?.size, product.variants?.[0]?.color, 1)}
                  isInWishlist={(id) => favorites.includes(parseInt(id))}
                  showQuickView={true}
                  showBuyNow={true}
                  className={`animate-fade-in-up`}
                  style={{ animationDelay: `${index * 0.1}s` } as any}
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sortedProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={{
                    id: product.id,
                    name: product.name,
                    description: product.description || `Premium ${product.category.toLowerCase()} from THE BLACKEGE collection. Available in ${product.colors.join(", ")} and sizes ${product.sizes.join(", ")}.`,
                    price: product.originalPrice || product.price,
                    salePrice: product.isSale ? product.price : undefined,
                    category: product.category,
                    images: product.images || [product.image],
                    sizes: product.sizes,
                    colors: product.colors,
                    isNew: product.isNew,
                    isSale: product.isSale,
                    inStock: true
                  }}
                  onAddToCart={() => handleAddToCart(product.id, product.sizes[0], product.colors[0], 1)}
                  onAddToWishlist={() => toggleFavorite(product.id)}
                  onBuyNow={() => handleAddToCart(product.id, product.sizes[0], product.colors[0], 1)}
                  isInWishlist={(id) => favorites.includes(parseInt(id))}
                  showQuickView={true}
                  showBuyNow={true}
                  size="lg"
                  className={`animate-fade-in-up`}
                  style={{ animationDelay: `${index * 0.05}s` } as any}
                />
              ))}
            </div>
          )}

          {sortedProducts.length === 0 && (
            <div className="text-center py-16">
              <h3 className="font-heading font-semibold text-2xl mb-4">No products found</h3>
              <p className="text-muted-foreground mb-8">
                This collection is currently being updated. Check back soon for new arrivals.
              </p>
              <Link href="/shop">
                <Button>Browse All Products</Button>
              </Link>
            </div>
          )}
        </div>


      </div>
    </div>
  )
}
