'use client';

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { notFound } from "next/navigation"
import { useEffect, useState } from "react"
import { getProductBySlug } from "@/lib/api/products"
import type { Product } from "@/lib/api/products"
import { EnhancedProductDetail } from "@/components/enhanced-product-detail"
import { Icons } from "@/components/ui/icons"

type Props = {
  params: { slug: string }
}

export default function ProductSlugPage({ params }: Props) {
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true)
        const productData = await getProductBySlug(params.slug)
        setProduct(productData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load product')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProduct()
  }, [params.slug])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <Icons.spinner className="mx-auto h-8 w-8 animate-spin text-gray-400 mb-4" />
              <p className="text-gray-600">Loading product...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (error || !product) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <EnhancedProductDetail product={product} />
      </main>
      <Footer />
    </div>
  )
}
