// 'use client'

// import Link from 'next/link'
// import { usePathname, useRouter } from 'next/navigation'
// import {
//   LayoutGrid, Car, User, Users, Wallet, Map,
//   ShieldCheck, Ticket, Headphones, Settings,
//   X, LogOut, UserX, LucideIcon
// } from 'lucide-react'
// import { adminLogout } from '@/api/auth'

// interface NavItem {
//   href: string
//   label: string
//   icon: LucideIcon
// }

// const nav: NavItem[] = [
//   { href: '/dashboard',           label: 'Dashboard',               icon: LayoutGrid  },
//   { href: '/rides',               label: 'Rides',                   icon: Car         },
//   { href: '/drivers',             label: 'Drivers',                 icon: User        },
//   { href: '/passengers',          label: 'Passengers',              icon: Users       },
//   { href: '/earnings',            label: 'Earnings',                icon: Wallet      },
//   { href: '/live-map',            label: 'Live Map',                icon: Map         },
//   { href: '/kyc-review',          label: 'KYC Review',              icon: ShieldCheck },
//   { href: '/blocked-drivers',     label: 'Blocked Drivers',         icon: UserX       },
//   { href: '/deactivate-users',    label: 'Deactivated Passengers',  icon: UserX       }, 
//   { href: '/promo-codes',         label: 'Promo Codes',             icon: Ticket      },
//   { href: '/support',             label: 'Support',                 icon: Headphones  },
//   { href: '/settings',            label: 'Settings',                icon: Settings    },
// ]

// interface SidebarProps {
//   open: boolean
//   onClose: () => void
// }

// export default function Sidebar({ open, onClose }: SidebarProps) {
//   const pathname = usePathname()
//   const router   = useRouter()

//   const handleLogout = async () => {
//     try {
//       await adminLogout()
//     } catch (error) {
//       console.error('Logout failed:', error)
//     } finally {
//       localStorage.removeItem('adminToken')
//       sessionStorage.clear()
//       router.push('/login')
//     }
//   }

//   return (
//     <>
//       {open && (
//         <div
//           className="fixed inset-0 z-30 bg-black/40 lg:hidden"
//           onClick={onClose}
//         />
//       )}

//       <aside
//         className={`fixed top-0 left-0 z-40 h-screen w-64 bg-white border-r
//                     border-slate-200 flex flex-col transition-transform duration-200
//                     lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}
//       >
//         {/* Logo */}
//         <div className="px-6 pt-6 pb-4 flex items-start justify-between">
//           <div>
//             <h1 className="text-xl font-bold text-blue-600 leading-tight">
//               Odisha Ride
//             </h1>
//             <p className="text-xs text-slate-500 mt-1">Super Admin</p>
//           </div>
//           <button onClick={onClose} className="lg:hidden p-1 text-slate-500">
//             <X className="h-5 w-5" />
//           </button>
//         </div>

//         {/* Nav */}
//         <nav className="flex-1 px-3 pt-4 space-y-1 overflow-y-auto">
//           {nav.map(({ href, label, icon: Icon }) => {
//             const active    = pathname === href
//             const isDanger  = href === '/blocked-drivers' || href === '/blocked-users'

//             return (
//               <Link
//                 key={href}
//                 href={href}
//                 onClick={onClose}
//                 className={`relative flex items-center gap-3 px-4 py-3 rounded-lg
//                             text-sm font-medium transition-colors ${
//                   active
//                     ? isDanger
//                       ? 'bg-red-50 text-red-700'
//                       : 'bg-blue-50 text-blue-700'
//                     : isDanger
//                       ? 'text-red-500 hover:bg-red-50 hover:text-red-700'
//                       : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
//                 }`}
//               >
//                 {active && (
//                   <span
//                     className={`absolute -right-3 top-1/2 -translate-y-1/2 h-8 w-1.5
//                                 rounded-l ${isDanger ? 'bg-red-600' : 'bg-blue-600'}`}
//                   />
//                 )}
//                 <Icon className="h-5 w-5" />
//                 {label}
//               </Link>
//             )
//           })}
//         </nav>

//         {/* Logout */}
//         <div className="p-3 border-t border-slate-200">
//           <button
//             onClick={handleLogout}
//             className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm
//                        font-medium text-red-600 hover:bg-red-50 transition-colors"
//           >
//             <LogOut className="h-5 w-5" />
//             Logout
//           </button>
//         </div>
//       </aside>
//     </>
//   )
// }


'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutGrid, Car, User, Users, Wallet, Map,
  ShieldCheck, Ticket, Headphones, Settings,
  X, LogOut, UserX, LucideIcon, ChevronRight,
  List, Radio, CheckCircle2, XCircle,
  ShieldAlert,
  CalendarClock,
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { adminLogout } from '@/api/auth'

interface NavItem {
  href: string
  label: string
  icon: LucideIcon
  children?: { href: string; label: string; icon: LucideIcon }[]
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
  { href: '/drivers', label: 'Drivers', icon: User },
  { href: '/passengers', label: 'Passengers', icon: Users },
  { href: '/earnings', label: 'Earnings', icon: Wallet },
  { href: '/live-map', label: 'Live Map', icon: Map },
  { href: '/kyc-review', label: 'KYC Review', icon: ShieldCheck },
  { href: '/blocked-drivers', label: 'Blocked Drivers', icon: UserX },
  { href: '/deactivate-users', label: 'Deactivated Passengers', icon: UserX },
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

  // Auto-expand rides submenu if current path is under /rides
  const [ridesOpen, setRidesOpen] = useState(pathname.startsWith('/rides'))

  useEffect(() => {
    if (pathname.startsWith('/rides')) setRidesOpen(true)
  }, [pathname])

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

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-40 h-screen w-64 bg-white border-r
                    border-slate-200 flex flex-col transition-transform duration-200
                    lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Logo */}
        <div className="px-6 pt-6 pb-4 flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-blue-600 leading-tight">Odisha Ride</h1>
            <p className="text-xs text-slate-500 mt-1">Super Admin</p>
          </div>
          <button onClick={onClose} className="lg:hidden p-1 text-slate-500">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 pt-4 space-y-1 overflow-y-auto">
          {nav.map(({ href, label, icon: Icon, children }) => {
            const isDanger = href === '/blocked-drivers' || href === '/deactivate-users'
            const isRidesGroup = !!children

            // ── Rides group with submenu ──────────────────
            if (isRidesGroup && children) {
              const isGroupActive = pathname.startsWith('/rides')

              return (
                <div key={href}>
                  {/* Parent row */}
                  <button
                    onClick={() => setRidesOpen(o => !o)}
                    className={`w-full relative flex items-center gap-3 px-4 py-3 rounded-lg
                                text-sm font-medium transition-colors ${isGroupActive
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                  >
                    {isGroupActive && (
                      <span className="absolute -right-3 top-1/2 -translate-y-1/2 h-8 w-1.5 rounded-l bg-blue-600" />
                    )}
                    <Icon className="h-5 w-5 shrink-0" />
                    <span className="flex-1 text-left">{label}</span>
                    <ChevronRight
                      className={`h-4 w-4 shrink-0 transition-transform duration-200 ${ridesOpen ? 'rotate-90' : ''
                        }`}
                    />
                  </button>

                  {/* Submenu */}
                  <div
                    className={`overflow-hidden transition-all duration-200 ${ridesOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
                      }`}
                  >
                    <div className="ml-4 mt-1 space-y-0.5 border-l-2 border-slate-100 pl-3">
                      {children.map(({ href: cHref, label: cLabel, icon: CIcon }) => {
                        const childActive = pathname === cHref
                        return (
                          <Link
                            key={cHref}
                            href={cHref}
                            onClick={onClose}
                            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg
                                        text-sm transition-colors ${childActive
                                ? 'bg-blue-50 text-blue-700 font-medium'
                                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                              }`}
                          >
                            <CIcon className="h-4 w-4 shrink-0" />
                            {cLabel}
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )
            }

            // ── Regular nav item ──────────────────────────
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={`relative flex items-center gap-3 px-4 py-3 rounded-lg
                            text-sm font-medium transition-colors ${active
                    ? isDanger
                      ? 'bg-red-50 text-red-700'
                      : 'bg-blue-50 text-blue-700'
                    : isDanger
                      ? 'text-red-500 hover:bg-red-50 hover:text-red-700'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
              >
                {active && (
                  <span
                    className={`absolute -right-3 top-1/2 -translate-y-1/2 h-8 w-1.5
                                rounded-l ${isDanger ? 'bg-red-600' : 'bg-blue-600'}`}
                  />
                )}
                <Icon className="h-5 w-5" />
                {label}
              </Link>
            )
          })}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-slate-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm
                       font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>
    </>
  )
}