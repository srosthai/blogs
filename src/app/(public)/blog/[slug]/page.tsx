import { notFound } from "next/navigation"
import { supabase } from "@/lib/prisma"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import { CodeBlock, InlineCode } from '@/components/CodeBlock'
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"

interface Props {
  params: Promise<{
    slug: string
  }>
}

async function getPost(slug: string) {
  const { data: post, error } = await supabase
    .from('Post')
    .select(`
      *,
      author:User(name)
    `)
    .eq('slug', slug)
    .eq('published', true)
    .single()
  
  if (error) return null
  return post
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const post = await getPost(slug)
  
  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  return {
    title: post.title,
    description: post.content.slice(0, 160),
  }
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params
  const post = await getPost(slug)

  if (!post) {
    notFound()
  }

  const tagArray = post.tags ? post.tags.split(',').map((tag: string) => tag.trim()) : []

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto mb-6">
        <Link href="/">
          <Button variant="ghost" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Blog List
          </Button>
        </Link>
      </div>
      <article className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          <div className="flex items-center gap-4 text-muted-foreground mb-4">
            <span>By {post.author?.name || 'Unknown Author'}</span>
            <span>•</span>
            <time>{new Date(post.createdAt).toLocaleDateString()}</time>
          </div>
          {tagArray.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tagArray.map((tag: string) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </header>
        
        {/* Featured Image */}
        {post.image && (
          <div className="relative w-full h-96 rounded-lg overflow-hidden mb-8">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}
        
        <div className="prose prose-lg prose-slate max-w-none dark:prose-invert break-words">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
            components={{
              // Code blocks (```code```)
              pre: ({ children, ...props }) => {
                const child = children as any
                if (child?.props?.className?.includes('hljs')) {
                  const code = child.props.children
                  let language = child.props.className?.match(/language-(\w+)/)?.[1]
                  
                  // Enhanced language detection for Laravel/Blade
                  if (language === 'blade' || language === 'laravel') {
                    // Add custom Blade syntax processing
                    const processedCode = code.replace(
                      /(\{\{|\{\!\!)(.*?)(\}\}|\!\!\})/g,
                      '<span class="hljs-blade-echo">$1$2$3</span>'
                    ).replace(
                      /@(\w+)(\([^)]*\))?/g,
                      '<span class="hljs-blade-directive">@$1</span><span class="hljs-blade-tag">$2</span>'
                    ).replace(
                      /\$(\w+)/g,
                      '<span class="hljs-blade-variable">$$1</span>'
                    )
                    
                    return (
                      <div className="code-block-container group">
                        <div className="code-block-header flex items-center justify-between px-4 py-2 bg-muted/50 border-b border-border rounded-t-lg text-xs font-medium text-muted-foreground">
                          <span className="uppercase tracking-wide">Laravel</span>
                        </div>
                        <pre className={`${child.props.className} !mt-0 !rounded-t-none`}>
                          <code 
                            className={child.props.className}
                            dangerouslySetInnerHTML={{ __html: processedCode }}
                          />
                        </pre>
                      </div>
                    )
                  }
                  
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
            {post.content}
          </ReactMarkdown>
        </div>
      </article>
    </div>
  )
}