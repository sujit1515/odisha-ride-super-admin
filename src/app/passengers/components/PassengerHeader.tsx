'use client'

import { ArrowLeft, User, Car, FileText, CreditCard, CheckCircle2, XCircle, Ban, Unlock } from 'lucide-react'
import { Passenger } from '../[id]/types'

interface PassengerHeaderProps {
  passenger: Passenger
  activeTab: 'overview' | 'rides' | 'documents' | 'banking'
  onTabChange: (tab: 'overview' | 'rides' | 'documents' | 'banking') => void
  onActivate: () => void
  onDeactivate: () => void
  onDelete: () => void
  isLoading: boolean
  onBack: () => void
}

export function PassengerHeader({
  passenger,
  activeTab,
  onTabChange,
  onActivate,
  onDeactivate,
  onDelete,
  isLoading,
  onBack
}: PassengerHeaderProps) {
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
            <h1 className="text-2xl font-bold text-slate-800">Passenger Profile</h1>
            <p className="text-sm text-slate-500 mt-0.5">View and manage passenger details</p>
          </div>
        </div>

        <div className="flex gap-2">
          {passenger.isActive ? (
            <>
              <button
                onClick={onDeactivate}
                disabled={isLoading}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-amber-200 bg-amber-50 text-amber-700 text-sm font-medium hover:bg-amber-100 transition-all disabled:opacity-50"
              >
                <Ban className="h-4 w-4" /> Deactivate
              </button>
              <button
                onClick={onDelete}
                disabled={isLoading}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-red-200 bg-red-50 text-red-700 text-sm font-medium hover:bg-red-100 transition-all disabled:opacity-50"
              >
                <XCircle className="h-4 w-4" /> Delete
              </button>
            </>
          ) : (
            <button
              onClick={onActivate}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-all shadow-sm disabled:opacity-50"
            >
              <Unlock className="h-4 w-4" /> Activate Account
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