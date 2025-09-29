import { AdminAuthGuard } from "@/lib/admin-auth"
import EditPostClient from "./EditPostClient"

interface Props {
  params: Promise<{
    id: string
  }>
}

export default async function EditPostPage({ params }: Props) {
  const { id } = await params
  
  return (
    <AdminAuthGuard>
      <EditPostClient postId={id} />
    </AdminAuthGuard>
  )
}