"use client"

import Link from "next/link"
import { useSession, signIn, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/ThemeToggle"
import { BookOpen, Home, Tags, User, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"

export function Navbar() {
  const { data: session } = useSession()
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      // Call our custom logout API
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      // Also call NextAuth signOut to clear client-side session
      await signOut({ redirect: false })

      // Redirect to home page
      router.push('/')
    } catch (error) {
      console.error('Sign out error:', error)
      // Fallback to NextAuth signOut if API fails
      await signOut({ redirect: false })
      router.push('/')
    }
  }

  return (
    <nav className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center space-x-2 text-2xl font-bold hover:opacity-80 transition-opacity"
          >
            <BookOpen className="h-8 w-8 text-primary" />
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              My Blog
            </span>
          </Link>

          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/" className="flex items-center space-x-2">
                <Home className="h-4 w-4" />
                <span className="hidden sm:inline">Home</span>
              </Link>
            </Button>

            <Button variant="ghost" size="sm" asChild>
              <Link href="/tags" className="flex items-center space-x-2">
                <Tags className="h-4 w-4" />
                <span className="hidden sm:inline">Tags</span>
              </Link>
            </Button>

            <div className="mx-2">
              <ThemeToggle />
            </div>

            {/* {session ? (
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="hidden sm:flex items-center space-x-1">
                  <User className="h-3 w-3" />
                  <span>{session.user?.name}</span>
                </Badge>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/admin" className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline">Admin</span>
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSignOut}
                  className="flex items-center space-x-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Sign Out</span>
                </Button>
              </div>
            ) : (
              <Button size="sm" onClick={() => signIn()}>
                Sign In
              </Button>
            )} */}
          </div>
        </div>
      </div>
    </nav>
  )
}