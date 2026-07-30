'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { RefreshCw, Wifi, WifiOff } from 'lucide-react'
import { getDriverStatusSummary } from '@/api/driver'
import type { DriverStatusSummary } from '@/api/driver'

interface DriverStatusProps {
  /** Auto-refresh interval in ms. Default: 30s */
  pollInterval?: number
}

export default function DriverStatus({ pollInterval = 30_000 }: DriverStatusProps) {
  const [data,        setData       ] = useState<DriverStatusSummary | null>(null)
  const [loading,     setLoading    ] = useState(true)
  const [refreshing,  setRefreshing ] = useState(false)
  const [error,       setError      ] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // ── Fetch ────────────────────────────────────────────────
  const fetchStatus = useCallback(async (isManual = false) => {
    if (isManual) setRefreshing(true)
    setError(false)
    try {
      const summary = await getDriverStatusSummary()
      setData(summary)
      setLastUpdated(new Date())
    } catch {
      setError(true)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  // ── Poll ─────────────────────────────────────────────────
  useEffect(() => {
    fetchStatus()
    intervalRef.current = setInterval(() => fetchStatus(), pollInterval)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [fetchStatus, pollInterval])

  // ── Derived values ────────────────────────────────────────
  const online  = data?.online  ?? 0
  const onRide  = data?.onRide  ?? 0
  const offline = data?.offline ?? 0
  const total   = data?.total   ?? 0
  const barMax  = total || 1

  // ── Loading skeleton ──────────────────────────────────────
  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 animate-pulse">
        <div className="h-5 w-32 bg-slate-100 rounded mb-6" />
        {[1, 2, 3].map(i => (
          <div key={i} className="mb-5">
            <div className="flex justify-between mb-2">
              <div className="h-4 w-20 bg-slate-100 rounded" />
              <div className="h-4 w-8  bg-slate-100 rounded" />
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full" />
          </div>
        ))}
        <div className="mt-6 pt-4 border-t flex justify-between">
          <div className="h-4 w-24 bg-slate-100 rounded" />
          <div className="h-4 w-20 bg-slate-100 rounded" />
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">

      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-semibold text-blue-700">Driver Status</h3>

        <div className="flex items-center gap-2">
          {/* Live / error pill */}
          {error ? (
            <span className="flex items-center gap-1 text-[10px] text-red-500 font-medium">
              <WifiOff className="h-3 w-3" /> offline
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[10px] text-emerald-600 font-medium">
              <Wifi className="h-3 w-3" />
              {lastUpdated
                ? lastUpdated.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })
                : 'live'}
            </span>
          )}

          {/* Manual refresh */}
          <button
            onClick={() => fetchStatus(true)}
            disabled={refreshing}
            title="Refresh"
            className="p-1.5 rounded-lg border border-slate-200 text-slate-400
                       hover:bg-slate-50 hover:text-slate-600 transition-colors
                       disabled:opacity-40"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* ── Error banner ── */}
      {error && (
        <div className="mb-4 text-xs text-red-600 bg-red-50 border border-red-100
                        rounded-xl px-3 py-2">
          Could not reach the server. Showing last known values.
        </div>
      )}

      {/* ── Bars ── */}
      <div className="space-y-5">

        {/* Online */}
        <div>
          <div className="flex justify-between text-sm">
            <span>Online</span>
            <span className="font-semibold">{online}</span>
          </div>
          <div className="mt-2 h-2 rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-all duration-700"
              style={{ width: `${Math.round((online / barMax) * 100)}%` }}
            />
          </div>
        </div>

        {/* On a Ride */}
        <div>
          <div className="flex justify-between text-sm">
            <span>On a Ride</span>
            <span className="font-semibold">{onRide}</span>
          </div>
          <div className="mt-2 h-2 rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full bg-orange-500 transition-all duration-700"
              style={{ width: `${Math.round((onRide / barMax) * 100)}%` }}
            />
          </div>
        </div>

        {/* Offline */}
        <div>
          <div className="flex justify-between text-sm">
            <span>Offline</span>
            <span className="font-semibold">{offline}</span>
          </div>
          <div className="mt-2 h-2 rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full bg-red-500 transition-all duration-700"
              style={{ width: `${Math.round((offline / barMax) * 100)}%` }}
            />
          </div>
        </div>

      </div>

      {/* ── Footer ── */}
      <div className="mt-6 pt-4 border-t flex justify-between text-sm">
        <span className="text-slate-500">Total Fleet</span>
        <span className="font-semibold">{total} Drivers</span>
      </div>

    </div>
  )
}