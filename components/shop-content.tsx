"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { ShoppingCart, Heart, Grid, List, Search, Eye, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"

const products = [
  {
    id: 1,
    name: "Urban Essentials Tee",
    price: 89.99,
    originalPrice: null,
    image: "/black-streetwear-t-shirt-urban-design.png",
    images: [
      "/black-streetwear-t-shirt-urban-design.png",
      "/black-t-shirt-front.png",
      "/black-t-shirt-back.png",
      "/black-t-shirt-detail-view.png",
    ],
    category: "T-Shirts",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: ["Black", "White", "Gray"],
    isNew: true,
    isSale: false,
    description: "Premium cotton blend tee with urban-inspired graphics. Perfect for everyday streetwear styling.",
  },
  {
    id: 2,
    name: "Night Vision Hoodie",
    price: 129.99,
    originalPrice: null,
    image: "/dark-hoodie-streetwear-minimalist-design.png",
    images: [
      "/dark-hoodie-streetwear-minimalist-design.png",
      "/black-hoodie-front.png",
      "/black-hoodie-back-view.png",
      "/black-hoodie-hood.png",
    ],
    category: "Hoodies",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black", "Charcoal"],
    isNew: false,
    isSale: false,
    description:
      "Heavyweight hoodie with minimalist design. Features premium fleece lining and adjustable drawstrings.",
  },
  {
    id: 3,
    name: "Street Elite Cap",
    price: 79.99,
    originalPrice: 99.99,
    image: "/black-cap-streetwear-accessories-urban.png",
    category: "Accessories",
    sizes: ["One Size"],
    colors: ["Black", "White"],
    isNew: false,
    isSale: true,
    description: "Stylish cap for everyday wear.",
  },
  {
    id: 4,
    name: "Midnight Bomber Jacket",
    price: 199.99,
    originalPrice: null,
    image: "/black-streetwear-jacket-urban-fashion.png",
    category: "Jackets",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Navy"],
    isNew: true,
    isSale: false,
    description: "Classic bomber jacket with a modern twist.",
  },
  {
    id: 5,
    name: "Shadow Cargo Pants",
    price: 149.99,
    originalPrice: null,
    image: "/dark-streetwear-pants-urban-style.png",
    category: "Pants",
    sizes: ["28", "30", "32", "34", "36", "38"],
    colors: ["Black", "Olive", "Gray"],
    isNew: false,
    isSale: false,
    description: "Comfortable cargo pants with multiple pockets.",
  },
  {
    id: 6,
    name: "Neon Edge Limited Tee",
    price: 149.99,
    originalPrice: null,
    image: "/black-streetwear-with-neon-accents-premium.png",
    category: "Limited Edition",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black/Blue", "Black/Red"],
    isNew: true,
    isSale: false,
    description: "Limited edition tee with neon accents.",
  },
  {
    id: 7,
    name: "Urban Crossbody Bag",
    price: 89.99,
    originalPrice: 109.99,
    image: "/black-streetwear-crossbody-bag-urban-accessories.png",
    category: "Accessories",
    sizes: ["One Size"],
    colors: ["Black", "Gray"],
    isNew: false,
    isSale: true,
    description: "Versatile crossbody bag for daily use.",
  },
  {
    id: 8,
    name: "Stealth Zip Hoodie",
    price: 159.99,
    originalPrice: null,
    image: "/black-zip-hoodie-streetwear-premium-quality.png",
    category: "Hoodies",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black", "Charcoal", "Navy"],
    isNew: true,
    isSale: false,
    description: "Premium zip hoodie with stealth design.",
  },
]

const categories = ["All", "T-Shirts", "Hoodies", "Jackets", "Pants", "Accessories", "Limited Edition"]
const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "name", label: "Name A-Z" },
]

export function ShopContent() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [sortBy, setSortBy] = useState("featured")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [quickViewProduct, setQuickViewProduct] = useState<(typeof products)[0] | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false)

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return a.isNew ? -1 : 1
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "name":
        return a.name.localeCompare(b.name)
      default:
        return 0
    }
  })

  const QuickViewModal = ({ product }: { product: (typeof products)[0] }) => {
    const nextImage = () => {
      setCurrentImageIndex((prev) => (prev + 1) % product.images.length)
    }

    const prevImage = () => {
      setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length)
    }

    return (
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-background border-border">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-lg bg-card">
              <img
                src={product.images[currentImageIndex] || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.images.length > 1 && (
                <>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 h-8 w-8"
                    onClick={prevImage}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8"
                    onClick={nextImage}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>

            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-colors ${
                      currentImageIndex === index ? "border-primary" : "border-border"
                    }`}
                  >
                    <img
                      src={img || "/placeholder.svg"}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline">{product.category}</Badge>
                {product.isNew && <Badge className="bg-primary text-primary-foreground">NEW</Badge>}
                {product.isSale && <Badge className="bg-secondary text-secondary-foreground">SALE</Badge>}
              </div>
              <h2 className="font-heading font-bold text-2xl mb-2">{product.name}</h2>
              <div className="flex items-center gap-2 mb-4">
                {product.originalPrice && (
                  <span className="text-lg text-muted-foreground line-through">${product.originalPrice}</span>
                )}
                <span className="text-2xl font-bold text-foreground">${product.price}</span>
              </div>
              <p className="text-muted-foreground">{product.description}</p>
            </div>

            {/* Colors */}
            <div>
              <h3 className="font-semibold mb-2">Colors</h3>
              <div className="flex gap-2">
                {product.colors.map((color) => (
                  <Button key={color} variant="outline" size="sm">
                    {color}
                  </Button>
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div>
              <h3 className="font-semibold mb-2">Sizes</h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <Button key={size} variant="outline" size="sm" className="min-w-[3rem] bg-transparent">
                    {size}
                  </Button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button className="flex-1">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
              </Button>
              <Button variant="outline" size="icon">
                <Heart className="h-4 w-4" />
              </Button>
            </div>

            <Link href={`/product/${product.id}`}>
              <Button variant="outline" className="w-full bg-transparent">
                View Full Details
              </Button>
            </Link>
          </div>
        </div>
      </DialogContent>
    )
  }

  const handleQuickView = (product: (typeof products)[0]) => {
    setQuickViewProduct(product)
    setCurrentImageIndex(0)
    setIsQuickViewOpen(true)
  }

  return (
    <div className="py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 animate-fade-in-up">
          <h1 className="font-heading font-bold text-4xl sm:text-5xl lg:text-6xl mb-4 text-center">Shop Collection</h1>
          <p className="text-xl text-muted-foreground text-center max-w-2xl mx-auto">
            Discover our complete range of premium streetwear pieces designed for the urban culture
          </p>
        </div>

        {/* Filters and Search */}
        <div className="mb-8 space-y-4 lg:space-y-0 lg:flex lg:items-center lg:justify-between animate-fade-in-up">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-card border-border"
            />
          </div>

          <div className="flex items-center gap-4">
            {/* Sort */}
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

            {/* View Mode */}
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

        {/* Category Filter */}
        <div className="mb-8 animate-fade-in-up">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="hover-glow"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Products Grid/List */}
        <div className="mb-12">
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedProducts.map((product, index) => (
                <Card
                  key={product.id}
                  className="group overflow-hidden border-border hover:border-primary/50 transition-all duration-300 hover-glow animate-fade-in-up relative"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <CardContent className="p-0 relative">
                    <Link href={`/product/${product.id}`} className="block">
                      <div className="relative overflow-hidden">
                        <img
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                        />

                        {/* Badges */}
                        <div className="absolute top-4 left-4 flex flex-col gap-2">
                          {product.isNew && <Badge className="bg-primary text-primary-foreground">NEW</Badge>}
                          {product.isSale && <Badge className="bg-secondary text-secondary-foreground">SALE</Badge>}
                        </div>

                        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>

                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-primary font-medium">{product.category}</span>
                          <div className="flex items-center gap-2">
                            {product.originalPrice && (
                              <span className="text-sm text-muted-foreground line-through">
                                ${product.originalPrice}
                              </span>
                            )}
                            <span className="text-lg font-bold text-foreground">${product.price}</span>
                          </div>
                        </div>
                        <h3 className="font-heading font-semibold text-lg text-foreground mb-2">{product.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{product.colors.length} colors</span>
                          <span>•</span>
                          <span>{product.sizes.length} sizes</span>
                        </div>
                      </div>
                    </Link>

                    {/* Action Buttons */}
                    <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Button size="icon" variant="secondary" className="h-8 w-8">
                        <Heart className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="secondary"
                        className="h-8 w-8"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          handleQuickView(product)
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Button
                        className="w-full"
                        size="sm"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          // Add to cart logic here
                        }}
                      >
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Add to Cart
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {sortedProducts.map((product, index) => (
                <Card
                  key={product.id}
                  className="group border-border hover:border-primary/50 transition-all duration-300 hover-glow animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <CardContent className="p-6">
                    <Link href={`/product/${product.id}`} className="flex gap-6">
                      <div className="relative overflow-hidden rounded-lg flex-shrink-0">
                        <img
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          className="w-32 h-32 object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {/* Badges */}
                        <div className="absolute top-2 left-2 flex flex-col gap-1">
                          {product.isNew && <Badge className="bg-primary text-primary-foreground text-xs">NEW</Badge>}
                          {product.isSale && (
                            <Badge className="bg-secondary text-secondary-foreground text-xs">SALE</Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <span className="text-sm text-primary font-medium">{product.category}</span>
                              <h3 className="font-heading font-semibold text-xl text-foreground">{product.name}</h3>
                            </div>
                            <div className="text-right">
                              {product.originalPrice && (
                                <span className="text-sm text-muted-foreground line-through block">
                                  ${product.originalPrice}
                                </span>
                              )}
                              <span className="text-xl font-bold text-foreground">${product.price}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                            <span>{product.colors.join(", ")}</span>
                            <span>•</span>
                            <span>Sizes: {product.sizes.join(", ")}</span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-3">
                          <Button className="flex-1">
                            <ShoppingCart className="mr-2 h-4 w-4" />
                            Add to Cart
                          </Button>
                          <Button variant="outline" size="icon">
                            <Heart className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              handleQuickView(product)
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Results Info */}
        <div className="text-center text-muted-foreground">
          Showing {sortedProducts.length} of {products.length} products
        </div>
      </div>

      <Dialog open={isQuickViewOpen} onOpenChange={setIsQuickViewOpen}>
        {quickViewProduct && <QuickViewModal product={quickViewProduct} />}
      </Dialog>
    </div>
  )
}
