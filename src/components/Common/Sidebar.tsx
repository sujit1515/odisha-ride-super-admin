'use client'

import { useRouter, usePathname } from 'next/navigation'
import {
  LayoutGrid,
  Car,
  User,
  Users,
  Wallet,
  Map,
  ShieldCheck,
  Ticket,
  Headphones,
  Settings,
  X,
  LogOut,
  UserX,
  LucideIcon,
  List,
  Radio,
  CheckCircle2,
  XCircle,
  ShieldAlert,
  CalendarClock,
  Clock,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'
import { adminLogout } from '@/api/auth'
import SidebarItem from './SidebarItem'

interface NavItem {
  href?: string
  label: string
  icon: LucideIcon
  children?: { href: string; label: string; icon: LucideIcon }[]
  isDanger?: boolean
}

const nav: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutGrid },
  {
    href: '/rides',
    label: 'Rides',
    icon: Car,
    children: [
      { href: '/rides', label: 'All Rides', icon: List },
      { href: '/rides/ongoing', label: 'Ongoing', icon: Radio },
      { href: '/rides/completed', label: 'Completed', icon: CheckCircle2 },
      { href: '/rides/cancelled', label: 'Cancelled', icon: XCircle },
      { href: '/rides/scheduled', label: 'Scheduled', icon: CalendarClock },
      { href: '/rides/disputed', label: 'Disputed', icon: ShieldAlert },
    ],
  },
  {
    href: '/drivers',
    label: 'Drivers',
    icon: User,
    children: [
      { href: '/drivers', label: 'All Drivers', icon: List },
      { href: '/drivers/online', label: 'Online Drivers', icon: Radio },
    ],
  },
  {
    href: '/passengers',
    label: 'Passengers',
    icon: Users,
    children: [
      { href: '/passengers', label: 'All Passengers', icon: List },
      { href: '/passengers/waiting', label: 'Passengers Waiting', icon: Clock },
    ],
  },
  { href: '/earnings', label: 'Earnings', icon: Wallet },
  { href: '/live-map', label: 'Live Map', icon: Map },
  { href: '/kyc-review', label: 'KYC Review', icon: ShieldCheck },
  { href: '/blocked-drivers', label: 'Blocked Drivers', icon: UserX, isDanger: true },
  { href: '/deactivate-users', label: 'Deactivated Passengers', icon: UserX, isDanger: true },
  { href: '/promo-codes', label: 'Promo Codes', icon: Ticket },
  { href: '/support', label: 'Support', icon: Headphones },
  { href: '/settings', label: 'Settings', icon: Settings },
]

interface SidebarProps {
  isCollapsed: boolean
  isMobileOpen: boolean
  onCloseMobile: () => void
  onExpandRequest: () => void
  transitionEnabled?: boolean
}

export default function Sidebar({
  isCollapsed,
  isMobileOpen,
  onCloseMobile,
  onExpandRequest,
  transitionEnabled = false,
}: SidebarProps) {
  const router = useRouter()
  const pathname = usePathname()

  // Handle Escape key to close mobile sidebar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileOpen) {
        onCloseMobile()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isMobileOpen, onCloseMobile])

  const handleLogout = async () => {
    try {
      await adminLogout()
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      localStorage.removeItem('adminToken')
      sessionStorage.clear()
      router.push('/login')
    }
  }

  // Animation variants for desktop width
  const sidebarWidthVariants = {
    expanded: { width: 220 },
    collapsed: { width: 80 },
  }

  // Animation variants for mobile slide-in
  const mobileSlideVariants = {
    closed: { x: '-100%' },
    open: { x: 0 },
  }

  // Helper to render sidebar content for both mobile and desktop
  const renderSidebarContent = (collapsed: boolean, isMobile: boolean = false) => (
    <div className="h-full flex flex-col bg-white border-r border-slate-200 shadow-sm select-none overflow-x-hidden">
      {/* Logo Area */}
      <div className={`px-6 pt-6 pb-4 flex items-center ${collapsed ? 'justify-center px-0' : 'justify-between'}`}>
        <AnimatePresence mode="wait">
          {collapsed ? (
            <motion.div
              key="collapsed-logo"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={transitionEnabled ? undefined : { duration: 0 }}
              className="flex items-center justify-center h-10 w-10 rounded-xl bg-blue-600 text-white font-bold text-lg shadow-md cursor-pointer"
              onClick={onExpandRequest}
            >
              OR
            </motion.div>
          ) : (
            <motion.div
              key="expanded-logo"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={transitionEnabled ? undefined : { duration: 0 }}
              className="flex-1"
            >
              <h1 className="text-xl font-bold text-blue-600 leading-tight">Odisha Ride</h1>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">Super Admin Panel</p>
            </motion.div>
          )}
        </AnimatePresence>
        {!collapsed && isMobile && (
          <button
            onClick={onCloseMobile}
            className="p-1.5 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Nav Link List */}
      <nav className={`flex-1 px-3 pt-6 space-y-1 overflow-y-auto overflow-x-hidden ${collapsed ? 'px-2' : 'px-3'}`}>
        {nav.map((item) => (
          <SidebarItem
            key={item.label}
            href={item.href}
            label={item.label}
            icon={item.icon}
            isCollapsed={collapsed}
            onClick={isMobile ? onCloseMobile : undefined}
            isDanger={item.isDanger}
            children={item.children}
            onExpandRequest={onExpandRequest}
            transitionEnabled={transitionEnabled}
          />
        ))}
      </nav>

      {/* Logout Row at bottom */}
      <div className={`p-3 border-t border-slate-150 ${collapsed ? 'p-2' : 'p-3'}`}>
        <SidebarItem
          label="Logout"
          icon={LogOut}
          isCollapsed={collapsed}
          onClick={handleLogout}
          isDanger={true}
          transitionEnabled={transitionEnabled}
        />
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile Dark Backdrop */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={onCloseMobile}
            className="fixed inset-0 z-45 bg-black lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Mobile Drawer (Visible < 1024px) */}
      <motion.aside
        initial="closed"
        animate={isMobileOpen ? 'open' : 'closed'}
        variants={mobileSlideVariants}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="fixed top-0 left-0 z-50 h-screen w-[220px] lg:hidden flex flex-col shadow-2xl"
      >
        {/* On mobile, it's always expanded visually (width 260px) */}
        {renderSidebarContent(false, true)}
      </motion.aside>

      {/* Desktop Sidebar (Docked >= 1024px) */}
      <motion.aside
        initial={isCollapsed ? 'collapsed' : 'expanded'}
        animate={isCollapsed ? 'collapsed' : 'expanded'}
        variants={sidebarWidthVariants}
        transition={
          transitionEnabled
            ? { duration: 0.3, ease: 'easeInOut' }
            : { duration: 0 }
        }
        className="fixed top-0 left-0 z-30 h-screen hidden lg:block overflow-hidden"
      >
        {renderSidebarContent(isCollapsed, false)}
      </motion.aside>
    </>
  )
}