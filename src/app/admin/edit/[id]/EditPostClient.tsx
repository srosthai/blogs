"use client"

import { useEffect, useState } from "react"
import { PostEditor } from "@/components/PostEditor"

interface Post {
  id: string
  title: string
  content: string
  slug: string
  tags: string
  image?: string
  published: boolean
  categoryId?: string | null
  postCategoryId?: string | null
}

interface EditPostClientProps {
  postId: string
}

export default function EditPostClient({ postId }: EditPostClientProps) {
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/admin/posts/${postId}`)
        
        if (response.ok) {
          const data = await response.json()
          
          // Extract categoryId and postCategoryId from related objects if they exist
          const processedData = {
            ...data,
            categoryId: data.category?.id || data.categoryId || null,
            postCategoryId: data.postCategory?.id || data.postCategoryId || null
          }
          setPost(processedData)
        } else {
          const errorData = await response.json()
          setError(errorData.error || 'Post not found')
        }
      } catch (error) {
        setError('Failed to load post')
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [postId])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="border-b bg-white dark:bg-gray-950">
          <div className="container mx-auto px-6 py-6">
            <div className="space-y-1">
              <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded animate-pulse w-48"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse w-64"></div>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-6 py-8">
          <div className="max-w-5xl mx-auto">
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-lg text-muted-foreground">Loading post...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-background">
        <div className="border-b bg-white dark:bg-gray-950">
          <div className="container mx-auto px-6 py-6">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold tracking-tight text-destructive">Error</h1>
              <p className="text-muted-foreground">Unable to load the post</p>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-6 py-8">
          <div className="max-w-5xl mx-auto">
            <div className="text-center py-16">
              <div className="text-6xl mb-4">⚠️</div>
              <h3 className="text-xl font-semibold mb-2 text-destructive">
                {error || 'Post not found'}
              </h3>
              <p className="text-muted-foreground mb-6">
                The post you're looking for doesn't exist or you don't have permission to edit it.
              </p>
              <a href="/admin" className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
                Back to Dashboard
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return <PostEditor initialData={post} isEditing />
}