"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ShoppingCart,
  Heart,
  Share2,
  ArrowLeft,
  Star,
  Truck,
  Shield,
  RotateCcw,
  Plus,
  Minus,
  Check,
} from "lucide-react"
import Link from "next/link"

type Product = {
  id: number
  name: string
  price: number
  originalPrice: number | null
  images: string[]
  category: string
  sizes: string[]
  colors: string[]
  isNew: boolean
  isSale: boolean
  description: string
  features: string[]
  materials: string
  careInstructions: string
  sku: string
  stock: Record<string, number>
}

type ProductDetailProps = {
  product: Product
}

export function ProductDetail({ product }: ProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState("")
  const [selectedColor, setSelectedColor] = useState(product.colors[0])
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity)
    }
  }

  const isInStock = selectedSize ? (product.stock[selectedSize] || 0) > 0 : true
  const stockCount = selectedSize ? product.stock[selectedSize] || 0 : 0

  return (
    <div className="py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Navigation */}
        <div className="mb-8 animate-fade-in-up">
          <Link href="/shop">
            <Button variant="ghost" className="mb-4 hover-glow">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Shop
            </Button>
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Product Images */}
          <div className="space-y-4 animate-fade-in-up">
            {/* Main Image */}
            <div className="aspect-square overflow-hidden rounded-2xl bg-card">
              <img
                src={product.images[selectedImage] || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnail Images */}
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square overflow-hidden rounded-lg border-2 transition-all duration-300 ${
                    selectedImage === index ? "border-primary shadow-lg" : "border-border hover:border-primary/50"
                  }`}
                >
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`${product.name} view ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            {/* Header */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Badge className="bg-primary/20 text-primary border-primary/30">{product.category}</Badge>
                {product.isNew && <Badge className="bg-secondary text-secondary-foreground">NEW</Badge>}
                {product.isSale && <Badge className="bg-destructive text-destructive-foreground">SALE</Badge>}
              </div>
              <h1 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl mb-4">{product.name}</h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  {product.originalPrice && (
                    <span className="text-xl text-muted-foreground line-through">${product.originalPrice}</span>
                  )}
                  <span className="text-3xl font-bold text-foreground">${product.price}</span>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                  <span className="text-sm text-muted-foreground ml-2">(4.8) 124 reviews</span>
                </div>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed">{product.description}</p>
            </div>

            <Separator />

            {/* Color Selection */}
            <div>
              <h3 className="font-semibold text-lg mb-3">Color: {selectedColor}</h3>
              <div className="flex gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 rounded-lg border-2 transition-all duration-300 ${
                      selectedColor === color
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div>
              <h3 className="font-semibold text-lg mb-3">Size</h3>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {product.sizes.map((size) => {
                  const sizeStock = product.stock[size] || 0
                  const isAvailable = sizeStock > 0

                  return (
                    <button
                      key={size}
                      onClick={() => isAvailable && setSelectedSize(size)}
                      disabled={!isAvailable}
                      className={`py-3 px-4 rounded-lg border-2 transition-all duration-300 ${
                        selectedSize === size
                          ? "border-primary bg-primary/10 text-primary"
                          : isAvailable
                            ? "border-border hover:border-primary/50"
                            : "border-border/50 text-muted-foreground cursor-not-allowed opacity-50"
                      }`}
                    >
                      {size}
                      {!isAvailable && <span className="block text-xs">Out</span>}
                    </button>
                  )
                })}
              </div>
              {selectedSize && <p className="text-sm text-muted-foreground mt-2">{stockCount} in stock</p>}
            </div>

            {/* Quantity */}
            <div>
              <h3 className="font-semibold text-lg mb-3">Quantity</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-border rounded-lg">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="h-10 w-10"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="px-4 py-2 font-semibold">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= 10}
                    className="h-10 w-10"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <span className="text-sm text-muted-foreground">Max 10 per order</span>
              </div>
            </div>

            <Separator />

            {/* Actions */}
            <div className="space-y-4">
              <div className="flex gap-4">
                <Button className="flex-1 h-12 text-lg hover-glow" disabled={!selectedSize || !isInStock}>
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  {!selectedSize ? "Select Size" : !isInStock ? "Out of Stock" : "Add to Cart"}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 bg-transparent"
                  onClick={() => setIsWishlisted(!isWishlisted)}
                >
                  <Heart className={`h-5 w-5 ${isWishlisted ? "fill-current text-red-500" : ""}`} />
                </Button>
                <Button variant="outline" size="icon" className="h-12 w-12 bg-transparent">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>

              {selectedSize && isInStock && (
                <Button variant="outline" className="w-full h-12 text-lg bg-transparent">
                  Buy Now - Fast Checkout
                </Button>
              )}
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="flex items-center gap-2 text-sm">
                <Truck className="h-4 w-4 text-primary" />
                <span>Free Shipping</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Shield className="h-4 w-4 text-primary" />
                <span>Authentic</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <RotateCcw className="h-4 w-4 text-primary" />
                <span>30-Day Returns</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="care">Care & Materials</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-heading font-semibold text-xl mb-4">Product Features</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {product.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 pt-6 border-t border-border">
                    <div className="grid sm:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-semibold">SKU:</span> {product.sku}
                      </div>
                      <div>
                        <span className="font-semibold">Category:</span> {product.category}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="care" className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-heading font-semibold text-xl mb-3">Materials</h3>
                      <p className="text-muted-foreground">{product.materials}</p>
                    </div>
                    <Separator />
                    <div>
                      <h3 className="font-heading font-semibold text-xl mb-3">Care Instructions</h3>
                      <p className="text-muted-foreground">{product.careInstructions}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <div className="text-center py-12">
                    <h3 className="font-heading font-semibold text-xl mb-4">Customer Reviews</h3>
                    <p className="text-muted-foreground mb-6">
                      Be the first to review this product and help other customers make their decision.
                    </p>
                    <Button>Write a Review</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
