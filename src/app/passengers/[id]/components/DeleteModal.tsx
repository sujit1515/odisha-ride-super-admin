'use client'

import { AlertTriangle } from 'lucide-react'

interface DeleteModalProps {
  isOpen: boolean
  passengerName: string
  passengerEmail: string
  passengerId: string
  onConfirm: () => void
  onClose: () => void
  isLoading: boolean
}

export function DeleteModal({
  isOpen,
  passengerName,
  passengerEmail,
  passengerId,
  onConfirm,
  onClose,
  isLoading
}: DeleteModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md transform transition-all">
        <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-4">
          <AlertTriangle className="h-6 w-6 text-red-600" />
        </div>
        <h3 className="text-lg font-semibold text-slate-800 text-center mb-2">Delete Passenger</h3>
        <p className="text-sm text-slate-500 text-center mb-1">
          Are you sure you want to delete
        </p>
        <p className="text-center text-sm font-semibold text-slate-800 mb-1">
          {passengerName}
        </p>
        <p className="text-center text-xs text-slate-400 mb-2">{passengerEmail}</p>
        <p className="text-center text-xs font-mono text-slate-500 mb-5">
          {passengerId}
        </p>
        <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 mb-6">
          <p className="text-xs text-red-600 text-center font-medium">
            ⚠️ This action cannot be undone. All data associated with this
            account will be permanently removed.
          </p>
        </div>
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
            className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Processing...' : 'Yes, Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}