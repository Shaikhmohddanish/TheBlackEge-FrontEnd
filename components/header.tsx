"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Icons } from "@/components/ui/icons"
import { useCart } from "@/hooks/use-cart"
import { useWishlist } from "@/hooks/use-wishlist"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { ProfessionalSearchBar } from "@/components/search/professional-search-bar"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  
  const { getTotalItems } = useCart()
  const { getTotalItems: getWishlistItems } = useWishlist()
  const { user, isAuthenticated, logout } = useAuth()
  const router = useRouter()
  const { toast, dismiss } = useToast()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`)
      setIsSearchOpen(false)
      setSearchQuery("")
    }
  }

  const handleLogout = async () => {
    try {
      console.log('Starting logout process...')
      await logout()
      console.log('Logout successful, showing toast and redirecting...')
      
      // Show success toast (it will auto-dismiss after 3 seconds due to TOAST_REMOVE_DELAY)
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      })
      
      // Use proper Next.js router for navigation with replace to prevent back navigation
      setTimeout(() => {
        router.replace('/login')
      }, 500) // Small delay to show toast briefly before redirect
      
    } catch (error) {
      console.error('Logout error:', error)
      toast({
        title: "Error", 
        description: "Failed to logout. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image src="/logo.png" alt="THE BLACKEGE" width={40} height={40} className="w-10 h-10" />
            <span className="font-heading font-bold text-xl tracking-tight">THE BLACKEGE</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-foreground hover:text-primary transition-colors">
              Home
            </Link>
            <Link href="/shop" className="text-foreground hover:text-primary transition-colors">
              Shop
            </Link>
            <Link href="/wishlist" className="text-foreground hover:text-primary transition-colors">
              Wishlist
            </Link>
            <Link href="/track" className="text-foreground hover:text-primary transition-colors">
              Track Order
            </Link>
            <Link href="/about" className="text-foreground hover:text-primary transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-foreground hover:text-primary transition-colors">
              Contact
            </Link>
          </nav>

          {/* Professional Search Bar */}
          <div className="hidden lg:flex items-center space-x-4">
            {isSearchOpen ? (
              <div className="flex items-center space-x-2">
                <ProfessionalSearchBar
                  variant="header"
                  placeholder="Search streetwear, brands, collections..."
                  className="w-80"
                  showTrending={true}
                />
                <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(false)}>
                  <Icons.x className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(true)} className="hover-glow">
                <Icons.search className="h-5 w-5" />
              </Button>
            )}
          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-4">
            {/* User Menu */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="hover-glow">
                    <Icons.user className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    Hello, {user?.firstName || user?.username}!
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push('/account')}>
                    <Icons.user className="mr-2 h-4 w-4" />
                    Account
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/account?tab=orders')}>
                    <Icons.shoppingCart className="mr-2 h-4 w-4" />
                    Orders
                  </DropdownMenuItem>
                  {user?.roles?.includes('ADMIN') && (
                    <DropdownMenuItem onClick={() => router.push('/admin')}>
                      <Icons.user className="mr-2 h-4 w-4" />
                      Admin Dashboard
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <Icons.x className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="ghost" size="icon" className="hover-glow" onClick={() => router.push('/login')}>
                <Icons.user className="h-5 w-5" />
              </Button>
            )}

            {/* Wishlist */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="hover-glow relative" 
              onClick={() => router.push('/wishlist')}
            >
              <Icons.heart className="h-5 w-5" />
              {getWishlistItems() > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs">
                  {getWishlistItems()}
                </Badge>
              )}
            </Button>

            {/* Cart */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="hover-glow relative" 
              onClick={() => router.push('/cart')}
            >
              <Icons.shoppingCart className="h-5 w-5" />
              {getTotalItems() > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs">
                  {getTotalItems()}
                </Badge>
              )}
            </Button>

            {/* Mobile Menu Button */}
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <Icons.x className="h-5 w-5" /> : <Icons.menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-in-up">
            <nav className="flex flex-col space-y-4">
              <Link href="/" className="text-foreground hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>
                Home
              </Link>
              <Link href="/shop" className="text-foreground hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>
                Shop
              </Link>
              <Link href="/wishlist" className="text-foreground hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>
                Wishlist
              </Link>
              <Link href="/track" className="text-foreground hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>
                Track Order
              </Link>
              <Link href="/about" className="text-foreground hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>
                About
              </Link>
              <Link href="/contact" className="text-foreground hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>
                Contact
              </Link>
              <div className="pt-4">
                <form onSubmit={handleSearch}>
                  <Input 
                    type="search" 
                    placeholder="Search products..." 
                    className="w-full bg-card border-border"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </form>
              </div>
              {!isAuthenticated && (
                <div className="pt-4 space-y-2">
                  <Button className="w-full" onClick={() => { router.push('/login'); setIsMenuOpen(false); }}>
                    Sign In
                  </Button>
                  <Button variant="outline" className="w-full" onClick={() => { router.push('/register'); setIsMenuOpen(false); }}>
                    Sign Up
                  </Button>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
