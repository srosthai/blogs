"use client"

import { useState, useEffect, useRef } from "react"
import { Search, X, FileText, Command, ArrowRight } from "lucide-react"
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
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
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
      setSelectedIndex(0)
      return
    }

    const filtered = posts.filter(post =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.tags && post.tags.toLowerCase().includes(searchQuery.toLowerCase()))
    ).slice(0, 6)

    setFilteredPosts(filtered)
    setIsOpen(true)
    setSelectedIndex(0)
  }, [searchQuery, posts])

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
  }

  const handleClearSearch = () => {
    setSearchQuery("")
    setFilteredPosts([])
    setIsOpen(false)
    setSelectedIndex(0)
  }

  const handlePostClick = (slug: string) => {
    setIsOpen(false)
    setSearchQuery("")
    setSelectedIndex(0)
    router.push(`/blog/${slug}`)
  }

  const handleClickOutside = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsOpen(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || filteredPosts.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => Math.min(prev + 1, filteredPosts.length - 1))
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => Math.max(prev - 1, 0))
        break
      case 'Enter':
        e.preventDefault()
        if (filteredPosts[selectedIndex]) {
          handlePostClick(filteredPosts[selectedIndex].slug)
        }
        break
      case 'Escape':
        e.preventDefault()
        setIsOpen(false)
        inputRef.current?.blur()
        break
    }
  }

  return (
    <div className="relative">
      {/* Command Search Input */}
      <div className="relative group">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
          <Command className="h-4 w-4 text-muted-foreground" />
        </div>
        <Input
          ref={inputRef}
          placeholder="Search posts... ⌘K"
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          onKeyDown={handleKeyDown}
          className="pl-10 pr-10 w-64 sm:w-80 bg-background/50 backdrop-blur-sm border-2 border-border/50 hover:border-border/80 focus:border-primary/50 transition-all duration-200 rounded-xl"
          onFocus={() => searchQuery && setIsOpen(true)}
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearSearch}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-muted/80 rounded-full transition-colors"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      {/* Command Palette Results */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm"
          onClick={handleClickOutside}
        >
          <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-full max-w-2xl mx-4">
            <Card className="shadow-2xl border-2 border-border/50 backdrop-blur-md bg-background/95 rounded-2xl overflow-hidden">
              <CardContent className="p-0">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <span className="ml-3 text-sm text-muted-foreground font-medium">Searching posts...</span>
                  </div>
                ) : filteredPosts.length > 0 ? (
                  <div className="max-h-96 overflow-y-auto">
                    <div className="p-3 border-b border-border/50 bg-muted/20">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          Blog Posts
                        </span>
                        <span className="text-xs text-muted-foreground">
                          ↑↓ Navigate • ↵ Select • ⎋ Close
                        </span>
                      </div>
                    </div>
                    {filteredPosts.map((post, index) => (
                      <div
                        key={post.id}
                        className={`p-4 cursor-pointer transition-all duration-150 flex items-center justify-between group ${
                          index === selectedIndex 
                            ? 'bg-primary/10 border-l-4 border-primary' 
                            : 'hover:bg-muted/30 border-l-4 border-transparent'
                        }`}
                        onClick={() => handlePostClick(post.slug)}
                      >
                        <div className="flex items-center space-x-4 flex-1 min-w-0">
                          <div className={`p-2 rounded-lg transition-colors ${
                            index === selectedIndex ? 'bg-primary/20 text-primary' : 'bg-muted/50 text-muted-foreground'
                          }`}>
                            <FileText className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className={`font-semibold text-sm truncate transition-colors ${
                              index === selectedIndex ? 'text-foreground' : 'text-foreground/90'
                            }`}>
                              {post.title}
                            </h3>
                            <p className="text-xs text-muted-foreground line-clamp-1 mt-1">
                              {post.content.replace(/[#*`]/g, '').substring(0, 120)}...
                            </p>
                            {post.tags && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {post.tags.split(',').slice(0, 3).map((tag, i) => (
                                  <Badge 
                                    key={i} 
                                    variant="outline" 
                                    className="text-xs h-5 px-2 bg-background/50"
                                  >
                                    {tag.trim()}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        <ArrowRight className={`h-4 w-4 transition-all duration-200 ${
                          index === selectedIndex ? 'text-primary opacity-100 translate-x-0' : 'text-muted-foreground opacity-0 -translate-x-2 group-hover:opacity-60 group-hover:translate-x-0'
                        }`} />
                      </div>
                    ))}
                    {posts.filter(post =>
                      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      (post.tags && post.tags.toLowerCase().includes(searchQuery.toLowerCase()))
                    ).length > 6 && (
                        <div className="p-4 text-center border-t border-border/50 bg-muted/10">
                          <Link
                            href={`/?search=${encodeURIComponent(searchQuery)}`}
                            className="inline-flex items-center space-x-2 text-sm text-primary hover:text-primary/80 font-medium transition-colors"
                            onClick={() => setIsOpen(false)}
                          >
                            <span>View all {posts.filter(post =>
                              post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              (post.tags && post.tags.toLowerCase().includes(searchQuery.toLowerCase()))
                            ).length} results</span>
                            <ArrowRight className="h-3 w-3" />
                          </Link>
                        </div>
                      )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="p-4 rounded-full bg-muted/20 mb-4">
                      <Search className="h-8 w-8 text-muted-foreground/50" />
                    </div>
                    <h3 className="font-medium text-sm text-foreground/80 mb-1">No posts found</h3>
                    <p className="text-xs text-muted-foreground">
                      Try adjusting your search terms for "{searchQuery}"
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