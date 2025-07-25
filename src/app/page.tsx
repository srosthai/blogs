"use client"

import { useState, useEffect, useMemo } from "react"
import { PostCard } from "@/components/PostCard"
import { BlogFilters } from "@/components/BlogFilters"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, BookOpen, TrendingUp, Filter } from "lucide-react"

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
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])

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

  // Get all available tags from posts
  const availableTags = useMemo(() => {
    const tagSet = new Set<string>()
    posts.forEach(post => {
      if (post.tags) {
        post.tags.split(',').forEach(tag => {
          tagSet.add(tag.trim())
        })
      }
    })
    return Array.from(tagSet).sort()
  }, [posts])

  // Filter posts based on search query and selected tags
  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      // Search filter
      const matchesSearch = searchQuery === "" || 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase())

      // Tag filter
      const postTags = post.tags ? post.tags.split(',').map(tag => tag.trim()) : []
      const matchesTags = selectedTags.length === 0 || 
        selectedTags.every(tag => postTags.includes(tag))

      return matchesSearch && matchesTags
    })
  }, [posts, searchQuery, selectedTags])

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  const handleClearFilters = () => {
    setSearchQuery("")
    setSelectedTags([])
  }

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
        
        {/* <Card className="max-w-md mx-auto bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
          <CardContent className="flex items-center justify-center space-x-6 py-4">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <span className="font-semibold">{posts.length} Posts</span>
            </div>
            <div className="h-4 w-px bg-border"></div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <span className="font-semibold">{filteredPosts.length} Results</span>
            </div>
          </CardContent>
        </Card> */}
      </div>

      {/* Filters Section */}
      <Card className="max-w-4xl mx-auto">
        <CardContent className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Filter className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Filter & Search</h2>
            {(searchQuery || selectedTags.length > 0) && (
              <Badge variant="secondary" className="ml-auto">
                {filteredPosts.length} of {posts.length}
              </Badge>
            )}
          </div>
          <BlogFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedTags={selectedTags}
            onTagToggle={handleTagToggle}
            availableTags={availableTags}
            onClearFilters={handleClearFilters}
          />
        </CardContent>
      </Card>

      {/* Posts Grid */}
      <div className="max-w-6xl mx-auto">
        {filteredPosts.length === 0 ? (
          <Card className="max-w-md mx-auto">
            <CardContent className="text-center py-12">
              {posts.length === 0 ? (
                <>
                  <BookOpen className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                  <h2 className="text-2xl font-semibold mb-4">No posts yet</h2>
                  <p className="text-muted-foreground">
                    Check back later for new content!
                  </p>
                </>
              ) : (
                <>
                  <Filter className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                  <h2 className="text-2xl font-semibold mb-4">No posts found</h2>
                  <p className="text-muted-foreground mb-6">
                    Try adjusting your search or filter criteria
                  </p>
                  <Button onClick={handleClearFilters} variant="outline">
                    Clear all filters
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Latest Posts</h2>
              {filteredPosts.length < posts.length && (
                <Badge variant="outline" className="flex items-center space-x-1">
                  <span>Filtered: {filteredPosts.length} of {posts.length}</span>
                </Badge>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post) => (
                <PostCard key={post.id} {...post} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
