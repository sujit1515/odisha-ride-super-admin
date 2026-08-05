'use client'

import {
  Wallet,
  IndianRupee,
  AlertTriangle,
  UserX,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  ShieldAlert,
  Clock,
} from 'lucide-react'
import { DriverCommission } from './types'

interface PaymentSummaryCardsProps {
  drivers?: DriverCommission[]
  onFilterStatus?: (status: string) => void
}

export default function PaymentSummaryCards({
  drivers = [],
  onFilterStatus,
}: PaymentSummaryCardsProps) {
  // Calculations based on drivers data or realistic default totals
  const totalOutstanding = drivers.reduce(
    (acc, d) => acc + d.outstandingCommission,
    0
  ) || 11210

  const warningCount = drivers.filter((d) => d.status === 'Warning').length || 3
  const blockedCount = drivers.filter((d) => d.status === 'Blocked').length || 3

  const todayReceived = 1750
  const monthlyCollected = 312000

  const cards = [
    {
      id: 'outstanding',
      title: 'Total Outstanding Commission',
      value: `₹${totalOutstanding.toLocaleString('en-IN')}`,
      subtext: 'Accumulated pending driver fees',
      icon: Wallet,
      iconBg: 'bg-blue-50 text-blue-600',
      borderHover: 'hover:border-blue-300',
      badge: { text: '+8.4% vs last week', isUp: true, color: 'text-amber-600 bg-amber-50' },
      actionStatus: 'All',
    },
    {
      id: 'today',
      title: 'Payments Received Today',
      value: `₹${todayReceived.toLocaleString('en-IN')}`,
      subtext: '12 collections recorded today',
      icon: IndianRupee,
      iconBg: 'bg-emerald-50 text-emerald-600',
      borderHover: 'hover:border-emerald-300',
      badge: { text: '+14.2% vs yesterday', isUp: true, color: 'text-emerald-600 bg-emerald-50' },
    },
    {
      id: 'warning',
      title: 'Drivers in Warning',
      value: `${warningCount}`,
      subtext: 'Near limit (₹1,200 - ₹1,500)',
      icon: AlertTriangle,
      iconBg: 'bg-amber-50 text-amber-600',
      borderHover: 'hover:border-amber-300',
      badge: { text: 'Needs payment alert', isUp: false, color: 'text-amber-700 bg-amber-100' },
      actionStatus: 'Warning',
    },
    {
      id: 'blocked',
      title: 'Blocked Drivers',
      value: `${blockedCount}`,
      subtext: 'Exceeded limit (>₹1,500)',
      icon: UserX,
      iconBg: 'bg-rose-50 text-rose-600',
      borderHover: 'hover:border-rose-300',
      badge: { text: 'Dispatch restricted', isUp: false, color: 'text-rose-700 bg-rose-100' },
      actionStatus: 'Blocked',
    },
    {
      id: 'monthly',
      title: 'Monthly Commission Collected',
      value: `₹${monthlyCollected.toLocaleString('en-IN')}`,
      subtext: 'August 2026 overall revenue',
      icon: TrendingUp,
      iconBg: 'bg-purple-50 text-purple-600',
      borderHover: 'hover:border-purple-300',
      badge: { text: '+18.5% MoM growth', isUp: true, color: 'text-purple-600 bg-purple-50' },
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      {cards.map((card) => {
        const Icon = card.icon
        const isClickable = !!card.actionStatus && !!onFilterStatus

        return (
          <div
            key={card.id}
            onClick={() => {
              if (isClickable && card.actionStatus) {
                onFilterStatus(card.actionStatus)
              }
            }}
            className={`bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-slate-200/80 transition-all duration-200 ${
              card.borderHover
            } ${
              isClickable ? 'cursor-pointer hover:-translate-y-0.5 hover:shadow-md' : ''
            }`}
          >
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide truncate">
                {card.title}
              </span>
              <div className={`p-2.5 rounded-xl shrink-0 ${card.iconBg}`}>
                <Icon className="h-5 w-5" />
              </div>
            </div>

            <div className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight mb-1">
              {card.value}
            </div>

            <div className="flex items-center justify-between gap-1 text-xs mt-2">
              <span className="text-slate-500 truncate">{card.subtext}</span>
            </div>

            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className={`px-2 py-0.5 rounded-full font-medium ${card.badge.color}`}>
                {card.badge.text}
              </span>
              {isClickable && (
                <span className="text-blue-600 font-semibold hover:underline">
                  Filter &rarr;
                </span>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
