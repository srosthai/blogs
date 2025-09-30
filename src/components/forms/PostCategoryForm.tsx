"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Save, X, ImageIcon, Upload } from "lucide-react"
import { toast } from "sonner"

interface PostCategoryFormData {
  name: string
  description: string
  image: string
  status: boolean
}

interface PostCategoryFormProps {
  initialData?: {
    id?: string
    name: string
    description: string
    image?: string
    status: boolean
  }
  onSubmit: (formData: PostCategoryFormData) => Promise<void>
  loading?: boolean
}

export function PostCategoryForm({ initialData, onSubmit, loading = false }: PostCategoryFormProps) {
  const [formData, setFormData] = useState<PostCategoryFormData>({
    name: initialData?.name || "",
    description: initialData?.description || "",
    image: initialData?.image || "",
    status: initialData?.status ?? true
  })
  const [uploadingImage, setUploadingImage] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleInputChange = (field: keyof PostCategoryFormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(formData)
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

  return (
    <div className="max-w-5xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Main Form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Fields */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Post Category Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    placeholder="Enter post category name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="h-11"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    This will be the display name for your post category
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-medium">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Enter post category description (optional)"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    rows={4}
                    className="resize-none"
                  />
                  <p className="text-xs text-muted-foreground">
                    Brief description of what this post category represents
                  </p>
                </div>

                {/* Image Upload Section */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Category Image</Label>
                  
                  {formData.image ? (
                    <div className="relative">
                      <div className="relative w-full h-64 rounded-lg overflow-hidden border bg-gray-50 dark:bg-gray-900">
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
                        size="icon"
                        onClick={removeImage}
                        className="absolute top-3 right-3 h-8 w-8"
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
                        className="w-full h-40 border-2 border-dashed hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex flex-col items-center space-y-3">
                          {uploadingImage ? (
                            <>
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                              <span className="text-sm font-medium">Uploading...</span>
                            </>
                          ) : (
                            <>
                              <div className="p-3 bg-primary/10 rounded-lg">
                                <Upload className="h-6 w-6 text-primary" />
                              </div>
                              <div className="text-center">
                                <p className="text-sm font-medium">Click to upload image</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  PNG, JPG, WebP up to 5MB
                                </p>
                              </div>
                            </>
                          )}
                        </div>
                      </Button>
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Upload a representative image for this category
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Settings */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Publication Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="status" className="text-sm font-medium">
                        Publication Status
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        {formData.status 
                          ? "Category is active and visible to users" 
                          : "Category is inactive and hidden from users"
                        }
                      </p>
                    </div>
                    <Switch
                      id="status"
                      checked={formData.status}
                      onCheckedChange={(checked) => handleInputChange("status", checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <Button
                    type="submit"
                    disabled={loading || !formData.name.trim() || uploadingImage}
                    className="w-full h-11"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {loading 
                      ? (initialData?.id ? "Updating..." : "Creating...")
                      : (initialData?.id ? "Update Post Category" : "Create Post Category")
                    }
                  </Button>
                  
                  <div className="text-xs text-muted-foreground text-center">
                    <span className="text-destructive">*</span> Required fields
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Image Preview Card (when image exists) */}
            {formData.image && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Image Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative w-full aspect-video rounded-lg overflow-hidden border bg-gray-50 dark:bg-gray-900">
                    <Image
                      src={formData.image}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </form>
    </div>
  )
}