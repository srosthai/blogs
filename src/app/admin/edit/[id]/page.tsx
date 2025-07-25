"use client"

import { useEffect, useState } from "react"
import { AdminAuthGuard } from "@/lib/admin-auth"
import { PostEditor } from "@/components/PostEditor"

interface Props {
  params: Promise<{
    id: string
  }>
}

interface Post {
  id: string
  title: string
  content: string
  slug: string
  tags: string
  image?: string
  published: boolean
}

function EditPostPage({ params }: { params: { id: string } }) {
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/admin/posts/${params.id}`)
        if (response.ok) {
          const data = await response.json()
          setPost(data)
        } else {
          setError('Post not found')
        }
      } catch (error) {
        console.error('Error fetching post:', error)
        setError('Failed to load post')
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [params.id])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading post...</div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-500">
          {error || 'Post not found'}
        </div>
      </div>
    )
  }

  return <PostEditor initialData={post} isEditing />
}

export default async function EditPostPageWrapper({ params }: Props) {
  const resolvedParams = await params
  
  return (
    <AdminAuthGuard>
      <EditPostPage params={resolvedParams} />
    </AdminAuthGuard>
  )
}