'use client'

import { ReactNode, useState } from 'react'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import { useSidebar } from '@/components/Context/SidebarContext'

interface DashboardLayoutProps {
  children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { isCollapsed, setIsCollapsed, mounted, transitionEnabled, title } = useSidebar()
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const toggleSidebar = () => {
    if (window.innerWidth >= 1024) {
      setIsCollapsed((prev) => {
        const next = !prev
        localStorage.setItem('sidebar-collapsed', String(next))
        return next
      })
    } else {
      setIsMobileOpen((prev) => !prev)
    }
  }

  const handleExpandRequest = () => {
    setIsCollapsed(false)
    localStorage.setItem('sidebar-collapsed', 'false')
  }

  // To prevent visual jump/flicker during initial page hydration,
  // we align with the default expanded layout (220px) and transition smoothly only after mount/transition activation.
  const sidebarWidthClass = isCollapsed ? 'lg:pl-[80px]' : 'lg:pl-[220px]'

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 overflow-x-hidden">
      {/* Collapsible Sidebar */}
      <Sidebar
        isCollapsed={isCollapsed}
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
        onExpandRequest={handleExpandRequest}
        transitionEnabled={transitionEnabled}
      />

      {/* Main Panel Content Area */}
      <div
        className={`flex flex-col min-h-screen ${
          transitionEnabled ? 'transition-all duration-300 ease-in-out' : ''
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
