'use client';

import { Header } from "@/components/header"
import { EnhancedShopContentInfinite } from "@/components/enhanced-shop-content-infinite"
import { Footer } from "@/components/footer"

export default function ShopPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <EnhancedShopContentInfinite />
      </main>
      <Footer />
    </div>
  )
}
