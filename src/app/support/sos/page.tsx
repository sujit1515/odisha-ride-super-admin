'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import AdminShell from '@/components/Common/AdminShell'
import { getActiveSosAlerts, resolveSosAlert } from '@/app/support/sos/api/sos'
import type { SosAlert } from '@/api/types/types'
import { useSosSocket } from '@/hooks/useSosSocket'
import ResolveAlertModal from '@/components/SOS/ResolveAlertModal'

function timeAgo(dateStr: string): string {
  const diffMs = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diffMs / 60000)
  if (mins < 1) return 'just now'
  if (mins === 1) return '1 min ago'
  if (mins < 60) return `${mins} min ago`
  const hrs = Math.floor(mins / 60)
  return `${hrs}h ${mins % 60}m ago`
}

export default function SosAlertsPage() {
  const [alerts, setAlerts] = useState<SosAlert[]>([])
  const [loading, setLoading] = useState(true)
  const [resolvingId, setResolvingId] = useState<string | null>(null)
  const [targetAlert, setTargetAlert] = useState<SosAlert | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const fetchAlerts = useCallback(async () => {
    try {
      const data = await getActiveSosAlerts()
      setAlerts(data)
    } catch {
      // keep showing last known list on transient errors
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAlerts()
    intervalRef.current = setInterval(fetchAlerts, 10_000)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [fetchAlerts])

  useSosSocket({
    onNew: fetchAlerts,
    onResolved: fetchAlerts,
  })

  const handleConfirmResolve = async (note?: string) => {
    if (!targetAlert) return
    const id = targetAlert._id
    setResolvingId(id)
    setErrorMessage(null)
    try {
      await resolveSosAlert(id, note)
      setAlerts(prev => prev.filter(a => a._id !== id))
      setTargetAlert(null)
    } catch (err) {
      console.error('Failed to resolve SOS alert:', err)
      setErrorMessage('Could not resolve this alert. Please try again.')
    } finally {
      setResolvingId(null)
    }
  }

  const router = useRouter()

  return (
    <AdminShell title="Emergency SOS Alerts">
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
            <h2 className="text-xl font-semibold text-red-700">Active Emergencies</h2>
            <p className="text-sm text-slate-500 mt-1">
              {alerts.length} active right now &middot; refreshing every 10s
            </p>
          </div>
        </div>

        <Link
          href="/support/sos/resolved"
          className="px-4 py-2 text-sm font-medium rounded-xl border border-slate-200 text-slate-600
                     hover:bg-yellow-50 hover:border-yellow-200 hover:text-yellow-700 transition"
        >
          View Resolved
        </Link>
      </div>

      {errorMessage && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 text-red-700 text-sm px-4 py-3">
          {errorMessage}
        </div>
      )}

      {loading ? (
        <div className="text-slate-400 text-sm">Loading alerts...</div>
      ) : alerts.length === 0 ? (
        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 text-emerald-700 text-sm">
          No active SOS alerts. All clear.
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map(alert => (
            <div
              key={alert._id}
              className="bg-white border border-red-100 rounded-2xl p-5 shadow-sm flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <span className="h-3 w-3 rounded-full bg-red-500 animate-pulse shrink-0" />
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
                    {alert.phoneNumber ?? 'No phone on file'} &middot; triggered {timeAgo(alert.createdAt)}
                    {alert.rideId && ' · mid-ride'}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {alert.latitude.toFixed(5)}, {alert.longitude.toFixed(5)}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setTargetAlert(alert)}
                disabled={resolvingId === alert._id}
                className="px-4 py-2 text-sm font-medium rounded-xl bg-red-600 text-white
                           hover:bg-red-700 transition disabled:opacity-50"
              >
                {resolvingId === alert._id ? 'Resolving...' : 'Mark Resolved'}
              </button>
            </div>
          ))}
        </div>
      )}

      <ResolveAlertModal
        open={targetAlert !== null}
        alertName={targetAlert?.name ?? ''}
        isSubmitting={resolvingId === targetAlert?._id}
        onConfirm={handleConfirmResolve}
        onCancel={() => setTargetAlert(null)}
      />
    </AdminShell>
  )
}