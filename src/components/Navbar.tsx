"use client"

import Link from "next/link"
import { useSession, signIn, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FloatingDock } from "@/components/ui/floating-dock"
import { NavbarSearch } from "@/components/NavbarSearch"
import { BookOpen, Home, Tags, User, LogOut, Search, Sparkles } from "lucide-react"
import {
  IconHome,
  IconTags,
  IconSearch,
  IconUser,
  IconLogout,
  IconBook2
} from "@tabler/icons-react"
import { useRouter } from "next/navigation"
import { usePathname } from "next/navigation"

export function Navbar() {
  const { data: session } = useSession()
  const router = useRouter()
  const pathname = usePathname()

  const handleSignOut = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      await signOut({ redirect: false })
      router.push('/')
    } catch (error) {
      console.error('Sign out error:', error)
      await signOut({ redirect: false })
      router.push('/')
    }
  }


  // Define dock items
  const dockItems = [
    {
      title: "Home",
      icon: <IconHome className="h-full w-full text-neutral-300" />,
      href: "/",
    },
    {
      title: "Tags",
      icon: <IconTags className="h-full w-full text-neutral-300" />,
      href: "/tags",
    },
    {
      title: "Blog",
      icon: <IconBook2 className="h-full w-full text-neutral-300" />,
      href: "/",
    },
  ]

  // Add admin items if session exists
  const adminItems = session ? [
    {
      title: "Admin",
      icon: <IconUser className="h-full w-full text-neutral-300" />,
      href: "/admin",
    },
    {
      title: "Sign Out",
      icon: <IconLogout className="h-full w-full text-neutral-300" />,
      href: "#",
      onClick: handleSignOut,
    },
  ] : []

  const allItems = [...dockItems, ...adminItems]

  return (
    <div className="relative">
      {/* Top Header with Logo and Search */}
      <div className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur-xl border-b border-border/40">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link
              href="/"
              className="group flex items-center space-x-3 hover:scale-105 transition-all duration-200"
            >
              <div className="relative">
                <BookOpen className="h-8 w-8 text-primary group-hover:text-primary/80 transition-colors" />
                <Sparkles className="h-3 w-3 text-primary/60 absolute -top-1 -right-1 animate-pulse" />
              </div>
              <span className="hidden sm:block text-xl font-bold bg-gradient-to-r from-primary via-primary/90 to-primary/70 bg-clip-text text-transparent">
                My Blog
              </span>
            </Link>

            {/* Search - Desktop */}
            <div className="hidden md:block flex-1 max-w-md mx-6">
              <NavbarSearch />
            </div>

            {/* User Badge */}
            {session && (
              <Badge variant="secondary" className="hidden md:flex items-center space-x-2">
                <User className="h-3 w-3" />
                <span>{session.user?.name}</span>
              </Badge>
            )}
          </div>

          {/* Mobile Search */}
          <div className="md:hidden mt-3 pt-3 border-t border-border/40">
            <NavbarSearch />
          </div>
        </div>
      </div>

      {/* Floating Dock */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
        <FloatingDock
          items={allItems}
          desktopClassName="bg-background/90 backdrop-blur-xl border border-border/40 shadow-2xl shadow-black/40"
          mobileClassName="bg-background/90 backdrop-blur-xl border border-border/40 shadow-2xl shadow-black/40"
        />
      </div>
    </div>
  )
}