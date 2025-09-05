import { Header } from "@/components/header"
import { CollectionContent } from "@/components/collection-content"
import { Footer } from "@/components/footer"
import type { Metadata } from "next"
import { notFound } from "next/navigation"

const collections = {
  "urban-essentials": {
    name: "Urban Essentials",
    description: "Core pieces that define street culture with minimalist design and premium construction.",
    hero: "/black-streetwear-t-shirt-urban-design.png",
    category: "T-Shirts",
  },
  "night-vision": {
    name: "Night Vision",
    description: "Dark aesthetics meet functional design for the nocturnal urban explorer.",
    hero: "/dark-hoodie-streetwear-minimalist-design.png",
    category: "Hoodies",
  },
  "neon-edge": {
    name: "Neon Edge",
    description: "Limited edition pieces featuring bold neon accents and cutting-edge design.",
    hero: "/black-streetwear-with-neon-accents-premium.png",
    category: "Limited Edition",
  },
  "stealth-mode": {
    name: "Stealth Mode",
    description: "All-black everything. Minimalist designs for maximum impact.",
    hero: "/black-zip-hoodie-streetwear-premium-quality.png",
    category: "Hoodies",
  },
  "street-accessories": {
    name: "Street Accessories",
    description: "Complete your look with premium bags, caps, and urban essentials.",
    hero: "/black-cap-streetwear-accessories-urban.png",
    category: "Accessories",
  },
  "limited-edition": {
    name: "Limited Edition",
    description: "Exclusive drops and collaborations. Available for a limited time only.",
    hero: "/black-streetwear-jacket-urban-fashion.png",
    category: "Jackets",
  },
  "tech-wear-pro": {
    name: "Tech Wear Pro",
    description: "Advanced technical streetwear with futuristic design and high-performance materials.",
    hero: "/placeholder.jpg",
    category: "Tech",
  },
  "shadow-runners": {
    name: "Shadow Runners",
    description: "Premium joggers and athletic wear for the urban athlete.",
    hero: "/placeholder.jpg",
    category: "Joggers",
  },
  "vintage-vibes": {
    name: "Vintage Vibes",
    description: "Retro-inspired streetwear with classic cuts and timeless appeal.",
    hero: "/placeholder.jpg",
    category: "Vintage",
  },
  "future-forward": {
    name: "Future Forward",
    description: "Next-generation streetwear designs for the fashion-forward individual.",
    hero: "/placeholder.jpg",
    category: "Future",
  },
  "classic-street": {
    name: "Classic Street",
    description: "Essential streetwear pieces that never go out of style.",
    hero: "/placeholder.jpg",
    category: "Classic",
  },
  "premium-luxury": {
    name: "Premium Luxury",
    description: "High-end streetwear pieces crafted with the finest materials.",
    hero: "/placeholder.jpg",
    category: "Premium",
  },
}

type Props = {
  params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const collection = collections[params.id as keyof typeof collections]

  if (!collection) {
    return {
      title: "Collection Not Found - THE BLACKEGE",
    }
  }

  return {
    title: `${collection.name} - THE BLACKEGE | Premium Streetwear Collection`,
    description: collection.description,
    keywords: `${collection.name}, ${collection.category}, streetwear collection, THE BLACKEGE, premium urban fashion`,
    openGraph: {
      title: `${collection.name} - THE BLACKEGE`,
      description: collection.description,
      type: "website",
      images: [collection.hero],
    },
  }
}

export async function generateStaticParams() {
  return Object.keys(collections).map((id) => ({
    id,
  }))
}

export default function CollectionPage({ params }: Props) {
  const collection = collections[params.id as keyof typeof collections]

  if (!collection) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Collection Not Found</h1>
            <p className="text-muted-foreground mb-8">
              The collection "{params.id}" doesn't exist or has been moved.
            </p>
            <div className="space-x-4">
              <a href="/collections" className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors">
                View All Collections
              </a>
              <a href="/" className="bg-secondary text-secondary-foreground px-6 py-3 rounded-lg hover:bg-secondary/90 transition-colors">
                Back to Home
              </a>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <CollectionContent collection={collection} />
      </main>
      <Footer />
    </div>
  )
}
