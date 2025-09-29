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
import { Upload, X, Image as ImageIcon } from "lucide-react"
import Image from "next/image"

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
  }
  isEditing?: boolean
}

export function PostEditor({ initialData, isEditing = false }: PostEditorProps) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    content: initialData?.content || '',
    slug: initialData?.slug || '',
    tags: initialData?.tags || '',
    image: initialData?.image || '',
    published: initialData?.published || false,
    categoryId: initialData?.categoryId || null,
  })
  const [loading, setLoading] = useState(false)
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

  const tagArray = formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(Boolean) : []

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">
            {isEditing ? 'Edit Post' : 'Create New Post'}
          </h1>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setPreviewMode(!previewMode)}
            >
              {previewMode ? 'Edit' : 'Preview'}
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push('/admin')}
            >
              Cancel
            </Button>
          </div>
        </div>

        {previewMode ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {formData.title || 'Untitled Post'}
                <Badge variant={formData.published ? "default" : "secondary"}>
                  {formData.published ? "Published" : "Draft"}
                </Badge>
              </CardTitle>
              {tagArray.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tagArray.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </CardHeader>
            <CardContent>
              {formData.image && (
                <div className="relative w-full h-64 rounded-lg overflow-hidden mb-6">
                  <Image
                    src={formData.image}
                    alt={formData.title || 'Featured image'}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="prose prose-slate max-w-none dark:prose-invert break-words">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight]}
                  components={{
                    // Code blocks (```code```)
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
                    // Inline code (`code`)
                    code: ({ children, className, ...props }) => {
                      // If it's inside a pre tag (code block), render normally
                      if (className?.includes('hljs')) {
                        return <code className={className} {...props}>{children}</code>
                      }
                      // If it's inline code, add copy functionality
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
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <Input
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Enter post title..."
                className="text-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Slug</label>
              <Input
                value={formData.slug}
                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                placeholder="post-slug-url"
              />
              <p className="text-sm text-muted-foreground mt-1">
                URL: /blog/{formData.slug || 'post-slug'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Tags</label>
              <Input
                value={formData.tags}
                onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                placeholder="javascript, react, nextjs (comma separated)"
              />
              {tagArray.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {tagArray.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <CategorySelect
              value={formData.categoryId}
              onValueChange={(categoryId) => setFormData(prev => ({ ...prev, categoryId }))}
              placeholder="Select a category (optional)"
            />

            {/* Featured Image Upload */}
            <div>
              <label className="block text-sm font-medium mb-2">Featured Image</label>
              
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
                    className="w-full h-32 border-dashed"
                  >
                    <div className="flex flex-col items-center space-y-2">
                      {uploadingImage ? (
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                      ) : (
                        <ImageIcon className="h-8 w-8 text-muted-foreground" />
                      )}
                      <span className="text-sm text-muted-foreground">
                        {uploadingImage ? 'Uploading...' : 'Click to upload featured image'}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        PNG, JPG, WebP up to 5MB
                      </span>
                    </div>
                  </Button>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Content</label>
              
              {/* Formatting Toolbar */}
              <div className="border rounded-t-md p-2 bg-muted/50 flex flex-wrap gap-2 mb-0">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => insertFormatting('# ', '', 'Heading 1')}
                  title="Heading 1"
                >
                  H1
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => insertFormatting('## ', '', 'Heading 2')}
                  title="Heading 2"
                >
                  H2
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => insertFormatting('### ', '', 'Heading 3')}
                  title="Heading 3"
                >
                  H3
                </Button>
                <div className="border-l mx-2" />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => insertFormatting('**', '**', 'bold text')}
                  title="Bold"
                >
                  <strong>B</strong>
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => insertFormatting('*', '*', 'italic text')}
                  title="Italic"
                >
                  <em>I</em>
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => insertFormatting('`', '`', 'inline code')}
                  title="Inline Code"
                >
                  {'</>'}
                </Button>
                <div className="border-l mx-2" />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => insertCodeBlock('javascript')}
                  title="JavaScript Code Block"
                >
                  JS
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => insertCodeBlock('typescript')}
                  title="TypeScript Code Block"
                >
                  TS
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => insertCodeBlock()}
                  title="Code Block"
                >
                  Code
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={insertCommand}
                  title="Command/Terminal"
                >
                  CMD
                </Button>
                <div className="border-l mx-2" />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => insertFormatting('- ', '', 'List item')}
                  title="Bullet List"
                >
                  •
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => insertFormatting('1. ', '', 'Numbered item')}
                  title="Numbered List"
                >
                  1.
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => insertFormatting('> ', '', 'Quote text')}
                  title="Quote"
                >
                  &quot;
                </Button>
              </div>
              
              <Textarea
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Write your post content here... (Markdown supported)"
                className="min-h-[400px] font-mono rounded-t-none border-t-0"
              />
              
              {/* Formatting Guide */}
              <div className="mt-2 text-sm text-muted-foreground">
                <details>
                  <summary className="cursor-pointer hover:text-foreground">Formatting Guide</summary>
                  <div className="mt-2 space-y-1 pl-4">
                    <p><code># Heading 1</code> → Large heading</p>
                    <p><code>## Heading 2</code> → Medium heading</p>
                    <p><code>**bold**</code> → <strong>bold text</strong></p>
                    <p><code>*italic*</code> → <em>italic text</em></p>
                    <p><code>`inline code`</code> → <code>inline code</code></p>
                    <p><code>```javascript</code> → Code blocks with syntax highlighting</p>
                    <p><code>- List item</code> → Bullet points</p>
                    <p><code>1. Numbered</code> → Numbered lists</p>
                    <p><code>&gt; Quote</code> → Block quotes</p>
                  </div>
                </details>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-4 mt-8">
          <Button
            onClick={() => handleSubmit(false)}
            variant="outline"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save as Draft'}
          </Button>
          <Button
            onClick={() => handleSubmit(true)}
            disabled={loading}
          >
            {loading ? 'Publishing...' : 'Publish'}
          </Button>
        </div>
      </div>
    </div>
  )
}