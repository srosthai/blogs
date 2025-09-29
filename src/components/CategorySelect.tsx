"use client"

import React, { useState, useEffect } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface Category {
  id: string
  name: string
  status: boolean
}

interface CategorySelectProps {
  value?: string | null
  onValueChange: (value: string | null) => void
  label?: string
  placeholder?: string
  required?: boolean
}

export function CategorySelect({ 
  value, 
  onValueChange, 
  label = "Category",
  placeholder = "Select a category",
  required = false 
}: CategorySelectProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCategories()
  }, [])

  const selectedCategory = categories.find(cat => cat.id === value)
  const displayValue = value === null || value === "none" ? "none" : value || "none"

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/categories?status=true')
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      }
    } catch (error) {
      // Silently handle error
    } finally {
      setLoading(false)
    }
  }

  const handleValueChange = (newValue: string) => {
    if (newValue === "none") {
      onValueChange(null)
    } else {
      onValueChange(newValue)
    }
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="category">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <Select 
        value={displayValue} 
        onValueChange={handleValueChange}
        disabled={loading}
      >
        <SelectTrigger>
          <SelectValue placeholder={loading ? "Loading..." : placeholder}>
            {loading ? "Loading..." : 
             selectedCategory ? selectedCategory.name : 
             value === null ? "No Category" : 
             placeholder}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">No Category</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              {category?.name || 'Unnamed Category'}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}