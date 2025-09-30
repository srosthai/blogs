import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user first to find their posts
    const user = await db.user.findUnique({
      where: { email: session.user.email }
    })
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const posts = await db.post.findMany({
      where: {
        authorId: user.id
      },
      include: {
        category: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(posts)
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { title, content, slug, tags, image, published, categoryId, postCategoryId } = await request.json()

    // Validate required fields
    if (!title || !content || !slug) {
      return NextResponse.json(
        { error: "Title, content, and slug are required" },
        { status: 400 }
      )
    }

    // Check if slug already exists
    const existingPost = await db.post.findUnique({
      where: { slug }
    })

    if (existingPost) {
      return NextResponse.json(
        { error: "A post with this slug already exists" },
        { status: 400 }
      )
    }

    // Find user (should exist since they're authenticated)
    const user = await db.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const post = await db.post.create({
      data: {
        title,
        content,
        slug,
        tags: tags || '',
        image: image || null,
        published: published || false,
        authorId: user.id,
        categoryId: categoryId || null,
        postCategoryId: postCategoryId || null,
      }
    })

    return NextResponse.json(post, { status: 201 })
  } catch (error: any) {
    console.error('Error creating post:', error)
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    )
  }
}