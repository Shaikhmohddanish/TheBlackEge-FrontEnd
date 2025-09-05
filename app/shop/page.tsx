'use client';

import { Header } from "@/components/header"
import { EnhancedShopContent } from "@/components/enhanced-shop-content"
import { Footer } from "@/components/footer"

export default function ShopPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <EnhancedShopContent />
      </main>
      <Footer />
    </div>
  )
}
