'use client';

import React from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { companyDetails } from '@/lib/config/company-details';
import { 
  Users, 
  Palette, 
  Camera, 
  Hammer, 
  Target, 
  Eye, 
  Heart, 
  Star,
  Quote,
  MapPin,
  Calendar
} from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="space-y-12">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-5xl font-bold text-white mb-4">About THE BLACKEGE</h1>
            <p className="text-xl text-white max-w-3xl mx-auto">
              Where authenticity meets visionary artistry. We're not just a clothing brand; 
              we're the embodiment of a cultural movement.
            </p>
          </div>

          {/* Hero Section */}
          <Card className="border-0 shadow-xl bg-gradient-to-br from-gray-900 to-black text-white">
            <CardContent className="p-12">
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-6">THE BLACKEGE</h2>
                <p className="text-xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
                  Rooted in the vibrant streets of India, THE BLACKEGE stands as a beacon of authenticity and 
                  self-expression in the world of fashion. Our ethos is simple yet powerful: to capture the 
                  true essence of Street Fashion and infuse it with visionary artistry.
                </p>
                <div className="flex justify-center gap-4 flex-wrap">
                  <Badge variant="secondary" className="bg-white text-black px-4 py-2">
                    Streetwear Fashion
                  </Badge>
                  <Badge variant="secondary" className="bg-white text-black px-4 py-2">
                    Cultural Movement
                  </Badge>
                  <Badge variant="secondary" className="bg-white text-black px-4 py-2">
                    Visionary Artistry
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Founder Story */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Users className="h-6 w-6" />
                The Founder's Story
              </CardTitle>
              <CardDescription>Meet the visionary behind THE BLACKEGE</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Farhan Ansari</h3>
                  <p className="text-white">
                    Mumbai-born Farhan Ansari launched his own Indian street wear label, "THE BLACKEGE" in 2024. 
                    The founder and creative director's interest in construction, photography, craftsmanship and 
                    working with artisans turned THE BLACKEGE into a well-respected brand.
                  </p>
                  <p className="text-white">
                    The fashion house covers gender-fluid, men's and women's ready-to-wear and custom made clothing. 
                    The collections are defined by Farhan Ansari's signature style. The Indian brand was one of the 
                    first of its kind to create a niche category in the country.
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h4 className="font-semibold mb-3 flex items-center gap-2 text-black">
                      <Eye className="h-5 w-5" />
                      Visual Philosophy
                    </h4>
                    <p className="text-sm text-black">
                      THE BLACKEGE's founder pays crucial emphasis on the visuals of things. The aesthetics of the 
                      designs are inspired by his own paintings, creating a unique fusion of art and fashion.
                    </p>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-lg text-black">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Heart className="h-5 w-5" />
                      Brand Philosophy
                    </h4>
                    <p className="text-sm">
                      "THE BLACKEGE is dangerous. It is for the people who aren't scared to cross the line and 
                      prove a point. It is for the people who believe in art and culture!" - Farhan Ansari
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Who We Are */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Target className="h-6 w-6" />
                Who We Are
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-lg text-gray-700 leading-relaxed">
                At THE BLACKEGE, we're not just a clothing and accessories brand; we're the embodiment of a cultural movement.
              </p>
              <p className="text-gray-700 leading-relaxed">
                THE BLACKEGE isn't just about fabric and threads; we're storytellers, visionaries, and rebels with a cause. 
                Each garment and accessory we craft tells a story - a narrative deeply rooted in the society and existential 
                movements that shape our world. We're not afraid to challenge conventions or push boundaries because we believe 
                true innovation lies at the intersection of creativity and rebellion.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 text-black">
                <div className="text-center p-6 bg-gray-50 rounded-lg">
                  <Palette className="h-12 w-12 mx-auto mb-4 text-blue-600" />
                  <h3 className="font-semibold mb-2">Storytellers</h3>
                  <p className="text-sm text-black">
                    Each piece tells a story rooted in society and cultural movements
                  </p>
                </div>
                <div className="text-center p-6 bg-gray-50 rounded-lg">
                  <Star className="h-12 w-12 mx-auto mb-4 text-purple-600" />
                  <h3 className="font-semibold mb-2">Visionaries</h3>
                  <p className="text-sm text-black">
                    We challenge conventions and push boundaries in fashion
                  </p>
                </div>
                <div className="text-center p-6 bg-gray-50 rounded-lg">
                  <Heart className="h-12 w-12 mx-auto mb-4 text-red-600" />
                  <h3 className="font-semibold mb-2">Rebels</h3>
                  <p className="text-sm text-black">
                    We believe true innovation lies at creativity and rebellion's intersection
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Our Vision */}
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl text-blue-800">
                <Eye className="h-6 w-6" />
                Our Vision
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-lg text-blue-800 leading-relaxed">
                At THE BLACKEGE, our vision is clear: to redefine Street Fashion and empower individuals to express 
                themselves boldly and unapologetically.
              </p>
              <p className="text-blue-700 leading-relaxed">
                We envision a world where clothing isn't just a means of covering the body but a canvas for self-expression, 
                where every garment is a statement and every accessory a conversation starter. Our aim is to inspire confidence, 
                ignite creativity, and spark a revolution in the world of fashion.
              </p>
            </CardContent>
          </Card>

          {/* Brand Values */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Our Values</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-black text-white p-3 rounded-full">
                      <Palette className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Artistic Integrity</h3>
                      <p className="text-white">
                        Every design is inspired by authentic artistic vision, ensuring each piece carries genuine creative expression.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-black text-white p-3 rounded-full">
                      <Camera className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Visual Excellence</h3>
                      <p className="text-white">
                        We pay crucial emphasis on the aesthetics and visual impact of our designs, inspired by artistic paintings.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-black text-white p-3 rounded-full">
                      <Hammer className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Craftsmanship</h3>
                      <p className="text-white">
                        Working closely with artisans to ensure the highest quality and attention to detail in every piece.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-black text-white p-3 rounded-full">
                      <Users className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Inclusivity</h3>
                      <p className="text-white">
                        Gender-fluid designs that celebrate diversity and self-expression for all individuals.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Company Milestones */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Our Journey</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="bg-black text-white p-3 rounded-full">
                    <Calendar className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">2024 - The Beginning</h3>
                    <p className="text-white">
                      Farhan Ansari launched THE BLACKEGE, creating India's first niche streetwear brand
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-black text-white p-3 rounded-full">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Mumbai Roots</h3>
                    <p className="text-white">
                      Born in the vibrant streets of Mumbai, drawing inspiration from the city's cultural diversity
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-black text-white p-3 rounded-full">
                    <Star className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Recognition</h3>
                    <p className="text-white">
                      Quickly established as a well-respected brand in the Indian fashion landscape
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quote Section */}
          <Card className="border-gray-800 bg-gray-900 text-white">
            <CardContent className="p-12 text-center">
              <Quote className="h-12 w-12 mx-auto mb-6 text-gray-400" />
              <blockquote className="text-2xl font-medium mb-6 leading-relaxed">
                "THE BLACKEGE is dangerous. It is for the people who aren't scared to cross the line and prove a point. 
                It is for the people who believe in art and culture!"
              </blockquote>
              <cite className="text-lg text-gray-300">- Farhan Ansari, Founder & Creative Director</cite>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-800">
                <MapPin className="h-5 w-5" />
                Connect With Us
              </CardTitle>
              <CardDescription>Join our cultural movement</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3 text-black">Get in Touch</h4>
                  <p className="text-sm text-black mb-4">
                    Ready to be part of the revolution? Connect with us and join the movement.
                  </p>
                  <div className="space-y-2 text-black">
                    <p className="text-sm"><strong>Email:</strong> {companyDetails.email}</p>
                    <p className="text-sm"><strong>Phone:</strong> {companyDetails.mobile}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3 text-black">Visit Us</h4>
                  <p className="text-sm text-black">
                    {companyDetails.address.flat}, {companyDetails.address.building}<br />
                    {companyDetails.address.road}, {companyDetails.address.locality}<br />
                    {companyDetails.address.city}, {companyDetails.address.state} - {companyDetails.address.pincode}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}