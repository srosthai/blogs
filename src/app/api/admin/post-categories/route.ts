import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const status = searchParams.get('status')
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    const where: any = {}
    if (search) {
      where.name = search
    }
    if (status !== null && status !== '') {
      where.status = status === '1' || status === 'true'
    }

    const orderBy: any = {}
    orderBy[sortBy] = sortOrder

    const postCategories = await db.postCategory.findMany({
      where,
      orderBy
    })

    return NextResponse.json(postCategories)
  } catch (error) {
    console.error('Fetch post categories error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch post categories' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, description, image, status } = body

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      )
    }

    const postCategory = await db.postCategory.create({
      data: {
        name,
        description: description || '',
        image: image || null,
        status: status !== undefined ? Boolean(status) : true
      }
    })

    return NextResponse.json(postCategory, { status: 201 })
  } catch (error) {
    console.error('Create post category error:', error)
    return NextResponse.json(
      { error: 'Failed to create post category' },
      { status: 500 }
    )
  }
}