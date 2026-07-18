'use client'

import { createContext, useContext, useState, useEffect, ReactNode, Dispatch, SetStateAction } from 'react'

interface SidebarContextType {
  isCollapsed: boolean
  setIsCollapsed: Dispatch<SetStateAction<boolean>>
  mounted: boolean
  transitionEnabled: boolean
  title: string
  setTitle: Dispatch<SetStateAction<string>>
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

interface SidebarProviderProps {
  children: ReactNode
  initialCollapsed?: boolean
}

export function SidebarProvider({ children, initialCollapsed = false }: SidebarProviderProps) {
  const [isCollapsed, setIsCollapsed] = useState(initialCollapsed)
  const [mounted, setMounted] = useState(false)
  const [transitionEnabled, setTransitionEnabled] = useState(false)
  const [title, setTitle] = useState('')

  useEffect(() => {
    // Check localStorage on mount as a fallback/safeguard
    const savedState = localStorage.getItem('sidebar-collapsed')
    if (savedState !== null) {
      setIsCollapsed(savedState === 'true')
    }
    setMounted(true)

    const timer = setTimeout(() => {
      setTransitionEnabled(true)
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  // Sync state changes to storage and cookies
  useEffect(() => {
    if (!mounted) return
    localStorage.setItem('sidebar-collapsed', String(isCollapsed))
    document.cookie = `sidebar-collapsed=${isCollapsed}; path=/; max-age=31536000; SameSite=Lax`
  }, [isCollapsed, mounted])

  return (
    <SidebarContext.Provider
      value={{
        isCollapsed,
        setIsCollapsed,
        mounted,
        transitionEnabled,
        title,
        setTitle,
      }}
    >
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  const context = useContext(SidebarContext)
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider')
  }
  return context
}
