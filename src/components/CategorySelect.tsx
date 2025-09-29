"use client"

import { useState, useEffect } from "react"
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
  status: number
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

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/categories?status=1')
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
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
        value={value || "none"} 
        onValueChange={handleValueChange}
        disabled={loading}
      >
        <SelectTrigger>
          <SelectValue placeholder={loading ? "Loading..." : placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">No Category</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}