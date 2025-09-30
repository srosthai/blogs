"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
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

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center">Loading post categories...</div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Post Categories</h1>
          <p className="text-muted-foreground">Manage your blog post categories</p>
        </div>
        <Link href="/admin/post-categories/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Post Category
          </Button>
        </Link>
      </div>

      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search post categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
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
          
          <div className="flex border rounded-md">
            <Button
              variant={viewMode === "table" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("table")}
              className="rounded-r-none"
            >
              <TableProperties className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="rounded-l-none"
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {filteredPostCategories.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            {postCategories.length === 0 ? "No post categories found. Create your first post category!" : "No post categories match your search criteria."}
          </p>
          {postCategories.length === 0 ? (
            <Link href="/admin/post-categories/new">
              <Button>Create your first post category</Button>
            </Link>
          ) : (
            <Button variant="outline" onClick={() => { setSearchTerm(""); setStatusFilter("all"); }}>
              Clear filters
            </Button>
          )}
        </div>
      ) : (
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
                  {filteredPostCategories.map((postCategory) => (
                    <TableRow key={postCategory.id}>
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
                            <Button variant="ghost" size="sm">
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
              {filteredPostCategories.map((postCategory) => (
                <Card key={postCategory.id} className="group hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">{postCategory?.name || 'Unnamed Post Category'}</CardTitle>
                        <Badge variant={postCategory.status ? "default" : "secondary"} className="w-fit">
                          {postCategory.status ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
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
                  <CardContent>
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
                    <CardDescription className="line-clamp-3">
                      {postCategory.description || "No description available"}
                    </CardDescription>
                  </CardContent>
                  <CardFooter className="text-sm text-muted-foreground">
                    Created {new Date(postCategory.createdAt).toLocaleDateString()}
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </>
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
  )
}