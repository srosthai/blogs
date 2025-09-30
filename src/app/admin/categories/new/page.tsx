"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { toast } from "sonner"
import { CategoryForm } from "@/components/forms/CategoryForm"

interface CategoryFormData {
  name: string
  description: string
  status: boolean
}

export default function NewCategoryPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (formData: CategoryFormData) => {
    if (!formData.name.trim()) {
      toast.error("Category name is required")
      return
    }

    setLoading(true)
    const loadingToast = toast.loading("Creating category...")

    try {
      const response = await fetch("/api/admin/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast.dismiss(loadingToast)
        toast.success("Category created successfully!")
        
        // Small delay to show success message before redirect
        setTimeout(() => {
          router.push("/admin/categories")
          router.refresh()
        }, 1000)
      } else {
        const error = await response.json()
        toast.dismiss(loadingToast)
        toast.error(error.error || "Failed to create category")
      }
    } catch (error) {
      toast.dismiss(loadingToast)
      toast.error("An error occurred while creating the category")
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
            <Link href="/admin/categories">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Categories
              </Button>
            </Link>
            <div className="space-y-1">
              <h1 className="text-3xl font-bold tracking-tight">Create New Category</h1>
              <p className="text-muted-foreground">Add a new category to organize your content</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <CategoryForm
          onSubmit={handleSubmit}
          loading={loading}
        />
      </div>
    </div>
  )
}