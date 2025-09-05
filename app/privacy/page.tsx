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
    id: 'information-collection',
    title: '1. Information We Collect',
    content: `
We collect information to provide better services to our customers. We collect information in the following ways:

**Information you give us directly:**
• Personal details when you create an account (name, email, phone number)
• Billing and shipping addresses for order processing
• Payment information (processed securely through our payment partners)
• Communication preferences and marketing opt-ins
• Reviews, comments, and feedback you provide
• Customer service communications

**Information we collect automatically:**
• Website usage data and analytics
• IP address and browser information
• Cookies and similar tracking technologies
• Device information and operating system
• Referral sources and site navigation patterns

**Information from third parties:**
• Social media information if you connect your accounts
• Payment processor information for transaction verification
• Shipping carrier information for delivery tracking
• Marketing platform data for campaign effectiveness
    `
  },
  {
    id: 'information-use',
    title: '2. How We Use Your Information',
    content: `
We use the information we collect for the following purposes:

**To provide our services:**
• Process and fulfill your orders
• Create and manage your account
• Provide customer support and respond to inquiries
• Send order confirmations and shipping updates
• Process returns and exchanges

**To improve our services:**
• Analyze website usage and customer behavior
• Personalize your shopping experience
• Develop new products and features
• Conduct market research and analytics
• Test and optimize our website performance

**To communicate with you:**
• Send promotional emails and newsletters (with your consent)
• Notify you about account activities and security updates
• Share information about new products and sales
• Conduct customer surveys and feedback requests

**For legal and security purposes:**
• Comply with legal obligations and regulations
• Prevent fraud and protect against security threats
• Enforce our terms of service and policies
• Resolve disputes and legal claims
    `
  },
  {
    id: 'information-sharing',
    title: '3. Information Sharing and Disclosure',
    content: `
We do not sell, trade, or rent your personal information to third parties. We may share your information in the following limited circumstances:

**Service Providers:**
• Payment processors for secure transaction handling
• Shipping companies for order delivery
• Email service providers for communications
• Analytics providers for website optimization
• Customer service platforms for support
• Marketing platforms for promotional campaigns

**Legal Requirements:**
• When required by law or legal process
• To protect our rights and property
• To prevent fraud or illegal activities
• In connection with legal proceedings
• To comply with regulatory requirements

**Business Transfers:**
• In the event of a merger, acquisition, or sale of assets
• During business restructuring or reorganization
• With proper notice and protection of your rights

**With Your Consent:**
• When you explicitly agree to share information
• For specific purposes you have authorized
• Through integrations you have enabled
    `
  },
  {
    id: 'data-security',
    title: '4. Data Security',
    content: `
We take the security of your personal information seriously and implement various measures to protect it:

**Technical Safeguards:**
• SSL encryption for all data transmission
• Secure servers with firewall protection
• Regular security audits and vulnerability assessments
• Access controls and authentication systems
• Data encryption at rest and in transit

**Administrative Safeguards:**
• Employee training on privacy and security practices
• Strict access controls based on job responsibilities
• Regular review and update of security policies
• Incident response procedures for security breaches
• Third-party security certifications and compliance

**Physical Safeguards:**
• Secure data centers with restricted access
• Environmental controls and monitoring systems
• Backup and disaster recovery procedures
• Secure disposal of physical media and documents

**Data Retention:**
We retain your personal information only as long as necessary for the purposes outlined in this policy or as required by law. We regularly review and delete outdated information.
    `
  },
  {
    id: 'cookies-tracking',
    title: '5. Cookies and Tracking Technologies',
    content: `
We use cookies and similar technologies to enhance your experience on our website:

**Essential Cookies:**
• Required for basic website functionality
• Shopping cart and checkout processes
• User authentication and security
• Cannot be disabled without affecting site functionality

**Analytics Cookies:**
• Google Analytics for website usage statistics
• Performance monitoring and optimization
• User behavior analysis and insights
• Help us improve our website and services

**Marketing Cookies:**
• Personalized advertising and promotions
• Social media integration and sharing
• Email marketing campaign tracking
• Retargeting and remarketing campaigns

**Cookie Management:**
You can control cookies through your browser settings. However, disabling certain cookies may limit your ability to use some features of our website. For more information, see our Cookie Policy.
    `
  },
  {
    id: 'your-rights',
    title: '6. Your Rights and Choices',
    content: `
You have various rights regarding your personal information:

**Access and Portability:**
• Request a copy of your personal information
• Download your data in a portable format
• Receive information about how we use your data
• Access your account information at any time

**Correction and Updates:**
• Correct inaccurate personal information
• Update your account details and preferences
• Modify your communication preferences
• Change your password and security settings

**Deletion and Restriction:**
• Request deletion of your personal information
• Restrict processing of your data
• Object to certain uses of your information
• Withdraw consent for marketing communications

**Marketing Communications:**
• Opt out of promotional emails at any time
• Unsubscribe from newsletters and marketing
• Manage your communication preferences
• Control personalized advertising

**Account Management:**
• Access and modify your account information
• View your order history and tracking
• Manage your wishlist and preferences
• Delete your account (subject to legal requirements)
    `
  },
  {
    id: 'international-transfers',
    title: '7. International Data Transfers',
    content: `
THE BLACKEGE operates globally, and your information may be transferred to and processed in countries other than your own:

**Data Transfer Safeguards:**
• We ensure adequate protection for international transfers
• Use of standard contractual clauses and adequacy decisions
• Regular assessment of data protection levels
• Compliance with applicable data protection laws

**Countries of Processing:**
• India (primary data processing)
• European Union (for EU customers)
• Other countries where our service providers operate
• Always with appropriate safeguards in place

**Your Rights:**
• Right to information about international transfers
• Right to object to transfers in certain circumstances
• Right to receive information about safeguards in place
    `
  },
  {
    id: 'children-privacy',
    title: '8. Children\'s Privacy',
    content: `
THE BLACKEGE is committed to protecting children's privacy:

**Age Restrictions:**
• Our services are not intended for children under 13
• We do not knowingly collect information from children under 13
• Parental consent required for users under 18
• Age verification processes for account creation

**If We Learn of Child Information:**
• We will delete the information promptly
• We will not use the information for any purpose
• We will not share the information with third parties
• Parents can contact us to request deletion

**Parental Rights:**
• Parents can review their child's information
• Parents can request deletion of their child's information
• Parents can refuse further collection of their child's information
    `
  },
  {
    id: 'changes-policy',
    title: '9. Changes to This Policy',
    content: `
We may update this Privacy Policy from time to time:

**Notification of Changes:**
• We will notify you of significant changes via email
• Updates will be posted on our website with effective date
• Continued use constitutes acceptance of changes
• Right to object to material changes

**Review and Updates:**
• Regular review of privacy practices and policies
• Updates to reflect changes in law or business practices
• Incorporation of new technologies and services
• Feedback and input from customers and stakeholders

**Effective Date:**
This Privacy Policy is effective as of [Current Date] and was last updated on [Last Updated Date].
    `
  },
  {
    id: 'contact-us',
    title: '10. Contact Information',
    content: `
If you have questions about this Privacy Policy or our privacy practices, please contact us:

**Privacy Officer:**
THE BLACKEGE Privacy Team
Email: privacy@theblackege.com
Phone: (555) 123-PRIV

**Mailing Address:**
THE BLACKEGE
Attn: Privacy Department
[Street Address]
[City, State, ZIP Code]

**Response Time:**
We will respond to your privacy inquiries within 30 days of receipt. For urgent matters, please call our customer service line.

**Data Protection Authority:**
If you are located in the EU, you have the right to lodge a complaint with your local data protection authority.
    `
  }
];

export default function PrivacyPolicyPage() {
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
              Privacy Policy
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Your privacy is important to us. This policy explains how THE BLACKEGE collects, 
              uses, and protects your personal information.
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
                Jump to any section of our privacy policy
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

          {/* Policy Sections */}
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
                Privacy Summary
              </CardTitle>
              <CardDescription>
                Key points about how we handle your information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-green-600">✓ What We Do</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <Icons.shoppingCart className="h-3 w-3 text-green-600" />
                      Protect your personal information with industry-standard security
                    </li>
                    <li className="flex items-center gap-2">
                      <Icons.shoppingCart className="h-3 w-3 text-green-600" />
                      Use your data only for providing and improving our services
                    </li>
                    <li className="flex items-center gap-2">
                      <Icons.shoppingCart className="h-3 w-3 text-green-600" />
                      Give you control over your personal information
                    </li>
                    <li className="flex items-center gap-2">
                      <Icons.shoppingCart className="h-3 w-3 text-green-600" />
                      Comply with all applicable privacy laws and regulations
                    </li>
                    <li className="flex items-center gap-2">
                      <Icons.shoppingCart className="h-3 w-3 text-green-600" />
                      Respond promptly to your privacy requests and concerns
                    </li>
                  </ul>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium text-red-600">✗ What We Don't Do</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <Icons.x className="h-3 w-3 text-red-600" />
                      Sell your personal information to third parties
                    </li>
                    <li className="flex items-center gap-2">
                      <Icons.x className="h-3 w-3 text-red-600" />
                      Share your data without your consent (except as legally required)
                    </li>
                    <li className="flex items-center gap-2">
                      <Icons.x className="h-3 w-3 text-red-600" />
                      Collect information from children under 13
                    </li>
                    <li className="flex items-center gap-2">
                      <Icons.x className="h-3 w-3 text-red-600" />
                      Use your data for purposes other than stated in this policy
                    </li>
                    <li className="flex items-center gap-2">
                      <Icons.x className="h-3 w-3 text-red-600" />
                      Keep your data longer than necessary
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Section */}
          <Card className="mt-8 animate-fade-in-up" style={{ animationDelay: '0.9s' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icons.user className="h-5 w-5" />
                Questions About Your Privacy?
              </CardTitle>
              <CardDescription>
                We're here to help you understand and exercise your privacy rights.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2" asChild>
                  <a href="mailto:privacy@theblackege.com">
                    <Icons.user className="h-6 w-6" />
                    <span className="font-medium">Email Privacy Team</span>
                    <span className="text-sm text-muted-foreground">privacy@theblackege.com</span>
                  </a>
                </Button>
                
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2" asChild>
                  <Link href="/contact">
                    <Icons.user className="h-6 w-6" />
                    <span className="font-medium">Contact Form</span>
                    <span className="text-sm text-muted-foreground">General inquiries</span>
                  </Link>
                </Button>
                
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2" asChild>
                  <Link href="/account">
                    <Icons.user className="h-6 w-6" />
                    <span className="font-medium">Manage Data</span>
                    <span className="text-sm text-muted-foreground">Account settings</span>
                  </Link>
                </Button>
              </div>
              
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <div className="text-sm text-center">
                  <strong>Need immediate help?</strong> For urgent privacy concerns or data breaches, 
                  contact our privacy team directly at privacy@theblackege.com or call (555) 123-PRIV.
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Related Links */}
          <div className="mt-8 text-center animate-fade-in-up" style={{ animationDelay: '1.0s' }}>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Button variant="outline" size="sm" asChild>
                <Link href="/terms">Terms of Service</Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="/cookies">Cookie Policy</Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="/security">Security Information</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
