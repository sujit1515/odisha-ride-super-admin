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
  CreditCard,
  History,
  Receipt,
  TrendingUp,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
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
  {
    href: '/payments',
    label: 'Payments',
    icon: CreditCard,
    children: [
      { href: '/payments', label: 'Commission Dashboard', icon: List },
      { href: '/payments/history', label: 'Payment History', icon: History },
      { href: '/payments/transactions', label: 'Ride Commissions', icon: Receipt },
      { href: '/payments/analytics', label: 'Analytics', icon: TrendingUp },
      { href: '/payments/settings', label: 'Payment Settings', icon: Settings },
    ],
  },
  { href: '/live-map', label: 'Live Map', icon: Map },
  { href: '/kyc-review', label: 'KYC Review', icon: ShieldCheck },
  { href: '/blocked-drivers', label: 'Drivers', icon: UserX, isDanger: true },
  { href: '/deactivate-users', label: 'Passengers', icon: UserX, isDanger: true },
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

  // Delay icon-only layout until width animation finishes — prevents vertical jump on close
  const [contentCollapsed, setContentCollapsed] = useState(isCollapsed)

  // Logout confirmation popup state
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  useEffect(() => {
    if (!isCollapsed) {
      setContentCollapsed(false)
      return
    }
    const timer = window.setTimeout(() => setContentCollapsed(true), 280)
    return () => window.clearTimeout(timer)
  }, [isCollapsed])

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
      {/* Logo Area — fixed height so open/close does not jump vertically */}
      <div
        className={`h-[72px] pt-6 pb-4 flex items-center shrink-0 ${collapsed ? 'justify-center px-2' : 'justify-between px-6'
          }`}
      >
        {collapsed ? (
          <div
            className="flex items-center justify-center h-10 w-10 rounded-xl bg-blue-600 text-white font-bold text-lg shadow-md cursor-pointer"
            onClick={onExpandRequest}
          >
            OR
          </div>
        ) : (
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-blue-600 leading-tight truncate">Odisha Ride</h1>
            <p className="text-xs text-slate-500 mt-0.5 font-medium truncate">Super Admin Panel</p>
          </div>
        )}
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
            key={item.href ?? item.label}
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
          onClick={() => setShowLogoutConfirm(true)}
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
            ? { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
            : { duration: 0 }
        }
        className="fixed top-0 left-0 z-30 h-screen hidden lg:block overflow-hidden"
      >
        {renderSidebarContent(contentCollapsed, false)}
      </motion.aside>

      {/* Logout Confirmation Popup */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl shadow-xl p-6 w-[90%] max-w-sm"
            >
              <h2 className="text-lg font-semibold text-slate-900 mb-2">Log out?</h2>
              <p className="text-sm text-slate-500 mb-6">Are you sure you want to log out?</p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="px-4 py-2 text-sm rounded-lg text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowLogoutConfirm(false)
                    handleLogout()
                  }}
                  className="px-4 py-2 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700"
                >
                  Logout
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}