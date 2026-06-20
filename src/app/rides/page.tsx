'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import AdminShell from '@/components/Common/AdminShell'
import {
  Search, Trash2, Eye, ChevronLeft, ChevronRight, RefreshCw
} from 'lucide-react'


type RideStatus = 'requested' | 'accepted' | 'arrived' | 'started' | 'completed' | 'cancelled' | 'all'

interface Ride {
  _id: string
  userId: { fullName: string; phoneNumber: string }
  driverId: { fullName: string; phone: string; vehicleNumber: string } | null
  pickup: { address: string }
  destination: { address: string }
  finalFare: number | null
  estimatedFare: number | null
  status: RideStatus
  createdAt: string
}

interface RidesResponse {
  rides: Ride[]
  total: number
  page: number
  limit: number
  totalPages: number
}

const STATUS_STYLES: Record<string, string> = {
  completed: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  cancelled: 'bg-red-50 text-red-600 border border-red-200',
  requested: 'bg-blue-50 text-blue-700 border border-blue-200',
  accepted: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
  arrived: 'bg-purple-50 text-purple-700 border border-purple-200',
  started: 'bg-amber-50 text-amber-700 border border-amber-200',
}

const STATUS_LABEL: Record<string, string> = {
  completed: 'Completed',
  cancelled: 'Cancelled',
  requested: 'Requested',
  accepted: 'Accepted',
  arrived: 'Arrived',
  started: 'Ongoing',
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium
                      ${STATUS_STYLES[status] ?? 'bg-slate-100 text-slate-600'}`}>
      {STATUS_LABEL[status] ?? status}
    </span>
  )
}

function SkeletonRow() {
  return (
    <tr className="border-b border-slate-100">
      {Array.from({ length: 10 }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 bg-slate-100 rounded animate-pulse"
            style={{ width: `${60 + Math.random() * 40}%` }} />
        </td>
      ))}
    </tr>
  )
}

export default function AllRidesPage() {
  const router = useRouter()

  const [rides, setRides] = useState<Ride[]>([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<RideStatus>('all')
  const [date, setDate] = useState('')

  const [deleteId, setDeleteId] = useState<string | null>(null)


  const limit = 10

  const STATIC_RIDES: Ride[] = [
    { _id: '6650a1b2c3d4e5f6a7b8c001', userId: { fullName: 'John Doe', phoneNumber: '+91 98765 43210' }, driverId: { fullName: 'Rajesh Kumar', phone: '+91 91234 56789', vehicleNumber: 'OD-05-AB-1234' }, pickup: { address: 'MG Road, Bhubaneswar' }, destination: { address: 'Infocity, Bhubaneswar' }, finalFare: 245, estimatedFare: 230, status: 'completed', createdAt: '2024-01-15T10:30:00Z' },
    { _id: '6650a1b2c3d4e5f6a7b8c002', userId: { fullName: 'Jane Smith', phoneNumber: '+91 98765 43211' }, driverId: { fullName: 'Suresh Patel', phone: '+91 91234 56790', vehicleNumber: 'OD-05-CD-5678' }, pickup: { address: 'Patia, Bhubaneswar' }, destination: { address: 'Esplanade, Bhubaneswar' }, finalFare: null, estimatedFare: 189, status: 'accepted', createdAt: '2024-01-15T11:15:00Z' },
    { _id: '6650a1b2c3d4e5f6a7b8c003', userId: { fullName: 'Mike Johnson', phoneNumber: '+91 98765 43212' }, driverId: { fullName: 'Amit Singh', phone: '+91 91234 56791', vehicleNumber: 'OD-05-EF-9012' }, pickup: { address: 'Cuttack Road, Bhubaneswar' }, destination: { address: 'Airport, Bhubaneswar' }, finalFare: 320, estimatedFare: 310, status: 'completed', createdAt: '2024-01-15T09:45:00Z' },
    { _id: '6650a1b2c3d4e5f6a7b8c004', userId: { fullName: 'Sarah Williams', phoneNumber: '+91 98765 43213' }, driverId: { fullName: 'Vikram Reddy', phone: '+91 91234 56792', vehicleNumber: 'OD-05-GH-3456' }, pickup: { address: 'Jaydev Vihar, Bhubaneswar' }, destination: { address: 'Ram Mandir, Bhubaneswar' }, finalFare: null, estimatedFare: 156, status: 'cancelled', createdAt: '2024-01-14T08:30:00Z' },
    { _id: '6650a1b2c3d4e5f6a7b8c005', userId: { fullName: 'David Brown', phoneNumber: '+91 98765 43214' }, driverId: { fullName: 'Manish Gupta', phone: '+91 91234 56793', vehicleNumber: 'OD-05-IJ-7890' }, pickup: { address: 'Saheed Nagar, Bhubaneswar' }, destination: { address: 'Rasulgarh, Bhubaneswar' }, finalFare: 278, estimatedFare: 260, status: 'completed', createdAt: '2024-01-14T14:30:00Z' },
    { _id: '6650a1b2c3d4e5f6a7b8c006', userId: { fullName: 'Emma Wilson', phoneNumber: '+91 98765 43215' }, driverId: { fullName: 'Rahul Verma', phone: '+91 91234 56794', vehicleNumber: 'OD-05-KL-2345' }, pickup: { address: 'Khandagiri, Bhubaneswar' }, destination: { address: 'Nayapalli, Bhubaneswar' }, finalFare: 342, estimatedFare: 330, status: 'requested', createdAt: '2024-01-13T18:45:00Z' },
    { _id: '6650a1b2c3d4e5f6a7b8c007', userId: { fullName: 'James Taylor', phoneNumber: '+91 98765 43216' }, driverId: { fullName: 'Pankaj Singh', phone: '+91 91234 56795', vehicleNumber: 'OD-05-MN-6789' }, pickup: { address: 'Unit-4, Bhubaneswar' }, destination: { address: 'Bomikhal, Bhubaneswar' }, finalFare: null, estimatedFare: 198, status: 'arrived', createdAt: '2024-01-13T19:20:00Z' },
    { _id: '6650a1b2c3d4e5f6a7b8c008', userId: { fullName: 'Lisa Anderson', phoneNumber: '+91 98765 43217' }, driverId: { fullName: 'Deepak Sharma', phone: '+91 91234 56796', vehicleNumber: 'OD-05-OP-0123' }, pickup: { address: 'Bapuji Nagar, Bhubaneswar' }, destination: { address: 'Sundarpada, Bhubaneswar' }, finalFare: 267, estimatedFare: 250, status: 'completed', createdAt: '2024-01-12T12:15:00Z' },
    { _id: '6650a1b2c3d4e5f6a7b8c009', userId: { fullName: 'Robert Taylor', phoneNumber: '+91 98765 43218' }, driverId: { fullName: 'Anil Kumar', phone: '+91 91234 56797', vehicleNumber: 'OD-05-QR-4567' }, pickup: { address: 'Vani Vihar, Bhubaneswar' }, destination: { address: 'Mancheswar, Bhubaneswar' }, finalFare: null, estimatedFare: 185, status: 'cancelled', createdAt: '2024-01-12T16:30:00Z' },
    { _id: '6650a1b2c3d4e5f6a7b8c010', userId: { fullName: 'Maria Garcia', phoneNumber: '+91 98765 43219' }, driverId: { fullName: 'Sunil Reddy', phone: '+91 91234 56798', vehicleNumber: 'OD-05-ST-8901' }, pickup: { address: 'Airport Road, Bhubaneswar' }, destination: { address: 'Domlur, Bhubaneswar' }, finalFare: 412, estimatedFare: 400, status: 'completed', createdAt: '2024-01-11T09:00:00Z' },
  ]

  const allRides = useMemo(() => STATIC_RIDES, [])

  const filtered = useMemo(() => {
    return allRides.filter(r => {
      const matchStatus = status === 'all' || r.status === status
      const matchDate = !date || r.createdAt.startsWith(date)
      const matchSearch = !search ||
        r.userId.fullName.toLowerCase().includes(search.toLowerCase()) ||
        r._id.toLowerCase().includes(search.toLowerCase()) ||
        (r.driverId?.fullName ?? '').toLowerCase().includes(search.toLowerCase())
      return matchStatus && matchDate && matchSearch
    })
  }, [allRides, status, date, search])

  useEffect(() => {
    const start = (page - 1) * limit
    setRides(filtered.slice(start, start + limit))
    setTotal(filtered.length)
    setTotalPages(Math.max(1, Math.ceil(filtered.length / limit)))
    setLoading(false)
  }, [filtered, page, limit])

  useEffect(() => { setPage(1) }, [status, date, search])

  // ── Delete ────────────────────────────────────────────────
  const handleDelete = () => {
    if (!deleteId) return
    setRides(prev => prev.filter(r => r._id !== deleteId))
    setDeleteId(null)
  }

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })

  const formatFare = (ride: Ride) => {
    const fare = ride.finalFare ?? ride.estimatedFare
    return fare != null ? `₹${fare}` : '—'
  }

  return (
    <AdminShell title="Rides">
      <div className="space-y-5">

        {/* ── Table Card ── */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">

          {/* ── Filters ── */}
          <div className="flex flex-wrap items-center gap-3 px-5 py-4 border-b border-slate-100">

            {/* Search */}
            <div className="flex items-center gap-2 flex-1 min-w-[200px] max-w-sm
                            bg-slate-50 rounded-lg px-3 py-2 border border-slate-200">
              <Search className="h-4 w-4 text-slate-400 shrink-0" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search ride / user..."
                className="bg-transparent text-sm text-slate-700 outline-none w-full
                           placeholder:text-slate-400"
              />
            </div>

            {/* Date picker */}
            <div className="flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2
                            border border-slate-200">
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="bg-transparent text-sm text-slate-700 outline-none"
              />
            </div>

            {/* Status filter */}
            <select
              value={status}
              onChange={e => setStatus(e.target.value as RideStatus)}
              className="bg-slate-50 text-sm text-slate-700 rounded-lg px-3 py-2
                         border border-slate-200 outline-none"
            >
              <option value="all">All</option>
              <option value="requested">Requested</option>
              <option value="accepted">Accepted</option>
              <option value="arrived">Arrived</option>
            </select>

            {/* Count + Refresh */}
            <div className="ml-auto flex items-center gap-3">
              <span className="text-sm text-slate-400 font-medium">
                Rides ({total})
              </span>
              <button
                onClick={() => { }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg border
                           border-slate-200 text-sm text-slate-600 hover:bg-slate-50
                           transition-colors"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Refresh
              </button>
            </div>
          </div>

          {/* ── Table ── */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60">
                  {['Ride ID', 'Passenger', 'Driver', 'Pickup', 'Drop',
                    'Fare', 'Status', 'Date', 'Time', ''].map(h => (
                      <th key={h}
                        className="px-4 py-3 text-left text-xs font-semibold text-slate-500
                                   uppercase tracking-wide whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)
                ) : error ? (
                  <tr>
                    <td colSpan={10} className="px-4 py-12 text-center text-red-500 text-sm">
                      {error}
                    </td>
                  </tr>
                ) : rides.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="px-4 py-16 text-center text-slate-400 text-sm">
                      No rides found
                    </td>
                  </tr>
                ) : (
                  rides.map(ride => (
                    <tr key={ride._id}
                      className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">

                      {/* Ride ID */}
                      <td className="px-4 py-3">
                        <button
                          onClick={() => router.push(`/rides/${ride._id}`)}
                          className="text-blue-600 hover:text-blue-800 font-medium text-xs"
                        >
                          {ride._id.slice(-6).toUpperCase()}
                        </button>
                      </td>

                      <td className="px-4 py-3 text-slate-700 whitespace-nowrap">
                        {ride.userId?.fullName ?? '—'}
                      </td>
                      <td className="px-4 py-3 text-slate-700 whitespace-nowrap">
                        {ride.driverId?.fullName ?? '—'}
                      </td>
                      <td className="px-4 py-3 text-slate-600 max-w-[160px] truncate">
                        {ride.pickup.address}
                      </td>
                      <td className="px-4 py-3 text-slate-600 max-w-[160px] truncate">
                        {ride.destination.address}
                      </td>
                      <td className="px-4 py-3 text-slate-700 font-medium whitespace-nowrap">
                        {formatFare(ride)}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={ride.status} />
                      </td>
                      <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                        {formatDate(ride.createdAt)}
                      </td>
                      <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                        {formatTime(ride.createdAt)}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => router.push(`/rides/${ride._id}`)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600
                                       hover:bg-blue-50 transition-colors"
                            title="View"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setDeleteId(ride._id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600
                                       hover:bg-red-50 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* ── Pagination ── */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-4 border-t border-slate-100">
              <p className="text-sm text-slate-500">
                Showing{' '}
                <span className="font-medium text-slate-700">{(page - 1) * limit + 1}</span>
                –
                <span className="font-medium text-slate-700">
                  {Math.min(page * limit, total)}
                </span>{' '}
                of{' '}
                <span className="font-medium text-slate-700">{total}</span>
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 rounded-lg text-slate-500 hover:bg-slate-100
                             disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
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
                        className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${p === page
                            ? 'bg-blue-600 text-white'
                            : 'text-slate-600 hover:bg-slate-100'
                          }`}
                      >
                        {p}
                      </button>
                    </>
                  ))}

                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-2 rounded-lg text-slate-500 hover:bg-slate-100
                             disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Delete Confirm Modal ── */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4">
            <div className="flex items-center justify-center w-12 h-12 bg-red-50
                            rounded-full mx-auto mb-4">
              <Trash2 className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-base font-semibold text-slate-800 text-center mb-1">
              Delete Ride
            </h3>
            <p className="text-sm text-slate-500 text-center mb-6">
              Are you sure you want to delete this ride? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200
                           text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white
           text-sm font-medium hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </AdminShell>
  )
}