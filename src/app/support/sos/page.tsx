'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import AdminShell from '@/components/Common/AdminShell'
import { getActiveSosAlerts, resolveSosAlert } from '@/api/sos'
import type { SosAlert } from '@/api/sos'

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

  const handleResolve = async (id: string) => {
    setResolvingId(id)
    try {
      await resolveSosAlert(id)
      setAlerts(prev => prev.filter(a => a._id !== id))
    } finally {
      setResolvingId(null)
    }
  }

  return (
    <AdminShell title="Emergency SOS Alerts">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-red-700">Active Emergencies</h2>
          <p className="text-sm text-slate-500 mt-1">
            {alerts.length} active right now &middot; refreshing every 10s
          </p>
        </div>
      </div>

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
                onClick={() => handleResolve(alert._id)}
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
    </AdminShell>
  )
}