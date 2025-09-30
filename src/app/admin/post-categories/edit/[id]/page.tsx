"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Save, X, ImageIcon } from "lucide-react"
import { toast } from "sonner"

interface PostCategory {
  id: string
  name: string
  description: string
  image?: string
  status: boolean
}

export default function EditPostCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)
  const [uploadingImage, setUploadingImage] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [id, setId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
    status: true
  })

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
        const postCategory: PostCategory = await response.json()
        setFormData({
          name: postCategory.name,
          description: postCategory.description,
          image: postCategory.image || '',
          status: postCategory.status
        })
      } else {
        toast.error("Post category not found")
        router.push("/admin/post-categories")
      }
    } catch (error) {
      toast.error("Failed to load post category")
      router.push("/admin/post-categories")
    } finally {
      setFetchLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
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
        router.push("/admin/post-categories")
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

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleImageUpload = async (file: File) => {
    setUploadingImage(true)
    const uploadToast = toast.loading('Uploading image...')
    
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
      
      if (response.ok) {
        const data = await response.json()
        setFormData(prev => ({ ...prev, image: data.url }))
        toast.dismiss(uploadToast)
        toast.success('Image uploaded successfully!')
      } else {
        const error = await response.json()
        toast.dismiss(uploadToast)
        toast.error(error.error || 'Failed to upload image')
      }
    } catch (error) {
      console.error('Upload error:', error)
      toast.dismiss(uploadToast)
      toast.error('Failed to upload image')
    } finally {
      setUploadingImage(false)
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      handleImageUpload(file)
    }
  }

  const removeImage = () => {
    setFormData(prev => ({ ...prev, image: '' }))
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  if (fetchLoading) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <div className="text-center">Loading post category...</div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/post-categories">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Post Categories
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Edit Post Category</h1>
          <p className="text-muted-foreground">Update post category information</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Post Category Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                placeholder="Enter post category name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter post category description (optional)"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                rows={4}
              />
            </div>

            {/* Post Category Image Upload */}
            <div>
              <label className="block text-sm font-medium mb-2">Post Category Image</label>
              
              {formData.image ? (
                <div className="relative">
                  <div className="relative w-full h-48 rounded-lg overflow-hidden border">
                    <Image
                      src={formData.image}
                      alt="Post category image"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={removeImage}
                    className="absolute top-2 right-2"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingImage}
                    className="w-full h-32 border-dashed"
                  >
                    <div className="flex flex-col items-center space-y-2">
                      {uploadingImage ? (
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                      ) : (
                        <ImageIcon className="h-8 w-8 text-muted-foreground" />
                      )}
                      <span className="text-sm text-muted-foreground">
                        {uploadingImage ? 'Uploading...' : 'Click to upload post category image'}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        PNG, JPG, WebP up to 5MB
                      </span>
                    </div>
                  </Button>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="status"
                checked={formData.status}
                onCheckedChange={(checked) => handleInputChange("status", checked)}
              />
              <Label htmlFor="status">
                Active (Published and visible to users)
              </Label>
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={loading}>
                <Save className="w-4 h-4 mr-2" />
                {loading ? "Updating..." : "Update Post Category"}
              </Button>
              <Link href="/admin/post-categories">
                <Button type="button" variant="outline" disabled={loading}>
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}