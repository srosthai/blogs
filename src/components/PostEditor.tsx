"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { PostForm } from '@/components/forms/PostForm'

interface PostEditorProps {
  initialData?: {
    id?: string
    title: string
    content: string
    slug: string
    tags: string
    image?: string
    published: boolean
    categoryId?: string | null
    postCategoryId?: string | null
  }
  isEditing?: boolean
}

export function PostEditor({ initialData, isEditing = false }: PostEditorProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (formData: any, published: boolean) => {
    setLoading(true)
    
    // Show loading toast
    const loadingToast = toast.loading(
      isEditing 
        ? `${published ? 'Publishing' : 'Saving'} post...` 
        : `${published ? 'Publishing' : 'Creating'} post...`
    )
    
    try {
      const url = isEditing ? `/api/admin/posts/${initialData?.id}` : '/api/admin/posts'
      const method = isEditing ? 'PATCH' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          published,
        }),
      })

      if (response.ok) {
        toast.dismiss(loadingToast)
        
        if (isEditing) {
          toast.success(published ? 'Post published successfully!' : 'Post updated successfully!')
        } else {
          toast.success(published ? 'Post created and published!' : 'Draft saved successfully!')
        }
        
        // Small delay to show success message before redirect
        setTimeout(() => {
          router.push('/admin')
          router.refresh()
        }, 1000)
      } else {
        const error = await response.json()
        toast.dismiss(loadingToast)
        toast.error(error.error || error.message || 'An error occurred')
      }
    } catch (error) {
      console.error('Error saving post:', error)
      toast.dismiss(loadingToast)
      toast.error('An error occurred while saving the post')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="border-b bg-white dark:bg-gray-950 sticky top-0 z-10">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold tracking-tight">
                {isEditing ? 'Edit Post' : 'Create New Post'}
              </h1>
              <p className="text-muted-foreground">
                {isEditing ? 'Update your post content and settings' : 'Write and publish your new blog post'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <PostForm
          initialData={initialData}
          onSubmit={handleSubmit}
          loading={loading}
        />
      </div>
    </div>
  )
}