"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { toast } from "sonner"
import { PostCategoryForm } from "@/components/forms/PostCategoryForm"

interface PostCategoryFormData {
  name: string
  description: string
  image: string
  status: boolean
}

export default function NewPostCategoryPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (formData: PostCategoryFormData) => {
    if (!formData.name.trim()) {
      toast.error("Post category name is required")
      return
    }

    setLoading(true)
    const loadingToast = toast.loading("Creating post category...")

    try {
      const response = await fetch("/api/admin/post-categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast.dismiss(loadingToast)
        toast.success("Post category created successfully!")
        
        // Small delay to show success message before redirect
        setTimeout(() => {
          router.push("/admin/post-categories")
          router.refresh()
        }, 1000)
      } else {
        const error = await response.json()
        toast.dismiss(loadingToast)
        toast.error(error.error || "Failed to create post category")
      }
    } catch (error) {
      toast.dismiss(loadingToast)
      toast.error("An error occurred while creating the post category")
    } finally {
      setLoading(false)
    }
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
              <h1 className="text-3xl font-bold tracking-tight">Create New Post Category</h1>
              <p className="text-muted-foreground">Add a new post category to organize your content</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <PostCategoryForm
          onSubmit={handleSubmit}
          loading={loading}
        />
      </div>
    </div>
  )
}