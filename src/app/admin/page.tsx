"use client"

import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Pagination } from "@/components/ui/pagination"
import Link from "next/link"
import { useEffect, useState, useMemo } from "react"
import { MoreHorizontal, Plus, Edit, Trash2, Eye, Search, Filter, Grid3X3, TableProperties } from "lucide-react"
import { toast } from "sonner"

interface Post {
  id: string
  title: string
  slug: string
  published: boolean
  createdAt: string
  tags: string
  image?: string | null
  categoryId?: string | null
  category?: {
    id: string
    name: string
  } | null
}

function AdminDashboard() {
  const { data: session } = useSession()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [deletePostId, setDeletePostId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all")
  const [viewMode, setViewMode] = useState<"grid" | "table">("table")
  const [currentPage, setCurrentPage] = useState(1)
  const postsPerPage = 10

  useEffect(() => {
    fetchPosts()
  }, [])

  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (post.category?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === "all" ||
        (statusFilter === "published" && post.published) ||
        (statusFilter === "draft" && !post.published)
      return matchesSearch && matchesStatus
    })
  }, [posts, searchTerm, statusFilter])

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage)
  const startIndex = (currentPage - 1) * postsPerPage
  const paginatedPosts = filteredPosts.slice(startIndex, startIndex + postsPerPage)

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, statusFilter])

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/admin/posts')
      if (response.ok) {
        const data = await response.json()
        setPosts(data)
      } else {
        toast.error('Failed to load posts')
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
      toast.error('An error occurred while loading posts')
    } finally {
      setLoading(false)
    }
  }

  const togglePublished = async (postId: string, published: boolean) => {
    const action = published ? 'unpublishing' : 'publishing'
    const loadingToast = toast.loading(`${action.charAt(0).toUpperCase() + action.slice(1)} post...`)

    try {
      const response = await fetch(`/api/admin/posts/${postId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ published: !published }),
      })

      if (response.ok) {
        toast.dismiss(loadingToast)
        toast.success(published ? 'Post unpublished successfully!' : 'Post published successfully!')
        fetchPosts()
      } else {
        toast.dismiss(loadingToast)
        toast.error('Failed to update post status')
      }
    } catch (error) {
      console.error('Error updating post:', error)
      toast.dismiss(loadingToast)
      toast.error('An error occurred while updating the post')
    }
  }

  const deletePost = async (postId: string) => {
    const loadingToast = toast.loading('Deleting post...')

    try {
      const response = await fetch(`/api/admin/posts/${postId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.dismiss(loadingToast)
        toast.success('Post deleted successfully!')
        fetchPosts()
        setDeletePostId(null)
      } else {
        toast.dismiss(loadingToast)
        toast.error('Failed to delete post')
      }
    } catch (error) {
      console.error('Error deleting post:', error)
      toast.dismiss(loadingToast)
      toast.error('An error occurred while deleting the post')
    }
  }


  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="border-b bg-white dark:bg-gray-950">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-4xl font-bold tracking-tight">Admin Dashboard</h1>
              <p className="text-lg text-muted-foreground">Welcome back, {session?.user?.name}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/admin/categories">
                <Button variant="outline" className="h-10">
                  <Grid3X3 className="w-4 h-4 mr-2" />
                  Categories
                </Button>
              </Link>
              <Link href="/admin/post-categories">
                <Button variant="outline" className="h-10">
                  <Grid3X3 className="w-4 h-4 mr-2" />
                  Post Categories
                </Button>
              </Link>
              <Link href="/admin/new">
                <Button className="h-10">
                  <Plus className="w-4 h-4 mr-2" />
                  New Post
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">

        {/* Search and Filter Controls */}
        <div className="space-y-4 mb-8">
          {/* Search Row */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search posts by title, tags, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-11"
              />
            </div>
          </div>
          
          {/* Filter and View Toggle Row */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              {/* Status Filter */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="h-10 min-w-[140px]">
                    <Filter className="w-4 h-4 mr-2" />
                    {statusFilter === "all" ? "All Posts" : statusFilter === "published" ? "Published" : "Draft"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem onClick={() => setStatusFilter("all")}>
                    All Posts
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("published")}>
                    Published Only
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("draft")}>
                    Draft Only
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* View Mode Toggle */}
            <div className="flex gap-2">
              <Button
                variant={viewMode === "table" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("table")}
                className="h-10 px-4"
              >
                <TableProperties className="w-4 h-4 mr-2" />
                Table
              </Button>
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="h-10 px-4"
              >
                <Grid3X3 className="w-4 h-4 mr-2" />
                Grid
              </Button>
            </div>
          </div>
        </div>

        {loading ? (
          // Loading Skeleton
          <div className="space-y-6">
            {viewMode === "table" ? (
              <div className="rounded-lg border bg-white dark:bg-gray-950 shadow-sm">
                <div className="p-4">
                  {/* Table Header Skeleton */}
                  <div className="flex items-center gap-4 mb-4 pb-3 border-b">
                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-24 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-20 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-16 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-20 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-16 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-12 animate-pulse ml-auto"></div>
                  </div>
                  {/* Table Rows Skeleton */}
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4 py-4 border-b last:border-b-0">
                      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded flex-1 max-w-xs animate-pulse"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-20 animate-pulse"></div>
                      <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-16 animate-pulse"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-20 animate-pulse"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-16 animate-pulse"></div>
                      <div className="h-8 w-8 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
                    {/* Image Skeleton */}
                    <div className="aspect-video w-full bg-gray-200 dark:bg-gray-800 animate-pulse"></div>
                    {/* Content Skeleton */}
                    <div className="p-4 space-y-3">
                      <div className="space-y-2">
                        <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4 animate-pulse"></div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-16 animate-pulse"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-20 animate-pulse"></div>
                      </div>
                      <div className="flex gap-1 pt-2">
                        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-12 animate-pulse"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-16 animate-pulse"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-10 animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16">
            <div className="mx-auto max-w-md">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold mb-2">No posts yet</h3>
              <p className="text-muted-foreground mb-6">You haven't created any posts yet. Get started by creating your first post.</p>
              <Link href="/admin/new">
                <Button size="lg">
                  <Plus className="w-4 h-4 mr-2" />
                  Create your first post
                </Button>
              </Link>
            </div>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-16">
            <div className="mx-auto max-w-md">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2">No results found</h3>
              <p className="text-muted-foreground mb-6">No posts match your search criteria. Try adjusting your filters.</p>
              <Button variant="outline" onClick={() => { setSearchTerm(""); setStatusFilter("all"); }}>
                Clear filters
              </Button>
            </div>
          </div>
        ) : (
        <>
          {viewMode === "table" ? (
            <div className="rounded-lg border bg-white dark:bg-gray-950 shadow-sm">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Tags</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedPosts.map((post) => (
                    <TableRow key={post.id}>
                      <TableCell className="font-medium max-w-xs">
                        <div className="truncate">{post.title}</div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {post.category?.name || "No category"}
                      </TableCell>
                      <TableCell>
                        <Badge variant={post.published ? "default" : "secondary"}>
                          {post.published ? "Published" : "Draft"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground max-w-xs">
                        <div className="truncate">{post.tags || "No tags"}</div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {post.published && (
                              <DropdownMenuItem asChild>
                                <Link href={`/blog/${post.slug}`} target="_blank">
                                  <Eye className="w-4 h-4 mr-2" />
                                  View Post
                                </Link>
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/edit/${post.id}`}>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => togglePublished(post.id, post.published)}
                            >
                              {post.published ? "Unpublish" : "Publish"}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setDeletePostId(post.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {paginatedPosts.map((post) => (
                <Card key={post.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800">
                  {/* Image Section */}
                  <div className="relative aspect-video w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                    {post.image ? (
                      <img
                        src={post.image}
                        alt={post.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <div className="text-4xl text-gray-400">📄</div>
                      </div>
                    )}
                    {/* Status Badge Overlay */}
                    <div className="absolute top-3 left-3">
                      <Badge 
                        variant={post.published ? "default" : "secondary"} 
                        className="text-xs shadow-md"
                      >
                        {post.published ? "Published" : "Draft"}
                      </Badge>
                    </div>
                    {/* Actions Menu Overlay */}
                    <div className="absolute top-3 right-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="secondary" 
                            size="sm" 
                            className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0 bg-white/90 hover:bg-white shadow-md"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {post.published && (
                            <DropdownMenuItem asChild>
                              <Link href={`/blog/${post.slug}`} target="_blank">
                                <Eye className="w-4 h-4 mr-2" />
                                View Post
                              </Link>
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/edit/${post.id}`}>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => togglePublished(post.id, post.published)}
                          >
                            {post.published ? "Unpublish" : "Publish"}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setDeletePostId(post.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  {/* Content Section */}
                  <CardContent className="p-4 space-y-3">
                    <div className="space-y-2">
                      <h3 className="font-semibold text-lg leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {post.title}
                      </h3>
                      
                      {/* Category and Date */}
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span className="flex items-center">
                          {post.category ? (
                            <span className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md text-xs">
                              {post.category.name}
                            </span>
                          ) : (
                            <span className="text-xs">No category</span>
                          )}
                        </span>
                        <span className="text-xs">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      {/* Tags */}
                      {post.tags && (
                        <div className="flex flex-wrap gap-1 pt-2">
                          {post.tags.split(',').slice(0, 4).map((tag, index) => (
                            <span 
                              key={index}
                              className="text-xs bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 px-2 py-1 rounded-full"
                            >
                              #{tag.trim()}
                            </span>
                          ))}
                          {post.tags.split(',').length > 4 && (
                            <span className="text-xs text-muted-foreground self-center">
                              +{post.tags.split(',').length - 4}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-8 pt-6 border-t">
              <p className="text-sm text-muted-foreground">
                Showing {startIndex + 1}-{Math.min(startIndex + postsPerPage, filteredPosts.length)} of {filteredPosts.length} posts
              </p>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </>)}
      </div>

      <AlertDialog open={!!deletePostId} onOpenChange={() => setDeletePostId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the post.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletePostId && deletePost(deletePostId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default function AdminPage() {
  return <AdminDashboard />
}