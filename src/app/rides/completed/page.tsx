'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Eye, ChevronLeft, ChevronRight, RefreshCw, CheckCircle2 } from 'lucide-react'
import Loader from '@/components/Common/Loader'
import AdminShell from '@/components/Common/AdminShell'
import { getCompletedRides, type Ride } from '@/app/rides/api/rides'

function SkeletonRow() {
  return (
    <tr className="border-b border-slate-100">
      {Array.from({ length: 9 }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 bg-slate-100 rounded animate-pulse" style={{ width: `${55 + Math.random() * 40}%` }} />
        </td>
      ))}
    </tr>
  )
}

export default function CompletedRidesPage() {
  const router = useRouter()

  const [rides, setRides] = useState<Ride[]>([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [date, setDate] = useState('')

  const limit = 10

  // Derived stats from current page data
  const totalFare = rides.reduce((sum, r) => sum + (r.finalFare ?? r.estimatedFare ?? 0), 0)
  const avgFare = rides.length ? Math.round(totalFare / rides.length) : 0

  const fetchRides = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await getCompletedRides({
        page,
        limit,
        ...(date && { date }),
        ...(search && { search }),
      })
      setRides(data.rides)
      setTotal(data.total)
      setTotalPages(data.totalPages)
    } catch (err: any) {
      setError(err.message ?? 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }, [page, date, search])

  useEffect(() => { fetchRides() }, [fetchRides])
  useEffect(() => { setPage(1) }, [date, search])

  const formatDate = (iso: string | null) =>
    iso ? new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'

  const formatTime = (iso: string | null) =>
    iso ? new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }) : '—'

  const formatFare = (ride: Ride) => {
    const fare = ride.finalFare ?? ride.estimatedFare
    return fare != null ? `₹${fare}` : '—'
  }

  return (
    <AdminShell title="Completed Rides">
      <div className="space-y-6">

        <div className="p-6 space-y-6">

          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                <h1 className="text-2xl font-bold text-slate-800">Completed Rides</h1>
              </div>
              <p className="text-sm text-slate-500 mt-0.5">All successfully completed rides</p>
            </div>
            <button
              onClick={fetchRides}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
              <p className="text-xs text-emerald-600 font-medium uppercase tracking-wide">Total Completed</p>
              <p className="text-2xl font-bold text-emerald-700 mt-1">{loading ? '—' : total}</p>
            </div>
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
              <p className="text-xs text-blue-600 font-medium uppercase tracking-wide">Page Revenue</p>
              <p className="text-2xl font-bold text-blue-700 mt-1">{loading ? '—' : `₹${totalFare}`}</p>
            </div>
            <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
              <p className="text-xs text-indigo-600 font-medium uppercase tracking-wide">Avg Fare</p>
              <p className="text-2xl font-bold text-indigo-700 mt-1">{loading ? '—' : `₹${avgFare}`}</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">This Page</p>
              <p className="text-2xl font-bold text-slate-700 mt-1">{loading ? '—' : rides.length}</p>
            </div>
          </div>

          {/* Table Card */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3 px-5 py-4 border-b border-slate-100">
              <div className="flex items-center gap-2 flex-1 min-w-[200px] max-w-sm bg-slate-50 rounded-lg px-3 py-2 border border-slate-200">
                <Search className="h-4 w-4 text-slate-400 shrink-0" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search ride / user..."
                  className="bg-transparent text-sm text-slate-700 outline-none w-full placeholder:text-slate-400"
                />
              </div>
              <div className="flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2 border border-slate-200">
                <input
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="bg-transparent text-sm text-slate-700 outline-none"
                />
              </div>
              <span className="ml-auto text-sm text-slate-400 font-medium">Total ({total})</span>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/60">
                    {['Ride ID', 'Passenger', 'Driver', 'Pickup', 'Drop', 'Fare', 'Distance', 'Duration', 'Date', 'Time', ''].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                  <tr>
                    <td colSpan={11} className="px-4 py-12">
                      <Loader text="Loading completed rides..." />
                    </td>
                  </tr>
                ) : error ? (
                    <tr>
                      <td colSpan={11} className="px-4 py-12 text-center text-red-500 text-sm">{error}</td>
                    </tr>
                  ) : rides.length === 0 ? (
                    <tr>
                      <td colSpan={11} className="px-4 py-16 text-center">
                        <CheckCircle2 className="h-10 w-10 text-slate-200 mx-auto mb-3" />
                        <p className="text-slate-400 text-sm">No completed rides found</p>
                      </td>
                    </tr>
                  ) : (
                    rides.map(ride => (
                      <tr key={ride._id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                        <td className="px-4 py-3">
                          <button
                            onClick={() => router.push(`/rides/${ride._id}`)}
                            className="text-blue-600 hover:text-blue-800 font-medium text-xs"
                          >
                            {ride._id.slice(-6).toUpperCase()}
                          </button>
                        </td>
                        <td className="px-4 py-3 text-slate-700 whitespace-nowrap">{ride.userId?.fullName ?? '—'}</td>
                        <td className="px-4 py-3 text-slate-700 whitespace-nowrap">{ride.driverId?.fullName ?? '—'}</td>
                        <td className="px-4 py-3 text-slate-600 max-w-[140px] truncate">{ride.pickup.address}</td>
                        <td className="px-4 py-3 text-slate-600 max-w-[140px] truncate">{ride.destination.address}</td>
                        <td className="px-4 py-3 font-semibold text-emerald-700 whitespace-nowrap">{formatFare(ride)}</td>
                        <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{ride.distance ?? '—'}</td>
                        <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{ride.duration ?? '—'}</td>
                        <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{formatDate(ride.completedAt ?? ride.createdAt)}</td>
                        <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{formatTime(ride.completedAt ?? ride.createdAt)}</td>
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-5 py-4 border-t border-slate-100">
                <p className="text-sm text-slate-500">
                  Showing {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of {total}
                </p>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                    .map((p, idx, arr) => (
                      <>
                        {idx > 0 && arr[idx - 1] !== p - 1 && (
                          <span key={`dots-${p}`} className="px-2 text-slate-400 text-sm">…</span>
                        )}
                        <button
                          key={p}
                          onClick={() => setPage(p)}
                          className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${p === page ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                            }`}
                        >
                          {p}
                        </button>
                      </>
                    ))}
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminShell>

  )
}