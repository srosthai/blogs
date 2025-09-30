import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const postCategory = await db.postCategory.findUnique({
      where: { id }
    })

    if (!postCategory) {
      return NextResponse.json(
        { error: 'Post category not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(postCategory)
  } catch (error) {
    console.error('Fetch post category error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch post category' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { name, description, image, status } = body

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      )
    }

    const postCategory = await db.postCategory.update({
      where: { id },
      data: {
        name,
        description: description || '',
        image: image || null,
        status: status !== undefined ? Boolean(status) : true
      }
    })

    return NextResponse.json(postCategory)
  } catch (error) {
    console.error('Update post category error:', error)
    return NextResponse.json(
      { error: 'Failed to update post category' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    await db.postCategory.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Post category deleted successfully' })
  } catch (error) {
    console.error('Delete post category error:', error)
    return NextResponse.json(
      { error: 'Failed to delete post category' },
      { status: 500 }
    )
  }
}