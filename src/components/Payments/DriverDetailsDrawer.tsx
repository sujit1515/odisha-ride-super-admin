'use client'

import { useState } from 'react'
import {
  X,
  Phone,
  Car,
  AlertTriangle,
  CheckCircle2,
  UserX,
  IndianRupee,
  ShieldCheck,
  Calendar,
  Star,
  PlusCircle,
  ArrowUpRight,
  History,
  Lock,
  Unlock,
  ExternalLink,
  ChevronRight,
  TrendingUp,
} from 'lucide-react'
import { DriverCommission } from './types'
import { mockCommissionTransactions, mockPaymentHistory } from './mockData'

interface DriverDetailsDrawerProps {
  isOpen: boolean
  onClose: () => void
  driver: DriverCommission | null
  onOpenReceivePayment?: (driver: DriverCommission) => void
  onOpenIncreaseLimit?: (driver: DriverCommission) => void
  onToggleBlock?: (driverId: string, block: boolean) => void
}

export default function DriverDetailsDrawer({
  isOpen,
  onClose,
  driver,
  onOpenReceivePayment,
  onOpenIncreaseLimit,
  onToggleBlock,
}: DriverDetailsDrawerProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'commissions' | 'payments'>('overview')

  if (!isOpen || !driver) return null

  // Calculate percentage used
  const percentUsed = Math.min(
    100,
    Math.round((driver.outstandingCommission / driver.commissionLimit) * 100)
  )

  const isBlocked = driver.status === 'Blocked'
  const isWarning = driver.status === 'Warning'

  // Filter mock transactions for this driver
  const driverTransactions = mockCommissionTransactions.filter(
    (t) => t.driverName.includes(driver.driverName.split(' ')[0]) || t.driverId === driver.driverId
  ).concat([
    {
      id: 'TXN-9910',
      rideId: 'RIDE-84901',
      driverId: driver.driverId,
      driverName: driver.driverName,
      vehicleType: driver.vehicleType,
      vehicleNumber: driver.vehicleNumber,
      rideFare: 320,
      commissionPercent: 15,
      commissionAmount: 48,
      createdDate: '2026-08-05 18:20',
      status: 'Charged',
    },
    {
      id: 'TXN-9911',
      rideId: 'RIDE-84880',
      driverId: driver.driverId,
      driverName: driver.driverName,
      vehicleType: driver.vehicleType,
      vehicleNumber: driver.vehicleNumber,
      rideFare: 210,
      commissionPercent: 15,
      commissionAmount: 31.5,
      createdDate: '2026-08-05 16:45',
      status: 'Charged',
    },
  ])

  // Filter mock payments for this driver
  const driverPayments = mockPaymentHistory.filter(
    (p) => p.driverName.includes(driver.driverName.split(' ')[0]) || p.driverId === driver.driverId
  ).concat([
    {
      id: 'PAY-882',
      receiptNo: 'REC-2026-0801-99',
      date: driver.lastPaymentDate,
      driverId: driver.driverId,
      driverName: driver.driverName,
      driverPhone: driver.phone,
      vehicleType: driver.vehicleType,
      amount: driver.lastPaymentAmount,
      paymentMethod: 'UPI',
      referenceNumber: 'UPI/9810294810/PAYTM',
      status: 'Success',
      collectedBy: 'Auto-Collected',
    },
  ])

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity animate-fade-in"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-xl bg-white shadow-2xl border-l border-slate-200 flex flex-col transform transition-transform duration-300">
          {/* Top Bar */}
          <div className="bg-slate-900 text-white px-6 py-5 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <span className="p-2 rounded-xl bg-blue-600">
                <Car className="h-5 w-5 text-white" />
              </span>
              <div>
                <h2 className="text-lg font-bold">Driver Commission Profile</h2>
                <p className="text-xs text-slate-400">ID: {driver.driverId}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Profile Card Header */}
          <div className="p-6 bg-slate-50 border-b border-slate-200 shrink-0">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-4">
                <img
                  src={driver.avatar}
                  alt={driver.driverName}
                  className="h-16 w-16 rounded-2xl object-cover border-2 border-white shadow-md"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-slate-900">{driver.driverName}</h3>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        isBlocked
                          ? 'bg-rose-100 text-rose-700 border border-rose-300'
                          : isWarning
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                      }`}
                    >
                      {driver.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 flex-wrap">
                    <span className="flex items-center gap-1 font-semibold text-slate-700">
                      <Car className="h-3.5 w-3.5 text-blue-600" />
                      {driver.vehicleType} &bull; {driver.vehicleNumber}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="h-3.5 w-3.5 text-slate-400" />
                      {driver.phone}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                    <span className="flex items-center gap-1 text-amber-500 font-bold">
                      <Star className="h-3.5 w-3.5 fill-amber-400" />
                      {driver.rating} ({driver.totalRides} rides)
                    </span>
                    <span>&bull;</span>
                    <span>UPI: {driver.upiId || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Commission Limit Progress Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-600">Commission Used Ratio</span>
                <span className="font-bold text-slate-900">{percentUsed}% Used</span>
              </div>
              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
                <div
                  style={{ width: `${percentUsed}%` }}
                  className={`h-full rounded-full transition-all duration-500 ${
                    percentUsed >= 100
                      ? 'bg-rose-600'
                      : percentUsed >= 80
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                  }`}
                />
              </div>

              {/* Status Notice Alert if Warning or Blocked */}
              {isBlocked && (
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs mt-2">
                  <UserX className="h-4 w-4 shrink-0 text-rose-600" />
                  <span>
                    <strong>Blocked Notice:</strong> Limit exceeded! Auto-dispatch is suspended until payment of ₹
                    {driver.outstandingCommission} is received.
                  </span>
                </div>
              )}
              {isWarning && (
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs mt-2">
                  <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600" />
                  <span>
                    <strong>Warning Notice:</strong> Only ₹{driver.remainingAmount} limit left before account block.
                  </span>
                </div>
              )}
            </div>

            {/* Financial Stats Cards */}
            <div className="grid grid-cols-3 gap-3 mt-4">
              <div className="bg-white p-3 rounded-2xl border border-slate-200 text-center">
                <span className="text-[11px] font-semibold text-slate-500 uppercase block mb-1">
                  Outstanding
                </span>
                <span className="text-lg font-extrabold text-amber-600">
                  ₹{driver.outstandingCommission.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="bg-white p-3 rounded-2xl border border-slate-200 text-center">
                <span className="text-[11px] font-semibold text-slate-500 uppercase block mb-1">
                  Limit
                </span>
                <span className="text-lg font-extrabold text-slate-800">
                  ₹{driver.commissionLimit.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="bg-white p-3 rounded-2xl border border-slate-200 text-center">
                <span className="text-[11px] font-semibold text-slate-500 uppercase block mb-1">
                  Remaining
                </span>
                <span className="text-lg font-extrabold text-emerald-600">
                  ₹{driver.remainingAmount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions Drawer Buttons Bar */}
          <div className="px-6 py-3 bg-white border-b border-slate-200 flex items-center justify-between gap-2 overflow-x-auto shrink-0">
            <button
              onClick={() => onOpenReceivePayment && onOpenReceivePayment(driver)}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <PlusCircle className="h-3.5 w-3.5" />
              <span>Receive Payment</span>
            </button>

            <button
              onClick={() => onOpenIncreaseLimit && onOpenIncreaseLimit(driver)}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
            >
              <ArrowUpRight className="h-3.5 w-3.5 text-blue-600" />
              <span>Increase Limit</span>
            </button>

            {isBlocked ? (
              <button
                onClick={() => onToggleBlock && onToggleBlock(driver.driverId, false)}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-semibold transition-colors cursor-pointer"
              >
                <Unlock className="h-3.5 w-3.5" />
                <span>Unblock</span>
              </button>
            ) : (
              <button
                onClick={() => onToggleBlock && onToggleBlock(driver.driverId, true)}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold transition-colors cursor-pointer"
              >
                <Lock className="h-3.5 w-3.5" />
                <span>Block Driver</span>
              </button>
            )}
          </div>

          {/* Drawer Inner Sub-Tabs */}
          <div className="flex border-b border-slate-200 px-6 bg-slate-50 shrink-0">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-3 px-4 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
                activeTab === 'overview'
                  ? 'border-blue-600 text-blue-600 bg-white'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              Account Summary
            </button>
            <button
              onClick={() => setActiveTab('commissions')}
              className={`py-3 px-4 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
                activeTab === 'commissions'
                  ? 'border-blue-600 text-blue-600 bg-white'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              Ride Commissions ({driverTransactions.length})
            </button>
            <button
              onClick={() => setActiveTab('payments')}
              className={`py-3 px-4 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
                activeTab === 'payments'
                  ? 'border-blue-600 text-blue-600 bg-white'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              Recent Payments ({driverPayments.length})
            </button>
          </div>

          {/* Scrollable Content Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Driver Details List */}
                <div className="bg-white rounded-2xl p-4 border border-slate-200 space-y-3 text-xs">
                  <h4 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-2">
                    Driver Profile Information
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-slate-400 block">Phone Number</span>
                      <span className="font-semibold text-slate-800">{driver.phone}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Vehicle Registration</span>
                      <span className="font-semibold text-slate-800">{driver.vehicleNumber}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Vehicle Type</span>
                      <span className="font-semibold text-slate-800">{driver.vehicleType}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Joined Platform</span>
                      <span className="font-semibold text-slate-800">{driver.joiningDate}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Total Lifetime Earnings</span>
                      <span className="font-semibold text-emerald-600">
                        ₹{(driver.totalCommissionEarned * 6).toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Total Lifetime Commission</span>
                      <span className="font-semibold text-blue-600">
                        ₹{driver.totalCommissionEarned.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Last Payment Box */}
                <div className="bg-emerald-50/60 rounded-2xl p-4 border border-emerald-200 text-xs space-y-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-emerald-800 flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      Last Recorded Payment
                    </span>
                    <span className="font-mono text-emerald-700">{driver.lastPaymentDate}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm pt-1">
                    <span className="text-emerald-900">Amount Received:</span>
                    <span className="font-extrabold text-emerald-700 text-base">
                      ₹{driver.lastPaymentAmount}
                    </span>
                  </div>
                </div>

                {/* Recent 2 Commissions Quick Snippet */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Recent Ride Commissions
                  </h4>
                  <div className="space-y-2">
                    {driverTransactions.slice(0, 3).map((t) => (
                      <div
                        key={t.id}
                        className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                      >
                        <div>
                          <span className="font-mono font-bold text-slate-800">{t.rideId}</span>
                          <span className="text-slate-400 block">{t.createdDate}</span>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-slate-900">₹{t.commissionAmount}</span>
                          <span className="text-[10px] text-slate-500 block">({t.commissionPercent}%)</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'commissions' && (
              <div className="space-y-3">
                {driverTransactions.map((t) => (
                  <div
                    key={t.id}
                    className="bg-white p-3.5 rounded-2xl border border-slate-200 flex items-center justify-between text-xs hover:border-blue-200 transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-blue-600">{t.rideId}</span>
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold">
                          Fare: ₹{t.rideFare}
                        </span>
                      </div>
                      <p className="text-slate-400 mt-1">{t.createdDate}</p>
                    </div>

                    <div className="text-right">
                      <div className="font-bold text-slate-900 text-sm">
                        +₹{t.commissionAmount}
                      </div>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                        {t.commissionPercent}% Commission
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'payments' && (
              <div className="space-y-3">
                {driverPayments.map((p) => (
                  <div
                    key={p.id}
                    className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2 text-xs"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-mono font-bold text-slate-900">{p.receiptNo}</span>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-bold">
                        {p.status}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-1 border-t border-slate-100">
                      <div>
                        <span className="text-slate-500 block">Method: {p.paymentMethod}</span>
                        <span className="text-slate-400 font-mono text-[10px]">{p.referenceNumber}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-base font-extrabold text-emerald-600">₹{p.amount}</span>
                        <span className="text-slate-400 block text-[10px]">{p.date}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
