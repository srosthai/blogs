"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { CategorySelect } from '@/components/CategorySelect'
import { PostCategorySelect } from '@/components/PostCategorySelect'
import { RichTextEditor } from '@/components/RichTextEditor'
import { X, Image as ImageIcon } from "lucide-react"
import Image from "next/image"

interface PostFormData {
  title: string
  content: string
  slug: string
  tags: string
  image: string
  published: boolean
  categoryId: string | null
  postCategoryId: string | null
}

interface PostFormProps {
  initialData?: Partial<PostFormData> & { id?: string }
  onSubmit: (data: PostFormData, published: boolean) => Promise<void>
  loading?: boolean
}

export function PostForm({ initialData, onSubmit, loading = false }: PostFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState<PostFormData>({
    title: initialData?.title || '',
    content: initialData?.content || '',
    slug: initialData?.slug || '',
    tags: initialData?.tags || '',
    image: initialData?.image || '',
    published: initialData?.published || false,
    categoryId: initialData?.categoryId || null,
    postCategoryId: initialData?.postCategoryId || null,
  })
  const [previewMode, setPreviewMode] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      // Auto-generate slug only if it's empty or matches the previous title's slug
      slug: (!prev.slug || prev.slug === generateSlug(prev.title)) ? generateSlug(title) : prev.slug
    }))
  }

  const handleSubmit = async (published: boolean) => {
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error('Please fill in title and content')
      return
    }

    if (!formData.slug.trim()) {
      toast.error('Please provide a URL slug')
      return
    }

    await onSubmit(formData, published)
  }

  const handleImageUpload = async (file: File): Promise<string> => {
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
        toast.dismiss(uploadToast)
        toast.success('Image uploaded successfully!')
        return data.url
      } else {
        const error = await response.json()
        toast.dismiss(uploadToast)
        toast.error(error.error || 'Failed to upload image')
        throw new Error(error.error || 'Failed to upload image')
      }
    } catch (error) {
      console.error('Upload error:', error)
      toast.dismiss(uploadToast)
      toast.error('Failed to upload image')
      throw error
    } finally {
      setUploadingImage(false)
    }
  }

  const handleFeaturedImageUpload = async (file: File) => {
    try {
      const url = await handleImageUpload(file)
      setFormData(prev => ({ ...prev, image: url }))
    } catch (error) {
      // Error already handled in handleImageUpload
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      handleFeaturedImageUpload(file)
    }
  }

  const removeImage = () => {
    setFormData(prev => ({ ...prev, image: '' }))
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }


  const tagArray = formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(Boolean) : []

  return (
    <div className="w-full max-w-7xl mx-auto">
      {previewMode ? (
        <div className="bg-white dark:bg-gray-950 rounded-xl border p-8">
          <div className="mb-6 pb-6 border-b">
            <h2 className="text-2xl font-bold mb-2">{formData.title || 'Untitled Post'}</h2>
            <div className="flex items-center gap-3">
              <Badge variant={formData.published ? "default" : "secondary"} className="text-sm">
                {formData.published ? "Published" : "Draft"}
              </Badge>
              {tagArray.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tagArray.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {formData.image && (
            <div className="relative w-full h-80 rounded-xl overflow-hidden mb-8 border">
              <Image
                src={formData.image}
                alt={formData.title || 'Featured image'}
                fill
                className="object-cover"
              />
            </div>
          )}
          
          <div className="prose prose-slate max-w-none dark:prose-invert break-words prose-lg">
            <div dangerouslySetInnerHTML={{ __html: formData.content || '<p>Start writing your content...</p>' }} />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            {/* Basic Information */}
            <div className="bg-white dark:bg-gray-950 rounded-xl border p-6 space-y-6">
              <h2 className="text-xl font-semibold border-b pb-3">Basic Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-3">Title *</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="Enter your post title..."
                    className="text-lg h-12 text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-3">URL Slug *</label>
                  <Input
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    placeholder="post-url-slug"
                    className="h-11 font-mono text-sm"
                  />
                  <p className="text-sm text-muted-foreground mt-2 bg-gray-50 dark:bg-gray-900 p-2 rounded border">
                    <span className="font-medium">Preview URL:</span> /blog/{formData.slug || 'your-post-slug'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-3">Tags</label>
                  <Input
                    value={formData.tags}
                    onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                    placeholder="javascript, react, nextjs, tutorial (comma separated)"
                    className="h-11"
                  />
                  {tagArray.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3 p-3 bg-gray-50 dark:bg-gray-900 rounded border">
                      {tagArray.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Content Editor */}
            <div className="bg-white dark:bg-gray-950 rounded-xl border p-6 space-y-6">
              <h2 className="text-xl font-semibold border-b pb-3">Content</h2>
              
              <RichTextEditor
                value={formData.content}
                onChange={(content) => setFormData(prev => ({ ...prev, content }))}
                placeholder="Start writing your post content..."
                height="500"
                onImageUpload={handleImageUpload}
              />
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Categories */}
            <div className="bg-white dark:bg-gray-950 rounded-xl border p-6 space-y-4">
              <h3 className="font-semibold border-b pb-3">Categories</h3>
              <div className="space-y-4">
                <CategorySelect
                  value={formData.categoryId}
                  onValueChange={(categoryId) => setFormData(prev => ({ ...prev, categoryId }))}
                  placeholder="Select a category (optional)"
                  label="Category"
                />

                <PostCategorySelect
                  value={formData.postCategoryId}
                  onValueChange={(postCategoryId) => setFormData(prev => ({ ...prev, postCategoryId }))}
                  placeholder="Select a post category (optional)"
                  label="Post Category"
                />
              </div>
            </div>
            
            {/* Featured Image */}
            <div className="bg-white dark:bg-gray-950 rounded-xl border p-6 space-y-4">
              <h3 className="font-semibold border-b pb-3">Featured Image</h3>
              
              {formData.image ? (
                <div className="relative">
                  <div className="relative w-full h-48 rounded-lg overflow-hidden border">
                    <Image
                      src={formData.image}
                      alt="Featured image"
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
                    className="w-full h-32 border-dashed hover:bg-gray-50 dark:hover:bg-gray-900"
                  >
                    <div className="flex flex-col items-center space-y-2">
                      {uploadingImage ? (
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                      ) : (
                        <ImageIcon className="h-8 w-8 text-muted-foreground" />
                      )}
                      <span className="text-sm text-muted-foreground font-medium">
                        {uploadingImage ? 'Uploading...' : 'Upload Featured Image'}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        PNG, JPG, WebP up to 5MB
                      </span>
                    </div>
                  </Button>
                </div>
              )}
            </div>
          </div>

        </div>
      )}

      {/* Action Buttons */}
      <div className="sticky bottom-6 left-0 right-0 z-20">
        <div className="bg-white dark:bg-gray-950 border rounded-xl p-6 shadow-lg mx-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="flex gap-3 flex-1 w-full">
              <Button
                onClick={() => setPreviewMode(!previewMode)}
                variant="outline"
                size="lg"
                className="flex-1"
                disabled={loading}
              >
                {previewMode ? 'Edit Mode' : 'Preview Mode'}
              </Button>
              <Button
                onClick={() => router.push('/admin')}
                variant="outline"
                size="lg"
                className="flex-1"
                disabled={loading}
              >
                Cancel
              </Button>
            </div>
            <div className="flex gap-3 flex-1 w-full">
              <Button
                onClick={() => handleSubmit(false)}
                variant="outline"
                disabled={loading}
                size="lg"
                className="flex-1"
              >
                {loading ? 'Saving...' : 'Save as Draft'}
              </Button>
              <Button
                onClick={() => handleSubmit(true)}
                disabled={loading}
                size="lg"
                className="flex-1 bg-primary hover:bg-primary/90"
              >
                {loading ? 'Publishing...' : 'Publish Post'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}