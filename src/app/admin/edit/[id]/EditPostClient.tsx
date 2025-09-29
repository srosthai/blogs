"use client"

import { useEffect, useState } from "react"
import { PostEditor } from "@/components/PostEditor"

interface Post {
  id: string
  title: string
  content: string
  slug: string
  tags: string
  image?: string
  published: boolean
  categoryId?: string | null
}

interface EditPostClientProps {
  postId: string
}

export default function EditPostClient({ postId }: EditPostClientProps) {
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/admin/posts/${postId}`)
        
        if (response.ok) {
          const data = await response.json()
          
          // Extract categoryId from category object if it exists
          const processedData = {
            ...data,
            categoryId: data.category?.id || data.categoryId || null
          }
          setPost(processedData)
        } else {
          const errorData = await response.json()
          setError(errorData.error || 'Post not found')
        }
      } catch (error) {
        setError('Failed to load post')
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [postId])

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