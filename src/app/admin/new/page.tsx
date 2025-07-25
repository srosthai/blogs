"use client"

import { AdminAuthGuard } from "@/lib/admin-auth"
import { PostEditor } from "@/components/PostEditor"

export default function NewPostPage() {
  return (
    <AdminAuthGuard>
      <PostEditor />
    </AdminAuthGuard>
  )
}