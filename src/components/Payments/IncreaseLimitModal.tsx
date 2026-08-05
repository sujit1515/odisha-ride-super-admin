'use client'

import { useState } from 'react'
import { X, ShieldAlert, ArrowUpRight, CheckCircle2 } from 'lucide-react'
import { DriverCommission } from './types'

interface IncreaseLimitModalProps {
  isOpen: boolean
  onClose: () => void
  driver: DriverCommission | null
  onUpdateLimit?: (driverId: string, newLimit: number) => void
}

export default function IncreaseLimitModal({
  isOpen,
  onClose,
  driver,
  onUpdateLimit,
}: IncreaseLimitModalProps) {
  const [newLimit, setNewLimit] = useState<string>(
    driver ? (driver.commissionLimit + 500).toString() : '2000'
  )
  const [reason, setReason] = useState<string>('High ride volume seasonal approval')
  const [isSuccess, setIsSuccess] = useState<boolean>(false)

  if (!isOpen || !driver) return null

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    const val = parseFloat(newLimit)
    if (isNaN(val) || val < 500) return

    if (onUpdateLimit) {
      onUpdateLimit(driver.driverId, val)
    }
    setIsSuccess(true)
    setTimeout(() => {
      setIsSuccess(false)
      onClose()
    }, 800)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden transform transition-all">
        <div className="bg-blue-600 text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/10">
              <ArrowUpRight className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Increase Commission Limit</h3>
              <p className="text-xs text-blue-100">{driver.driverName} ({driver.driverId})</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-blue-100 hover:text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center">
            <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto mb-2 animate-bounce" />
            <h4 className="font-bold text-slate-900">Limit Updated Successfully!</h4>
            <p className="text-xs text-slate-500 mt-1">New limit set to ₹{newLimit}</p>
          </div>
        ) : (
          <form onSubmit={handleSave} className="p-6 space-y-4">
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Current Limit:</span>
                <span className="font-bold text-slate-800">₹{driver.commissionLimit}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Outstanding:</span>
                <span className="font-semibold text-amber-700">₹{driver.outstandingCommission}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                New Limit (₹) *
              </label>
              <input
                type="number"
                step="100"
                min="500"
                max="10000"
                required
                value={newLimit}
                onChange={(e) => setNewLimit(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-900 text-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-2">
              {[2000, 2500, 3000].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setNewLimit(preset.toString())}
                  className="flex-1 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 transition-colors cursor-pointer"
                >
                  ₹{preset}
                </button>
              ))}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Reason for Limit Increase
              </label>
              <textarea
                rows={2}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 shadow-md cursor-pointer"
              >
                Save New Limit
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
