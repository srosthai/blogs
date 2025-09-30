"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { toast } from "sonner"
import { PostCategoryForm } from "@/components/forms/PostCategoryForm"

interface PostCategory {
  id: string
  name: string
  description: string
  image?: string
  status: boolean
}

interface PostCategoryFormData {
  name: string
  description: string
  image: string
  status: boolean
}

export default function EditPostCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)
  const [id, setId] = useState<string | null>(null)
  const [postCategory, setPostCategory] = useState<PostCategory | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    params.then(({ id }) => {
      setId(id)
    })
  }, [params])

  useEffect(() => {
    if (id) {
      fetchPostCategory()
    }
  }, [id])

  const fetchPostCategory = async () => {
    if (!id) return
    
    try {
      setFetchLoading(true)
      const response = await fetch(`/api/admin/post-categories/${id}`)
      if (response.ok) {
        const postCategoryData: PostCategory = await response.json()
        setPostCategory(postCategoryData)
      } else {
        const errorData = await response.json()
        setError(errorData.error || "Post category not found")
      }
    } catch (error) {
      setError("Failed to load post category")
    } finally {
      setFetchLoading(false)
    }
  }

  const handleSubmit = async (formData: PostCategoryFormData) => {
    if (!formData.name.trim()) {
      toast.error("Post category name is required")
      return
    }

    setLoading(true)
    const loadingToast = toast.loading("Updating post category...")

    try {
      const response = await fetch(`/api/admin/post-categories/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast.dismiss(loadingToast)
        toast.success("Post category updated successfully!")
        
        // Small delay to show success message before redirect
        setTimeout(() => {
          router.push("/admin/post-categories")
          router.refresh()
        }, 1000)
      } else {
        const error = await response.json()
        toast.dismiss(loadingToast)
        toast.error(error.error || "Failed to update post category")
      }
    } catch (error) {
      toast.dismiss(loadingToast)
      toast.error("An error occurred while updating the post category")
    } finally {
      setLoading(false)
    }
  }

  if (fetchLoading) {
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
              <p className="text-lg text-muted-foreground">Loading post category...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !postCategory) {
    return (
      <div className="min-h-screen bg-background">
        <div className="border-b bg-white dark:bg-gray-950">
          <div className="container mx-auto px-6 py-6">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold tracking-tight text-destructive">Error</h1>
              <p className="text-muted-foreground">Unable to load the post category</p>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-6 py-8">
          <div className="max-w-5xl mx-auto">
            <div className="text-center py-16">
              <div className="text-6xl mb-4">⚠️</div>
              <h3 className="text-xl font-semibold mb-2 text-destructive">
                {error || 'Post category not found'}
              </h3>
              <p className="text-muted-foreground mb-6">
                The post category you're looking for doesn't exist or you don't have permission to edit it.
              </p>
              <Link href="/admin/post-categories">
                <Button className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Post Categories
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="border-b bg-white dark:bg-gray-950 sticky top-0 z-10">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center gap-4">
            <Link href="/admin/post-categories">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Post Categories
              </Button>
            </Link>
            <div className="space-y-1">
              <h1 className="text-3xl font-bold tracking-tight">Edit Post Category</h1>
              <p className="text-muted-foreground">Update post category information</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <PostCategoryForm
          initialData={{
            ...postCategory,
            image: postCategory.image || ""
          }}
          onSubmit={handleSubmit}
          loading={loading}
        />
      </div>
    </div>
  )
}