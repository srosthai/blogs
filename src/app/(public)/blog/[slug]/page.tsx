import { notFound } from "next/navigation"
import { supabase } from "@/lib/prisma"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Layers, Home } from "lucide-react"
import BackButton from "@/components/BackButton"

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
      author:User(name),
      category:PostCategory(id, name)
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

  // Strip HTML tags for description
  const stripHtml = (html: string) => {
    const tmp = html.replace(/<[^>]*>/g, '');
    return tmp.replace(/\s+/g, ' ').trim();
  }
  const description = stripHtml(post.content).slice(0, 160)
  const publishedTime = new Date(post.createdAt).toISOString()
  const modifiedTime = new Date(post.updatedAt || post.createdAt).toISOString()
  const tags = post.tags ? post.tags.split(',').map((tag: string) => tag.trim()) : []

  return {
    title: post.title,
    description,
    keywords: tags,
    authors: [{ name: post.author?.name || 'SrosThaiDev' }],
    openGraph: {
      title: post.title,
      description,
      type: 'article',
      publishedTime,
      modifiedTime,
      authors: [post.author?.name || 'SrosThaiDev'],
      tags,
      images: post.image ? [
        {
          url: post.image,
          width: 1200,
          height: 630,
          alt: post.title,
        }
      ] : [
        {
          url: '/me-fav.png',
          width: 1200,
          height: 630,
          alt: post.title,
        }
      ],
      url: `https://blog.srosthai.dev/blog/${slug}`,
      siteName: 'SrosThaiDev Blog',
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description,
      images: [post.image || '/me-fav.png'],
      creator: '@srosthai',
    },
    alternates: {
      canonical: `https://blog.srosthai.dev/blog/${slug}`,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params
  const post = await getPost(slug)

  if (!post) {
    notFound()
  }

  const tagArray = post.tags ? post.tags.split(',').map((tag: string) => tag.trim()) : []

  // Strip HTML tags for description
  const stripHtml = (html: string) => {
    const tmp = html.replace(/<[^>]*>/g, '');
    return tmp.replace(/\s+/g, ' ').trim();
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": stripHtml(post.content).slice(0, 160),
    "image": post.image || "https://blog.srosthai.dev/me-fav.png",
    "datePublished": new Date(post.createdAt).toISOString(),
    "dateModified": new Date(post.updatedAt || post.createdAt).toISOString(),
    "author": {
      "@type": "Person",
      "name": post.author?.name || "SrosThaiDev"
    },
    "publisher": {
      "@type": "Organization",
      "name": "SrosThaiDev Blog",
      "logo": {
        "@type": "ImageObject",
        "url": "https://blog.srosthai.dev/me-fav.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://blog.srosthai.dev/blog/${slug}`
    },
    "keywords": post.tags || "",
    "url": `https://blog.srosthai.dev/blog/${slug}`
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData)
        }}
      />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <BackButton 
            postCategoryId={post.category?.id || null}
            postCategoryName={post.category?.name || null}
          />
        </div>
        <article className="max-w-4xl mx-auto">
        <header className="mb-8">
          {/* Category Badge */}
          {post.category && (
            <div className="mb-4">
              <Link href={`/category/${post.category.id}`}>
                <Badge variant="outline" className="hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer">
                  <Layers className="h-3 w-3 mr-1" />
                  {post.category.name}
                </Badge>
              </Link>
            </div>
          )}
          
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
        
        {/* HTML Content from Summernote */}
        <div 
          className="prose prose-lg prose-slate max-w-none dark:prose-invert break-words
            prose-headings:scroll-mt-20
            prose-h1:text-3xl prose-h1:font-bold prose-h1:mb-4
            prose-h2:text-2xl prose-h2:font-semibold prose-h2:mb-3 prose-h2:mt-8
            prose-h3:text-xl prose-h3:font-semibold prose-h3:mb-2 prose-h3:mt-6
            prose-h4:text-lg prose-h4:font-semibold prose-h4:mb-2 prose-h4:mt-4
            prose-p:mb-4 prose-p:leading-7
            prose-ul:mb-4 prose-ul:ml-6 prose-ul:list-disc
            prose-ol:mb-4 prose-ol:ml-6 prose-ol:list-decimal
            prose-li:mb-1
            prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:my-4
            prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
            prose-pre:bg-muted prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto prose-pre:my-4
            prose-img:rounded-lg prose-img:shadow-md prose-img:my-6
            prose-table:my-4 prose-table:overflow-x-auto
            prose-th:border prose-th:border-border prose-th:px-3 prose-th:py-2 prose-th:bg-muted
            prose-td:border prose-td:border-border prose-td:px-3 prose-td:py-2
            prose-strong:font-bold
            prose-em:italic
            prose-a:text-primary prose-a:underline prose-a:underline-offset-2 hover:prose-a:text-primary/80
            [&_pre]:bg-[#1e1e1e] [&_pre]:text-[#d4d4d4]
            dark:[&_pre]:bg-[#0a0a0a]
            [&_pre_code]:bg-transparent [&_pre_code]:p-0
            [&_video]:max-w-full [&_video]:rounded-lg [&_video]:my-6
            [&_iframe]:max-w-full [&_iframe]:rounded-lg [&_iframe]:my-6"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
        </article>
      </div>
    </>
  )
}