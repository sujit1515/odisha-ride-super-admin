'use client'
import { useState, useMemo, useEffect, useCallback, useRef } from 'react'
import {
  Search, RefreshCw, Clock, IndianRupee,
  UserX, Car, Phone, X, ChevronDown, Loader2, AlertCircle, Radio
} from 'lucide-react'

const AUTO_REFRESH_SEC = 15
import AdminShell from '@/components/Common/AdminShell'
import {
  getWaitingPassengers,
  adminCancelRide,
} from '@/api/passengers-waiting'
import { SearchingPassenger, MatchedPassenger } from '@/api/types/types';

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatWait(seconds: number) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}m ${s.toString().padStart(2, '0')}s`
}

function waitSeverity(seconds: number) {
  if (seconds >= 300) return 'critical'
  if (seconds >= 150) return 'warning'
  return 'normal'
}

const severityStyles = {
  normal: { bg: '#ECFDF5', text: '#059669', dot: '#10B981' },
  warning: { bg: '#FFFBEB', text: '#B45309', dot: '#F59E0B' },
  critical: { bg: '#FEF2F2', text: '#DC2626', dot: '#EF4444' },
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function WaitBadge({ seconds }: { seconds: number }) {
  const sev = waitSeverity(seconds) as keyof typeof severityStyles
  const style = severityStyles[sev]
  return (
    <span
      style={{ backgroundColor: style.bg, color: style.text }}
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
    >
      <span style={{ backgroundColor: style.dot }} className="h-1.5 w-1.5 rounded-full" />
      {formatWait(seconds)}
    </span>
  )
}

function RouteLine({ pickup, drop }: { pickup: string; drop: string }) {
  return (
    <div className="flex flex-col gap-1.5 text-sm">
      <div className="flex items-start gap-2">
        <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
        <span className="text-gray-700 leading-snug">{pickup}</span>
      </div>
      <div className="ml-[3px] h-3 w-px bg-gray-300" />
      <div className="flex items-start gap-2">
        <span className="mt-0.5 h-2 w-2 shrink-0 rounded-sm bg-blue-600" />
        <span className="text-gray-700 leading-snug">{drop}</span>
      </div>
    </div>
  )
}

function ActionMenu({
  onCancel,
  onCall,
}: {
  onCancel: () => void
  onCall: () => void
}) {
  const [open, setOpen] = useState(false)
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        Actions
        <ChevronDown className="h-3.5 w-3.5" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-20 mt-1 w-44 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
            <button
              onClick={() => { onCall(); setOpen(false) }}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
            >
              <Phone className="h-3.5 w-3.5" />
              Call passenger
            </button>
            <button
              onClick={() => { onCancel(); setOpen(false) }}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
            >
              <UserX className="h-3.5 w-3.5" />
              Cancel request
            </button>
          </div>
        </>
      )}
    </div>
  )
}

function SectionCard({
  title,
  liveDotColor,
  count,
  children,
}: {
  title: string
  liveDotColor: string
  count: number
  children: React.ReactNode
}) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
        <div className="flex items-center gap-2">
          <span style={{ backgroundColor: liveDotColor }} className="h-2 w-2 rounded-full animate-pulse" />
          <h2 className="text-base font-semibold text-gray-900">{title}</h2>
        </div>
        <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-600">
          {count}
        </span>
      </div>
      {children}
    </div>
  )
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
        <Clock className="h-5 w-5 text-gray-400" />
      </div>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  )
}

// Skeleton loader for a table row
function SkeletonRow() {
  return (
    <div className="grid grid-cols-1 gap-4 px-6 py-4 sm:grid-cols-[1fr_1.4fr_auto_auto_auto] sm:items-center">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-4 rounded-md bg-gray-100 animate-pulse" style={{ width: `${60 + i * 8}%` }} />
      ))}
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function PassengersWaitingPage() {
  const [query, setQuery] = useState('')
  const [searching, setSearching] = useState<SearchingPassenger[]>([])
  const [matched, setMatched] = useState<MatchedPassenger[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Countdown state
  const [countdown, setCountdown] = useState(AUTO_REFRESH_SEC)
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null)

  // Cancel confirmation state
  const [cancelTarget, setCancelTarget] = useState<(SearchingPassenger | MatchedPassenger) | null>(null)
  const [cancelling, setCancelling] = useState(false)

  // Auto-refresh interval ref
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // ── Fetch logic ─────────────────────────────────────────────────────────────
  const fetchData = useCallback(async (isManual = false) => {
    if (isManual) setRefreshing(true)
    setError(null)
    try {
      const data = await getWaitingPassengers()
      setSearching(data.searching)
      setMatched(data.matched)
      setLastRefresh(new Date())
      setCountdown(AUTO_REFRESH_SEC)   // reset countdown on every successful fetch
    } catch (err: any) {
      console.error('[WaitingPage] fetch failed:', err)
      setError(err?.response?.data?.message ?? 'Failed to load waiting passengers.')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  // ── Initial load + 15s polling ──────────────────────────────────────────────
  useEffect(() => {
    fetchData()
    intervalRef.current = setInterval(() => fetchData(), AUTO_REFRESH_SEC * 1000)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [fetchData])

  // ── Countdown tick — decrements every second independently ─────────────────
  useEffect(() => {
    const id = setInterval(
      () => setCountdown((c) => (c <= 1 ? AUTO_REFRESH_SEC : c - 1)),
      1000,
    )
    return () => clearInterval(id)
  }, [])

  // ── Cancel ride ─────────────────────────────────────────────────────────────
  const handleConfirmCancel = async () => {
    if (!cancelTarget) return
    setCancelling(true)
    try {
      await adminCancelRide(cancelTarget._id, 'Cancelled by admin from waiting list')
      // Remove from local state immediately for instant feedback
      setSearching((prev) => prev.filter((p) => p._id !== cancelTarget._id))
      setMatched((prev) => prev.filter((p) => p._id !== cancelTarget._id))
      setCancelTarget(null)
    } catch (err: any) {
      alert(err?.response?.data?.message ?? 'Failed to cancel ride. Please try again.')
    } finally {
      setCancelling(false)
    }
  }

  // ── Filtered lists ──────────────────────────────────────────────────────────
  const filteredSearching = useMemo(
    () =>
      searching.filter((p) =>
        `${p.passenger.name} ${p._id} ${p.pickup} ${p.drop}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      ),
    [query, searching],
  )

  const filteredMatched = useMemo(
    () =>
      matched.filter((p) =>
        `${p.passenger.name} ${p._id} ${p.pickup} ${p.drop} ${(p as MatchedPassenger).driver?.name}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      ),
    [query, matched],
  )

  const totalWaiting = searching.length + matched.length

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <AdminShell title="Passengers Waiting">

      {/* ── Header ── */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Radio className="h-5 w-5 text-green-500 animate-pulse" />
            <h1 className="text-2xl font-bold text-gray-900">Passengers Waiting</h1>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            {loading
              ? 'Loading live data…'
              : `${totalWaiting} passenger${totalWaiting !== 1 ? 's' : ''} waiting right now across Odisha`}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Last refresh + countdown */}
          {lastRefresh && (
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <Clock className="h-3.5 w-3.5" />
              Last:{' '}
              {lastRefresh.toLocaleTimeString('en-IN', {
                hour: '2-digit', minute: '2-digit', hour12: true,
              })}
              <span className="ml-1 text-amber-500 font-medium">({countdown}s)</span>
            </div>
          )}

          <button
            onClick={() => fetchData(true)}
            disabled={refreshing}
            className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* ── Error banner ── */}
      {error && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
          <button onClick={() => fetchData(true)} className="ml-auto font-medium underline">
            Retry
          </button>
        </div>
      )}

      {/* ── Stats cards ── */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="mb-2 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-sm text-gray-500">Live Now</span>
          </div>
          <p className="text-sm text-gray-600">Passengers waiting right now</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">
            {loading ? '—' : totalWaiting}
          </p>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="mb-2 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-sm text-gray-500">Searching</span>
          </div>
          <p className="text-sm text-gray-600">No driver accepted yet</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">
            {loading ? '—' : searching.length}
          </p>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="mb-2 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-sm text-gray-500">Matched</span>
          </div>
          <p className="text-sm text-gray-600">Driver assigned, arriving</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">
            {loading ? '—' : matched.length}
          </p>
        </div>
      </div>

      {/* ── Search ── */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by passenger, request ID, or address…"
            className="w-full rounded-full border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>

      {/* ── Section 1: Searching ── */}
      <div className="mb-6">
        <SectionCard title="Searching for a driver" liveDotColor="#3B82F6" count={filteredSearching.length}>
          {loading ? (
            <div className="divide-y divide-gray-100">
              {[...Array(3)].map((_, i) => <SkeletonRow key={i} />)}
            </div>
          ) : filteredSearching.length === 0 ? (
            <EmptyState label="No passengers currently searching for a driver." />
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredSearching.map((p) => (
                <div
                  key={p._id}
                  className="grid grid-cols-1 gap-4 px-6 py-4 sm:grid-cols-[1fr_1.4fr_auto_auto_auto] sm:items-center"
                >
                  <div>
                    <p className="text-xs font-medium text-blue-600 font-mono">{p._id.slice(-8).toUpperCase()}</p>
                    <p className="text-sm font-semibold text-gray-900">{p.passenger.name}</p>
                    <p className="text-xs text-gray-500">{p.passenger.phone}</p>
                    {p.vehicleType && (
                      <p className="text-xs text-gray-400 mt-0.5 capitalize">{p.vehicleType.toLowerCase()} · {p.paymentMethod}</p>
                    )}
                  </div>

                  <RouteLine pickup={p.pickup} drop={p.drop} />

                  <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-900">
                    <IndianRupee className="h-3.5 w-3.5 text-gray-400" />
                    {p.estimatedFare}
                  </div>

                  <WaitBadge seconds={p.waitSeconds} />

                  <ActionMenu
                    onCall={() => window.open(`tel:${p.passenger.phone}`)}
                    onCancel={() => setCancelTarget(p)}
                  />
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      </div>

      {/* ── Section 2: Matched ── */}
      <div>
        <SectionCard title="Driver assigned · en route" liveDotColor="#10B981" count={filteredMatched.length}>
          {loading ? (
            <div className="divide-y divide-gray-100">
              {[...Array(2)].map((_, i) => <SkeletonRow key={i} />)}
            </div>
          ) : filteredMatched.length === 0 ? (
            <EmptyState label="No passengers currently waiting on an assigned driver." />
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredMatched.map((p) => {
                const mp = p as MatchedPassenger
                return (
                  <div
                    key={p._id}
                    className="grid grid-cols-1 gap-4 px-6 py-4 sm:grid-cols-[1fr_1.4fr_auto_auto_auto_auto] sm:items-center"
                  >
                    <div>
                      <p className="text-xs font-medium text-blue-600 font-mono">{p._id.slice(-8).toUpperCase()}</p>
                      <p className="text-sm font-semibold text-gray-900">{p.passenger.name}</p>
                      <p className="text-xs text-gray-500">{p.passenger.phone}</p>
                    </div>

                    <RouteLine pickup={p.pickup} drop={p.drop} />

                    <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-900">
                      <IndianRupee className="h-3.5 w-3.5 text-gray-400" />
                      {p.estimatedFare}
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-900">{mp.driver.name}</p>
                      <p className="flex items-center gap-1 text-xs text-gray-500">
                        <Car className="h-3 w-3" />
                        ETA {mp.eta} · {mp.driver.vehicle}
                      </p>
                    </div>

                    <WaitBadge seconds={p.waitSeconds} />

                    <ActionMenu
                      onCall={() => window.open(`tel:${p.passenger.phone}`)}
                      onCancel={() => setCancelTarget(p)}
                    />
                  </div>
                )
              })}
            </div>
          )}
        </SectionCard>
      </div>

      {/* ── Cancel Confirmation Dialog ── */}
      {/* ── Footer live bar ── */}
      <div className="mt-6 flex items-center gap-2 text-xs text-gray-400">
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
        </span>
        <span>
          Live data — refreshing in{' '}
          <span className="text-amber-600 font-medium">{countdown}s</span>
        </span>
      </div>

      {cancelTarget && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-start justify-between">
              <h3 className="text-base font-semibold text-gray-900">Cancel this request?</h3>
              <button
                onClick={() => setCancelTarget(null)}
                className="text-gray-400 hover:text-gray-600"
                disabled={cancelling}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="mb-5 text-sm text-gray-600">
              <span className="font-semibold">{cancelTarget.passenger.name}&apos;s</span> ride request (
              <span className="font-mono">{cancelTarget._id.slice(-8).toUpperCase()}</span>) will be cancelled and
              they&apos;ll be notified to request again.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setCancelTarget(null)}
                disabled={cancelling}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Keep waiting
              </button>
              <button
                onClick={handleConfirmCancel}
                disabled={cancelling}
                className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
              >
                {cancelling && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                Cancel request
              </button>
            </div>
          </div>
        </div>
      )}

    </AdminShell>
  )
}