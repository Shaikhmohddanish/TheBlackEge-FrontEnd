'use client';

import React, { useState } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Icons } from '@/components/ui/icons';
import { useToast } from '@/hooks/use-toast';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      category: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: 'Message sent!',
        description: 'Thank you for reaching out. We\'ll get back to you within 24 hours.',
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        category: '',
        message: '',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: <Icons.user className="h-6 w-6" />,
      title: 'Customer Service',
      details: ['support@theblackege.com', 'Mon-Fri: 9AM-6PM EST'],
      description: 'General inquiries, order support, and customer care'
    },
    {
      icon: <Icons.shoppingCart className="h-6 w-6" />,
      title: 'Sales & Partnerships',
      details: ['sales@theblackege.com', 'Mon-Fri: 10AM-5PM EST'],
      description: 'Wholesale inquiries, collaborations, and business partnerships'
    },
    {
      icon: <Icons.heart className="h-6 w-6" />,
      title: 'Press & Media',
      details: ['press@theblackege.com', 'Response within 48 hours'],
      description: 'Media inquiries, press releases, and brand collaborations'
    },
  ];

  const faqs = [
    {
      question: 'How long does shipping take?',
      answer: 'Standard shipping takes 3-5 business days. Express shipping is available for 1-2 day delivery.'
    },
    {
      question: 'What is your return policy?',
      answer: 'We offer 30-day returns for unworn items in original condition with tags attached.'
    },
    {
      question: 'Do you ship internationally?',
      answer: 'Yes, we ship worldwide. International shipping times vary by location (5-14 business days).'
    },
    {
      question: 'How do I track my order?',
      answer: 'You\'ll receive a tracking number via email once your order ships. You can also track orders in your account.'
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="py-20 px-4 bg-gradient-to-br from-primary/10 to-secondary/10">
          <div className="container mx-auto max-w-4xl text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Get In Touch
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              We're here to help with questions, feedback, or just to connect with 
              fellow streetwear enthusiasts. Drop us a line!
            </p>
          </div>
        </section>

        {/* Contact Form & Info */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Send us a message</CardTitle>
                  <CardDescription>
                    Fill out the form below and we'll get back to you as soon as possible.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name *</Label>
                        <Input
                          id="name"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Your full name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select value={formData.category} onValueChange={handleSelectChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select inquiry type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General Inquiry</SelectItem>
                          <SelectItem value="order">Order Support</SelectItem>
                          <SelectItem value="returns">Returns & Exchanges</SelectItem>
                          <SelectItem value="wholesale">Wholesale</SelectItem>
                          <SelectItem value="press">Press & Media</SelectItem>
                          <SelectItem value="collaboration">Collaboration</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject *</Label>
                      <Input
                        id="subject"
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={handleInputChange}
                        placeholder="Brief description of your inquiry"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        name="message"
                        required
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Tell us more about your inquiry..."
                        className="min-h-[120px]"
                      />
                    </div>

                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
                  <div className="space-y-6">
                    {contactInfo.map((info, index) => (
                      <Card key={index}>
                        <CardContent className="p-6">
                          <div className="flex items-start space-x-4">
                            <div className="text-primary mt-1">
                              {info.icon}
                            </div>
                            <div className="flex-grow">
                              <h3 className="font-semibold mb-2">{info.title}</h3>
                              <div className="space-y-1 text-sm text-muted-foreground mb-2">
                                {info.details.map((detail, idx) => (
                                  <p key={idx}>{detail}</p>
                                ))}
                              </div>
                              <p className="text-sm">{info.description}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Social Media */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4">Follow Us</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Stay connected with THE BLACKEGE community
                    </p>
                    <div className="flex space-x-4">
                      <Button variant="outline" size="sm">
                        <Icons.user className="h-4 w-4 mr-2" />
                        Instagram
                      </Button>
                      <Button variant="outline" size="sm">
                        <Icons.user className="h-4 w-4 mr-2" />
                        Twitter
                      </Button>
                      <Button variant="outline" size="sm">
                        <Icons.user className="h-4 w-4 mr-2" />
                        TikTok
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 px-4 bg-muted/30">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-lg text-muted-foreground">
                Quick answers to common questions
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {faqs.map((faq, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-3">{faq.question}</h3>
                    <p className="text-sm text-muted-foreground">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-8">
              <p className="text-muted-foreground mb-4">
                Don't see your question answered?
              </p>
              <Button variant="outline">
                View Full FAQ
              </Button>
            </div>
          </div>
        </section>

        {/* Store Hours & Location */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Icons.user className="h-5 w-5 mr-2" />
                    Flagship Store
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="font-medium">THE BLACKEGE Store</p>
                    <p className="text-muted-foreground">
                      123 MG Road<br />
                      Bangalore, Karnataka 560001<br />
                      India
                    </p>
                  </div>
                  <div>
                    <p className="font-medium mb-2">Store Hours:</p>
                    <div className="text-sm space-y-1 text-muted-foreground">
                      <p>Monday - Friday: 11AM - 8PM</p>
                      <p>Saturday: 10AM - 9PM</p>
                      <p>Sunday: 12PM - 6PM</p>
                    </div>
                  </div>
                  <Button className="w-full">
                    Get Directions
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Icons.shoppingCart className="h-5 w-5 mr-2" />
                    Need Immediate Help?
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="font-medium">Live Chat Support</p>
                    <p className="text-muted-foreground">
                      Available Monday-Friday, 9AM-6PM EST
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">Phone Support</p>
                    <p className="text-muted-foreground">
                      +1 (555) 123-4567<br />
                      Monday-Friday, 9AM-6PM EST
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">Emergency Returns</p>
                    <p className="text-muted-foreground">
                      returns@theblackege.com<br />
                      24/7 automated processing
                    </p>
                  </div>
                  <Button className="w-full" variant="outline">
                    Start Live Chat
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
