'use client';

import React, { useState } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Icons } from '@/components/ui/icons';
import { cn } from '@/lib/utils';

// Size chart data
const sizeCharts = {
  tops: {
    title: 'Tops (T-Shirts, Hoodies, Sweatshirts)',
    headers: ['Size', 'Chest (in)', 'Length (in)', 'Shoulder (in)', 'Sleeve (in)'],
    rows: [
      { size: 'XS', chest: '34-36', length: '26', shoulder: '17', sleeve: '24', fit: 'Fitted' },
      { size: 'S', chest: '36-38', length: '27', shoulder: '18', sleeve: '25', fit: 'Regular' },
      { size: 'M', chest: '38-40', length: '28', shoulder: '19', sleeve: '26', fit: 'Regular' },
      { size: 'L', chest: '40-42', length: '29', shoulder: '20', sleeve: '27', fit: 'Regular' },
      { size: 'XL', chest: '42-44', length: '30', shoulder: '21', sleeve: '28', fit: 'Relaxed' },
      { size: 'XXL', chest: '44-46', length: '31', shoulder: '22', sleeve: '29', fit: 'Relaxed' },
      { size: 'XXXL', chest: '46-48', length: '32', shoulder: '23', sleeve: '30', fit: 'Oversized' }
    ]
  },
  bottoms: {
    title: 'Bottoms (Joggers, Shorts, Pants)',
    headers: ['Size', 'Waist (in)', 'Hip (in)', 'Inseam (in)', 'Outseam (in)'],
    rows: [
      { size: 'XS', waist: '28-30', hip: '36-38', inseam: '30', outseam: '40', fit: 'Slim' },
      { size: 'S', waist: '30-32', hip: '38-40', inseam: '31', outseam: '41', fit: 'Regular' },
      { size: 'M', waist: '32-34', hip: '40-42', inseam: '32', outseam: '42', fit: 'Regular' },
      { size: 'L', waist: '34-36', hip: '42-44', inseam: '33', outseam: '43', fit: 'Regular' },
      { size: 'XL', waist: '36-38', hip: '44-46', inseam: '34', outseam: '44', fit: 'Relaxed' },
      { size: 'XXL', waist: '38-40', hip: '46-48', inseam: '34', outseam: '44', fit: 'Relaxed' },
      { size: 'XXXL', waist: '40-42', hip: '48-50', inseam: '34', outseam: '44', fit: 'Oversized' }
    ]
  },
  accessories: {
    title: 'Accessories (Caps, Beanies)',
    headers: ['Size', 'Head Circumference (in)', 'Fit'],
    rows: [
      { size: 'One Size', circumference: '22-24', fit: 'Adjustable/Stretchy' }
    ]
  }
};

const measurementTips = [
  {
    title: 'Chest/Bust',
    description: 'Measure around the fullest part of your chest, keeping the tape horizontal.',
    icon: Icons.user
  },
  {
    title: 'Waist',
    description: 'Measure around your natural waistline, typically the narrowest part of your torso.',
    icon: Icons.user
  },
  {
    title: 'Hip',
    description: 'Measure around the fullest part of your hips, about 7-9 inches below your waist.',
    icon: Icons.user
  },
  {
    title: 'Length',
    description: 'For tops, measure from the highest point of the shoulder to the desired hem length.',
    icon: Icons.user
  },
  {
    title: 'Inseam',
    description: 'Measure from the crotch to the ankle along the inside of your leg.',
    icon: Icons.user
  }
];

const fitGuides = [
  {
    fit: 'Fitted',
    description: 'Close to body, minimal ease',
    color: 'bg-blue-100 text-blue-800',
    icon: '👔'
  },
  {
    fit: 'Regular',
    description: 'Classic streetwear fit with comfortable room',
    color: 'bg-green-100 text-green-800',
    icon: '👕'
  },
  {
    fit: 'Relaxed',
    description: 'Loose and comfortable with extra room',
    color: 'bg-orange-100 text-orange-800',
    icon: '🧥'
  },
  {
    fit: 'Oversized',
    description: 'Intentionally large, authentic streetwear aesthetic',
    color: 'bg-purple-100 text-purple-800',
    icon: '🥋'
  }
];

export default function SizeGuidePage() {
  const [selectedCategory, setSelectedCategory] = useState('tops');
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 animate-fade-in-up">
            <h1 className="font-heading font-bold text-4xl sm:text-5xl lg:text-6xl mb-6">
              Size Guide
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Find your perfect fit with THE BLACKEGE streetwear. Our detailed size guide ensures 
              you get that authentic urban look with maximum comfort.
            </p>
          </div>

          {/* Fit Guide Overview */}
          <div className="mb-12">
            <h2 className="font-heading font-bold text-3xl mb-8 text-center animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              Our Fit Philosophy
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {fitGuides.map((guide, index) => (
                <Card 
                  key={guide.fit} 
                  className="text-center animate-fade-in-up hover:shadow-lg transition-shadow"
                  style={{ animationDelay: `${0.2 + index * 0.1}s` }}
                >
                  <CardContent className="pt-6">
                    <div className="text-4xl mb-3">{guide.icon}</div>
                    <Badge className={cn('mb-3', guide.color)}>
                      {guide.fit}
                    </Badge>
                    <p className="text-sm text-muted-foreground">
                      {guide.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Size Charts */}
          <div className="mb-16">
            <h2 className="font-heading font-bold text-3xl mb-8 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
              Size Charts
            </h2>
            
            <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="space-y-8">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="tops">Tops</TabsTrigger>
                <TabsTrigger value="bottoms">Bottoms</TabsTrigger>
                <TabsTrigger value="accessories">Accessories</TabsTrigger>
              </TabsList>

              {Object.entries(sizeCharts).map(([key, chart]) => (
                <TabsContent key={key} value={key}>
                  <Card className="animate-fade-in-up">
                    <CardHeader>
                      <CardTitle>{chart.title}</CardTitle>
                      <CardDescription>
                        All measurements are in inches. For the best fit, measure yourself and compare with our size chart.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b">
                              {chart.headers.map((header) => (
                                <th key={header} className="text-left p-3 font-medium">
                                  {header}
                                </th>
                              ))}
                              {key !== 'accessories' && <th className="text-left p-3 font-medium">Fit</th>}
                            </tr>
                          </thead>
                          <tbody>
                            {chart.rows.map((row, index) => (
                              <tr 
                                key={row.size}
                                className={cn(
                                  'border-b hover:bg-muted/50 cursor-pointer transition-colors',
                                  selectedSize === row.size && 'bg-primary/10'
                                )}
                                onClick={() => setSelectedSize(selectedSize === row.size ? null : row.size)}
                              >
                                <td className="p-3 font-medium">{row.size}</td>
                                {key === 'tops' && (
                                  <>
                                    <td className="p-3">{(row as any).chest}</td>
                                    <td className="p-3">{(row as any).length}</td>
                                    <td className="p-3">{(row as any).shoulder}</td>
                                    <td className="p-3">{(row as any).sleeve}</td>
                                    <td className="p-3">
                                      <Badge variant="outline" className="text-xs">
                                        {(row as any).fit}
                                      </Badge>
                                    </td>
                                  </>
                                )}
                                {key === 'bottoms' && (
                                  <>
                                    <td className="p-3">{(row as any).waist}</td>
                                    <td className="p-3">{(row as any).hip}</td>
                                    <td className="p-3">{(row as any).inseam}</td>
                                    <td className="p-3">{(row as any).outseam}</td>
                                    <td className="p-3">
                                      <Badge variant="outline" className="text-xs">
                                        {(row as any).fit}
                                      </Badge>
                                    </td>
                                  </>
                                )}
                                {key === 'accessories' && (
                                  <>
                                    <td className="p-3">{(row as any).circumference}</td>
                                    <td className="p-3">{(row as any).fit}</td>
                                  </>
                                )}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      
                      {selectedSize && (
                        <div className="mt-4 p-4 bg-primary/5 rounded-lg border">
                          <h4 className="font-medium mb-2">Size {selectedSize} Details:</h4>
                          <p className="text-sm text-muted-foreground">
                            This size is designed for a {chart.rows.find(row => row.size === selectedSize)?.fit?.toLowerCase()} fit. 
                            Perfect for {selectedSize === 'XS' || selectedSize === 'S' ? 'a more fitted streetwear look' : 
                                     selectedSize === 'M' || selectedSize === 'L' ? 'the classic streetwear aesthetic' : 
                                     'an oversized, authentic urban style'}.
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          </div>

          {/* How to Measure */}
          <div className="mb-16">
            <h2 className="font-heading font-bold text-3xl mb-8 animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
              How to Measure Yourself
            </h2>
            
            <Card className="animate-fade-in-up" style={{ animationDelay: '0.9s' }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icons.user className="h-5 w-5" />
                  Measurement Guide
                </CardTitle>
                <CardDescription>
                  Follow these steps to get accurate measurements for the perfect fit
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {measurementTips.map((tip, index) => (
                    <div 
                      key={tip.title}
                      className="flex items-start gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center shrink-0">
                        <tip.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">{tip.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {tip.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-8 p-6 bg-muted rounded-lg">
                  <h4 className="font-medium mb-4 flex items-center gap-2">
                    <Icons.shoppingCart className="h-4 w-4" />
                    Pro Tips for Accurate Measurements
                  </h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <Icons.shoppingCart className="h-3 w-3 text-green-600" />
                      Use a flexible measuring tape, not a ruler
                    </li>
                    <li className="flex items-center gap-2">
                      <Icons.shoppingCart className="h-3 w-3 text-green-600" />
                      Measure over thin, form-fitting clothing or underwear
                    </li>
                    <li className="flex items-center gap-2">
                      <Icons.shoppingCart className="h-3 w-3 text-green-600" />
                      Stand naturally and breathe normally while measuring
                    </li>
                    <li className="flex items-center gap-2">
                      <Icons.shoppingCart className="h-3 w-3 text-green-600" />
                      Have someone help you for more accurate measurements
                    </li>
                    <li className="flex items-center gap-2">
                      <Icons.shoppingCart className="h-3 w-3 text-green-600" />
                      Double-check measurements to ensure accuracy
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Fit Recommendations */}
          <div className="mb-16">
            <h2 className="font-heading font-bold text-3xl mb-8 animate-fade-in-up" style={{ animationDelay: '1.0s' }}>
              Fit Recommendations
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="animate-fade-in-up" style={{ animationDelay: '1.1s' }}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icons.shoppingCart className="h-5 w-5 text-green-600" />
                    For the Perfect Streetwear Look
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3 text-sm">
                    <div>
                      <div className="font-medium mb-1">Classic Streetwear Fit</div>
                      <div className="text-muted-foreground">
                        Choose your regular size for that authentic urban aesthetic - not too tight, not too loose.
                      </div>
                    </div>
                    
                    <div>
                      <div className="font-medium mb-1">Oversized Look</div>
                      <div className="text-muted-foreground">
                        Size up 1-2 sizes for the popular oversized streetwear style that's trending now.
                      </div>
                    </div>
                    
                    <div>
                      <div className="font-medium mb-1">Layering</div>
                      <div className="text-muted-foreground">
                        Consider sizing up if you plan to layer hoodies over t-shirts or wear thick layers underneath.
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="animate-fade-in-up" style={{ animationDelay: '1.2s' }}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icons.user className="h-5 w-5 text-blue-600" />
                    Between Sizes?
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3 text-sm">
                    <div>
                      <div className="font-medium mb-1">For Tops</div>
                      <div className="text-muted-foreground">
                        Size up for a relaxed fit, size down for a more fitted look. Most customers prefer sizing up.
                      </div>
                    </div>
                    
                    <div>
                      <div className="font-medium mb-1">For Bottoms</div>
                      <div className="text-muted-foreground">
                        Size down if you're between sizes - our bottoms tend to run slightly large for comfort.
                      </div>
                    </div>
                    
                    <div>
                      <div className="font-medium mb-1">Still Unsure?</div>
                      <div className="text-muted-foreground">
                        Contact our style team for personalized fit advice based on your measurements and preferences.
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Size Comparison */}
          <div className="mb-16">
            <h2 className="font-heading font-bold text-3xl mb-8 animate-fade-in-up" style={{ animationDelay: '1.3s' }}>
              International Size Conversion
            </h2>
            
            <Card className="animate-fade-in-up" style={{ animationDelay: '1.4s' }}>
              <CardHeader>
                <CardTitle>Size Conversion Chart</CardTitle>
                <CardDescription>
                  Compare THE BLACKEGE sizes with international standards
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3 font-medium">THE BLACKEGE</th>
                        <th className="text-left p-3 font-medium">US</th>
                        <th className="text-left p-3 font-medium">UK</th>
                        <th className="text-left p-3 font-medium">EU</th>
                        <th className="text-left p-3 font-medium">Japan</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b"><td className="p-3 font-medium">XS</td><td className="p-3">XS</td><td className="p-3">6</td><td className="p-3">32</td><td className="p-3">S</td></tr>
                      <tr className="border-b"><td className="p-3 font-medium">S</td><td className="p-3">S</td><td className="p-3">8</td><td className="p-3">34</td><td className="p-3">M</td></tr>
                      <tr className="border-b"><td className="p-3 font-medium">M</td><td className="p-3">M</td><td className="p-3">10</td><td className="p-3">36</td><td className="p-3">L</td></tr>
                      <tr className="border-b"><td className="p-3 font-medium">L</td><td className="p-3">L</td><td className="p-3">12</td><td className="p-3">38</td><td className="p-3">XL</td></tr>
                      <tr className="border-b"><td className="p-3 font-medium">XL</td><td className="p-3">XL</td><td className="p-3">14</td><td className="p-3">40</td><td className="p-3">XXL</td></tr>
                      <tr className="border-b"><td className="p-3 font-medium">XXL</td><td className="p-3">XXL</td><td className="p-3">16</td><td className="p-3">42</td><td className="p-3">XXXL</td></tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Section */}
          <Card className="animate-fade-in-up" style={{ animationDelay: '1.5s' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icons.user className="h-5 w-5" />
                Need Sizing Help?
              </CardTitle>
              <CardDescription>
                Our style experts are here to help you find the perfect fit for your streetwear style.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                  <Icons.user className="h-6 w-6" />
                  <span className="font-medium">Style Consultation</span>
                  <span className="text-sm text-muted-foreground">Get personalized advice</span>
                </Button>
                
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                  <Icons.shoppingCart className="h-6 w-6" />
                  <span className="font-medium">Size Exchange</span>
                  <span className="text-sm text-muted-foreground">Free within 14 days</span>
                </Button>
                
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                  <Icons.user className="h-6 w-6" />
                  <span className="font-medium">Live Chat</span>
                  <span className="text-sm text-muted-foreground">Instant sizing help</span>
                </Button>
              </div>
              
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <div className="text-sm text-center">
                  <strong>Remember:</strong> THE BLACKEGE offers free size exchanges within 14 days. 
                  When in doubt, order your preferred size and we'll help you get the perfect fit!
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
