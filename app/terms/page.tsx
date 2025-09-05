'use client';

import React from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons';
import Link from 'next/link';

const sections = [
  {
    id: 'acceptance',
    title: '1. Acceptance of Terms',
    content: `
By accessing and using THE BLACKEGE website and services, you accept and agree to be bound by the terms and provision of this agreement.

**Agreement to Terms:**
• These terms constitute a legally binding agreement between you and THE BLACKEGE
• By using our website, you acknowledge that you have read, understood, and agree to these terms
• If you do not agree to these terms, you must not use our website or services
• Your continued use of our services constitutes ongoing acceptance of these terms

**Capacity to Enter Agreement:**
• You must be at least 18 years old to make purchases
• If you are under 18, you must have parental or guardian consent
• You must have the legal capacity to enter into binding contracts
• You represent that all information provided is accurate and truthful

**Updates to Terms:**
We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting on our website. Your continued use after changes constitutes acceptance of the modified terms.
    `
  },
  {
    id: 'use-of-website',
    title: '2. Use of Website',
    content: `
Your use of THE BLACKEGE website is subject to the following terms and restrictions:

**Permitted Use:**
• Browse and purchase products for personal use
• Create an account and manage your profile
• Access customer service and support
• Participate in promotions and contests (subject to additional terms)
• Share content through social media integration features

**Prohibited Use:**
• Use the website for any unlawful purpose or activity
• Attempt to gain unauthorized access to our systems
• Interfere with or disrupt our website or services
• Use automated systems (bots, scrapers) without permission
• Copy, reproduce, or distribute our content without authorization
• Impersonate others or provide false information
• Upload malicious code, viruses, or harmful content

**Account Responsibilities:**
• Maintain the confidentiality of your account credentials
• Notify us immediately of any unauthorized use
• Ensure all account information is accurate and up-to-date
• Comply with all applicable laws and regulations
    `
  },
  {
    id: 'products-services',
    title: '3. Products and Services',
    content: `
THE BLACKEGE provides streetwear clothing and accessories through our e-commerce platform:

**Product Information:**
• We strive to provide accurate product descriptions, images, and pricing
• Colors may vary due to monitor settings and photography
• Product availability is subject to change without notice
• We reserve the right to discontinue products at any time
• All measurements and sizing information are approximate

**Pricing and Payment:**
• All prices are in USD unless otherwise specified
• Prices are subject to change without notice
• We reserve the right to correct pricing errors
• Payment is due at the time of order placement
• We accept major credit cards, PayPal, and other approved payment methods

**Order Processing:**
• Orders are subject to acceptance and availability
• We reserve the right to refuse or cancel orders
• Order confirmation does not guarantee product availability
• Processing times may vary based on product availability and demand

**Shipping and Delivery:**
• Shipping times are estimates and not guarantees
• Risk of loss transfers to you upon delivery
• We are not responsible for delays caused by shipping carriers
• Additional customs duties may apply to international orders
    `
  },
  {
    id: 'intellectual-property',
    title: '4. Intellectual Property Rights',
    content: `
THE BLACKEGE and its content are protected by intellectual property laws:

**Our Intellectual Property:**
• THE BLACKEGE name, logo, and trademarks are our exclusive property
• All website content, including text, images, graphics, and designs
• Product designs, patterns, and creative elements
• Software, code, and technical implementations
• Marketing materials and promotional content

**Your Rights:**
• Limited license to use our website for personal, non-commercial purposes
• Right to view and download content for personal use only
• Permission to share specific content through provided social media features
• No right to modify, reproduce, or create derivative works

**User-Generated Content:**
• You retain ownership of content you submit (reviews, comments, photos)
• You grant us a license to use your content for promotional purposes
• You represent that you have the right to share submitted content
• We may remove user content at our discretion

**Copyright Infringement:**
If you believe your intellectual property rights have been infringed, please contact us with:
• Description of the copyrighted work
• Location of the allegedly infringing material
• Your contact information and statement of good faith belief
    `
  },
  {
    id: 'privacy-data',
    title: '5. Privacy and Data Protection',
    content: `
Your privacy is important to us. Our data practices are governed by our Privacy Policy:

**Data Collection:**
• We collect information necessary to provide our services
• Personal information is collected with your consent
• We use cookies and tracking technologies as described in our Cookie Policy
• Third-party integrations may collect additional data

**Data Use:**
• Your information is used to process orders and provide customer service
• We may use data for marketing purposes with your consent
• Analytics data helps us improve our website and services
• We do not sell your personal information to third parties

**Data Protection:**
• We implement security measures to protect your information
• Access to personal data is limited to authorized personnel
• We comply with applicable data protection laws
• You have rights regarding your personal information

**Your Rights:**
• Access, correct, or delete your personal information
• Opt out of marketing communications
• Request data portability or restrict processing
• Lodge complaints with data protection authorities

For complete details, please review our Privacy Policy and Cookie Policy.
    `
  },
  {
    id: 'returns-refunds',
    title: '6. Returns and Refunds',
    content: `
Our return and refund policy is designed to ensure customer satisfaction:

**Return Policy:**
• 30-day return window for most items
• Items must be in original condition with tags attached
• Sale items have a 14-day return window
• Final sale items cannot be returned
• Return shipping costs apply unless item is defective

**Refund Process:**
• Refunds are processed within 5-7 business days of receiving returned items
• Refunds are issued to the original payment method
• Shipping costs are non-refundable unless we made an error
• Processing fees may apply for certain payment methods

**Exchanges:**
• Free size exchanges within 14 days
• Color or style exchanges require return and new order
• Exchange processing time is 5-10 business days
• Subject to product availability

**Defective Items:**
• Full refund plus free return shipping for defective items
• Contact customer service within 7 days of delivery
• Provide photos of defective items when requested
• We may request return of defective items for quality control

For detailed return instructions, please visit our Returns page.
    `
  },
  {
    id: 'disclaimers',
    title: '7. Disclaimers and Limitations',
    content: `
THE BLACKEGE provides services "as is" with the following disclaimers:

**Service Availability:**
• We strive for 99.9% uptime but cannot guarantee uninterrupted service
• Scheduled maintenance may cause temporary service interruptions
• We are not liable for losses due to service unavailability
• Third-party service disruptions may affect our services

**Product Disclaimers:**
• Product colors may vary from images due to monitor settings
• Sizing may vary between different product lines and manufacturers
• We make no warranties regarding product performance or durability
• Individual results and satisfaction may vary

**Limitation of Liability:**
• Our liability is limited to the purchase price of products
• We are not liable for indirect, incidental, or consequential damages
• This includes loss of profits, data, or business interruption
• Some jurisdictions may not allow these limitations

**Third-Party Services:**
• We use third-party services for payment processing, shipping, and analytics
• We are not responsible for third-party service failures or data breaches
• Third-party terms and privacy policies apply to their services
• We make no warranties regarding third-party services

**Force Majeure:**
We are not liable for delays or failures due to circumstances beyond our control, including natural disasters, government actions, labor disputes, or technical failures.
    `
  },
  {
    id: 'user-conduct',
    title: '8. User Conduct and Responsibilities',
    content: `
Users of THE BLACKEGE website must comply with the following conduct standards:

**Acceptable Use:**
• Use the website only for lawful purposes
• Provide accurate and truthful information
• Respect the rights and privacy of others
• Comply with all applicable laws and regulations
• Report security vulnerabilities or abuse to us

**Prohibited Activities:**
• Harassment, threats, or abusive behavior toward others
• Posting or sharing illegal, offensive, or inappropriate content
• Attempting to hack, breach, or circumvent security measures
• Using automated tools to access or scrape our website
• Creating multiple accounts to circumvent restrictions
• Engaging in fraudulent or deceptive practices

**Content Standards:**
• User-generated content must be appropriate and lawful
• No spam, promotional content, or commercial solicitations
• Respect intellectual property rights of others
• No false or misleading information
• Content must not violate privacy rights

**Consequences of Violations:**
• Warning or temporary suspension of account privileges
• Permanent account termination for serious violations
• Legal action for illegal activities or significant harm
• Cooperation with law enforcement when appropriate

**Reporting Violations:**
If you encounter inappropriate behavior or content, please report it to our customer service team immediately.
    `
  },
  {
    id: 'termination',
    title: '9. Termination',
    content: `
Either party may terminate this agreement under certain circumstances:

**Termination by You:**
• You may stop using our services at any time
• You may request account deletion (subject to legal retention requirements)
• Outstanding orders and obligations remain in effect
• Some provisions survive termination (payment obligations, intellectual property)

**Termination by Us:**
• We may terminate accounts for violations of these terms
• We may discontinue services with reasonable notice
• We reserve the right to refuse service to anyone
• Termination may be immediate for serious violations

**Effect of Termination:**
• Your right to use our services ends immediately
• We may delete your account and associated data
• Outstanding payment obligations remain in effect
• Certain provisions survive termination (disclaimers, limitations, intellectual property)

**Data After Termination:**
• We may retain data as required by law or for legitimate business purposes
• You may request data deletion subject to legal requirements
• Some data may be retained in backup systems for technical reasons
• Personal data handling follows our Privacy Policy

**Survival:**
Provisions regarding intellectual property, disclaimers, limitations of liability, and dispute resolution survive termination of this agreement.
    `
  },
  {
    id: 'dispute-resolution',
    title: '10. Dispute Resolution',
    content: `
We prefer to resolve disputes amicably, but formal procedures are available:

**Informal Resolution:**
• Contact our customer service team first to resolve issues
• We will work in good faith to address your concerns
• Most issues can be resolved through direct communication
• Document your attempts at informal resolution

**Formal Dispute Process:**
• If informal resolution fails, you may pursue formal dispute resolution
• Disputes must be filed within one year of the incident
• You must provide detailed information about the dispute
• We will respond within 30 days of receiving a formal dispute

**Arbitration:**
• Disputes may be subject to binding arbitration
• Arbitration will be conducted under established rules
• Arbitration location will be mutually agreed upon or determined by rules
• Arbitration decisions are final and binding

**Class Action Waiver:**
• You agree to resolve disputes individually, not as part of a class action
• This waiver applies to all claims and disputes
• Some jurisdictions may not enforce class action waivers
• If the waiver is unenforceable, the dispute may proceed in court

**Governing Law:**
These terms are governed by the laws of [Jurisdiction], without regard to conflict of law principles.
    `
  },
  {
    id: 'miscellaneous',
    title: '11. Miscellaneous Provisions',
    content: `
Additional terms and provisions that govern our relationship:

**Entire Agreement:**
• These terms, along with our Privacy Policy and other referenced policies, constitute the entire agreement
• These terms supersede all previous agreements and understandings
• Any modifications must be in writing and agreed to by both parties
• No oral modifications or waivers are valid

**Severability:**
• If any provision is found invalid or unenforceable, the remainder remains in effect
• Invalid provisions will be modified to be enforceable while preserving intent
• The agreement continues in full force despite invalid provisions

**Assignment:**
• We may assign our rights and obligations under this agreement
• You may not assign your rights without our written consent
• Assignment includes mergers, acquisitions, and business transfers
• Your obligations remain binding on successors and assigns

**Waiver:**
• Our failure to enforce any provision does not waive our right to enforce it later
• Waivers must be in writing to be effective
• Waiver of one breach does not waive future breaches
• All rights and remedies are cumulative

**Notices:**
• Legal notices will be sent to your registered email address
• You must keep your contact information current
• Notices are effective when sent, regardless of actual receipt
• You may send notices to our legal department at the address below

**Contact Information:**
THE BLACKEGE Legal Department
[Address]
[City, State ZIP]
Email: legal@theblackege.com
    `
  }
];

export default function TermsOfServicePage() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in-up">
            <h1 className="font-heading font-bold text-4xl sm:text-5xl lg:text-6xl mb-6">
              Terms of Service
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              These terms govern your use of THE BLACKEGE website and services. 
              Please read them carefully before making a purchase or using our services.
            </p>
            <div className="flex items-center justify-center gap-4 mt-6 text-sm text-muted-foreground">
              <div>Last Updated: December 2024</div>
              <div>•</div>
              <div>Effective Date: December 2024</div>
            </div>
          </div>

          {/* Quick Navigation */}
          <Card className="mb-12 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icons.shoppingCart className="h-5 w-5" />
                Quick Navigation
              </CardTitle>
              <CardDescription>
                Jump to any section of our terms of service
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {sections.map((section) => (
                  <Button
                    key={section.id}
                    variant="ghost"
                    className="justify-start text-left h-auto p-2"
                    onClick={() => scrollToSection(section.id)}
                  >
                    <Icons.shoppingCart className="h-3 w-3 mr-2 shrink-0" />
                    <span className="text-sm">{section.title}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Terms Sections */}
          <div className="space-y-8">
            {sections.map((section, index) => (
              <Card 
                key={section.id} 
                id={section.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${0.2 + index * 0.05}s` }}
              >
                <CardHeader>
                  <CardTitle className="text-xl">{section.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none text-muted-foreground">
                    <div className="whitespace-pre-line leading-relaxed">
                      {section.content}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Summary Card */}
          <Card className="mt-12 animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icons.shoppingCart className="h-5 w-5" />
                Terms Summary
              </CardTitle>
              <CardDescription>
                Key points about your rights and responsibilities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-green-600">✓ Your Rights</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <Icons.shoppingCart className="h-3 w-3 text-green-600" />
                      Browse and purchase products for personal use
                    </li>
                    <li className="flex items-center gap-2">
                      <Icons.shoppingCart className="h-3 w-3 text-green-600" />
                      Return items within 30 days (conditions apply)
                    </li>
                    <li className="flex items-center gap-2">
                      <Icons.shoppingCart className="h-3 w-3 text-green-600" />
                      Access customer service and support
                    </li>
                    <li className="flex items-center gap-2">
                      <Icons.shoppingCart className="h-3 w-3 text-green-600" />
                      Privacy protection under our Privacy Policy
                    </li>
                    <li className="flex items-center gap-2">
                      <Icons.shoppingCart className="h-3 w-3 text-green-600" />
                      Terminate your account at any time
                    </li>
                  </ul>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium text-red-600">✗ Your Responsibilities</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <Icons.x className="h-3 w-3 text-red-600" />
                      Use the website only for lawful purposes
                    </li>
                    <li className="flex items-center gap-2">
                      <Icons.x className="h-3 w-3 text-red-600" />
                      Provide accurate information when ordering
                    </li>
                    <li className="flex items-center gap-2">
                      <Icons.x className="h-3 w-3 text-red-600" />
                      Respect intellectual property rights
                    </li>
                    <li className="flex items-center gap-2">
                      <Icons.x className="h-3 w-3 text-red-600" />
                      Maintain account security and confidentiality
                    </li>
                    <li className="flex items-center gap-2">
                      <Icons.x className="h-3 w-3 text-red-600" />
                      Comply with all applicable laws and regulations
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Agreement Confirmation */}
          <Card className="mt-8 animate-fade-in-up" style={{ animationDelay: '0.9s' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icons.shoppingCart className="h-5 w-5" />
                Agreement Confirmation
              </CardTitle>
              <CardDescription>
                By using THE BLACKEGE website and services, you agree to these terms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-muted rounded-lg">
                <div className="text-sm leading-relaxed">
                  <strong>Important:</strong> By continuing to use our website, creating an account, 
                  or making a purchase, you acknowledge that you have read, understood, and agree 
                  to be bound by these Terms of Service and our Privacy Policy. If you do not agree 
                  to these terms, please discontinue use of our website immediately.
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Section */}
          <Card className="mt-8 animate-fade-in-up" style={{ animationDelay: '1.0s' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icons.user className="h-5 w-5" />
                Questions About These Terms?
              </CardTitle>
              <CardDescription>
                Contact our legal team if you have questions about these terms of service.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2" asChild>
                  <a href="mailto:legal@theblackege.com">
                    <Icons.user className="h-6 w-6" />
                    <span className="font-medium">Legal Department</span>
                    <span className="text-sm text-muted-foreground">legal@theblackege.com</span>
                  </a>
                </Button>
                
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2" asChild>
                  <Link href="/contact">
                    <Icons.user className="h-6 w-6" />
                    <span className="font-medium">Customer Service</span>
                    <span className="text-sm text-muted-foreground">General inquiries</span>
                  </Link>
                </Button>
                
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2" asChild>
                  <Link href="/faq">
                    <Icons.shoppingCart className="h-6 w-6" />
                    <span className="font-medium">FAQ</span>
                    <span className="text-sm text-muted-foreground">Common questions</span>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Related Links */}
          <div className="mt-8 text-center animate-fade-in-up" style={{ animationDelay: '1.1s' }}>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Button variant="outline" size="sm" asChild>
                <Link href="/privacy">Privacy Policy</Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="/cookies">Cookie Policy</Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="/returns">Return Policy</Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="/shipping">Shipping Information</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
