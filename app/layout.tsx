import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Montserrat, Inter } from "next/font/google"
import { Suspense } from "react"
import { AuthProvider } from "@/contexts/auth-context"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
  weight: ["400", "600", "700", "900"],
})

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: ["400", "500", "600"],
})

export const metadata: Metadata = {
  title: "THE BLACKEGE - Premium Streetwear",
  description:
    "Elevate Your Streetwear Game. Authenticity Meets Visionary Artistry. Premium streetwear clothing and accessories for the urban fashion enthusiast.",
  keywords: "streetwear, premium clothing, urban fashion, THE BLACKEGE, t-shirts, hoodies, accessories",
  icons: {
    icon: [
      { url: '/logo.png', sizes: '32x32', type: 'image/png' },
      { url: '/logo.png', sizes: '16x16', type: 'image/png' }
    ],
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
  openGraph: {
    title: "THE BLACKEGE - Premium Streetwear",
    description: "Elevate Your Streetwear Game. Authenticity Meets Visionary Artistry.",
    type: "website",
    locale: "en_IN",
    images: ['/logo.png'],
  },
  twitter: {
    card: "summary_large_image",
    title: "THE BLACKEGE - Premium Streetwear",
    description: "Elevate Your Streetwear Game. Authenticity Meets Visionary Artistry.",
    images: ['/logo.png'],
  },
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`font-sans ${GeistSans.variable} ${GeistMono.variable} ${montserrat.variable} ${inter.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <Suspense fallback={null}>
              {children}
            </Suspense>
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
