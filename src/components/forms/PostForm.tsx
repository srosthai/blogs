"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import { toast } from "sonner"
import { CodeBlock, InlineCode } from '@/components/CodeBlock'
import { CategorySelect } from '@/components/CategorySelect'
import { PostCategorySelect } from '@/components/PostCategorySelect'
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
      slug: prev.slug || generateSlug(title)
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

  // Format insertion functions
  const insertFormatting = (before: string, after: string = '', placeholder: string = '') => {
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = formData.content.substring(start, end)
    const replacement = selectedText || placeholder
    
    const newContent = 
      formData.content.substring(0, start) + 
      before + replacement + after + 
      formData.content.substring(end)
    
    setFormData(prev => ({ ...prev, content: newContent }))
    
    // Set cursor position
    setTimeout(() => {
      const newPos = start + before.length + replacement.length
      textarea.setSelectionRange(newPos, newPos)
      textarea.focus()
    }, 0)
  }

  const insertCodeBlock = (language: string = '') => {
    insertFormatting(`\`\`\`${language}\n`, '\n```', 'Your code here')
  }

  const insertCommand = () => {
    insertFormatting('```bash\n', '\n```', '$ your-command-here')
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
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
              components={{
                pre: ({ children, ...props }) => {
                  const child = children as any
                  if (child?.props?.className?.includes('hljs')) {
                    const code = child.props.children
                    const language = child.props.className?.match(/language-(\w+)/)?.[1]
                    return (
                      <CodeBlock className={child.props.className} language={language}>
                        {code}
                      </CodeBlock>
                    )
                  }
                  return <pre {...props}>{children}</pre>
                },
                code: ({ children, className, ...props }) => {
                  if (className?.includes('hljs')) {
                    return <code className={className} {...props}>{children}</code>
                  }
                  return (
                    <InlineCode className={className}>
                      {String(children)}
                    </InlineCode>
                  )
                }
              }}
            >
              {formData.content || 'Start writing your content...'}
            </ReactMarkdown>
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
              
              {/* Formatting Toolbar */}
              <div className="border rounded-lg p-3 bg-gray-50 dark:bg-gray-900">
                <div className="flex flex-wrap gap-2">
                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => insertFormatting('# ', '', 'Heading 1')}
                      title="Heading 1"
                      className="h-8 px-2"
                    >
                      H1
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => insertFormatting('## ', '', 'Heading 2')}
                      title="Heading 2"
                      className="h-8 px-2"
                    >
                      H2
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => insertFormatting('### ', '', 'Heading 3')}
                      title="Heading 3"
                      className="h-8 px-2"
                    >
                      H3
                    </Button>
                  </div>
                  
                  <div className="border-l mx-2" />
                  
                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => insertFormatting('**', '**', 'bold text')}
                      title="Bold"
                      className="h-8 px-2"
                    >
                      <strong>B</strong>
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => insertFormatting('*', '*', 'italic text')}
                      title="Italic"
                      className="h-8 px-2"
                    >
                      <em>I</em>
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => insertFormatting('`', '`', 'inline code')}
                      title="Inline Code"
                      className="h-8 px-2"
                    >
                      {'</>'}
                    </Button>
                  </div>
                  
                  <div className="border-l mx-2" />
                  
                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => insertCodeBlock('javascript')}
                      title="JavaScript Code Block"
                      className="h-8 px-2"
                    >
                      JS
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => insertCodeBlock('typescript')}
                      title="TypeScript Code Block"
                      className="h-8 px-2"
                    >
                      TS
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => insertCodeBlock()}
                      title="Code Block"
                      className="h-8 px-2"
                    >
                      Code
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={insertCommand}
                      title="Command/Terminal"
                      className="h-8 px-2"
                    >
                      CMD
                    </Button>
                  </div>
                  
                  <div className="border-l mx-2" />
                  
                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => insertFormatting('- ', '', 'List item')}
                      title="Bullet List"
                      className="h-8 px-2"
                    >
                      •
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => insertFormatting('1. ', '', 'Numbered item')}
                      title="Numbered List"
                      className="h-8 px-2"
                    >
                      1.
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => insertFormatting('> ', '', 'Quote text')}
                      title="Quote"
                      className="h-8 px-2"
                    >
                      &quot;
                    </Button>
                  </div>
                  
                  <div className="border-l mx-2" />
                  
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setPreviewMode(!previewMode)}
                    title="Toggle Preview"
                    className="h-8 px-3"
                  >
                    {previewMode ? 'Edit' : 'Preview'}
                  </Button>
                </div>
              </div>
              
              <Textarea
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Write your post content here... (Markdown supported)"
                className="min-h-[500px] font-mono text-sm leading-relaxed resize-none"
              />
              
              {/* Formatting Guide */}
              <div className="text-sm text-muted-foreground">
                <details>
                  <summary className="cursor-pointer hover:text-foreground font-medium">Markdown Formatting Guide</summary>
                  <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 pl-4">
                    <div className="space-y-1">
                      <p><code className="bg-gray-100 dark:bg-gray-800 px-1 rounded"># Heading 1</code> → Large heading</p>
                      <p><code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">## Heading 2</code> → Medium heading</p>
                      <p><code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">**bold**</code> → <strong>bold text</strong></p>
                      <p><code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">*italic*</code> → <em>italic text</em></p>
                    </div>
                    <div className="space-y-1">
                      <p><code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">`inline code`</code> → <code>inline code</code></p>
                      <p><code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">```javascript</code> → Code blocks</p>
                      <p><code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">- List item</code> → Bullet points</p>
                      <p><code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">&gt; Quote</code> → Block quotes</p>
                    </div>
                  </div>
                </details>
              </div>
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