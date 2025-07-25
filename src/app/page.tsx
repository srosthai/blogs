"use client"

import { useState, useEffect, useMemo } from "react"
import { PostCard } from "@/components/PostCard"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
  author: {
    name: string | null
  }
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [showAllPosts, setShowAllPosts] = useState(false)
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get('search') || ''

  // Filter posts based on search query from URL
  const filteredPosts = useMemo(() => {
    if (!searchQuery) return posts
    
    return posts.filter(post => 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.tags && post.tags.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  }, [posts, searchQuery])

  // Get posts to display (limited to 6 unless showAllPosts is true or we're searching)
  const postsToDisplay = useMemo(() => {
    const relevantPosts = searchQuery ? filteredPosts : posts
    if (searchQuery || showAllPosts) {
      return relevantPosts
    }
    return relevantPosts.slice(0, 6)
  }, [posts, filteredPosts, searchQuery, showAllPosts])

  // Fetch posts on component mount
  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch('/api/posts')
        if (response.ok) {
          const data = await response.json()
          setPosts(data)
        }
      } catch (error) {
        console.error('Error fetching posts:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
            <p className="text-muted-foreground">Loading posts...</p>
          </CardContent>
        </Card>
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
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">
                {searchQuery ? 'Search Results' : 'Latest Posts'}
              </h2>
              {!searchQuery && posts.length > 6 && !showAllPosts && (
                <Badge variant="outline" className="text-sm">
                  Showing 6 of {posts.length} posts
                </Badge>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {postsToDisplay.map((post) => (
                <PostCard key={post.id} {...post} />
              ))}
            </div>
            
            {/* See All Button */}
            {!searchQuery && posts.length > 6 && !showAllPosts && (
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
