"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface CodeBlockProps {
  children: string
  className?: string
  language?: string
}

export function CodeBlock({ children, className, language }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(children)
      setCopied(true)
      toast.success('Code copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
      toast.error('Failed to copy code')
    }
  }

  // Extract language from className (e.g., "language-javascript" -> "javascript")
  const lang = language || className?.replace('language-', '') || 'text'

  return (
    <div className="relative group code-block-container">
      {/* Language label and copy button */}
      <div className="code-block-header flex items-center justify-between px-4 py-2 bg-muted/50 border-b border-border rounded-t-lg text-xs font-medium text-muted-foreground">
        <span className="uppercase tracking-wide">{lang}</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={copyToClipboard}
          className="h-6 w-6 p-0 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity hover:bg-muted"
          title="Copy code"
        >
          {copied ? (
            <Check className="h-3 w-3 text-green-500" />
          ) : (
            <Copy className="h-3 w-3" />
          )}
        </Button>
      </div>
      
      {/* Code content */}
      <pre className={`${className} !mt-0 !rounded-t-none`}>
        <code className={className}>{children}</code>
      </pre>
    </div>
  )
}

interface InlineCodeProps {
  children: string
  className?: string
}

export function InlineCode({ children, className }: InlineCodeProps) {
  const [copied, setCopied] = useState(false)
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(children)
      setCopied(true)
      toast.success('Code copied!')
      setTimeout(() => setCopied(false), 1000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
      toast.error('Failed to copy')
    }
  }

  return (
    <span className="relative group inline-flex items-center">
      <code className={`${className} pr-6`}>{children}</code>
      <Button
        variant="ghost"
        size="sm"
        onClick={copyToClipboard}
        className="h-4 w-4 p-0 absolute right-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity hover:bg-muted rounded-sm"
        title="Copy"
      >
        {copied ? (
          <Check className="h-2.5 w-2.5 text-green-500" />
        ) : (
          <Copy className="h-2.5 w-2.5" />
        )}
      </Button>
    </span>
  )
}