'use client'

import { XCircle } from 'lucide-react'

interface RejectModalProps {
  isOpen: boolean
  driverName: string
  reason: string
  onReasonChange: (reason: string) => void
  onConfirm: () => void
  onClose: () => void
  isLoading: boolean
}

export function RejectModal({
  isOpen,
  driverName,
  reason,
  onReasonChange,
  onConfirm,
  onClose,
  isLoading
}: RejectModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md transform transition-all">
        <div className="flex items-center justify-center w-12 h-12 bg-rose-100 rounded-full mx-auto mb-4">
          <XCircle className="h-6 w-6 text-rose-600" />
        </div>
        <h3 className="text-lg font-semibold text-slate-800 text-center mb-2">Reject KYC</h3>
        <p className="text-sm text-slate-500 text-center mb-4">
          Please provide a reason for rejecting {driverName}'s KYC.
        </p>
        <textarea
          value={reason}
          onChange={e => onReasonChange(e.target.value)}
          placeholder="Reason for rejection..."
          rows={3}
          className="w-full text-sm border border-slate-200 rounded-xl p-3 resize-none outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-300 mb-4"
        />
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 rounded-xl bg-rose-600 text-white text-sm font-medium hover:bg-rose-700 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Processing...' : 'Yes, Reject'}
          </button>
        </div>
      </div>
    </div>
  )
}