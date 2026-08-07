'use client'

import { CreditCard } from 'lucide-react'
import { Driver } from '../[id]/types'

interface DriverBankingProps {
  driver: Driver
}

export function DriverBanking({ driver }: DriverBankingProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-800 mb-4 flex items-center gap-2">
        <CreditCard className="h-4 w-4 text-blue-500" />
        Banking Information
      </h3>
      {driver.bankAccount ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 bg-gradient-to-br from-slate-50 to-white rounded-lg border border-slate-100">
              <p className="text-xs text-slate-500 mb-1">Account Holder</p>
              <p className="text-sm font-semibold text-slate-800">{driver.fullName}</p>
            </div>
            <div className="p-3 bg-gradient-to-br from-slate-50 to-white rounded-lg border border-slate-100">
              <p className="text-xs text-slate-500 mb-1">Bank Name</p>
              <p className="text-sm font-semibold text-slate-800">{driver.bankAccount.bankName}</p>
            </div>
            <div className="p-3 bg-gradient-to-br from-slate-50 to-white rounded-lg border border-slate-100">
              <p className="text-xs text-slate-500 mb-1">Account Number</p>
              <p className="text-sm font-mono font-semibold text-slate-800">{driver.bankAccount.accountNumber}</p>
            </div>
            <div className="p-3 bg-gradient-to-br from-slate-50 to-white rounded-lg border border-slate-100">
              <p className="text-xs text-slate-500 mb-1">IFSC Code</p>
              <p className="text-sm font-mono font-semibold text-slate-800">{driver.bankAccount.ifscCode}</p>
            </div>
          </div>
          {driver.aadharNumber && (
            <div className="p-3 bg-gradient-to-br from-slate-50 to-white rounded-lg border border-slate-100">
              <p className="text-xs text-slate-500 mb-1">Aadhar Number</p>
              <p className="text-sm font-mono font-semibold text-slate-800">{driver.aadharNumber}</p>
            </div>
          )}
          {driver.panNumber && (
            <div className="p-3 bg-gradient-to-br from-slate-50 to-white rounded-lg border border-slate-100">
              <p className="text-xs text-slate-500 mb-1">PAN Number</p>
              <p className="text-sm font-mono font-semibold text-slate-800">{driver.panNumber}</p>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8">
          <CreditCard className="h-12 w-12 text-slate-300 mx-auto mb-2" />
          <p className="text-sm text-slate-500">Banking information not available</p>
        </div>
      )}
    </div>
  )
}