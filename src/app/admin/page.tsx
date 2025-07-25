"use client"

import { useSession } from "next-auth/react"
import { AdminAuthGuard } from "@/lib/admin-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import Link from "next/link"
import { useEffect, useState } from "react"
import { MoreHorizontal, Plus, Edit, Trash2, Eye } from "lucide-react"
import { toast } from "sonner"

interface Post {
  id: string
  title: string
  slug: string
  published: boolean
  createdAt: string
  tags: string
}

function AdminDashboard() {
  const { data: session } = useSession()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [deletePostId, setDeletePostId] = useState<string | null>(null)

  useEffect(() => {
    fetchPosts()
  }, [])

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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading your posts...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {session?.user?.name}</p>
        </div>
        <Link href="/admin/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Post
          </Button>
        </Link>
      </div>

      <div className="space-y-4">
        {posts.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground mb-4">You haven't created any posts yet.</p>
              <Link href="/admin/new">
                <Button>Create your first post</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          posts.map((post) => (
            <Card key={post.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {post.title}
                      <Badge variant={post.published ? "default" : "secondary"}>
                        {post.published ? "Published" : "Draft"}
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      Created on {new Date(post.createdAt).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {post.published && (
                        <DropdownMenuItem asChild>
                          <Link href={`/blog/${post.slug}`}>
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
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
              </CardHeader>
            </Card>
          ))
        )}
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
  return (
    <AdminAuthGuard>
      <AdminDashboard />
    </AdminAuthGuard>
  )
}