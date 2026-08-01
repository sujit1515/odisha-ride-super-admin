'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import AdminShell from '@/components/Common/AdminShell'
import {
  Radio, RefreshCw, Clock, Search, Car, Phone,
  MapPin, Wifi, WifiOff, AlertCircle, Loader2, ChevronRight,
} from 'lucide-react'
import { fetchOnlineDriversApi } from '@/api/driver-location'
import type { OnlineDriver } from '@/api/types/types'
import { io } from 'socket.io-client'

const AUTO_REFRESH_SEC = 30

// ─── Helpers ────────────────────────────────────────────────────────────────

function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime()
  const diffMin = Math.floor(diffMs / 60_000)
  if (diffMin < 1) return 'just now'
  if (diffMin < 60) return `${diffMin}m ago`
  const diffHr = Math.floor(diffMin / 60)
  return `${diffHr}h ago`
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-IN', {
    hour: '2-digit', minute: '2-digit', hour12: true,
  })
}

// ─── DriverCard ──────────────────────────────────────────────────────────────

function DriverCard({ driver, index }: { driver: OnlineDriver; index: number }) {
  const ago = timeAgo(driver.updatedAt)
  const isRecent = Date.now() - new Date(driver.updatedAt).getTime() < 5 * 60_000 // < 5 min

  return (
    <Link
      href={`/drivers/${driver.driverId}`}
      className="group flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm hover:shadow-md hover:border-blue-200 hover:-translate-y-0.5 transition-all duration-200"
    >
      {/* Avatar with rank */}
      <div className="relative shrink-0">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-base font-bold shadow-sm">
          {driver.fullName.charAt(0).toUpperCase()}
        </div>
        {/* Online indicator */}
        <span className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white" />
        </span>
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
            {driver.fullName}
          </p>
          {isRecent && (
            <span className="shrink-0 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
              Active
            </span>
          )}
        </div>
        <p className="text-xs text-gray-500 font-mono mt-0.5">#{driver.driverId.slice(-8).toUpperCase()}</p>
        <div className="mt-1.5 flex items-center gap-3 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {driver.latitude.toFixed(4)}, {driver.longitude.toFixed(4)}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {ago}
          </span>
        </div>
      </div>

      <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-blue-400 transition-colors shrink-0" />
    </Link>
  )
}

// ─── Skeleton ────────────────────────────────────────────────────────────────

function DriverCardSkeleton() {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="h-12 w-12 rounded-full bg-gray-100 animate-pulse shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3.5 w-32 rounded-md bg-gray-100 animate-pulse" />
        <div className="h-3 w-24 rounded-md bg-gray-100 animate-pulse" />
        <div className="h-3 w-40 rounded-md bg-gray-100 animate-pulse" />
      </div>
    </div>
  )
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function DriversOnlinePage() {
  const [drivers, setDrivers] = useState<OnlineDriver[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [countdown, setCountdown] = useState(AUTO_REFRESH_SEC)
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchData = useCallback(async (isManual = false) => {
    if (isManual) setRefreshing(true)
    setError(null)
    try {
      const res = await fetchOnlineDriversApi()
      setDrivers(res.drivers)
      setLastRefresh(new Date())
      setCountdown(AUTO_REFRESH_SEC)
    } catch (err: any) {
      console.error('[DriversOnlinePage] fetch failed:', err)
      setError(err?.response?.data?.message ?? 'Failed to load online drivers.')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  // Initial load + WebSocket Real-time Sync & Polling Fallback
  useEffect(() => {
    fetchData()

    if (typeof window === 'undefined') return

    const token = localStorage.getItem('adminToken')
    if (!token) return

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8000/api/v1'
    const socketUrl = baseUrl.replace('/api/v1', '')

    const socket = io(`${socketUrl}/admin`, {
      auth: { token },
      transports: ['websocket'],
    })

    socket.on('connect', () => {
      console.log('[OnlineDrivers] Connected to admin real-time socket')
    })

    socket.on('driver:location-update', (data: any) => {
      setDrivers((prev) => {
        const exists = prev.some(d => d._id === data._id)
        if (exists) {
          return prev.map(d => d._id === data._id ? { ...d, ...data } : d)
        } else {
          return [...prev, data]
        }
      })
      setLastRefresh(new Date())
      setCountdown(AUTO_REFRESH_SEC)
    })

    socket.on('driver:status-change', (data: any) => {
      const { driverId, isOnline, ...details } = data
      if (isOnline) {
        if (details.latitude && details.longitude) {
          setDrivers((prev) => {
            const exists = prev.some(d => d._id === driverId)
            if (exists) return prev
            return [...prev, {
              _id: driverId,
              driverId: details.driverId,
              fullName: details.fullName,
              latitude: details.latitude,
              longitude: details.longitude,
              updatedAt: new Date().toISOString(),
            }]
          })
        }
      } else {
        setDrivers((prev) => prev.filter(d => d._id !== driverId))
      }
      setLastRefresh(new Date())
      setCountdown(AUTO_REFRESH_SEC)
    })

    socket.on('disconnect', () => {
      console.log('[OnlineDrivers] Disconnected from admin socket')
    })

    intervalRef.current = setInterval(() => fetchData(), AUTO_REFRESH_SEC * 1000)

    return () => {
      socket.disconnect()
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [fetchData])

  // Countdown tick
  useEffect(() => {
    const id = setInterval(
      () => setCountdown((c) => (c <= 1 ? AUTO_REFRESH_SEC : c - 1)),
      1000,
    )
    return () => clearInterval(id)
  }, [])

  // ── Filter ─────────────────────────────────────────────────────────────────
  const filtered = drivers.filter((d) =>
    `${d.fullName} ${d.driverId}`.toLowerCase().includes(query.toLowerCase()),
  )

  const total = drivers.length

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <AdminShell title="Drivers Online Now">
      <div className="space-y-6">

        {/* ── Header ── */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Radio className="h-5 w-5 text-emerald-500 animate-pulse" />
              <h1 className="text-2xl font-bold text-gray-900">Drivers Online Right Now</h1>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              {loading
                ? 'Loading live driver data…'
                : `${total} driver${total !== 1 ? 's' : ''} currently online across Odisha`}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {lastRefresh && (
              <div className="flex items-center gap-1.5 text-xs text-gray-400">
                <Clock className="h-3.5 w-3.5" />
                Last: {formatTime(lastRefresh.toISOString())}
                <span className="ml-1 text-amber-500 font-medium">({countdown}s)</span>
              </div>
            )}
            <button
              onClick={() => fetchData(true)}
              disabled={refreshing}
              className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* ── Error banner ── */}
        {error && (
          <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
            <button onClick={() => fetchData(true)} className="ml-auto font-medium underline">
              Retry
            </button>
          </div>
        )}

        {/* ── Stats strip ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Online Now
            </div>
            <p className="text-sm text-gray-600">Total drivers online</p>
            <p className="mt-1 text-4xl font-bold text-gray-900">{loading ? '—' : total}</p>
          </div>
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
              <Wifi className="h-3.5 w-3.5 text-blue-500" />
              Active (last 5 min)
            </div>
            <p className="text-sm text-gray-600">Recently updated location</p>
            <p className="mt-1 text-4xl font-bold text-gray-900">
              {loading ? '—' : drivers.filter(d => Date.now() - new Date(d.updatedAt).getTime() < 5 * 60_000).length}
            </p>
          </div>
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
              <WifiOff className="h-3.5 w-3.5 text-amber-500" />
              Idle (&gt; 5 min)
            </div>
            <p className="text-sm text-gray-600">No recent location ping</p>
            <p className="mt-1 text-4xl font-bold text-gray-900">
              {loading ? '—' : drivers.filter(d => Date.now() - new Date(d.updatedAt).getTime() >= 5 * 60_000).length}
            </p>
          </div>
        </div>

        {/* ── Search ── */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or driver ID…"
            className="w-full rounded-full border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {/* ── Driver Grid ── */}
        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
          {/* Card header */}
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <h2 className="text-base font-semibold text-gray-900">Online Drivers</h2>
            </div>
            <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-600">
              {loading ? '…' : filtered.length}
            </span>
          </div>

          <div className="p-4">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                {[...Array(6)].map((_, i) => <DriverCardSkeleton key={i} />)}
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
                  <WifiOff className="h-7 w-7 text-gray-400" />
                </div>
                <p className="text-sm font-medium text-gray-700">
                  {query ? 'No drivers match your search' : 'No drivers online right now'}
                </p>
                <p className="text-xs text-gray-400">
                  {query ? 'Try a different name or ID' : 'Check back in a few minutes'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                {filtered.map((driver, i) => (
                  <DriverCard key={driver._id} driver={driver} index={i} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Footer live bar ── */}
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span>
            Live data — refreshing in{' '}
            <span className="text-amber-600 font-medium">{countdown}s</span>
          </span>
        </div>

      </div>
    </AdminShell>
  )
}
