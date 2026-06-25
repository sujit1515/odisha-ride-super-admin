'use client'

import { useState } from 'react'

interface ResolveAlertModalProps {
  open: boolean
  alertName: string
  isSubmitting: boolean
  onConfirm: (note?: string) => void
  onCancel: () => void
}

export default function ResolveAlertModal({
  open,
  alertName,
  isSubmitting,
  onConfirm,
  onCancel,
}: ResolveAlertModalProps) {
  const [note, setNote] = useState('')

  if (!open) return null

  const handleConfirm = () => {
    onConfirm(note.trim() ? note.trim() : undefined)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-red-100 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-1">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500 shrink-0" />
          <h3 className="text-lg font-semibold text-slate-900">
            Mark alert as resolved
          </h3>
        </div>
        <p className="text-sm text-slate-500 mt-1 mb-4">
          You&rsquo;re resolving the SOS alert for{' '}
          <span className="font-medium text-slate-700">{alertName}</span>.
          This cannot be undone.
        </p>

        <label className="block text-xs font-medium text-slate-600 mb-1.5">
          Resolution note (optional)
        </label>
        <textarea
          autoFocus
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="e.g. Spoke with rider by phone — false alarm"
          rows={3}
          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-800
                     placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-200
                     focus:border-red-300 resize-none"
        />

        <div className="flex items-center justify-end gap-2 mt-5">
          <button
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium rounded-xl text-slate-600
                       hover:bg-slate-100 transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium rounded-xl bg-red-600 text-white
                       hover:bg-red-700 transition disabled:opacity-50 inline-flex items-center gap-2"
          >
            {isSubmitting && (
              <span className="h-3.5 w-3.5 rounded-full border-2 border-white/40 border-t-white animate-spin" />
            )}
            {isSubmitting ? 'Resolving…' : 'Mark Resolved'}
          </button>
        </div>
      </div>
    </div>
  )
}