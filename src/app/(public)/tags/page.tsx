"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { PostCard } from "@/components/PostCard"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { Tags, Hash, BookOpen, Filter, Sparkles, Search, Grid3x3, List, Eye, Clock } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

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
  category?: {
    id: string
    name: string
  } | null
}

export default function TagsPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const selectedTag = searchParams.get('tag')
  
  const [allTags, setAllTags] = useState<string[]>([])
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [tagsLoading, setTagsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  useEffect(() => {
    fetchAllTags()
  }, [])

  useEffect(() => {
    fetchPosts()
  }, [selectedTag])

  const fetchAllTags = async () => {
    try {
      const response = await fetch('/api/posts')
      if (response.ok) {
        const data = await response.json()
        const tagSet = new Set<string>()
        
        data.forEach((post: Post) => {
          if (post.tags) {
            post.tags.split(',').forEach((tag: string) => {
              tagSet.add(tag.trim())
            })
          }
        })
        
        setAllTags(Array.from(tagSet).sort())
      }
    } catch (error) {
      console.error('Error fetching tags:', error)
    } finally {
      setTagsLoading(false)
    }
  }

  const fetchPosts = async () => {
    setLoading(true)
    try {
      let url = '/api/posts'
      if (selectedTag) {
        url += `?tag=${encodeURIComponent(selectedTag)}`
      }
      
      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        let filteredPosts = data
        
        if (selectedTag) {
          filteredPosts = data.filter((post: Post) => 
            post.tags && post.tags.toLowerCase().includes(selectedTag.toLowerCase())
          )
        }
        
        setPosts(filteredPosts)
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  // Filter tags based on search
  const filteredTags = allTags.filter(tag =>
    tag.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleTagSelect = (tag: string) => {
    if (selectedTag === tag) {
      router.push('/tags')
    } else {
      router.push(`/tags?tag=${encodeURIComponent(tag)}`)
    }
  }

  // Skeleton components
  const TagSkeleton = () => (
    <Skeleton className="h-8 w-20 rounded-full" />
  )

  const PostCardSkeleton = () => (
    <Card className="h-full overflow-hidden">
      <div className="relative h-32 sm:h-36 md:h-40 lg:h-48 w-full">
        <Skeleton className="h-full w-full" />
      </div>
      <CardContent className="p-4 space-y-3">
        <div className="space-y-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-5 w-12 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-12">
        <div className="space-y-12">
          {/* Hero Section */}
          <div className="text-center space-y-6 py-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Tags className="h-8 w-8 text-primary animate-pulse" />
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                Browse by Tags
              </h1>
              <Hash className="h-8 w-8 text-primary animate-pulse" />
            </div>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              {selectedTag 
                ? `Discover all posts tagged with "${selectedTag}"` 
                : 'Explore posts organized by topics and technologies'
              }
            </p>

            <div className="flex items-center justify-center gap-8 pt-4">
              <div className="flex items-center gap-2">
                <Hash className="h-5 w-5 text-muted-foreground" />
                <span className="text-muted-foreground font-medium">
                  {tagsLoading ? '...' : `${allTags.length} Tags`}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-muted-foreground" />
                <span className="text-muted-foreground font-medium">
                  {loading ? '...' : `${posts.length} Posts`}
                </span>
              </div>
            </div>
          </div>

          {/* Tags Filter Section */}
          <Card className="max-w-6xl mx-auto bg-white/50 dark:bg-card/50 backdrop-blur border-border/50">
            <CardHeader className="pb-4">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <CardTitle className="flex flex-wrap items-center gap-2">
                    <div className="flex items-center gap-2">
                      <Filter className="h-5 w-5 text-primary" />
                      <span>Filter by Tag</span>
                    </div>
                    {selectedTag && (
                      <Badge variant="default" className="w-fit">
                        {selectedTag}
                      </Badge>
                    )}
                  </CardTitle>
                  
                  {/* Search Tags */}
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search tags..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {tagsLoading ? (
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <TagSkeleton key={i} />
                  ))}
                </div>
              ) : (
                <div className="flex justify-between flex-wrap gap-2 max-h-64 overflow-y-auto">
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      variant={!selectedTag ? "default" : "outline"} 
                      size="sm" 
                      onClick={() => router.push('/tags')}
                      className="gap-2"
                    >
                      <Sparkles className="h-3 w-3" />
                      All Posts
                    </Button>
                    {filteredTags.map((tag) => (
                      <Button 
                        key={tag} 
                        variant={selectedTag === tag ? "default" : "outline"} 
                        size="sm"
                        onClick={() => handleTagSelect(tag)}
                        className="gap-2"
                      >
                        <Hash className="h-3 w-3" />
                        {tag}
                      </Button>
                    ))}
                  </div>
                  {filteredTags.length === 0 && searchTerm && (
                    <p className="text-muted-foreground text-sm py-4">
                      No tags found matching "{searchTerm}"
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Posts Section */}
          <div className="max-w-7xl mx-auto">
            {loading ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-8 w-48" />
                  <Skeleton className="h-6 w-20" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <PostCardSkeleton key={i} />
                  ))}
                </div>
              </div>
            ) : posts.length === 0 ? (
              <Card className="max-w-md mx-auto border-dashed border-2">
                <CardContent className="text-center py-16">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
                    <Tags className="h-10 w-10 text-primary/60" />
                  </div>
                  <h2 className="text-2xl font-semibold mb-4">No posts found</h2>
                  <p className="text-muted-foreground mb-6">
                    {selectedTag 
                      ? `No posts are tagged with "${selectedTag}"`
                      : 'No posts available at the moment'
                    }
                  </p>
                  {selectedTag && (
                    <Button variant="outline" onClick={() => router.push('/tags')}>
                      View All Tags
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex flex-col">
                    <h2 className="text-2xl font-bold">
                      {selectedTag ? `Posts tagged "${selectedTag}"` : 'All Posts'}
                    </h2>
                    <span className="text-sm text-muted-foreground mt-1">
                      {posts.length} {posts.length === 1 ? 'Post' : 'Posts'}
                    </span>
                  </div>
                  
                  {/* View Toggle */}
                  <div className="flex items-center gap-2 p-1 bg-muted rounded-lg">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                      className="gap-2 h-8 px-3"
                    >
                      <Grid3x3 className="h-4 w-4" />
                      <span className="hidden sm:inline">Grid</span>
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                      className="gap-2 h-8 px-3"
                    >
                      <List className="h-4 w-4" />
                      <span className="hidden sm:inline">List</span>
                    </Button>
                  </div>
                </div>
                
                <div className={viewMode === 'grid' 
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
                  : "space-y-4"
                }>
                  {posts.map((post) => (
                    viewMode === 'grid' ? (
                      <PostCard key={post.id} {...post} />
                    ) : (
                      <Card key={post.id} className="group hover:shadow-lg transition-all duration-300 bg-card border border-border/30 hover:border-border/50">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            {/* Image */}
                            <div className="relative w-16 h-16 rounded-lg overflow-hidden from-primary/10 to-secondary/10 shrink-0">
                              {post.image ? (
                                <Image
                                  src={post.image}
                                  alt={post.title}
                                  fill
                                  sizes="64px"
                                  className="object-cover"
                                />
                              ) : (
                                <div className="h-full flex items-center justify-center">
                                  <BookOpen className="h-6 w-6 text-primary" />
                                </div>
                              )}
                            </div>
                            
                            {/* Content */}
                            <div className="flex-1 min-w-0 space-y-1">
                              {/* Category Badge */}
                              {post.category && (
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <Hash className="h-3 w-3" />
                                  <span className="font-medium">{post.category.name}</span>
                                </div>
                              )}
                              
                              {/* Title */}
                              <Link href={`/blog/${post.slug}`} className="group/title">
                                <h3 className="text-lg font-semibold text-foreground group-hover/title:text-primary transition-colors line-clamp-1">
                                  {post.title}
                                </h3>
                              </Link>
                              
                              {/* Meta Info */}
                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  <span>{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Eye className="h-3 w-3" />
                                  <span>{post.author.name}</span>
                                </div>
                              </div>
                            </div>
                            
                            {/* Tags */}
                            <div className="hidden sm:flex items-center gap-1 shrink-0">
                              {post.tags && post.tags.split(',').slice(0, 2).map((tag, index) => (
                                <Badge 
                                  key={index}
                                  variant="secondary" 
                                  className="text-xs px-1.5 py-0.5 cursor-pointer hover:bg-muted"
                                  onClick={() => handleTagSelect(tag.trim())}
                                >
                                  {tag.trim()}
                                </Badge>
                              ))}
                              {post.tags && post.tags.split(',').length > 2 && (
                                <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                                  +{post.tags.split(',').length - 2}
                                </Badge>
                              )}
                            </div>
                            
                            {/* Date Range Style */}
                            <div className="hidden md:flex flex-col items-end text-right shrink-0">
                              <span className="text-xs text-muted-foreground font-medium">PUBLISHED</span>
                              <span className="text-sm font-semibold text-foreground">
                                {new Date(post.createdAt).toLocaleDateString('en-US', { 
                                  month: 'short', 
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </span>
                            </div>
                            
                            {/* Action Button */}
                            <Link 
                              href={`/blog/${post.slug}`}
                              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shrink-0"
                            >
                              Read Post
                            </Link>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}