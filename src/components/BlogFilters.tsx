"use client"

import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input" 
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface BlogFiltersProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  selectedTags: string[]
  onTagToggle: (tag: string) => void
  availableTags: string[]
  onClearFilters: () => void
}

export function BlogFilters({
  searchQuery,
  onSearchChange,
  selectedTags,
  onTagToggle,
  availableTags,
  onClearFilters
}: BlogFiltersProps) {
  const hasActiveFilters = searchQuery.length > 0 || selectedTags.length > 0

  return (
    <div className="space-y-6 mb-8">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search posts by title or content..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 pr-4 py-2 text-base"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSearchChange("")}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-muted"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      {/* Tags Filter */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-foreground">Filter by Tags</h3>
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClearFilters}
              className="text-xs"
            >
              Clear All
            </Button>
          )}
        </div>
        
        {availableTags.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {availableTags.map((tag) => {
              const isSelected = selectedTags.includes(tag)
              return (
                <Badge
                  key={tag}
                  variant={isSelected ? "default" : "outline"}
                  className={`cursor-pointer transition-all hover:scale-105 ${
                    isSelected 
                      ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                      : "hover:bg-muted"
                  }`}
                  onClick={() => onTagToggle(tag)}
                >
                  {tag}
                  {isSelected && (
                    <X className="ml-1 h-3 w-3" />
                  )}
                </Badge>
              )
            })}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No tags available</p>
        )}
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <span className="shrink-0">Active filters:</span>
          {searchQuery && (
            <Badge variant="secondary" className="text-xs">
              Search: "{searchQuery.length > 20 ? searchQuery.slice(0, 20) + '...' : searchQuery}"
            </Badge>
          )}
          {selectedTags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              Tag: {tag}
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}