"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, Home, ImageIcon, Video, Users, Settings, LayoutDashboard, LogOut } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useEffect } from "react"
import { db } from "@/lib/firebase"
import { doc, getDoc } from "firebase/firestore/lite"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { logout, user } = useAuth()
  const [companyName, setCompanyName] = useState<string>("DAIGAVILLA")
  const [logoUrl, setLogoUrl] = useState<string | null>(null)

  const handleLogout = async () => {
    try {
      await logout()
      router.push('/login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

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
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Images", href: "/dashboard/images", icon: ImageIcon },
    { name: "Videos", href: "/dashboard/videos", icon: Video },
    { name: "Team Members", href: "/dashboard/team", icon: Users },
    { name: "Site Settings", href: "/dashboard/settings", icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b">
        <div className="flex items-center justify-between p-4">
          <Link href="/" className="flex items-center gap-2">
            {logoUrl ? (
              <img src={logoUrl} alt={companyName} className="w-8 h-8 rounded-lg object-contain bg-white p-0.5" />
            ) : (
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">D</span>
              </div>
            )}
            <span className="font-bold">{companyName}</span>
          </Link>
          <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            {isSidebarOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </header>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen w-64 bg-white border-r transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b hidden lg:block">
            <Link href="/" className="flex items-center gap-2">
              {logoUrl ? (
                <img src={logoUrl} alt={companyName} className="w-10 h-10 rounded-lg object-contain bg-white p-1" />
              ) : (
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">D</span>
                </div>
              )}
              <div>
                <span className="font-bold text-lg block">{companyName}</span>
                <span className="text-xs text-muted-foreground">Admin Panel</span>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 mt-16 lg:mt-0">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(item.href + "/")
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive ? "bg-primary text-white" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* User Info & Actions */}
          <div className="p-4 border-t space-y-2">
            {user && (
              <div className="px-4 py-2 bg-muted rounded-lg mb-2">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-xs text-muted-foreground">Logged in as</p>
                  <span className="px-2 py-0.5 bg-primary text-primary-foreground text-xs rounded-full font-medium">
                    Admin
                  </span>
                </div>
                <p className="text-sm font-medium truncate">{user.email}</p>
              </div>
            )}
            <Link href="/">
              <Button variant="outline" className="w-full bg-transparent">
                <Home className="w-4 h-4 mr-2" />
                Back to Website
              </Button>
            </Link>
            <Button variant="outline" className="w-full bg-transparent text-destructive hover:text-destructive" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Main Content */}
      <main className="lg:ml-64 pt-20 lg:pt-0 min-h-screen">
        <div className="p-4 lg:p-8">{children}</div>
      </main>
    </div>
  )
}
