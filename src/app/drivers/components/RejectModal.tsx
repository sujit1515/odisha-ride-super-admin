'use client'

import { XCircle } from 'lucide-react'

export interface RejectModalProps {
  isOpen: boolean
  driverName: string
  reason: string
  onReasonChange: (reason: string) => void
  flaggedDocuments: string[]
  onFlaggedDocumentsChange: (docs: string[]) => void
  onConfirm: () => void
  onClose: () => void
  isLoading: boolean
}

const DOCUMENT_OPTIONS = [
  { id: 'profileImage', label: 'Profile Image' },
  { id: 'aadhaarImage', label: 'Aadhaar Image' },
  { id: 'licenseImage', label: 'License Image' },
  { id: 'rcImage', label: 'RC Document' },
]

export function RejectModal({
  isOpen,
  driverName,
  reason,
  onReasonChange,
  flaggedDocuments,
  onFlaggedDocumentsChange,
  onConfirm,
  onClose,
  isLoading,
}: RejectModalProps) {
  if (!isOpen) return null

  const toggleDocument = (docId: string) => {
    if (flaggedDocuments.includes(docId)) {
      onFlaggedDocumentsChange(flaggedDocuments.filter(id => id !== docId))
    } else {
      onFlaggedDocumentsChange([...flaggedDocuments, docId])
    }
  }

  const isFormValid = flaggedDocuments.length > 0 && reason.trim().length > 0

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md transform transition-all">
        <div className="flex items-center justify-center w-12 h-12 bg-rose-100 rounded-full mx-auto mb-4">
          <XCircle className="h-6 w-6 text-rose-600" />
        </div>
        <h3 className="text-lg font-semibold text-slate-800 text-center mb-2">Reject Application</h3>
        <p className="text-sm text-slate-500 text-center mb-4">
          Select which document(s) need re-upload for <span className="font-semibold text-slate-700">{driverName}</span>:
        </p>

        <div className="space-y-2 mb-4">
          {DOCUMENT_OPTIONS.map(doc => {
            const isChecked = flaggedDocuments.includes(doc.id)
            return (
              <label
                key={doc.id}
                onClick={() => toggleDocument(doc.id)}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                  isChecked
                    ? 'border-rose-300 bg-rose-50/50 text-rose-900 font-medium'
                    : 'border-slate-200 bg-slate-50/50 text-slate-700 hover:bg-slate-100/50'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => {}} // handled by label onClick
                  className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 border-slate-300"
                />
                <span className="text-sm">{doc.label}</span>
              </label>
            )
          })}
        </div>

        <p className="text-xs font-medium text-slate-500 mb-1">Rejection Reason Explanation</p>
        <textarea
          value={reason}
          onChange={e => onReasonChange(e.target.value)}
          placeholder="Detailed reason for rejection..."
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
            disabled={isLoading || !isFormValid}
            className="flex-1 px-4 py-2.5 rounded-xl bg-rose-600 text-white text-sm font-medium hover:bg-rose-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Processing...' : 'Confirm Reject'}
          </button>
        </div>
      </div>
    </div>
  )
}