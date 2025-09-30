"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { PostCard } from "@/components/PostCard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft, Calendar, FileText, Layers, BookOpen } from "lucide-react"

interface Post {
  id: string
  title: string
  content: string
  slug: string
  tags: string
  image?: string | null
  published: boolean
  createdAt: string
  author: {
    name: string | null
  }
}

interface PostCategory {
  id: string
  name: string
  description: string
  image?: string | null
  status: boolean
  createdAt: string
  posts: Post[]
}

export default function CategoryPage() {
  const params = useParams()
  const router = useRouter()
  const categoryId = params.id as string
  
  const [category, setCategory] = useState<PostCategory | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCategoryAndPosts() {
      try {
        const response = await fetch(`/api/post-categories/${categoryId}`)
        if (response.ok) {
          const data = await response.json()
          setCategory(data)
        } else if (response.status === 404) {
          setError('Category not found')
        } else {
          setError('Failed to load category')
        }
      } catch (error) {
        console.error('Error fetching category:', error)
        setError('An error occurred while loading the category')
      } finally {
        setLoading(false)
      }
    }

    if (categoryId) {
      fetchCategoryAndPosts()
    }
  }, [categoryId])

  // Component for post card skeleton
  const PostCardSkeleton = () => (
    <Card className="overflow-hidden">
      <Skeleton className="h-48 w-full" />
      <CardContent className="p-4">
        <div className="space-y-3">
          <Skeleton className="h-6 w-3/4" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-6 w-12 rounded-full" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
        </div>
      </CardContent>
    </Card>
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-8">
            {/* Header skeleton */}
            <div className="space-y-4">
              <Skeleton className="h-10 w-32" />
              <div className="relative h-64 w-full rounded-xl overflow-hidden">
                <Skeleton className="h-full w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-96" />
              </div>
            </div>

            {/* Posts grid skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <PostCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !category) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Link href="/">
              <Button variant="ghost" className="mb-6 gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Categories
              </Button>
            </Link>
            
            <Card>
              <CardContent className="text-center py-16">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-destructive/10 mb-6">
                  <Layers className="h-10 w-10 text-destructive" />
                </div>
                <h2 className="text-2xl font-semibold mb-4 text-destructive">
                  {error === 'Category not found' ? 'Category Not Found' : 'Error Loading Category'}
                </h2>
                <p className="text-muted-foreground mb-6">
                  {error === 'Category not found' 
                    ? 'The category you\'re looking for doesn\'t exist or may have been removed.'
                    : 'We encountered an error while loading this category. Please try again later.'
                  }
                </p>
                <Link href="/">
                  <Button>Browse All Categories</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  const publishedPosts = category.posts.filter(post => post.published)

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Back Button */}
          <Link href="/">
            <Button variant="ghost" className="gap-2 hover:gap-3 transition-all">
              <ArrowLeft className="h-4 w-4" />
              Back to Categories
            </Button>
          </Link>

          {/* Category Header */}
          <div className="relative">
            {/* Category Image */}
            <div className="relative h-64 w-full rounded-xl overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-transparent">
              {category.image ? (
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full"></div>
                    <Layers className="h-20 w-20 text-primary/60 relative" />
                  </div>
                </div>
              )}
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent"></div>
              
              {/* Category Info Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="space-y-3">
                  <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                    {category.name}
                  </h1>
                  {category.description && (
                    <p className="text-lg text-muted-foreground max-w-2xl">
                      {category.description}
                    </p>
                  )}
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground font-medium">
                        {publishedPosts.length} {publishedPosts.length === 1 ? 'Post' : 'Posts'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground font-medium">
                        Created {new Date(category.createdAt).toLocaleDateString('en-US', {
                          month: 'long',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Posts Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">
                {publishedPosts.length === 0 ? 'No Posts Yet' : 'Latest Posts'}
              </h2>
              {publishedPosts.length > 0 && (
                <Badge variant="outline" className="font-medium">
                  {publishedPosts.length} {publishedPosts.length === 1 ? 'Post' : 'Posts'}
                </Badge>
              )}
            </div>

            {publishedPosts.length === 0 ? (
              <Card className="max-w-2xl mx-auto border-dashed border-2">
                <CardContent className="text-center py-16">
                  <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-primary/10 to-primary/20 mb-6">
                    <div className="relative">
                      <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full"></div>
                      <BookOpen className="h-12 w-12 text-primary/70 relative" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-foreground">Coming Soon!</h3>
                  <p className="text-lg text-muted-foreground mb-2">
                    <span className="font-medium text-primary">{category.name}</span> is ready and waiting for amazing content.
                  </p>
                  <p className="text-muted-foreground mb-8">
                    We're working on bringing you fresh articles in this category. Stay tuned!
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link href="/">
                      <Button variant="default" className="gap-2">
                        <Layers className="h-4 w-4" />
                        Browse Other Categories
                      </Button>
                    </Link>
                    <Link href="/search">
                      <Button variant="outline" className="gap-2">
                        Search All Posts
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {publishedPosts.map((post) => (
                  <PostCard key={post.id} {...post} />
                ))}
              </div>
            )}
          </div>

          {/* Bottom Navigation */}
          {publishedPosts.length > 0 && (
            <div className="text-center py-8">
              <Link href="/">
                <Button variant="outline" className="gap-2">
                  <Layers className="h-4 w-4" />
                  Explore More Categories
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}