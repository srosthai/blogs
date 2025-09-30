"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Sparkles, Layers, ArrowRight, Calendar, FileText } from "lucide-react"

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
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
      <div className="relative h-48 w-full">
        <Skeleton className="h-full w-full" />
      </div>
      <CardHeader className="space-y-2">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </CardHeader>
      <CardFooter className="pt-0">
        <div className="flex items-center justify-between w-full">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-24" />
        </div>
      </CardFooter>
    </Card>
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container mx-auto px-4 py-12">
          <div className="space-y-12">
            {/* Header skeleton */}
            <div className="text-center space-y-4">
              <Skeleton className="h-12 w-80 mx-auto" />
              <Skeleton className="h-6 w-96 mx-auto" />
            </div>

            {/* Categories grid skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {Array.from({ length: 8 }).map((_, i) => (
                <CategoryCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

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
                  {postCategories.length} Categories
                </span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <span className="text-muted-foreground font-medium">
                  {postCategories.reduce((acc, cat) => acc + (cat._count?.posts || 0), 0)} Total Posts
                </span>
              </div>
            </div>
          </div>

          {/* Categories Grid */}
          <div className="max-w-7xl mx-auto">
            {postCategories.length === 0 ? (
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {postCategories.map((category) => (
                  <Link 
                    key={category.id} 
                    href={`/category/${category.id}`}
                    className="group"
                  >
                    <Card className="h-full overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border-muted/50 bg-card/50 backdrop-blur">
                      {/* Category Image */}
                      <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-transparent">
                        {category.image ? (
                          <Image
                            src={category.image}
                            alt={category.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <div className="relative">
                              <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full"></div>
                              <Layers className="h-16 w-16 text-primary/60 relative" />
                            </div>
                          </div>
                        )}
                        {/* Overlay gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-60"></div>
                      </div>

                      <CardHeader className="space-y-2">
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors line-clamp-1">
                            {category.name}
                          </CardTitle>
                          <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                        </div>
                        <CardDescription className="line-clamp-2 text-sm">
                          {category.description || "Explore articles in this category"}
                        </CardDescription>
                      </CardHeader>

                      <CardFooter className="pt-0 pb-4">
                        <div className="flex items-center justify-between w-full">
                          <Badge variant="secondary" className="font-medium">
                            <FileText className="h-3 w-3 mr-1" />
                            {category._count?.posts || 0} Posts
                          </Badge>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(category.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              year: 'numeric'
                            })}
                          </div>
                        </div>
                      </CardFooter>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Bottom CTA Section */}
          {postCategories.length > 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                Can't find what you're looking for?
              </p>
              <Link href="/search">
                <Badge 
                  variant="outline" 
                  className="px-6 py-2 text-sm hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
                >
                  Search All Posts →
                </Badge>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}