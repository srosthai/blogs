"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react'

type ViewMode = "grid" | "table"

interface AdminViewContextType {
  viewMode: ViewMode
  setViewMode: (mode: ViewMode) => void
  toggleViewMode: () => void
}

const AdminViewContext = createContext<AdminViewContextType | undefined>(undefined)

export function AdminViewProvider({ children }: { children: ReactNode }) {
  const [viewMode, setViewMode] = useState<ViewMode>("table")

  const toggleViewMode = () => {
    setViewMode(prev => prev === "table" ? "grid" : "table")
  }

  return (
    <AdminViewContext.Provider value={{
      viewMode,
      setViewMode,
      toggleViewMode
    }}>
      {children}
    </AdminViewContext.Provider>
  )
}

export function useAdminView() {
  const context = useContext(AdminViewContext)
  if (context === undefined) {
    throw new Error('useAdminView must be used within an AdminViewProvider')
  }
  return context
}