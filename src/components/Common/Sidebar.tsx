'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
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
  LucideIcon
} from 'lucide-react'

import { adminLogout } from '@/api/auth' // adjust path

interface NavItem {
  href: string
  label: string
  icon: LucideIcon
}

const nav: NavItem[] = [
  { href: '/', label: 'Dashboard', icon: LayoutGrid },
  { href: '/rides', label: 'Rides', icon: Car },
  { href: '/drivers', label: 'Drivers', icon: User },
  { href: '/passengers', label: 'Passengers', icon: Users },
  { href: '/earnings', label: 'Earnings', icon: Wallet },
  { href: '/live-map', label: 'Live Map', icon: Map },
  { href: '/kyc-review', label: 'KYC Review', icon: ShieldCheck },
  { href: '/promo-codes', label: 'Promo Codes', icon: Ticket },
  { href: '/support', label: 'Support', icon: Headphones },
  { href: '/settings', label: 'Settings', icon: Settings },
]

interface SidebarProps {
  open: boolean
  onClose: () => void
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

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

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-40 h-screen w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-200 lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="px-6 pt-6 pb-4 flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-blue-600 leading-tight">
              Odisha Ride
            </h1>
            <p className="text-xs text-slate-500 mt-1">Super Admin</p>
          </div>

          <button onClick={onClose} className="lg:hidden p-1 text-slate-500">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 px-3 pt-4 space-y-1 overflow-y-auto">
          {nav.map(({ href, label, icon: Icon }) => {
            const active = pathname === href

            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={`relative flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {active && (
                  <span className="absolute -right-3 top-1/2 -translate-y-1/2 h-8 w-1.5 bg-blue-600 rounded-l" />
                )}

                <Icon className="h-5 w-5" />
                {label}
              </Link>
            )
          })}
        </nav>

        <div className="p-3 border-t border-slate-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>
    </>
  )
}