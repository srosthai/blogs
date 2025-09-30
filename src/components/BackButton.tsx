"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Layers, Home } from "lucide-react"
import Link from "next/link"

interface BackButtonProps {
  postCategoryId?: string | null
  postCategoryName?: string | null
}

export default function BackButton({ postCategoryId, postCategoryName }: BackButtonProps) {
  const router = useRouter()
  const [referrer, setReferrer] = useState<string | null>(null)

  useEffect(() => {
    // Get the referrer from document.referrer
    const ref = document.referrer
    setReferrer(ref)
  }, [])

  // Check if user came from a category page
  const cameFromCategory = referrer && referrer.includes('/category/')
  
  // Extract category ID from referrer if it's a category page
  const referrerCategoryId = cameFromCategory 
    ? referrer.split('/category/')[1]?.split('?')[0]?.split('#')[0]
    : null

  // Determine the best back destination
  const getBackDestination = () => {
    // If user came from a category page, go back to that category
    if (cameFromCategory && referrerCategoryId) {
      return `/category/${referrerCategoryId}`
    }
    
    // If the post has a category and user didn't come from category, suggest the post's category
    if (postCategoryId) {
      return `/category/${postCategoryId}`
    }
    
    // Default to homepage
    return "/"
  }

  const getBackText = () => {
    if (cameFromCategory && referrerCategoryId) {
      return "Back to Category"
    }
    
    if (postCategoryId && postCategoryName) {
      return `View ${postCategoryName} Category`
    }
    
    return "Back to Blog List"
  }

  const getBackIcon = () => {
    if (cameFromCategory || postCategoryId) {
      return <Layers className="h-4 w-4" />
    }
    
    return <Home className="h-4 w-4" />
  }

  const backDestination = getBackDestination()
  const backText = getBackText()
  const backIcon = getBackIcon()

  return (
    <div className="flex items-center gap-3 mb-6">
      <Link href={backDestination}>
        <Button variant="ghost" className="flex items-center gap-2 hover:gap-3 transition-all">
          <ArrowLeft className="h-4 w-4" />
          {backIcon}
          {backText}
        </Button>
      </Link>
      
      {/* Secondary navigation if we're showing category instead of home */}
      {(cameFromCategory || postCategoryId) && (
        <Link href="/">
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Home className="h-3 w-3" />
            Home
          </Button>
        </Link>
      )}
    </div>
  )
}