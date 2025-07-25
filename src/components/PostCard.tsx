import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, User, ArrowRight, BookOpen } from "lucide-react"

interface PostCardProps {
  id: string
  title: string
  content: string
  slug: string
  tags: string
  image?: string | null
  published: boolean
  createdAt: string | Date
  author: {
    name: string | null
  }
}

export function PostCard({ title, content, slug, tags, image, createdAt, author }: PostCardProps) {
  const tagArray = tags ? tags.split(',').map(tag => tag.trim()) : []
  
  // Get content preview with character limit  
  const getContentPreview = (markdownContent: string) => {
    // Remove markdown syntax for cleaner preview
    const cleanText = markdownContent
      .replace(/#{1,6}\s+/g, '') // Remove headers
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
      .replace(/\*(.*?)\*/g, '$1') // Remove italic
      .replace(/`(.*?)`/g, '$1') // Remove inline code
      .replace(/```[\s\S]*?```/g, '[Code Block]') // Replace code blocks
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links, keep text
      .replace(/\n+/g, ' ') // Replace newlines with spaces
      .trim()
    
    return cleanText.slice(0, 120) + (cleanText.length > 120 ? '...' : '')
  }

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    })
  }
  
  return (
    <Card className="flex h-full flex-col overflow-hidden p-0 shadow-sm transition-shadow hover:shadow-md">
      {/* Featured Image */}
      <div className="relative h-40 overflow-hidden sm:h-48 md:h-52">
        {image ? (
          <>
            <Image
              src={image}
              alt={title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 hover:scale-105"
            />
            {/* Primary tag overlay */}
            {tagArray.length > 0 && (
              <div className="absolute top-3 left-3">
                <Badge className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  {tagArray[0]}
                </Badge>
              </div>
            )}
          </>
        ) : (
          <div className="relative h-full bg-gradient-to-br from-primary/10 via-primary/5 to-secondary/10 flex items-center justify-center">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="p-3 rounded-full bg-primary/10 mb-2">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <p className="text-xs font-medium text-muted-foreground">Read Article</p>
            </div>
            {/* Primary tag for no-image cards */}
            {tagArray.length > 0 && (
              <div className="absolute top-3 left-3">
                <Badge className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  {tagArray[0]}
                </Badge>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <CardContent className="flex-grow p-4 sm:p-6">
        {/* Date and Author */}
        <div className="text-muted-foreground mb-2 flex items-center text-xs sm:mb-3 sm:text-sm">
          <Calendar className="mr-1 h-3 w-3" />
          <span className="mr-3">{formatDate(createdAt)}</span>
          <User className="mr-1 h-3 w-3" />
          <span>By {author.name}</span>
        </div>

        {/* Title */}
        <h3 className="mb-2 line-clamp-2 text-base font-semibold sm:text-lg leading-tight">
          <Link 
            href={`/blog/${slug}`}
            className="hover:text-primary transition-colors duration-200"
          >
            {title}
          </Link>
        </h3>

        {/* Content Preview */}
        <p className="text-muted-foreground line-clamp-2 text-xs sm:line-clamp-3 sm:text-sm leading-relaxed">
          {getContentPreview(content)}
        </p>

        {/* Additional Tags */}
        {tagArray.length > 1 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {tagArray.slice(1, 3).map((tag) => (
              <Badge 
                key={tag} 
                variant="outline" 
                className="text-xs px-2 py-0.5"
              >
                {tag}
              </Badge>
            ))}
            {tagArray.length > 3 && (
              <Badge 
                variant="outline" 
                className="text-xs px-2 py-0.5"
              >
                +{tagArray.length - 3}
              </Badge>
            )}
          </div>
        )}
      </CardContent>

      {/* Footer */}
      <CardFooter className="p-4 sm:p-6 pt-0">
        <Button
          variant="ghost"
          size="sm"
          className="w-full text-sm justify-center hover:bg-primary/5 hover:text-primary transition-colors"
          asChild
        >
          <Link href={`/blog/${slug}`} className="flex items-center">
            Read Article
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}