'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminShell from '@/components/Common/AdminShell'
import { getResolvedSosAlerts, clearResolvedSosAlerts } from '@/app/support/sos/api/sos'
import type { ResolvedSosAlert } from '@/api/types/types'

const CONFIRM_PHRASE = 'DELETE ALL'

function formatDateTime(dateStr: string | null): string {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function ResolvedSosAlertsPage() {
  const [alerts, setAlerts] = useState<ResolvedSosAlert[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)

  const [showClearModal, setShowClearModal] = useState(false)
  const [confirmText, setConfirmText] = useState('')
  const [clearing, setClearing] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const fetchResolved = useCallback(async (pageNum: number) => {
    setLoading(true)
    try {
      const res = await getResolvedSosAlerts(pageNum, 20)
      setAlerts(res.data)
      setTotalPages(res.totalPages)
      setTotal(res.total)
    } catch (err) {
      console.error('Failed to load resolved SOS alerts:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchResolved(page)
  }, [page, fetchResolved])

  const handleClearAll = async () => {
    setClearing(true)
    setErrorMessage(null)
    try {
      await clearResolvedSosAlerts()
      setShowClearModal(false)
      setConfirmText('')
      setPage(1)
      fetchResolved(1)
    } catch (err) {
      console.error('Failed to clear resolved SOS alerts:', err)
      setErrorMessage('Could not clear alerts. Please try again.')
    } finally {
      setClearing(false)
    }
  }

  const closeModal = () => {
    if (clearing) return
    setShowClearModal(false)
    setConfirmText('')
  }

  const router = useRouter()

  return (
    <AdminShell title="Resolved SOS Alerts">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="h-9 w-9 flex items-center justify-center rounded-full border border-slate-200
                       text-slate-600 hover:bg-slate-50 transition shrink-0"
            aria-label="Go back"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Resolved Emergencies</h2>
            <p className="text-sm text-slate-500 mt-1">
              {total} total &middot; page {page} of {totalPages || 1}
            </p>
          </div>
        </div>

        {total > 0 && (
          <button
            onClick={() => setShowClearModal(true)}
            className="px-4 py-2 text-sm font-medium rounded-xl border border-red-200 text-red-600
                       hover:bg-red-50 transition"
          >
            Clear All
          </button>
        )}
      </div>

      {errorMessage && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 text-red-700 text-sm px-4 py-3">
          {errorMessage}
        </div>
      )}

      {loading ? (
        <div className="text-slate-400 text-sm">Loading history...</div>
      ) : alerts.length === 0 ? (
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 text-slate-500 text-sm">
          No resolved alerts yet.
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map(alert => {
            const isSelfResolved = alert.status === 'SELF_RESOLVED'
            return (
              <div
                key={alert._id}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <span className="h-3 w-3 rounded-full bg-emerald-500 shrink-0 mt-1" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          alert.triggeredBy === 'DRIVER'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-purple-100 text-purple-700'
                        }`}>
                          {alert.triggeredBy}
                        </span>
                        <span className="font-semibold text-slate-900">{alert.name}</span>
                        {alert.publicId && (
                          <span className="text-xs text-slate-400">({alert.publicId})</span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        {alert.phoneNumber ?? 'No phone on file'} &middot; triggered {formatDateTime(alert.createdAt)}
                        {alert.rideId && ' · mid-ride'}
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        {alert.latitude.toFixed(5)}, {alert.longitude.toFixed(5)}
                      </div>
                    </div>
                  </div>

                  <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${
                    isSelfResolved
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {alert.resolvedByLabel}
                  </span>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                  <span>Resolved {formatDateTime(alert.resolvedAt)}</span>
                  {alert.resolutionNote && (
                    <span className="text-slate-500 italic truncate max-w-xs">
                      &ldquo;{alert.resolutionNote}&rdquo;
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1.5 text-sm rounded-lg border border-slate-200 text-slate-600
                       hover:bg-slate-50 disabled:opacity-40 transition"
          >
            Previous
          </button>
          <span className="text-sm text-slate-500">
            {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1.5 text-sm rounded-lg border border-slate-200 text-slate-600
                       hover:bg-slate-50 disabled:opacity-40 transition"
          >
            Next
          </button>
        </div>
      )}

      {/* ── Clear-all confirmation modal ─────────────────────────────── */}
      {showClearModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4"
          onClick={closeModal}
        >
          <div
            className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-red-100 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-1">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500 shrink-0" />
              <h3 className="text-lg font-semibold text-slate-900">
                Permanently delete all resolved alerts?
              </h3>
            </div>
            <p className="text-sm text-slate-500 mt-1 mb-4">
              This will permanently delete all {total} resolved and self-resolved
              SOS records. Active emergencies are not affected. This action
              cannot be undone.
            </p>

            <label className="block text-xs font-medium text-slate-600 mb-1.5">
              Type <span className="font-mono font-semibold text-red-600">{CONFIRM_PHRASE}</span> to confirm
            </label>
            <input
              autoFocus
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder={CONFIRM_PHRASE}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-800
                         placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-200
                         focus:border-red-300 font-mono"
            />

            <div className="flex items-center justify-end gap-2 mt-5">
              <button
                onClick={closeModal}
                disabled={clearing}
                className="px-4 py-2 text-sm font-medium rounded-xl text-slate-600
                           hover:bg-slate-100 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleClearAll}
                disabled={clearing || confirmText !== CONFIRM_PHRASE}
                className="px-4 py-2 text-sm font-medium rounded-xl bg-red-600 text-white
                           hover:bg-red-700 transition disabled:opacity-40 inline-flex items-center gap-2"
              >
                {clearing && (
                  <span className="h-3.5 w-3.5 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                )}
                {clearing ? 'Deleting…' : 'Permanently Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  )
}