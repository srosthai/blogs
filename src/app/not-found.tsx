import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function GlobalNotFound() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
        <p className="text-muted-foreground mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="space-x-4">
          <Link href="/">
            <Button>Back to Home</Button>
          </Link>
          <Link href="/tags">
            <Button variant="outline">Browse Posts</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}