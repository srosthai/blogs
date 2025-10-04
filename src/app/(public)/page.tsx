"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Sparkles, Layers, ArrowRight, Calendar, FileText, Heart, Star } from "lucide-react"

interface PostCategory {
  id: string
  name: string
  description: string
  image?: string | null
  status: boolean
  createdAt: string
  updatedAt: string
  _count?: {
    posts: number
  }
}

export default function Home() {
  const [postCategories, setPostCategories] = useState<PostCategory[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch post categories on component mount
  useEffect(() => {
    async function fetchPostCategories() {
      try {
        const response = await fetch('/api/post-categories')
        if (response.ok) {
          const data = await response.json()
          // Only show active categories
          const activeCategories = data.filter((cat: PostCategory) => cat.status)
          setPostCategories(activeCategories)
        }
      } catch (error) {
        console.error('Error fetching post categories:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPostCategories()
  }, [])

  // Component for category card skeleton
  const CategoryCardSkeleton = () => (
    <Card className="h-full overflow-hidden bg-card border border-border/30 rounded-2xl flex flex-col">
      <div className="relative p-3">
        <Skeleton className="h-32 sm:h-36 md:h-40 lg:h-44 w-full rounded-xl" />
        {/* Heart icon skeleton */}
        <div className="absolute top-5 right-5">
          <Skeleton className="w-7 h-7 rounded-full" />
        </div>
      </div>
      <div className="px-4 pb-4 pt-1 space-y-3 flex-1 flex flex-col">
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-3/4" />
        </div>
        <Skeleton className="h-8 w-full flex-1" />
        <div className="flex items-center justify-between pt-1 mt-auto">
          <div className="space-y-0.5">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="h-7 w-20 rounded-xl" />
        </div>
      </div>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-12">
        <div className="space-y-12">
          {/* Hero Section */}
          <div className="text-center space-y-6 py-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Sparkles className="h-8 w-8 text-primary animate-pulse" />
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                Explore Topics
              </h1>
              <Sparkles className="h-8 w-8 text-primary animate-pulse" />
            </div>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              Browse through our curated categories and discover articles that interest you
            </p>

            <div className="flex items-center justify-center gap-8 pt-4">
              <div className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-muted-foreground" />
                <span className="text-muted-foreground font-medium">
                  {loading ? '...' : postCategories.length} Categories
                </span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <span className="text-muted-foreground font-medium">
                  {loading ? '...' : postCategories.reduce((acc, cat) => acc + (cat._count?.posts || 0), 0)} Total Posts
                </span>
              </div>
            </div>
          </div>

          {/* Categories Grid */}
          <div className="max-w-7xl mx-auto">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <CategoryCardSkeleton key={i} />
                ))}
              </div>
            ) : postCategories.length === 0 ? (
              <Card className="max-w-md mx-auto">
                <CardContent className="text-center py-16">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
                    <Layers className="h-10 w-10 text-primary" />
                  </div>
                  <h2 className="text-2xl font-semibold mb-4">No Categories Yet</h2>
                  <p className="text-muted-foreground">
                    Check back later for new content categories!
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {postCategories.map((category) => (
                  <Link 
                    key={category.id} 
                    href={`/category/${category.id}`}
                    className="group block h-full"
                  >
                    <Card className="h-full overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer bg-card border border-border/30 rounded-2xl hover:-translate-y-1 flex flex-col">
                      {/* Category Image with Heart Icon */}
                      <div className="relative p-3">
                        <div className="relative h-32 sm:h-36 md:h-40 lg:h-44 w-full overflow-hidden rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent shadow-sm">
                          {category.image ? (
                            <Image
                              src={category.image}
                              alt={category.name}
                              fill
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                              className="object-cover group-hover:scale-110 transition-transform duration-500 rounded-xl"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full rounded-xl">
                              <div className="relative">
                                <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full"></div>
                                <Layers className="h-10 w-10 text-primary/60 relative" />
                              </div>
                            </div>
                          )}
                          {/* Subtle overlay for better contrast */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-black/5 rounded-xl"></div>
                        </div>
                      </div>

                      {/* Card Content */}
                      <div className="px-4 pb-4 pt-1 space-y-3 flex-1 flex flex-col">
                        {/* Title and Rating */}
                        <div className="space-y-1.5">
                          <h3 className="font-semibold text-base line-clamp-1 group-hover:text-primary transition-colors leading-tight">
                            {category.name}
                          </h3>
                        </div>

                        {/* Description */}
                        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed flex-1">
                          {category.description || "Explore articles and insights in this category"}
                        </p>

                        {/* Bottom Section */}
                        <div className="flex items-center justify-between pt-1 mt-auto">
                          <div className="space-y-0.5">
                            <div className="text-xs text-muted-foreground font-medium tracking-wide">ARTICLES FROM</div>
                            <div className="font-semibold text-sm">
                              <span className="text-primary">{category._count?.posts || 0}</span> <span className="text-muted-foreground">- Free</span>
                            </div>
                          </div>
                          <div className="bg-primary/10 hover:bg-primary hover:text-primary-foreground text-primary px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer hover:shadow-sm">
                            View Details
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}