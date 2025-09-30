"use client"

import React, { useState, useEffect } from "react"
import { Check, ChevronsUpDown, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Label } from "@/components/ui/label"

interface PostCategory {
  id: string
  name: string
  image?: string
  status: boolean
}

interface PostCategorySelectProps {
  value?: string | null
  onValueChange: (value: string | null) => void
  label?: string
  placeholder?: string
  required?: boolean
  searchable?: boolean
  className?: string
}

export function PostCategorySelect({ 
  value, 
  onValueChange, 
  label = "Post Category",
  placeholder = "Select a post category",
  required = false,
  searchable = true,
  className
}: PostCategorySelectProps) {
  const [postCategories, setPostCategories] = useState<PostCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [searchValue, setSearchValue] = useState("")

  useEffect(() => {
    fetchPostCategories()
  }, [])

  const selectedPostCategory = postCategories.find(cat => cat.id === value)
  
  const filteredPostCategories = postCategories.filter(postCategory =>
    postCategory.name.toLowerCase().includes(searchValue.toLowerCase())
  )

  const fetchPostCategories = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/post-categories?status=true')
      if (response.ok) {
        const data = await response.json()
        setPostCategories(data)
      }
    } catch (error) {
      // Silently handle error
    } finally {
      setLoading(false)
    }
  }

  const handleSelect = (postCategoryId: string) => {
    if (postCategoryId === value) {
      onValueChange(null)
    } else {
      onValueChange(postCategoryId === "none" ? null : postCategoryId)
    }
    setOpen(false)
  }

  const clearSelection = (e: React.MouseEvent) => {
    e.stopPropagation()
    onValueChange(null)
  }

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label htmlFor="post-category">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between h-10 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={loading}
          >
            <span className="truncate">
              {loading
                ? "Loading..."
                : selectedPostCategory
                ? selectedPostCategory.name
                : placeholder}
            </span>
            <div className="flex items-center gap-1">
              {selectedPostCategory && (
                <X
                  className="h-4 w-4 opacity-50 hover:opacity-100 transition-opacity"
                  onClick={clearSelection}
                />
              )}
              <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            {searchable && (
              <CommandInput
                placeholder="Search post categories..."
                className="h-9"
                value={searchValue}
                onValueChange={setSearchValue}
              />
            )}
            <CommandEmpty style={{ display: filteredPostCategories.length === 0 ? 'block' : 'none' }}>
              No post category found.
            </CommandEmpty>
            <CommandGroup className="max-h-64 overflow-auto">
              <CommandItem
                onSelect={() => handleSelect("none")}
                className="flex items-center gap-2"
              >
                <Check
                  className={cn(
                    "h-4 w-4",
                    !value ? "opacity-100" : "opacity-0"
                  )}
                />
                <span className="text-muted-foreground">No Post Category</span>
              </CommandItem>
              {filteredPostCategories.map((postCategory) => (
                <CommandItem
                  key={postCategory.id}
                  onSelect={() => handleSelect(postCategory.id)}
                  className="flex items-center gap-2"
                >
                  <Check
                    className={cn(
                      "h-4 w-4",
                      value === postCategory.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <span className="truncate">
                    {postCategory?.name || 'Unnamed Post Category'}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}