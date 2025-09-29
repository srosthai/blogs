"use client"

import { useState, useEffect, useMemo } from "react"
import { PostCard } from "@/components/PostCard"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Sparkles, BookOpen, Search, ChevronDown } from "lucide-react"
import { useSearchParams } from "next/navigation"

interface Post {
  id: string
  title: string
  content: string
  slug: string
  tags: string
  image?: string | null
  published: boolean
  createdAt: string
  categoryId?: string | null
  category?: {
    id: string
    name: string
  } | null
  author: {
    name: string | null
  }
}

interface Category {
  id: string
  name: string
  status: boolean
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [categoryLoading, setCategoryLoading] = useState(false)
  const [showAllPosts, setShowAllPosts] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get('search') || ''

  // Filter posts based on search query and category
  const filteredPosts = useMemo(() => {
    let filtered = posts

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (post.tags && post.tags.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // Apply category filter
    if (selectedCategory) {
      filtered = filtered.filter(post => post.categoryId === selectedCategory)
    }

    return filtered
  }, [posts, searchQuery, selectedCategory])

  // Get posts to display (limited to 6 unless showAllPosts is true or we're filtering)
  const postsToDisplay = useMemo(() => {
    const isFiltering = searchQuery || selectedCategory
    if (isFiltering || showAllPosts) {
      return filteredPosts
    }
    return filteredPosts.slice(0, 6)
  }, [filteredPosts, searchQuery, selectedCategory, showAllPosts])

  // Fetch posts and categories on component mount
  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch posts
        const postsResponse = await fetch('/api/posts')
        if (postsResponse.ok) {
          const postsData = await postsResponse.json()
          setPosts(postsData)
        }

        // Fetch categories
        const categoriesResponse = await fetch('/api/admin/categories?status=true')
        if (categoriesResponse.ok) {
          const categoriesData = await categoriesResponse.json()
          setCategories(categoriesData)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Reset showAllPosts when category changes
  useEffect(() => {
    if (selectedCategory !== null) {
      setShowAllPosts(false)
    }
  }, [selectedCategory])

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
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Header skeleton */}
          <div className="text-center space-y-4">
            <Skeleton className="h-12 w-64 mx-auto" />
            <Skeleton className="h-4 w-96 mx-auto" />
          </div>

          {/* Category filter skeleton */}
          <div className="flex justify-center">
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-8 w-24 rounded-full" />
              <Skeleton className="h-8 w-20 rounded-full" />
              <Skeleton className="h-8 w-28 rounded-full" />
              <Skeleton className="h-8 w-22 rounded-full" />
            </div>
          </div>

          {/* Posts grid skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <PostCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-6 py-8">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Sparkles className="h-8 w-8 text-primary animate-pulse" />
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
            Welcome to My Blog
          </h1>
          <Sparkles className="h-8 w-8 text-primary animate-pulse" />
        </div>
        
        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
          Discover the latest articles, tutorials, and insights on web development, technology, and more
        </p>
      </div>

      {/* Search Results Header */}
      {searchQuery && (
        <div className="max-w-6xl mx-auto">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Search className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold">
                    Search Results for "{searchQuery}"
                  </h2>
                </div>
                <Badge variant="secondary">
                  {filteredPosts.length} of {posts.length} posts
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Posts Grid */}
      <div className="max-w-6xl mx-auto">
        {posts.length === 0 ? (
          <Card className="max-w-md mx-auto">
            <CardContent className="text-center py-12">
              <BookOpen className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold mb-4">No posts yet</h2>
              <p className="text-muted-foreground">
                Check back later for new content!
              </p>
            </CardContent>
          </Card>
        ) : searchQuery && filteredPosts.length === 0 ? (
          <Card className="max-w-md mx-auto">
            <CardContent className="text-center py-12">
              <Search className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold mb-4">No posts found</h2>
              <p className="text-muted-foreground">
                No posts match your search for "{searchQuery}"
              </p>
            </CardContent>
          </Card>
        ) : selectedCategory && filteredPosts.length === 0 ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">
                {categories.find(c => c.id === selectedCategory)?.name || 'Category'} Posts
              </h2>
              <Badge variant="outline" className="text-sm">
                0 posts in this category
              </Badge>
            </div>
            
            {/* Category Filter */}
            {categories.length > 0 && (
              <div className="flex justify-center">
                <div className="flex flex-wrap gap-2 items-center">
                  <Button
                    variant={selectedCategory === null ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      if (selectedCategory !== null) {
                        setCategoryLoading(true)
                        setTimeout(() => {
                          setSelectedCategory(null)
                          setCategoryLoading(false)
                        }, 300)
                      }
                    }}
                    className="rounded-full"
                  >
                    All Categories
                  </Button>
                  {categories.map((category) => (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        if (selectedCategory !== category.id) {
                          setCategoryLoading(true)
                          setTimeout(() => {
                            setSelectedCategory(category.id)
                            setCategoryLoading(false)
                          }, 300)
                        }
                      }}
                      className="rounded-full"
                    >
                      {category.name}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <Card className="max-w-md mx-auto">
              <CardContent className="text-center py-12">
                <div className="text-4xl mb-4">📂</div>
                <h2 className="text-2xl font-semibold mb-4">No posts in this category</h2>
                <p className="text-muted-foreground mb-4">
                  No posts found in "{categories.find(c => c.id === selectedCategory)?.name}" category yet.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setCategoryLoading(true)
                    setTimeout(() => {
                      setSelectedCategory(null)
                      setCategoryLoading(false)
                    }, 300)
                  }}
                  className="mt-2"
                >
                  View All Posts
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">
                {searchQuery ? 'Search Results' : 
                 selectedCategory ? `${categories.find(c => c.id === selectedCategory)?.name || 'Category'} Posts` : 
                 'Latest Posts'}
              </h2>
              {!searchQuery && (
                <Badge variant="outline" className="text-sm">
                  {selectedCategory ? (
                    showAllPosts ? 
                      `${filteredPosts.length} posts in this category` :
                      `Showing ${Math.min(6, filteredPosts.length)} of ${filteredPosts.length} posts`
                  ) : (
                    showAllPosts ? 
                      `${posts.length} total posts` :
                      posts.length > 6 ? 
                        `Showing 6 of ${posts.length} posts` :
                        `${posts.length} posts`
                  )}
                </Badge>
              )}
            </div>
            
            {/* Category Filter */}
            {categories.length > 0 && (
              <div className="flex justify-center">
                <div className="flex flex-wrap gap-2 items-center">
                  <Button
                    variant={selectedCategory === null ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      if (selectedCategory !== null) {
                        setCategoryLoading(true)
                        setTimeout(() => {
                          setSelectedCategory(null)
                          setCategoryLoading(false)
                        }, 300)
                      }
                    }}
                    className="rounded-full"
                  >
                    All Categories
                  </Button>
                  {categories.map((category) => (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        if (selectedCategory !== category.id) {
                          setCategoryLoading(true)
                          setTimeout(() => {
                            setSelectedCategory(category.id)
                            setCategoryLoading(false)
                          }, 300)
                        }
                      }}
                      className="rounded-full"
                    >
                      {category.name}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryLoading ? (
                // Show skeleton cards when filtering by category
                Array.from({ length: 6 }).map((_, i) => (
                  <PostCardSkeleton key={i} />
                ))
              ) : (
                postsToDisplay.map((post) => (
                  <PostCard key={post.id} {...post} />
                ))
              )}
            </div>
            
            {/* See All Button */}
            {!searchQuery && !selectedCategory && posts.length > 6 && !showAllPosts && (
              <div className="flex justify-center pt-6">
                <Button 
                  onClick={() => setShowAllPosts(true)}
                  variant="outline"
                  size="lg"
                  className="flex items-center space-x-2 hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <span>See All Posts ({posts.length})</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </div>
            )}
            
            {/* Show Less Button */}
            {!searchQuery && showAllPosts && posts.length > 6 && (
              <div className="flex justify-center pt-6">
                <Button 
                  onClick={() => setShowAllPosts(false)}
                  variant="outline"
                  size="lg"
                  className="flex items-center space-x-2 hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <span>Show Less</span>
                  <ChevronDown className="h-4 w-4 rotate-180" />
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
