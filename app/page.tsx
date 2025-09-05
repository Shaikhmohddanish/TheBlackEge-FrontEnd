import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { HeroSearchSection } from "@/components/search/hero-search-section"
import { FeaturedCollections } from "@/components/featured-collections"
import { TrendingProducts } from "@/components/trending-products"
import { BrandStory } from "@/components/brand-story"
import { FeaturesSection } from "@/components/features-section"
import { LifestyleSection } from "@/components/lifestyle-section"
import { StatsSection } from "@/components/stats-section"
import { SocialProof } from "@/components/social-proof"
import { AboutSection } from "@/components/about-section"
import { CustomerReviews } from "@/components/customer-reviews"
import { NewsletterSection } from "@/components/newsletter-section"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <HeroSearchSection />
        <FeaturedCollections />
        <TrendingProducts />
        <BrandStory />
        <FeaturesSection />
        <LifestyleSection />
        <StatsSection />
        <SocialProof />
        <AboutSection />
        <CustomerReviews />
        <NewsletterSection />
      </main>
      <Footer />
    </div>
  )
}
