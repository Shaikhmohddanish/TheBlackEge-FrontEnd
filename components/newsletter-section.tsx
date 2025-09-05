"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, ArrowRight } from "lucide-react"

export function NewsletterSection() {
  const [email, setEmail] = useState("")
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle newsletter signup
    setIsSubscribed(true)
    setEmail("")
    setTimeout(() => setIsSubscribed(false), 3000)
  }

  return (
    <section className="py-20 bg-gradient-to-r from-primary/10 via-background to-secondary/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center animate-fade-in-up">
          <div className="mb-8">
            <Mail className="h-16 w-16 text-primary mx-auto mb-6" />
            <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl mb-4">
              Join THE BLACKEGE{" "}
              <span className="text-transparent bg-gradient-to-r from-primary to-secondary bg-clip-text">Movement</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Be the first to know about new drops, exclusive releases, and street culture insights. Join our community
              of urban fashion pioneers.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 bg-card border-border text-foreground placeholder:text-muted-foreground"
              />
              <Button type="submit" className="hover-glow group" disabled={isSubscribed}>
                {isSubscribed ? (
                  "Subscribed!"
                ) : (
                  <>
                    Subscribe
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </div>
          </form>

          <div className="mt-8 flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-primary rounded-full" />
              <span>Exclusive Drops</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-secondary rounded-full" />
              <span>Early Access</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-primary rounded-full" />
              <span>Street Culture News</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
