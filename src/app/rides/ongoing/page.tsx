'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, RefreshCw, Radio, Clock } from 'lucide-react'
import Loader from '@/components/Common/Loader'
import AdminShell from '@/components/Common/AdminShell'
import { getOngoingRides } from '@/app/rides/api/rides'



type OngoingStatus = 'requested' | 'accepted' | 'arrived' | 'started'

interface Ride {
  _id: string
  userId: { fullName: string; phoneNumber: string }
  driverId: { fullName: string; phone: string; vehicleNumber: string } | null
  pickup: { address: string; latitude: number; longitude: number }
  destination: { address: string }
  estimatedFare: number | null
  status: OngoingStatus
  createdAt: string
  acceptedAt: string | null
  startedAt: string | null
}

interface RidesResponse {
  rides: Ride[]
  total: number
}

const STATUS_STYLES: Record<string, string> = {
  requested: 'bg-blue-50   text-blue-700  border border-blue-200',
  accepted: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
  arrived: 'bg-purple-50 text-purple-700 border border-purple-200',
  started: 'bg-amber-50  text-amber-700  border border-amber-200',
}

const STATUS_LABEL: Record<string, string> = {
  requested: 'Requested',
  accepted: 'Accepted',
  arrived: 'Arrived',
  started: 'In Progress',
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_STYLES[status] ?? 'bg-slate-100 text-slate-600'}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 animate-pulse" />
      {STATUS_LABEL[status] ?? status}
    </span>
  )
}

function SkeletonRow() {
  return (
    <tr className="border-b border-slate-100">
      {Array.from({ length: 8 }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 bg-slate-100 rounded animate-pulse" style={{ width: `${55 + Math.random() * 40}%` }} />
        </td>
      ))}
    </tr>
  )
}

function ElapsedTime({ from }: { from: string | null }) {
  const [elapsed, setElapsed] = useState('—')

  useEffect(() => {
    if (!from) return
    const calc = () => {
      const diff = Math.floor((Date.now() - new Date(from).getTime()) / 1000)
      const m = Math.floor(diff / 60)
      const s = diff % 60
      setElapsed(m > 0 ? `${m}m ${s}s` : `${s}s`)
    }
    calc()
    const id = setInterval(calc, 1000)
    return () => clearInterval(id)
  }, [from])

  return <span className="text-amber-600 font-medium tabular-nums">{elapsed}</span>
}

const AUTO_REFRESH_SEC = 15

export default function OngoingRidesPage() {
  const router = useRouter()

  const [rides, setRides] = useState<Ride[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null)
  const [countdown, setCountdown] = useState(AUTO_REFRESH_SEC)
  const [filterStatus, setFilterStatus] = useState<OngoingStatus | 'all'>('all')

  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const fetchRides = useCallback(async (silent = false) => {
    if (!silent) setLoading(true)
    setError('')
    try {
      const res = await getOngoingRides()
      setRides(res.rides as unknown as Ride[])
      setTotal(res.total)
      setLastRefresh(new Date())
      setCountdown(AUTO_REFRESH_SEC)
    } catch (err: any) {
      setError(err.message ?? 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }, [])

  // Auto-refresh every 15 seconds
  useEffect(() => {
    fetchRides()
    timerRef.current = setInterval(() => {
      fetchRides(true)
    }, AUTO_REFRESH_SEC * 1000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [fetchRides])

  // Countdown tick
  useEffect(() => {
    const id = setInterval(() => setCountdown(c => (c <= 1 ? AUTO_REFRESH_SEC : c - 1)), 1000)
    return () => clearInterval(id)
  }, [])

  const visibleRides = filterStatus === 'all'
    ? rides
    : rides.filter(r => r.status === filterStatus)

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })

  return (
    <AdminShell title="Ongoing Rides">
      <div className="space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Radio className="h-6 w-6 text-green-500 animate-pulse" />
              <h1 className="text-2xl font-bold text-slate-800">Ongoing Rides</h1>
            </div>
            <p className="text-sm text-slate-500 mt-0.5">Live rides — auto-refreshes every {AUTO_REFRESH_SEC}s</p>
          </div>

          <div className="flex items-center gap-3">
            {lastRefresh && (
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Clock className="h-3.5 w-3.5" />
                Last: {formatTime(lastRefresh.toISOString())}
                <span className="ml-1 text-amber-500 font-medium">({countdown}s)</span>
              </div>
            )}
            <button
              onClick={() => fetchRides()}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh now
            </button>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {(['requested', 'accepted', 'arrived', 'started'] as OngoingStatus[]).map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(prev => prev === s ? 'all' : s)}
              className={`text-left rounded-xl p-4 border transition-all ${filterStatus === s
                ? 'ring-2 ring-blue-500 border-blue-200 bg-blue-50'
                : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
            >
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wide capitalize">{STATUS_LABEL[s]}</p>
              <p className="text-2xl font-bold text-slate-700 mt-1">
                {loading ? '—' : rides.filter(r => r.status === s).length}
              </p>
            </button>
          ))}
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">

          {/* Sub-filter bar */}
          <div className="flex items-center gap-3 px-5 py-3 border-b border-slate-100 bg-slate-50/60">
            <span className="text-xs text-slate-500 font-medium uppercase tracking-wide">
              Showing: {filterStatus === 'all' ? 'All ongoing' : STATUS_LABEL[filterStatus]}
            </span>
            {filterStatus !== 'all' && (
              <button
                onClick={() => setFilterStatus('all')}
                className="text-xs text-blue-600 hover:underline"
              >
                Clear filter
              </button>
            )}
            <span className="ml-auto text-sm text-slate-400 font-medium">{visibleRides.length} rides</span>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-white">
                  {['Ride ID', 'Passenger', 'Driver', 'Vehicle', 'Pickup', 'Drop', 'Status', 'Est. Fare', 'Elapsed', ''].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={10} className="px-4 py-12">
                      <Loader text="Loading ongoing rides..." />
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={10} className="px-4 py-12 text-center text-red-500 text-sm">{error}</td>
                  </tr>
                ) : visibleRides.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="px-4 py-16 text-center">
                      <Radio className="h-10 w-10 text-slate-200 mx-auto mb-3" />
                      <p className="text-slate-400 text-sm">No ongoing rides right now</p>
                    </td>
                  </tr>
                ) : (
                  visibleRides.map(ride => (
                    <tr key={ride._id} className="border-b border-slate-100 hover:bg-amber-50/30 transition-colors">
                      <td className="px-4 py-3">
                        <button
                          onClick={() => router.push(`/rides/${ride._id}`)}
                          className="text-blue-600 hover:text-blue-800 font-medium text-xs"
                        >
                          {ride._id.slice(-6).toUpperCase()}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-slate-700 font-medium whitespace-nowrap">{ride.userId?.fullName ?? '—'}</div>
                        <div className="text-xs text-slate-400">{ride.userId?.phoneNumber ?? ''}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-slate-700 whitespace-nowrap">{ride.driverId?.fullName ?? <span className="text-slate-400 italic">Not assigned</span>}</div>
                        <div className="text-xs text-slate-400">{ride.driverId?.phone ?? ''}</div>
                      </td>
                      <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{ride.driverId?.vehicleNumber ?? '—'}</td>
                      <td className="px-4 py-3 text-slate-600 max-w-[140px] truncate">{ride.pickup.address}</td>
                      <td className="px-4 py-3 text-slate-600 max-w-[140px] truncate">{ride.destination.address}</td>
                      <td className="px-4 py-3"><StatusBadge status={ride.status} /></td>
                      <td className="px-4 py-3 text-slate-700 font-medium whitespace-nowrap">
                        {ride.estimatedFare != null ? `₹${ride.estimatedFare}` : '—'}
                      </td>
                      <td className="px-4 py-3">
                        <ElapsedTime from={ride.startedAt ?? ride.acceptedAt ?? ride.createdAt} />
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => router.push(`/rides/${ride._id}`)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Live indicator footer */}
          <div className="flex items-center gap-2 px-5 py-3 border-t border-slate-100 bg-slate-50/40">
            <span className="flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </span>
            <span className="text-xs text-slate-400">
              Live data — refreshing in <span className="text-amber-600 font-medium">{countdown}s</span>
            </span>
          </div>
        </div>
      </div>
    </AdminShell>

  )
}