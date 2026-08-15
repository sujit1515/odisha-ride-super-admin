'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Eye, ChevronLeft, ChevronRight, RefreshCw, XCircle } from 'lucide-react'
import Loader from '@/components/Common/Loader'
import AdminShell from '@/components/Common/AdminShell'
import { getCancelledRides, type Ride } from '@/app/rides/api/rides'

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

const CANCELLED_BY_STYLES: Record<string, string> = {
  passenger: 'bg-orange-50 text-orange-700 border border-orange-200',
  driver: 'bg-purple-50 text-purple-700 border border-purple-200',
  admin: 'bg-slate-100 text-slate-700 border border-slate-200',
}

export default function CancelledRidesPage() {
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

  const fetchRides = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await getCancelledRides({
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

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })

  const formatFare = (ride: Ride) => {
    const fare = ride.finalFare ?? ride.estimatedFare
    return fare != null ? `₹${fare}` : '—'
  }

  return (
    <AdminShell title="Cancelled Rides">
      <div className="space-y-6">


        <div className="p-6 space-y-6">

          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <XCircle className="h-6 w-6 text-red-500" />
                <h1 className="text-2xl font-bold text-slate-800">Cancelled Rides</h1>
              </div>
              <p className="text-sm text-slate-500 mt-0.5">All cancelled rides with reason &amp; who cancelled</p>
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
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="bg-red-50 rounded-xl p-4 border border-red-100">
              <p className="text-xs text-red-500 font-medium uppercase tracking-wide">Total Cancelled</p>
              <p className="text-2xl font-bold text-red-700 mt-1">{loading ? '—' : total}</p>
            </div>
            <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
              <p className="text-xs text-orange-500 font-medium uppercase tracking-wide">By Passenger</p>
              <p className="text-2xl font-bold text-orange-700 mt-1">
                {loading ? '—' : rides.filter(r => r.cancelledBy === 'passenger').length}
              </p>
            </div>
            <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
              <p className="text-xs text-purple-500 font-medium uppercase tracking-wide">By Driver</p>
              <p className="text-2xl font-bold text-purple-700 mt-1">
                {loading ? '—' : rides.filter(r => r.cancelledBy === 'driver').length}
              </p>
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
                    {['Ride ID', 'Passenger', 'Driver', 'Pickup', 'Drop', 'Fare', 'Cancelled By', 'Reason', 'Date', 'Time', ''].map(h => (
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
                        <Loader text="Loading cancelled rides..." />
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan={11} className="px-4 py-12 text-center text-red-500 text-sm">{error}</td>
                    </tr>
                  ) : rides.length === 0 ? (
                    <tr>
                      <td colSpan={11} className="px-4 py-16 text-center">
                        <XCircle className="h-10 w-10 text-slate-200 mx-auto mb-3" />
                        <p className="text-slate-400 text-sm">No cancelled rides found</p>
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
                        <td className="px-4 py-3 text-slate-700 font-medium whitespace-nowrap">{formatFare(ride)}</td>
                        <td className="px-4 py-3">
                          {ride.cancelledBy ? (
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium capitalize ${CANCELLED_BY_STYLES[ride.cancelledBy] ?? 'bg-slate-100 text-slate-600'}`}>
                              {ride.cancelledBy}
                            </span>
                          ) : '—'}
                        </td>
                        <td className="px-4 py-3 text-slate-500 max-w-[160px] truncate">
                          {ride.cancellationReason ?? '—'}
                        </td>
                        <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{formatDate(ride.createdAt)}</td>
                        <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{formatTime(ride.createdAt)}</td>
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