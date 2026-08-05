'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Wallet,
  History,
  Receipt,
  TrendingUp,
  Settings,
  PlusCircle,
  Download,
  Filter,
} from 'lucide-react'

interface PaymentNavHeaderProps {
  onQuickCollect?: () => void
  onExportCsv?: () => void
}

export default function PaymentNavHeader({
  onQuickCollect,
  onExportCsv,
}: PaymentNavHeaderProps) {
  const pathname = usePathname()

  const tabs = [
    {
      label: 'Driver Commissions',
      href: '/payments',
      icon: Wallet,
      exact: true,
      badge: '10 Drivers',
    },
    {
      label: 'Payment History',
      href: '/payments/history',
      icon: History,
      badge: '10 Recs',
    },
    {
      label: 'Ride Commissions',
      href: '/payments/transactions',
      icon: Receipt,
      badge: '10 Rides',
    },
    {
      label: 'Analytics',
      href: '/payments/analytics',
      icon: TrendingUp,
    },
    {
      label: 'Settings',
      href: '/payments/settings',
      icon: Settings,
    },
  ]

  const isActive = (href: string, exact: boolean = false) => {
    if (exact) {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  return (
    <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-slate-200/80 mb-6 transition-all">
      {/* Top Header Row */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600 mb-1">
            <span className="h-2 w-2 rounded-full bg-blue-600 animate-pulse"></span>
            Finance & Collections Module
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
            Payments & Commission Hub
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Track driver balances, collect daily commission payments, manage wallet thresholds, and review payment logs.
          </p>
        </div>

        {/* Top Quick Actions */}
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          {onExportCsv && (
            <button
              onClick={onExportCsv}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-medium hover:bg-slate-50 hover:border-slate-300 transition-colors shadow-xs cursor-pointer"
            >
              <Download className="h-4 w-4 text-slate-500" />
              <span>Export CSV</span>
            </button>
          )}

          {onQuickCollect && (
            <button
              onClick={onQuickCollect}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-all shadow-md hover:shadow-blue-600/20 cursor-pointer active:scale-98"
            >
              <PlusCircle className="h-4.5 w-4.5" />
              <span>Receive Payment</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs Navigation Row */}
      <div className="flex items-center gap-1 md:gap-2 overflow-x-auto pt-4 no-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const active = isActive(tab.href, tab.exact)

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                active
                  ? 'bg-blue-50 text-blue-600 font-semibold shadow-xs border border-blue-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 border border-transparent'
              }`}
            >
              <Icon className={`h-4 w-4 ${active ? 'text-blue-600' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    active ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
