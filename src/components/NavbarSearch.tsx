"use client"

import { useState, useEffect } from "react"
import { Search, X, FileText } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface Post {
  id: string
  title: string
  content: string
  slug: string
  tags: string
  image?: string | null
  published: boolean
  createdAt: string
}

export function NavbarSearch() {
  const [searchQuery, setSearchQuery] = useState("")
  const [posts, setPosts] = useState<Post[]>([])
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // Fetch posts when component mounts
  useEffect(() => {
    async function fetchPosts() {
      try {
        setLoading(true)
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

  // Filter posts based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredPosts([])
      setIsOpen(false)
      return
    }

    const filtered = posts.filter(post =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.tags && post.tags.toLowerCase().includes(searchQuery.toLowerCase()))
    ).slice(0, 5) // Show only first 5 results

    setFilteredPosts(filtered)
    setIsOpen(true)
  }, [searchQuery, posts])

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
  }

  const handleClearSearch = () => {
    setSearchQuery("")
    setFilteredPosts([])
    setIsOpen(false)
  }

  const handlePostClick = (slug: string) => {
    setIsOpen(false)
    setSearchQuery("")
    router.push(`/blog/${slug}`)
  }

  const handleClickOutside = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsOpen(false)
    }
  }

  return (
    <div className="relative">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search posts..."
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10 pr-10 w-64 sm:w-80"
          onFocus={() => searchQuery && setIsOpen(true)}
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearSearch}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-muted"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm"
          onClick={handleClickOutside}
        >
          <div className="absolute top-16 left-1/2 transform -translate-x-1/2 w-full max-w-md mx-4">
            <Card className="shadow-lg border-2">
              <CardContent className="p-0">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    <span className="ml-2 text-sm text-muted-foreground">Searching...</span>
                  </div>
                ) : filteredPosts.length > 0 ? (
                  <div className="max-h-96 overflow-y-auto">
                    {filteredPosts.map((post, index) => (
                      <div
                        key={post.id}
                        className={`p-4 cursor-pointer hover:bg-muted/50 transition-colors ${index !== filteredPosts.length - 1 ? 'border-b' : ''
                          }`}
                        onClick={() => handlePostClick(post.slug)}
                      >
                        <div className="flex items-start space-x-3">
                          <FileText className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-sm truncate">{post.title}</h3>
                            <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                              {post.content.replace(/[#*`]/g, '').substring(0, 100)}...
                            </p>
                            {post.tags && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {post.tags.split(',').slice(0, 2).map((tag, i) => (
                                  <Badge key={i} variant="secondary" className="text-xs">
                                    {tag.trim()}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    {posts.filter(post =>
                      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      (post.tags && post.tags.toLowerCase().includes(searchQuery.toLowerCase()))
                    ).length > 5 && (
                        <div className="p-3 text-center border-t">
                          <Link
                            href={`/?search=${encodeURIComponent(searchQuery)}`}
                            className="text-sm text-primary hover:underline"
                            onClick={() => setIsOpen(false)}
                          >
                            View all results ({posts.filter(post =>
                              post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              (post.tags && post.tags.toLowerCase().includes(searchQuery.toLowerCase()))
                            ).length})
                          </Link>
                        </div>
                      )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Search className="h-8 w-8 text-muted-foreground/50 mb-2" />
                    <p className="text-sm text-muted-foreground">
                      No posts found for "{searchQuery}"
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}