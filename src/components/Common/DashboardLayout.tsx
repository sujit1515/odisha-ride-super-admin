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
  const sidebarWidthClass = isCollapsed ? 'lg:pl-[80px]' : 'lg:pl-[190px]'

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
        className={`flex flex-col min-h-screen ${transitionEnabled ? 'transition-[padding-left] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]' : ''
          } ${mounted ? sidebarWidthClass : 'lg:pl-[190px]'}`}
      >
        <Navbar title={title} onMenuClick={toggleSidebar} isSidebarCollapsed={isCollapsed} />
        <main className="flex-1 p-4 md:p-8 w-full">
          {children}
        </main>
      </div>
    </div>
  )
}
