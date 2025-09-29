import { supabase } from "@/lib/prisma"
import { PostCard } from "@/components/PostCard"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tags, Hash, BookOpen, Filter, Sparkles } from "lucide-react"
import Link from "next/link"

interface Props {
  searchParams: Promise<{
    tag?: string
  }>
}

async function getAllTags() {
  const { data: posts, error } = await supabase
    .from('Post')
    .select('tags')
    .eq('published', true)

  if (error) return []

  const allTags = new Set<string>()
  posts?.forEach(post => {
    if (post.tags) {
      post.tags.split(',').forEach((tag: string) => {
        allTags.add(tag.trim())
      })
    }
  })

  return Array.from(allTags).sort()
}

async function getPostsByTag(tag?: string) {
  let query = supabase
    .from('Post')
    .select(`
      *,
      author:User(name)
    `)
    .eq('published', true)
    .order('createdAt', { ascending: false })

  if (tag) {
    query = query.ilike('tags', `%${tag}%`)
  }

  const { data: posts, error } = await query
  
  if (error) return []
  return posts || []
}

export default async function TagsPage({ searchParams }: Props) {
  const { tag: selectedTag } = await searchParams
  const allTags = await getAllTags()
  const posts = await getPostsByTag(selectedTag)

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-6 py-8">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Tags className="h-8 w-8 text-primary animate-pulse" />
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
            Browse by Tags
          </h1>
          <Hash className="h-8 w-8 text-primary animate-pulse" />
        </div>
        
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          {selectedTag 
            ? `Discover all posts tagged with "${selectedTag}"` 
            : 'Explore posts organized by topics and technologies'
          }
        </p>
        
        {/* <Card className="max-w-md mx-auto bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
          <CardContent className="flex items-center justify-center space-x-6 py-4">
            <div className="flex items-center space-x-2">
              <Hash className="h-5 w-5 text-primary" />
              <span className="font-semibold">{allTags.length} Tags</span>
            </div>
            <div className="h-4 w-px bg-border"></div>
            <div className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <span className="font-semibold">{posts.length} Posts</span>
            </div>
          </CardContent>
        </Card> */}
      </div>

      {/* Tags Filter Section */}
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filter by Tag</span>
            {selectedTag && (
              <Badge variant="secondary" className="ml-auto">
                {selectedTag}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button variant={!selectedTag ? "default" : "outline"} size="sm" asChild>
              <Link href="/tags" className="flex items-center space-x-1">
                <Sparkles className="h-3 w-3" />
                <span>All Posts</span>
              </Link>
            </Button>
            {allTags.map((tag) => (
              <Button 
                key={tag} 
                variant={selectedTag === tag ? "default" : "outline"} 
                size="sm" 
                asChild
              >
                <Link href={`/tags?tag=${encodeURIComponent(tag)}`} className="flex items-center space-x-1">
                  <Hash className="h-3 w-3" />
                  <span>{tag}</span>
                </Link>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Posts Section */}
      <div className="max-w-6xl mx-auto">
        {posts.length === 0 ? (
          <Card className="max-w-md mx-auto">
            <CardContent className="text-center py-12">
              <Tags className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold mb-4">No posts found</h2>
              <p className="text-muted-foreground mb-6">
                {selectedTag 
                  ? `No posts are tagged with "${selectedTag}"`
                  : 'No posts available'
                }
              </p>
              {selectedTag && (
                <Button variant="outline" asChild>
                  <Link href="/tags">View All Tags</Link>
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold flex items-center space-x-2">
                <BookOpen className="h-6 w-6" />
                <span>
                  {selectedTag ? `Posts tagged "${selectedTag}"` : 'All Posts'}
                </span>
              </h2>
              <Badge variant="outline" className="flex items-center space-x-1">
                <span>{posts.length} post{posts.length !== 1 ? 's' : ''}</span>
              </Badge>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <PostCard key={post.id} {...post} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}