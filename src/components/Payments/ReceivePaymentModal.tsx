'use client'

import { useState, useEffect } from 'react'
import {
  X,
  CheckCircle2,
  IndianRupee,
  CreditCard,
  QrCode,
  Building2,
  Banknote,
  Receipt,
  AlertCircle,
  Copy,
  Check,
} from 'lucide-react'
import { DriverCommission, PaymentMethod } from './types'

interface ReceivePaymentModalProps {
  isOpen: boolean
  onClose: () => void
  driver?: DriverCommission | null
  allDrivers?: DriverCommission[]
  onSuccessPayment?: (driverId: string, amount: number, method: PaymentMethod, ref: string) => void
}

export default function ReceivePaymentModal({
  isOpen,
  onClose,
  driver: selectedDriver,
  allDrivers = [],
  onSuccessPayment,
}: ReceivePaymentModalProps) {
  const [driverId, setDriverId] = useState<string>('')
  const [amountReceived, setAmountReceived] = useState<string>('')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI')
  const [referenceNumber, setReferenceNumber] = useState<string>('')
  const [notes, setNotes] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [isSuccess, setIsSuccess] = useState<boolean>(false)
  const [copiedRef, setCopiedRef] = useState<boolean>(false)

  // Current active driver model
  const activeDriver =
    selectedDriver ||
    allDrivers.find((d) => d.driverId === driverId) ||
    allDrivers[0]

  useEffect(() => {
    if (selectedDriver) {
      setDriverId(selectedDriver.driverId)
      setAmountReceived(selectedDriver.outstandingCommission.toString())
    } else if (allDrivers.length > 0) {
      setDriverId(allDrivers[0].driverId)
      setAmountReceived(allDrivers[0].outstandingCommission.toString())
    }
    // Auto-generate reference number
    const randomRef = `UPI/${Math.floor(100000000000 + Math.random() * 900000000000)}/ODISHARIDE`
    setReferenceNumber(randomRef)
    setIsSuccess(false)
  }, [selectedDriver, isOpen, allDrivers])

  // Change active driver handler
  const handleDriverChange = (id: string) => {
    setDriverId(id)
    const target = allDrivers.find((d) => d.driverId === id)
    if (target) {
      setAmountReceived(target.outstandingCommission.toString())
    }
  }

  // Method selection updates ref format
  const handleMethodSelect = (method: PaymentMethod) => {
    setPaymentMethod(method)
    const rand = Math.floor(100000000 + Math.random() * 900000000)
    if (method === 'UPI') {
      setReferenceNumber(`UPI/${rand}92/PAYTM`)
    } else if (method === 'Razorpay') {
      setReferenceNumber(`pay_${Math.random().toString(36).substring(2, 12)}`)
    } else if (method === 'Bank Transfer') {
      setReferenceNumber(`NEFT/IMPS_${rand}`)
    } else {
      setReferenceNumber(`CASH-HUB-BBSR-${Math.floor(100 + Math.random() * 900)}`)
    }
  }

  // Preset amount shortcuts
  const setShortcutAmount = (type: 'full' | 'half' | 'round') => {
    if (!activeDriver) return
    const out = activeDriver.outstandingCommission
    if (type === 'full') {
      setAmountReceived(out.toString())
    } else if (type === 'half') {
      setAmountReceived(Math.round(out / 2).toString())
    } else if (type === 'round') {
      setAmountReceived((Math.ceil(out / 100) * 100).toString())
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const numAmount = parseFloat(amountReceived)
    if (isNaN(numAmount) || numAmount <= 0) return

    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSuccess(true)
      if (onSuccessPayment && activeDriver) {
        onSuccessPayment(activeDriver.driverId, numAmount, paymentMethod, referenceNumber)
      }
    }, 600)
  }

  if (!isOpen) return null

  const methodsList: { id: PaymentMethod; label: string; icon: any; color: string }[] = [
    { id: 'UPI', label: 'UPI (GPay / PhonePe / Paytm)', icon: QrCode, color: 'border-blue-500 bg-blue-50/50 text-blue-700' },
    { id: 'Cash', label: 'Cash at Hub', icon: Banknote, color: 'border-emerald-500 bg-emerald-50/50 text-emerald-700' },
    { id: 'Razorpay', label: 'Razorpay Gateway', icon: CreditCard, color: 'border-purple-500 bg-purple-50/50 text-purple-700' },
    { id: 'Bank Transfer', label: 'Bank Transfer (IMPS/NEFT)', icon: Building2, color: 'border-amber-500 bg-amber-50/50 text-amber-700' },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden my-8 transform transition-all">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-blue-600 text-white shadow-md">
              <IndianRupee className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Receive Driver Payment</h2>
              <p className="text-xs text-slate-400">Record manual or online commission collection</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        {isSuccess ? (
          <div className="p-8 text-center">
            <div className="h-16 w-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-1">Payment Received Successfully!</h3>
            <p className="text-sm text-slate-500 mb-6">
              Recorded ₹{amountReceived} for <span className="font-semibold text-slate-800">{activeDriver?.driverName}</span>
            </p>

            {/* Receipt Summary Box */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-left mb-6 space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Receipt No:</span>
                <span className="font-mono font-bold text-slate-800">REC-2026-0805-{Math.floor(100 + Math.random() * 900)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Driver Phone:</span>
                <span className="font-medium text-slate-800">{activeDriver?.phone}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Payment Mode:</span>
                <span className="font-semibold text-blue-600">{paymentMethod}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Reference No:</span>
                <span className="font-mono text-slate-700">{referenceNumber}</span>
              </div>
              <div className="flex justify-between py-1 pt-2 text-sm">
                <span className="font-bold text-slate-700">New Outstanding:</span>
                <span className="font-extrabold text-emerald-600">
                  ₹{Math.max(0, (activeDriver?.outstandingCommission || 0) - parseFloat(amountReceived))}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(referenceNumber)
                  setCopiedRef(true)
                  setTimeout(() => setCopiedRef(false), 2000)
                }}
                className="flex-1 py-3 px-4 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                {copiedRef ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                <span>{copiedRef ? 'Copied Receipt' : 'Copy Reference'}</span>
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-3 px-4 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 shadow-md cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Driver Select / Display */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Select Driver
              </label>
              {selectedDriver ? (
                <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                  <img
                    src={selectedDriver.avatar}
                    alt={selectedDriver.driverName}
                    className="h-10 w-10 rounded-full object-cover border border-slate-300"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-slate-900 truncate">{selectedDriver.driverName}</h4>
                    <p className="text-xs text-slate-500">
                      {selectedDriver.vehicleType} &bull; {selectedDriver.vehicleNumber} &bull; {selectedDriver.phone}
                    </p>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      selectedDriver.status === 'Active'
                        ? 'bg-emerald-100 text-emerald-700'
                        : selectedDriver.status === 'Warning'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-700'
                    }`}
                  >
                    {selectedDriver.status}
                  </span>
                </div>
              ) : (
                <select
                  value={driverId}
                  onChange={(e) => handleDriverChange(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {allDrivers.map((d) => (
                    <option key={d.driverId} value={d.driverId}>
                      {d.driverName} ({d.vehicleType} - {d.phone}) — Outstanding ₹{d.outstandingCommission}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Outstanding & Amount Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-amber-50/70 p-3.5 rounded-2xl border border-amber-200">
                <span className="text-xs font-semibold text-amber-800 block mb-1">
                  Current Outstanding
                </span>
                <span className="text-2xl font-extrabold text-amber-900">
                  ₹{(activeDriver?.outstandingCommission || 0).toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-amber-700 block mt-0.5">
                  Limit: ₹{activeDriver?.commissionLimit}
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Amount Received (₹) *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3 text-slate-400 font-bold">₹</span>
                  <input
                    type="number"
                    min="1"
                    max="50000"
                    required
                    value={amountReceived}
                    onChange={(e) => setAmountReceived(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full pl-8 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-900 text-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                {/* Shortcuts */}
                <div className="flex gap-1.5 mt-2">
                  <button
                    type="button"
                    onClick={() => setShortcutAmount('full')}
                    className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer"
                  >
                    Full (₹{activeDriver?.outstandingCommission})
                  </button>
                  <button
                    type="button"
                    onClick={() => setShortcutAmount('half')}
                    className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer"
                  >
                    50%
                  </button>
                  <button
                    type="button"
                    onClick={() => setShortcutAmount('round')}
                    className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer"
                  >
                    Round Up
                  </button>
                </div>
              </div>
            </div>

            {/* Payment Method Segmented Choice */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Payment Method *
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {methodsList.map((m) => {
                  const MIcon = m.icon
                  const selected = paymentMethod === m.id
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => handleMethodSelect(m.id)}
                      className={`flex items-center gap-2.5 p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                        selected
                          ? `${m.color} border-2 shadow-xs font-semibold`
                          : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                      }`}
                    >
                      <MIcon className={`h-4 w-4 shrink-0 ${selected ? '' : 'text-slate-400'}`} />
                      <span className="text-xs font-medium leading-tight">{m.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Reference Number & Notes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Reference Number / UTR
                </label>
                <input
                  type="text"
                  required
                  value={referenceNumber}
                  onChange={(e) => setReferenceNumber(e.target.value)}
                  placeholder="e.g. UPI/62910481902"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-mono text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Notes / Remarks
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Cleared at Cuttack Hub"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Action Footer */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition-all shadow-md hover:shadow-blue-600/20 disabled:opacity-50 flex items-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Confirm Payment</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
