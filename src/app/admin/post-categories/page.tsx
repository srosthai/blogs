"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Pagination } from "@/components/ui/pagination"
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
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Grid3X3, 
  TableProperties,
  Eye,
  EyeOff
} from "lucide-react"
import { toast } from "sonner"

interface PostCategory {
  id: string
  name: string
  description: string
  image?: string
  status: boolean
  createdAt: string
  updatedAt: string
}

export default function PostCategoriesPage() {
  const [postCategories, setPostCategories] = useState<PostCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all")
  const [viewMode, setViewMode] = useState<"grid" | "table">("table")
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const categoriesPerPage = 10

  useEffect(() => {
    fetchPostCategories()
  }, [])

  const fetchPostCategories = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (searchTerm) params.append('search', searchTerm)
      if (statusFilter !== 'all') {
        params.append('status', statusFilter === 'active' ? 'true' : 'false')
      }
      
      const response = await fetch(`/api/admin/post-categories?${params}`)
      if (response.ok) {
        const data = await response.json()
        setPostCategories(data)
      } else {
        toast.error('Failed to load post categories')
      }
    } catch (error) {
      toast.error('An error occurred while loading post categories')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const delayedFetch = setTimeout(() => {
      fetchPostCategories()
    }, 300)
    
    return () => clearTimeout(delayedFetch)
  }, [searchTerm, statusFilter])

  const toggleStatus = async (postCategoryId: string, currentStatus: boolean) => {
    const newStatus = !currentStatus
    const action = newStatus ? 'activating' : 'deactivating'
    const loadingToast = toast.loading(`${action.charAt(0).toUpperCase() + action.slice(1)} post category...`)

    try {
      const postCategory = postCategories.find(c => c.id === postCategoryId)
      if (!postCategory || !postCategory.name) return

      const response = await fetch(`/api/admin/post-categories/${postCategoryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: postCategory.name,
          description: postCategory.description || '',
          image: postCategory.image || '',
          status: newStatus
        }),
      })

      if (response.ok) {
        toast.dismiss(loadingToast)
        toast.success(`Post category ${newStatus ? 'activated' : 'deactivated'} successfully!`)
        fetchPostCategories()
      } else {
        toast.dismiss(loadingToast)
        toast.error('Failed to update post category status')
      }
    } catch (error) {
      toast.dismiss(loadingToast)
      toast.error('An error occurred while updating the post category')
    }
  }

  const deletePostCategory = async (postCategoryId: string) => {
    const loadingToast = toast.loading('Deleting post category...')

    try {
      const response = await fetch(`/api/admin/post-categories/${postCategoryId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.dismiss(loadingToast)
        toast.success('Post category deleted successfully!')
        fetchPostCategories()
        setDeleteId(null)
      } else {
        toast.dismiss(loadingToast)
        toast.error('Failed to delete post category')
      }
    } catch (error) {
      toast.dismiss(loadingToast)
      toast.error('An error occurred while deleting the post category')
    }
  }

  const filteredPostCategories = useMemo(() => {
    return postCategories.filter(postCategory => {
      const matchesSearch = (postCategory?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (postCategory?.description || '').toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === "all" ||
        (statusFilter === "active" && postCategory.status === true) ||
        (statusFilter === "inactive" && postCategory.status === false)
      return matchesSearch && matchesStatus
    })
  }, [postCategories, searchTerm, statusFilter])

  const totalPages = Math.ceil(filteredPostCategories.length / categoriesPerPage)
  const startIndex = (currentPage - 1) * categoriesPerPage
  const paginatedPostCategories = filteredPostCategories.slice(startIndex, startIndex + categoriesPerPage)

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, statusFilter])

  const LoadingSkeleton = () => (
    <>
      {viewMode === "table" ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <div className="w-12 h-12 rounded-lg bg-gray-200 dark:bg-gray-800 animate-pulse"></div>
                  </TableCell>
                  <TableCell>
                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse w-32"></div>
                  </TableCell>
                  <TableCell>
                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse w-48"></div>
                  </TableCell>
                  <TableCell>
                    <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse w-16"></div>
                  </TableCell>
                  <TableCell>
                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse w-24"></div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded animate-pulse w-8 ml-auto"></div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="space-y-2">
                  <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-16"></div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-32 bg-gray-200 dark:bg-gray-800 rounded mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-2/3"></div>
                </div>
              </CardContent>
              <CardFooter>
                <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-24"></div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </>
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="border-b bg-white dark:bg-gray-950 sticky top-0 z-10">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold tracking-tight">Post Categories</h1>
              <p className="text-muted-foreground">Manage your blog post categories</p>
            </div>
            <Link href="/admin/post-categories/new">
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                New Post Category
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">

        {/* Search and Filter Controls */}
        <div className="bg-white dark:bg-gray-950 rounded-lg border p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search post categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-11"
              />
            </div>
            <div className="flex items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2 min-w-[140px]">
                    <Filter className="w-4 h-4" />
                    {statusFilter === "all" ? "All Status" : statusFilter === "active" ? "Active" : "Inactive"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setStatusFilter("all")}>
                    All Status
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("active")}>
                    Active Only
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("inactive")}>
                    Inactive Only
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <div className="flex gap-1 p-1 bg-muted rounded-lg">
                <Button
                  variant={viewMode === "table" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("table")}
                  className={`px-4 py-2 h-9 gap-2 font-medium transition-all ${
                    viewMode === "table" 
                      ? "bg-background text-foreground shadow-sm" 
                      : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                  }`}
                >
                  <TableProperties className="w-4 h-4" />
                  Table
                </Button>
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className={`px-4 py-2 h-9 gap-2 font-medium transition-all ${
                    viewMode === "grid" 
                      ? "bg-background text-foreground shadow-sm" 
                      : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                  Grid
                </Button>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <LoadingSkeleton />
        ) : filteredPostCategories.length === 0 ? (
          <div className="bg-white dark:bg-gray-950 rounded-lg border p-12">
            <div className="text-center">
              <div className="text-6xl mb-4">📂</div>
              <h3 className="text-xl font-semibold mb-2">
                {postCategories.length === 0 ? "No post categories found" : "No matching post categories"}
              </h3>
              <p className="text-muted-foreground mb-6">
                {postCategories.length === 0 
                  ? "Create your first post category to organize your content!" 
                  : "No post categories match your search criteria."
                }
              </p>
              {postCategories.length === 0 ? (
                <Link href="/admin/post-categories/new">
                  <Button className="gap-2">
                    <Plus className="w-4 h-4" />
                    Create your first post category
                  </Button>
                </Link>
              ) : (
                <Button 
                  variant="outline" 
                  onClick={() => { setSearchTerm(""); setStatusFilter("all"); }}
                  className="gap-2"
                >
                  Clear filters
                </Button>
              )}
            </div>
          </div>
        ) : (
          <>
            {viewMode === "table" ? (
              <div className="bg-white dark:bg-gray-950 rounded-lg border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b">
                      <TableHead className="w-16">Image</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="w-24">Status</TableHead>
                      <TableHead className="w-32">Created</TableHead>
                      <TableHead className="w-20 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedPostCategories.map((postCategory) => (
                      <TableRow key={postCategory.id} className="hover:bg-muted/50">
                      <TableCell>
                        {postCategory.image ? (
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                            <Image
                              src={postCategory.image}
                              alt={postCategory.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                            <span className="text-gray-400 text-xs">No Image</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{postCategory?.name || 'Unnamed Post Category'}</TableCell>
                      <TableCell className="text-muted-foreground max-w-xs truncate">
                        {postCategory.description || "No description"}
                      </TableCell>
                      <TableCell>
                        <Badge variant={postCategory.status ? "default" : "secondary"}>
                          {postCategory.status ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(postCategory.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/post-categories/edit/${postCategory.id}`}>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => toggleStatus(postCategory.id, postCategory.status)}
                            >
                              {postCategory.status ? (
                                <>
                                  <EyeOff className="w-4 h-4 mr-2" />
                                  Deactivate
                                </>
                              ) : (
                                <>
                                  <Eye className="w-4 h-4 mr-2" />
                                  Activate
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setDeleteId(postCategory.id)}
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
                {paginatedPostCategories.map((postCategory) => (
                  <Card key={postCategory.id} className="group hover:shadow-md transition-all duration-200 bg-white dark:bg-gray-950">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <CardTitle className="text-lg leading-tight">{postCategory?.name || 'Unnamed Post Category'}</CardTitle>
                          <Badge variant={postCategory.status ? "default" : "secondary"} className="w-fit">
                            {postCategory.status ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/post-categories/edit/${postCategory.id}`}>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => toggleStatus(postCategory.id, postCategory.status)}
                          >
                            {postCategory.status ? (
                              <>
                                <EyeOff className="w-4 h-4 mr-2" />
                                Deactivate
                              </>
                            ) : (
                              <>
                                <Eye className="w-4 h-4 mr-2" />
                                Activate
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setDeleteId(postCategory.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                    {postCategory.image && (
                      <div className="relative w-full h-32 rounded-lg overflow-hidden mb-4 bg-gray-100 dark:bg-gray-800">
                        <Image
                          src={postCategory.image}
                          alt={postCategory.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                      <CardDescription className="line-clamp-3 text-sm">
                        {postCategory.description || "No description available"}
                      </CardDescription>
                    </CardContent>
                    <CardFooter className="pt-0 text-xs text-muted-foreground">
                      Created {new Date(postCategory.createdAt).toLocaleDateString()}
                    </CardFooter>
                </Card>
              ))}
              </div>
            )}
          </>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white dark:bg-gray-950 rounded-lg border p-4 mt-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <p className="text-sm text-muted-foreground font-medium">
                Showing <span className="text-foreground">{startIndex + 1}-{Math.min(startIndex + categoriesPerPage, filteredPostCategories.length)}</span> of <span className="text-foreground">{filteredPostCategories.length}</span> post categories
              </p>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          </div>
        )}

        <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the post category.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && deletePostCategory(deleteId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}