'use client'
import AdminShell from '@/components/Common/AdminShell'
import { Plus } from 'lucide-react'

// Types
type PromoStatus = 'Active' | 'Expired' | 'Inactive'

interface Promo {
  code: string
  discount: string
  maxAmt: number
  used: number
  limit: number
  status: PromoStatus
  expiry: string
}

// Mock Data
const promos: Promo[] = [
  {
    code: 'WELCOME50',
    discount: '50% OFF',
    maxAmt: 100,
    used: 1245,
    limit: 2000,
    status: 'Active',
    expiry: '2024-12-31'
  },
  {
    code: 'FIRSTRIDE',
    discount: '₹100 OFF',
    maxAmt: 100,
    used: 892,
    limit: 1500,
    status: 'Active',
    expiry: '2024-10-30'
  },
  {
    code: 'ODISHARIDE',
    discount: '20% OFF',
    maxAmt: 80,
    used: 456,
    limit: 1000,
    status: 'Active',
    expiry: '2024-11-15'
  },
  {
    code: 'FESTIVAL23',
    discount: '30% OFF',
    maxAmt: 120,
    used: 2100,
    limit: 2000,
    status: 'Expired',
    expiry: '2023-12-31'
  },
  {
    code: 'WEEKEND40',
    discount: '40% OFF',
    maxAmt: 150,
    used: 678,
    limit: 800,
    status: 'Active',
    expiry: '2024-09-20'
  },
  {
    code: 'HAPPYHOUR',
    discount: '₹50 OFF',
    maxAmt: 50,
    used: 1234,
    limit: 1500,
    status: 'Active',
    expiry: '2024-08-15'
  },
  {
    code: 'REFERRAL',
    discount: '₹200 OFF',
    maxAmt: 200,
    used: 345,
    limit: 500,
    status: 'Inactive',
    expiry: '2024-12-01'
  },
  {
    code: 'STUDENT10',
    discount: '10% OFF',
    maxAmt: 60,
    used: 89,
    limit: 300,
    status: 'Active',
    expiry: '2024-10-01'
  },
  {
    code: 'FLASH25',
    discount: '25% OFF',
    maxAmt: 90,
    used: 567,
    limit: 600,
    status: 'Expired',
    expiry: '2024-01-15'
  }
]

export default function PromoPage() {
  return (
    <AdminShell title="Promo Codes">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-xl font-bold text-slate-800">All Promo Codes</h3>
          <p className="text-sm text-slate-500">Manage discount campaigns</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700">
          <Plus className="h-4 w-4" /> Add Promo
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {promos.map((p: Promo) => (
          <div key={p.code} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
            <div className="flex justify-between items-start">
              <div className="text-2xl font-bold text-blue-600">{p.code}</div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                p.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 
                p.status === 'Expired' ? 'bg-red-100 text-red-700' : 
                'bg-slate-200 text-slate-600'
              }`}>
                {p.status}
              </span>
            </div>
            <div className="mt-3 text-sm text-slate-600">{p.discount} (max ₹{p.maxAmt})</div>
            <div className="mt-4">
              <div className="flex justify-between text-xs text-slate-500 mb-1">
                <span>Used</span>
                <span>{p.used} / {p.limit}</span>
              </div>
              <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-blue-500" style={{ width: `${Math.min(100, (p.used / p.limit) * 100)}%` }} />
              </div>
            </div>
            <div className="mt-4 text-xs text-slate-500">Expires: {p.expiry}</div>
          </div>
        ))}
      </div>
    </AdminShell>
  )
}