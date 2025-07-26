import { Heart, Github, Twitter, Linkedin, Mail } from "lucide-react"
import Link from "next/link"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative border-t bg-gradient-to-r from-background via-background to-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 mt-16">
      {/* Decorative gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      <div className="container mx-auto px-4 py-12">
        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
            <span>&copy; {currentYear} My Blog. All rights reserved.</span>
          </div>
          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
            <span className="font-medium text-foreground hover:text-primary transition-colors cursor-pointer">
              SROS THAI
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}