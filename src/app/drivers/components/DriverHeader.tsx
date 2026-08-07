'use client'

import { ArrowLeft, CheckCircle2, XCircle, Ban, Unlock, User, Car, FileText, CreditCard } from 'lucide-react'
import { Driver } from '../[id]/types'

interface DriverHeaderProps {
  driver: Driver
  activeTab: 'overview' | 'rides' | 'documents' | 'banking'
  onTabChange: (tab: 'overview' | 'rides' | 'documents' | 'banking') => void
  onApprove: () => void
  onReject: () => void
  onBlock: () => void
  onUnblock: () => void
  isLoading: boolean
  onBack: () => void
}

export function DriverHeader({
  driver,
  activeTab,
  onTabChange,
  onApprove,
  onReject,
  onBlock,
  onUnblock,
  isLoading,
  onBack
}: DriverHeaderProps) {
  const getStatusColor = () => {
    if (driver.isBlocked) return 'bg-red-100 text-red-800 border-red-200'
    if (driver.status === 'pending') return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    if (driver.status === 'rejected') return 'bg-rose-100 text-rose-800 border-rose-200'
    if (driver.isOnline) return 'bg-emerald-100 text-emerald-800 border-emerald-200'
    return 'bg-gray-100 text-gray-800 border-gray-200'
  }

  const getStatusText = () => {
    if (driver.isBlocked) return 'Blocked'
    if (driver.status === 'pending') return 'Pending Approval'
    if (driver.status === 'rejected') return 'Rejected'
    if (driver.isOnline) return 'Online'
    return 'Offline'
  }

  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: User },
    { id: 'rides' as const, label: 'Ride History', icon: Car },
    { id: 'documents' as const, label: 'Documents', icon: FileText },
    { id: 'banking' as const, label: 'Banking', icon: CreditCard },
  ]

  return (
    <div className="mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all hover:shadow-sm"
          >
            <ArrowLeft className="h-5 w-5 text-slate-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Driver Profile</h1>
            <p className="text-sm text-slate-500 mt-0.5">View and manage driver details</p>
          </div>
        </div>

        <div className="flex gap-2">
          {driver.status === 'pending' && (
            <>
              <button
                onClick={onReject}
                disabled={isLoading}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 text-sm font-medium hover:bg-rose-100 transition-all disabled:opacity-50"
              >
                <XCircle className="h-4 w-4" /> Reject KYC
              </button>
              <button
                onClick={onApprove}
                disabled={isLoading}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-all shadow-sm disabled:opacity-50"
              >
                <CheckCircle2 className="h-4 w-4" /> Approve KYC
              </button>
            </>
          )}
          {driver.status === 'active' && !driver.isBlocked && (
            <button
              onClick={onBlock}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-orange-200 bg-orange-50 text-orange-700 text-sm font-medium hover:bg-orange-100 transition-all"
            >
              <Ban className="h-4 w-4" /> Block Driver
            </button>
          )}
          {driver.isBlocked && (
            <button
              onClick={onUnblock}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 text-sm font-medium hover:bg-emerald-100 transition-all disabled:opacity-50"
            >
              <Unlock className="h-4 w-4" /> Unblock Driver
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <nav className="flex gap-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 px-1 py-3 text-sm font-medium transition-all relative
                ${activeTab === tab.id 
                  ? 'text-blue-600' 
                  : 'text-slate-500 hover:text-slate-700'}`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
              )}
            </button>
          ))}
        </nav>
      </div>
    </div>
  )
}