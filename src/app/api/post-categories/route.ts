import { NextResponse } from 'next/server'
import { db } from '@/lib/prisma'

export async function GET() {
  try {
    const postCategories = await db.postCategory.findMany({
      where: {
        status: true // Only return active categories for public use
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Get post count for each category
    const postCategoriesWithCount = await Promise.all(
      postCategories.map(async (category: any) => {
        const posts = await db.post.findMany({
          where: {
            postCategoryId: category.id,
            published: true
          }
        })
        
        return {
          ...category,
          _count: {
            posts: posts.length
          }
        }
      })
    )

    return NextResponse.json(postCategoriesWithCount)
  } catch (error) {
    console.error('Error fetching post categories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch post categories' },
      { status: 500 }
    )
  }
}