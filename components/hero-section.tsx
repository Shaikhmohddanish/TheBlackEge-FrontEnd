"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/dark-moody-streetwear-model-wearing-black-t-shirt-.png"
          alt="Streetwear Model"
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl animate-fade-in-up">
          <h1 className="font-heading font-black text-4xl sm:text-6xl lg:text-7xl leading-tight mb-6 text-balance">
            Elevate Your{" "}
            <span className="text-transparent bg-gradient-to-r from-primary to-secondary bg-clip-text">
              Streetwear Game
            </span>
          </h1>
          <p className="text-xl sm:text-2xl text-muted-foreground mb-8 text-pretty">
            Authenticity Meets Visionary Artistry. Premium streetwear for the urban fashion enthusiast.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="hover-glow group">
              Shop Now
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="outline" size="lg" className="hover-glow bg-transparent">
              Explore Collections
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary rounded-full flex justify-center">
          <div className="w-1 h-3 bg-primary rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  )
}
