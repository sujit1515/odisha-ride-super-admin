'use client'
import { Search, Bell, HelpCircle, PanelLeft, User, LogOut } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { adminLogout } from '@/app/(auth)/api/auth'

interface NavbarProps {
  title?: string
  onMenuClick: () => void
  isSidebarCollapsed?: boolean
}

export default function Navbar({ title = 'Odisha Ride Admin', onMenuClick, isSidebarCollapsed = false }: NavbarProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const router = useRouter()
  const menuRef = useRef<HTMLDivElement>(null)

  const handleLogout = async () => {
    try {
      await adminLogout() // call backend logout API

      localStorage.removeItem('adminToken')
      sessionStorage.clear()

      router.push('/login')
    } catch (error) {
      console.error('Logout failed:', error)

      // still clear local data if API fails
      localStorage.removeItem('adminToken')
      sessionStorage.clear()

      router.push('/login')
    }
  }

  const handleProfileClick = () => {
    setIsProfileOpen(false)
    router.push('/profile') // navigate to profile page
  }

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen)
  }

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false)
      }
    }

    if (isProfileOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isProfileOpen])

  const menuVariants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
      y: -10,
      transition: { duration: 0.2 }
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.2 }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: -10,
      transition: { duration: 0.15 }
    }
  }

  return (
    <header className="sticky top-0 z-20 bg-slate-50/80 backdrop-blur border-b border-slate-200">
      <div className="flex items-center gap-3 md:gap-6 px-4 md:px-8 py-4">
        <button
          onClick={onMenuClick}
          aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="p-1.5 rounded-lg hover:bg-slate-100 text-blue-600 hover:text-blue-700 transition-colors cursor-pointer flex items-center justify-center border border-blue-200/80 bg-blue-50/40"
          title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <PanelLeft className="h-5 w-5" />
        </button>
        <h2 className="text-lg md:text-2xl font-bold text-blue-600 leading-tight whitespace-pre-line">{title}</h2>
        <div className="flex-1 max-w-xl hidden sm:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>
        <div className="ml-auto flex items-center gap-3 md:gap-5">
          <button className="relative p-2 rounded-full hover:bg-slate-100">
            <Bell className="h-5 w-5 text-slate-600" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full" />
          </button>
          <button className="p-2 rounded-full hover:bg-slate-100 hidden sm:block">
            <HelpCircle className="h-5 w-5 text-slate-600" />
          </button>
          <div className="h-8 w-px bg-slate-200 hidden md:block" />
          <div className="flex items-center gap-3">
            <div className="text-right hidden md:block">
              <div className="text-sm font-semibold text-slate-800">Admin Profile</div>
              <div className="text-xs text-slate-500">Super Admin</div>
            </div>
            <div className="relative" ref={menuRef}>
              <button
                onClick={toggleProfile}
                className="focus:outline-none"
              >
                <img
                  src="https://i.pravatar.cc/80?img=12"
                  alt="admin"
                  className="h-9 w-9 rounded-full object-cover ring-2 ring-white shadow cursor-pointer hover:ring-3 transition-all"
                />
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    variants={menuVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="absolute right-0 mt-3 w-72 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden z-40"
                  >
                    {/* Menu Items - Only Profile and Logout */}
                    <div className="py-2">
                      <button
                        onClick={handleProfileClick}
                        className="w-full px-4 py-3 flex items-center gap-3 hover:bg-slate-50 transition-colors"
                      >
                        <User className="h-5 w-5 text-slate-500" />
                        <div className="flex-1 text-left">
                          <div className="text-sm font-medium text-slate-700">Profile</div>
                          <div className="text-xs text-slate-400">View and edit your profile</div>
                        </div>
                      </button>

                      <div className="border-t border-slate-100 my-1"></div>

                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-3 flex items-center gap-3 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="h-5 w-5 text-red-500" />
                        <div className="flex-1 text-left">
                          <div className="text-sm font-medium text-red-600">Logout</div>
                          <div className="text-xs text-slate-400">Sign out of your account</div>
                        </div>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}