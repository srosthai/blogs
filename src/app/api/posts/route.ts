import { NextResponse } from "next/server"
import { db, supabase } from "@/lib/prisma"

export async function GET() {
  try {
    // Get posts with author information using Supabase join
    const { data: posts, error } = await supabase
      .from('Post')
      .select(`
        *,
        author:User(name)
      `)
      .eq('published', true)
      .order('createdAt', { ascending: false })
    
    if (error) throw error

    return NextResponse.json(posts || [])
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    )
  }
}