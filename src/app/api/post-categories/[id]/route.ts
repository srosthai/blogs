import { NextResponse } from 'next/server'
import { db } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const postCategory = await db.postCategory.findUnique({
      where: {
        id: id
      }
    })

    // Check if category exists and is active
    if (!postCategory || !postCategory.status) {
      return NextResponse.json(
        { error: 'Post category not found' },
        { status: 404 }
      )
    }

    // Get posts for this category
    const posts = await db.post.findMany({
      where: {
        postCategoryId: id,
        published: true // Only include published posts
      },
      include: {
        author: {
          select: {
            name: true
          }
        },
        category: true,
        postCategory: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    const result = {
      ...postCategory,
      posts
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching post category:', error)
    return NextResponse.json(
      { error: 'Failed to fetch post category' },
      { status: 500 }
    )
  }
}