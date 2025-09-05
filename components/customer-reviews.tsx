"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Star, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const reviews = [
  {
    id: 1,
    name: "Marcus Chen",
    rating: 5,
    comment:
      "THE BLACKEGE isn't just clothing, it's a lifestyle. The quality is unmatched and the designs are absolutely fire.",
    image: "/young-urban-male-portrait.png",
  },
  {
    id: 2,
    name: "Zara Williams",
    rating: 5,
    comment: "Finally found a brand that gets street culture. Every piece I own from THE BLACKEGE gets compliments.",
    image: "/young-urban-female-portrait.png",
  },
  {
    id: 3,
    name: "Diego Rodriguez",
    rating: 5,
    comment: "The attention to detail is incredible. You can feel the premium quality in every stitch.",
    image: "/young-urban-male-portrait-streetwear.png",
  },
  {
    id: 4,
    name: "Aisha Johnson",
    rating: 5,
    comment:
      "THE BLACKEGE represents everything I love about street fashion. Bold, authentic, and unapologetically unique.",
    image: "/young-urban-female-portrait-fashion.png",
  },
]

export function CustomerReviews() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % reviews.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const nextReview = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % reviews.length)
  }

  const prevReview = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + reviews.length) % reviews.length)
  }

  return (
    <section className="py-20 bg-gradient-to-b from-background to-card/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl mb-4">What Our Community Says</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Real voices from the streets. Real stories from our family.
          </p>
        </div>

        <div className="max-w-4xl mx-auto relative">
          <Card className="bg-card/80 backdrop-blur border-border hover-glow">
            <CardContent className="p-8 sm:p-12">
              <div className="text-center animate-fade-in-up" key={currentIndex}>
                <div className="flex justify-center mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-6 w-6 ${
                        i < reviews[currentIndex].rating ? "text-primary fill-current" : "text-muted-foreground"
                      }`}
                    />
                  ))}
                </div>

                <blockquote className="text-xl sm:text-2xl text-foreground mb-8 font-medium text-balance">
                  "{reviews[currentIndex].comment}"
                </blockquote>

                <div className="flex items-center justify-center space-x-4">
                  <img
                    src={reviews[currentIndex].image || "/placeholder.svg"}
                    alt={reviews[currentIndex].name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold text-foreground">{reviews[currentIndex].name}</div>
                    <div className="text-sm text-muted-foreground">Verified Customer</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-center items-center mt-8 space-x-4">
            <Button variant="outline" size="icon" onClick={prevReview} className="hover-glow bg-transparent">
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex space-x-2">
              {reviews.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentIndex ? "bg-primary" : "bg-muted-foreground"
                  }`}
                  onClick={() => setCurrentIndex(index)}
                />
              ))}
            </div>

            <Button variant="outline" size="icon" onClick={nextReview} className="hover-glow bg-transparent">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
