'use client'

import { CreditCard } from 'lucide-react'
import { Passenger } from '../types'

interface PassengerBankingProps {
  passenger: Passenger
}

export function PassengerBanking({ passenger }: PassengerBankingProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-800 mb-4 flex items-center gap-2">
        <CreditCard className="h-4 w-4 text-blue-500" />
        Banking & KYC Information
      </h3>
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          {passenger.aadharNumber && (
            <div className="p-3 bg-gradient-to-br from-slate-50 to-white rounded-lg border border-slate-100">
              <p className="text-xs text-slate-500 mb-1">Aadhar Number</p>
              <p className="text-sm font-mono font-semibold text-slate-800">{passenger.aadharNumber}</p>
            </div>
          )}
          {passenger.panNumber && (
            <div className="p-3 bg-gradient-to-br from-slate-50 to-white rounded-lg border border-slate-100">
              <p className="text-xs text-slate-500 mb-1">PAN Number</p>
              <p className="text-sm font-mono font-semibold text-slate-800">{passenger.panNumber}</p>
            </div>
          )}
          {!passenger.aadharNumber && !passenger.panNumber && (
            <div className="text-center py-8">
              <CreditCard className="h-12 w-12 text-slate-300 mx-auto mb-2" />
              <p className="text-sm text-slate-500">No banking or KYC information available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}