'use client'

import { ReactNode, useState, useEffect } from 'react'
import Sidebar from './Sidebar'
import Navbar from './Navbar'

interface DashboardLayoutProps {
  children: ReactNode
  title?: string
}

// Module-level variable to store the sidebar state across client-side page transitions.
// This survives route navigations since the bundle remains loaded in the browser.
let globalIsCollapsed: boolean | null = null

export default function DashboardLayout({ children, title }: DashboardLayoutProps) {
  // Initialize state synchronously if on client, to prevent visual jumps on navigation
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      if (globalIsCollapsed !== null) {
        return globalIsCollapsed
      }
      const savedState = localStorage.getItem('sidebar-collapsed')
      return savedState === 'true'
    }
    return false
  })

  const [isMobileOpen, setIsMobileOpen] = useState(false)

  // Initialize mounted state to true immediately if we've already mounted once on the client,
  // which prevents any visual transition/delay on client-side routing.
  const [mounted, setMounted] = useState(() => {
    return typeof window !== 'undefined' && globalIsCollapsed !== null
  })

  // Synchronize with localStorage on initial render (flicker-free hydration guard)
  useEffect(() => {
    const savedState = localStorage.getItem('sidebar-collapsed')
    const parsedState = savedState === 'true'
    setIsCollapsed(parsedState)
    globalIsCollapsed = parsedState
    setMounted(true)
  }, [])

  const toggleSidebar = () => {
    if (window.innerWidth >= 1024) {
      setIsCollapsed((prev) => {
        const next = !prev
        localStorage.setItem('sidebar-collapsed', String(next))
        globalIsCollapsed = next
        return next
      })
    } else {
      setIsMobileOpen((prev) => !prev)
    }
  }

  const handleExpandRequest = () => {
    setIsCollapsed(false)
    localStorage.setItem('sidebar-collapsed', 'false')
    globalIsCollapsed = false
  }

  // To prevent visual jump/flicker during initial page hydration,
  // we align with the default expanded layout (260px) and transition smoothly only after mount.
  const sidebarWidthClass = isCollapsed ? 'lg:pl-[80px]' : 'lg:pl-[220px]'

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 overflow-x-hidden">
      {/* Collapsible Sidebar */}
      <Sidebar
        isCollapsed={isCollapsed}
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
        onExpandRequest={handleExpandRequest}
      />

      {/* Main Panel Content Area */}
      <div
        className={`flex flex-col min-h-screen ${
          mounted ? 'transition-all duration-300 ease-in-out' : ''
        } ${mounted ? sidebarWidthClass : 'lg:pl-[220px]'}`}
      >
        <Navbar title={title} onMenuClick={toggleSidebar} />
        <main className="flex-1 p-4 md:p-8 w-full transition-all">
          {children}
        </main>
      </div>
    </div>
  )
}
