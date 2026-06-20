'use client'

import { Ban } from 'lucide-react'

interface DeactivateModalProps {
  isOpen: boolean
  passengerName: string
  reason: string
  onReasonChange: (reason: string) => void
  onConfirm: () => void
  onClose: () => void
  isLoading: boolean
}

export function DeactivateModal({
  isOpen,
  passengerName,
  reason,
  onReasonChange,
  onConfirm,
  onClose,
  isLoading
}: DeactivateModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md transform transition-all">
        <div className="flex items-center justify-center w-12 h-12 bg-amber-100 rounded-full mx-auto mb-4">
          <Ban className="h-6 w-6 text-amber-600" />
        </div>
        <h3 className="text-lg font-semibold text-slate-800 text-center mb-2">Deactivate Passenger</h3>
        <p className="text-sm text-slate-500 text-center mb-4">
          {passengerName} will lose access to the platform immediately.
        </p>
        <label className="text-sm font-medium text-slate-700 mb-1.5 block">
          Reason for deactivation <span className="text-red-500">*</span>
        </label>
        <textarea
          value={reason}
          onChange={e => onReasonChange(e.target.value)}
          placeholder="e.g. Violated terms of service, suspicious activity..."
          rows={3}
          className="w-full text-sm border border-slate-200 rounded-xl p-3 resize-none outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 mb-4"
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
            disabled={isLoading || !reason.trim()}
            className="flex-1 px-4 py-2.5 rounded-xl bg-amber-600 text-white text-sm font-medium hover:bg-amber-700 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Processing...' : 'Yes, Deactivate'}
          </button>
        </div>
      </div>
    </div>
  )
}