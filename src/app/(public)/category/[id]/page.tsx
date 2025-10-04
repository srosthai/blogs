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
import { Input } from "@/components/ui/input"
import { 
  ArrowLeft, 
  Calendar, 
  FileText, 
  Layers, 
  BookOpen, 
  Grid3x3, 
  List, 
  Search, 
  Filter,
  SortAsc,
  Eye,
  Clock,
  Hash,
  Tag,
  Folder,
  ChevronRight
} from "lucide-react"

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
    description: string
    status: boolean
  } | null
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
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [sortBy, setSortBy] = useState<'name' | 'posts' | 'recent'>('name')
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)

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
  
  // Filter posts by selected category if any
  const filteredPosts = selectedCategoryId 
    ? publishedPosts.filter(post => post.category?.id === selectedCategoryId)
    : publishedPosts

  // Get unique categories from posts in this PostCategory
  const relatedCategories = publishedPosts
    .filter(post => post.category && post.category.status)
    .reduce((acc, post) => {
      if (post.category && !acc.find(cat => cat.id === post.category!.id)) {
        acc.push({
          ...post.category,
          postCount: publishedPosts.filter(p => p.category?.id === post.category!.id).length
        })
      }
      return acc
    }, [] as Array<{ id: string; name: string; description: string; status: boolean; postCount: number }>)

  // Filter and sort related categories
  const filteredCategories = relatedCategories
    .filter(cat => 
      cat.name.toLowerCase().includes(categoryFilter.toLowerCase()) ||
      cat.description.toLowerCase().includes(categoryFilter.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'posts':
          return b.postCount - a.postCount
        case 'recent':
          const aLatest = publishedPosts
            .filter(p => p.category?.id === a.id)
            .sort((x, y) => new Date(y.createdAt).getTime() - new Date(x.createdAt).getTime())[0]
          const bLatest = publishedPosts
            .filter(p => p.category?.id === b.id)
            .sort((x, y) => new Date(y.createdAt).getTime() - new Date(x.createdAt).getTime())[0]
          return new Date(bLatest?.createdAt || 0).getTime() - new Date(aLatest?.createdAt || 0).getTime()
        default:
          return a.name.localeCompare(b.name)
      }
    })

  // Post card component for list view
  const PostListItem = ({ post }: { post: Post }) => (
    <Card className="group hover:shadow-lg transition-all duration-300 bg-card border border-border/30 hover:border-border/50">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          {/* Image */}
          <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10 shrink-0">
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

          {/* Related Categories Section */}
          {relatedCategories.length > 0 && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Layers className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold">Related Categories</h2>
                  <Badge variant="secondary" className="font-medium">
                    {filteredCategories.length}
                  </Badge>
                </div>
                
                {/* Search and Filter Controls */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search categories..."
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="pl-10 w-full sm:w-48"
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant={sortBy === 'name' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSortBy('name')}
                      className="gap-2"
                    >
                      <SortAsc className="h-4 w-4" />
                      Name
                    </Button>
                    <Button
                      variant={sortBy === 'posts' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSortBy('posts')}
                      className="gap-2"
                    >
                      <FileText className="h-4 w-4" />
                      Posts
                    </Button>
                    <Button
                      variant={sortBy === 'recent' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSortBy('recent')}
                      className="gap-2"
                    >
                      <Clock className="h-4 w-4" />
                      Recent
                    </Button>
                  </div>
                </div>
              </div>

              {/* Categories Buttons */}
              <div className="flex flex-wrap gap-3">
                {filteredCategories.map((relatedCategory) => (
                  <Button
                    key={relatedCategory.id}
                    variant={selectedCategoryId === relatedCategory.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      if (selectedCategoryId === relatedCategory.id) {
                        setSelectedCategoryId(null)
                      } else {
                        setSelectedCategoryId(relatedCategory.id)
                      }
                    }}
                    className={`
                      gap-2 h-auto py-2 px-3 text-sm transition-all duration-300
                      ${selectedCategoryId === relatedCategory.id
                        ? 'shadow-lg shadow-primary/20 scale-105' 
                        : 'hover:scale-105 hover:shadow-md'
                      }
                    `}
                  >
                    <Folder className="h-4 w-4" />
                    <span>{relatedCategory.name}</span>
                    <Badge 
                      variant={selectedCategoryId === relatedCategory.id ? "secondary" : "outline"}
                      className="text-xs px-1.5 py-0.5 ml-1"
                    >
                      {relatedCategory.postCount}
                    </Badge>
                    {selectedCategoryId === relatedCategory.id && (
                      <ChevronRight className="h-3 w-3 ml-1" />
                    )}
                  </Button>
                ))}
              </div>

              {filteredCategories.length === 0 && categoryFilter && (
                <Card className="border-dashed border-2">
                  <CardContent className="text-center py-12">
                    <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No categories found</h3>
                    <p className="text-muted-foreground">
                      No categories match your search "{categoryFilter}"
                    </p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => setCategoryFilter('')}
                    >
                      Clear search
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Posts Section */}
          <div className="space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col">
                <h2 className="text-2xl font-bold">
                  {filteredPosts.length === 0 ? 'No Posts Found' : selectedCategoryId ? 'Filtered Posts' : 'Latest Posts'}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  {filteredPosts.length > 0 && (
                    <span className="text-sm text-muted-foreground">
                      {filteredPosts.length} {filteredPosts.length === 1 ? 'Post' : 'Posts'}
                    </span>
                  )}
                  {selectedCategoryId && (
                    <Badge variant="default" className="text-xs">
                      Filtered by: {filteredCategories.find(cat => cat.id === selectedCategoryId)?.name}
                    </Badge>
                  )}
                </div>
              </div>
              
              {/* Controls */}
              <div className="flex items-center gap-3">
                {/* Clear Filter Button */}
                {selectedCategoryId && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedCategoryId(null)}
                    className="gap-2"
                  >
                    <Filter className="h-4 w-4" />
                    <span className="hidden sm:inline">Clear Filter</span>
                  </Button>
                )}
                
                {/* View Toggle */}
                {filteredPosts.length > 0 && (
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
                )}
              </div>
            </div>

            {filteredPosts.length === 0 ? (
              <Card className="max-w-2xl mx-auto border-dashed border-2">
                <CardContent className="text-center py-16">
                  <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-primary/10 to-primary/20 mb-6">
                    <div className="relative">
                      <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full"></div>
                      <BookOpen className="h-12 w-12 text-primary/70 relative" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-foreground">
                    {selectedCategoryId ? 'No Posts in This Category' : 'Coming Soon!'}
                  </h3>
                  <p className="text-lg text-muted-foreground mb-2">
                    {selectedCategoryId ? (
                      <>No posts found in <span className="font-medium text-primary">{filteredCategories.find(cat => cat.id === selectedCategoryId)?.name}</span> category.</>
                    ) : (
                      <><span className="font-medium text-primary">{category.name}</span> is ready and waiting for amazing content.</>
                    )}
                  </p>
                  <p className="text-muted-foreground mb-8">
                    {selectedCategoryId 
                      ? 'Try selecting a different category or clear the filter to see all posts.'
                      : 'We\'re working on bringing you fresh articles in this category. Stay tuned!'
                    }
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    {selectedCategoryId ? (
                      <Button 
                        variant="default" 
                        className="gap-2"
                        onClick={() => setSelectedCategoryId(null)}
                      >
                        <Filter className="h-4 w-4" />
                        Clear Filter & Show All Posts
                      </Button>
                    ) : (
                      <>
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
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className={viewMode === 'grid' 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
                : "space-y-6"
              }>
                {filteredPosts.map((post) => (
                  viewMode === 'grid' ? (
                    <PostCard key={post.id} {...post} />
                  ) : (
                    <PostListItem key={post.id} post={post} />
                  )
                ))}
              </div>
            )}
          </div>

          {/* Bottom Navigation */}
          {filteredPosts.length > 0 && (
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