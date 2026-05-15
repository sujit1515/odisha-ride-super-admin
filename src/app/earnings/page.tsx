'use client'
import AdminShell from '@/components/Common/AdminShell'
import { TrendingUp, Wallet, Banknote, RotateCcw, LucideIcon } from 'lucide-react'

// Types
interface MonthlyRevenue {
  m: string
  v: number
}

interface EarningsData {
  totalRevenue: number
  driverPayouts: number
  platformFee: number
  refunds: number
  monthly: MonthlyRevenue[]
}

// Mock Data
const earningsData: EarningsData = {
  totalRevenue: 3824000,
  driverPayouts: 2685000,
  platformFee: 573600,
  refunds: 56400,
  monthly: [
    { m: 'Jan', v: 185000 },
    { m: 'Feb', v: 172000 },
    { m: 'Mar', v: 210000 },
    { m: 'Apr', v: 195000 },
    { m: 'May', v: 228000 },
    { m: 'Jun', v: 242000 },
    { m: 'Jul', v: 265000 },
    { m: 'Aug', v: 278000 },
    { m: 'Sep', v: 312000 },
    { m: 'Oct', v: 358000 },
    { m: 'Nov', v: 395000 },
    { m: 'Dec', v: 421000 }
  ]
}

interface SummaryCard {
  label: string
  value: number
  icon: LucideIcon
  color: string
}

export default function EarningsPage() {
  const max = Math.max(...earningsData.monthly.map(m => m.v))
  const cards: SummaryCard[] = [
    { label: 'Total Revenue', value: earningsData.totalRevenue, icon: TrendingUp, color: 'text-emerald-600 bg-emerald-50' },
    { label: 'Driver Payouts', value: earningsData.driverPayouts, icon: Wallet, color: 'text-blue-600 bg-blue-50' },
    { label: 'Platform Fee', value: earningsData.platformFee, icon: Banknote, color: 'text-purple-600 bg-purple-50' },
    { label: 'Refunds Issued', value: earningsData.refunds, icon: RotateCcw, color: 'text-red-600 bg-red-50' },
  ]
  return (
    <AdminShell title="Earnings">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
            <div className={`h-10 w-10 rounded-full flex items-center justify-center ${c.color}`}>
              <c.icon className="h-5 w-5" />
            </div>
            <div className="mt-4 text-sm text-slate-500">{c.label}</div>
            <div className="mt-1 text-2xl font-bold">₹{c.value.toLocaleString()}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-800">Monthly Revenue</h3>
        <div className="mt-6 flex items-end gap-4 h-64">
          {earningsData.monthly.map(m => (
            <div key={m.m} className="flex-1 flex flex-col items-center gap-2">
              <div className="text-xs text-slate-500">₹{(m.v / 1000).toFixed(0)}k</div>
              <div 
                className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg" 
                style={{ height: `${(m.v / max) * 100}%`, minHeight: '4px' }} 
              />
              <div className="text-xs text-slate-600 font-medium">{m.m}</div>
            </div>
          ))}
        </div>
      </div>
    </AdminShell>
  )
}