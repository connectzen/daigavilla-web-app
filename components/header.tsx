"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import Link from "next/link"
import { db } from "@/lib/firebase"
import { doc, getDoc } from "firebase/firestore/lite"

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [companyName, setCompanyName] = useState<string>("DAIGAVILLA Ltd")
  const [logoUrl, setLogoUrl] = useState<string | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Load site settings (logo and company name)
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const siteDoc = await getDoc(doc(db, "settings", "site"))
        if (siteDoc.exists()) {
          const data: any = siteDoc.data()
          if (data.companyName) setCompanyName(data.companyName)
          if (data.logoUrl) setLogoUrl(data.logoUrl)
        }
      } catch (_) {
        // ignore
      }
    }
    loadSettings()
  }, [])

  const navItems = [
    { name: "Home", href: "#home" },
    { name: "About Us", href: "#about" },
    { name: "Our Services", href: "#services" },
    { name: "Our Projects", href: "#projects" },
    { name: "Our Team", href: "#team" },
    { name: "Contact Us", href: "#contact" },
    { name: "Dashboard", href: "/login" },
  ]

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/95 backdrop-blur-md shadow-md" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="#home" className="flex items-center gap-3 group">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={companyName}
                className="w-10 h-10 rounded-lg object-contain bg-white p-1 transition-transform group-hover:scale-110"
              />
            ) : (
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center transition-transform group-hover:scale-110">
                <span className="text-white font-bold text-xl">D</span>
              </div>
            )}
            <span className={`font-bold text-xl transition-colors ${isScrolled ? "text-foreground" : "text-white"}`}>
              {companyName}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isScrolled ? "text-foreground" : "text-white"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className={isScrolled ? "text-foreground" : "text-white"} />
            ) : (
              <Menu className={isScrolled ? "text-foreground" : "text-white"} />
            )}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <nav className="lg:hidden py-4 border-t animate-in slide-in-from-top bg-white/95 backdrop-blur-md rounded-b-lg shadow-lg">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block py-3 px-4 text-sm font-medium text-foreground hover:text-primary hover:bg-primary/5 transition-colors rounded-md mx-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  )
}
