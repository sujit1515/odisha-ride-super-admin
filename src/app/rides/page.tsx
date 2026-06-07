// 'use client'
// import { useState, ChangeEvent } from 'react'
// import Link from 'next/link'
// import AdminShell from '@/components/Common/AdminShell'
// import { Search, Calendar } from 'lucide-react'

// // Types
// type RideStatus = 'Completed' | 'Ongoing' | 'Cancelled' | 'Pending'

// interface Ride {
//   id: string
//   passenger: string
//   driver: string
//   fare: number
//   status: RideStatus
//   time: string
//   date: string
//   pickup: string
//   drop: string
// }

// // Mock Data
// const rides: Ride[] = [
//   {
//     id: 'RIDE-001',
//     passenger: 'John Doe',
//     driver: 'Rajesh Kumar',
//     fare: 245,
//     status: 'Completed',
//     time: '10:30 AM',
//     date: '2024-01-15',
//     pickup: 'MG Road, Bangalore',
//     drop: 'Indiranagar, Bangalore'
//   },
//   {
//     id: 'RIDE-002',
//     passenger: 'Jane Smith',
//     driver: 'Suresh Patel',
//     fare: 189,
//     status: 'Ongoing',
//     time: '11:15 AM',
//     date: '2024-01-15',
//     pickup: 'Koramangala, Bangalore',
//     drop: 'HSR Layout, Bangalore'
//   },
//   {
//     id: 'RIDE-003',
//     passenger: 'Mike Johnson',
//     driver: 'Amit Singh',
//     fare: 320,
//     status: 'Completed',
//     time: '09:45 AM',
//     date: '2024-01-15',
//     pickup: 'Whitefield, Bangalore',
//     drop: 'Electronic City, Bangalore'
//   },
//   {
//     id: 'RIDE-004',
//     passenger: 'Sarah Williams',
//     driver: 'Vikram Reddy',
//     fare: 156,
//     status: 'Cancelled',
//     time: '08:30 AM',
//     date: '2024-01-14',
//     pickup: 'Jayanagar, Bangalore',
//     drop: 'Banashankari, Bangalore'
//   },
//   {
//     id: 'RIDE-005',
//     passenger: 'David Brown',
//     driver: 'Manish Gupta',
//     fare: 278,
//     status: 'Completed',
//     time: '02:30 PM',
//     date: '2024-01-14',
//     pickup: 'Hebbal, Bangalore',
//     drop: 'Yeshwanthpur, Bangalore'
//   },
//   {
//     id: 'RIDE-006',
//     passenger: 'Emma Wilson',
//     driver: 'Rahul Verma',
//     fare: 342,
//     status: 'Completed',
//     time: '06:45 PM',
//     date: '2024-01-13',
//     pickup: 'Marathahalli, Bangalore',
//     drop: 'Bellandur, Bangalore'
//   },
//   {
//     id: 'RIDE-007',
//     passenger: 'James Taylor',
//     driver: 'Pankaj Singh',
//     fare: 198,
//     status: 'Ongoing',
//     time: '07:20 PM',
//     date: '2024-01-13',
//     pickup: 'Ulsoor, Bangalore',
//     drop: 'Richmond Town, Bangalore'
//   },
//   {
//     id: 'RIDE-008',
//     passenger: 'Lisa Anderson',
//     driver: 'Deepak Sharma',
//     fare: 267,
//     status: 'Completed',
//     time: '12:15 PM',
//     date: '2024-01-12',
//     pickup: 'BTM Layout, Bangalore',
//     drop: 'JP Nagar, Bangalore'
//   },
//   {
//     id: 'RIDE-009',
//     passenger: 'Robert Taylor',
//     driver: 'Anil Kumar',
//     fare: 185,
//     status: 'Cancelled',
//     time: '04:30 PM',
//     date: '2024-01-12',
//     pickup: 'Frazer Town, Bangalore',
//     drop: 'Shivajinagar, Bangalore'
//   },
//   {
//     id: 'RIDE-010',
//     passenger: 'Maria Garcia',
//     driver: 'Sunil Reddy',
//     fare: 412,
//     status: 'Completed',
//     time: '09:00 PM',
//     date: '2024-01-11',
//     pickup: 'Airport Road, Bangalore',
//     drop: 'Domlur, Bangalore'
//   }
// ]

// type StatusFilter = 'All' | RideStatus

// const statusBadge = (s: RideStatus): string => {
//   if (s === 'Completed') return 'bg-emerald-100 text-emerald-700'
//   if (s === 'Ongoing') return 'bg-orange-100 text-orange-700'
//   if (s === 'Cancelled') return 'bg-red-100 text-red-700'
//   return 'bg-slate-100 text-slate-700'
// }

// export default function RidesPage() {
//   const [q, setQ] = useState<string>('')
//   const [status, setStatus] = useState<StatusFilter>('All')
//   const [date, setDate] = useState<string>('')

//   const filtered = rides.filter(r => {
//     const matchQ = !q || `${r.id} ${r.passenger} ${r.driver}`.toLowerCase().includes(q.toLowerCase())
//     const matchStatus = status === 'All' || r.status === status
//     const matchDate = !date || r.date === date
//     return matchQ && matchStatus && matchDate
//   })

//   return (
//     <AdminShell title="All Rides">
//       <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
//         <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
//           <div>
//             <h3 className="text-xl font-bold text-slate-800">Rides ({filtered.length})</h3>
//             <p className="text-sm text-slate-500">All rides with date &amp; time</p>
//           </div>
//           <div className="flex flex-col sm:flex-row gap-2">
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
//               <input 
//                 value={q} 
//                 onChange={(e: ChangeEvent<HTMLInputElement>) => setQ(e.target.value)} 
//                 placeholder="Search ride / user..." 
//                 className="pl-9 pr-3 py-2 rounded-lg border border-slate-200 text-sm" 
//               />
//             </div>
//             <div className="relative">
//               <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
//               <input 
//                 value={date} 
//                 onChange={(e: ChangeEvent<HTMLInputElement>) => setDate(e.target.value)} 
//                 type="date" 
//                 className="pl-9 pr-3 py-2 rounded-lg border border-slate-200 text-sm" 
//               />
//             </div>
//             <select 
//               value={status} 
//               onChange={(e: ChangeEvent<HTMLSelectElement>) => setStatus(e.target.value as StatusFilter)} 
//               className="px-3 py-2 rounded-lg border border-slate-200 text-sm"
//             >
//               <option>All</option>
//               <option>Completed</option>
//               <option>Ongoing</option>
//               <option>Cancelled</option>
//             </select>
//           </div>
//         </div>

//         <div className="mt-5 overflow-x-auto">
//           <table className="min-w-full text-sm">
//             <thead>
//               <tr className="text-slate-500 text-xs bg-slate-50">
//                 <th className="text-left font-medium px-3 py-3">Ride ID</th>
//                 <th className="text-left font-medium px-3 py-3">Passenger</th>
//                 <th className="text-left font-medium px-3 py-3">Driver</th>
//                 <th className="text-left font-medium px-3 py-3">Pickup</th>
//                 <th className="text-left font-medium px-3 py-3">Drop</th>
//                 <th className="text-left font-medium px-3 py-3">Fare</th>
//                 <th className="text-left font-medium px-3 py-3">Status</th>
//                 <th className="text-left font-medium px-3 py-3">Date</th>
//                 <th className="text-left font-medium px-3 py-3">Time</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-slate-100">
//               {filtered.map(r => (
//                 <tr key={r.id} className="hover:bg-slate-50">
//                   <td className="px-3 py-3">
//                     <Link href={`/rides/${encodeURIComponent(r.id)}`} className="text-blue-600 font-medium hover:underline">
//                       {r.id}
//                     </Link>
//                   </td>
//                   <td className="px-3 py-3">{r.passenger}</td>
//                   <td className="px-3 py-3">{r.driver}</td>
//                   <td className="px-3 py-3 text-slate-600">{r.pickup}</td>
//                   <td className="px-3 py-3 text-slate-600">{r.drop}</td>
//                   <td className="px-3 py-3 font-medium">₹{r.fare}</td>
//                   <td className="px-3 py-3">
//                     <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${statusBadge(r.status)}`}>
//                       {r.status}
//                     </span>
//                   </td>
//                   <td className="px-3 py-3 text-slate-500 whitespace-nowrap">{r.date}</td>
//                   <td className="px-3 py-3 text-slate-500 whitespace-nowrap">{r.time}</td>
//                 </tr>
//               ))}
//               {filtered.length === 0 && (
//                 <tr>
//                   <td colSpan={9} className="text-center py-10 text-slate-400">No rides found</td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </AdminShell>
//   )
// }


'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import AdminShell from '@/components/Common/AdminShell'
import {
  Search, Trash2, Eye, ChevronLeft, ChevronRight, RefreshCw
} from 'lucide-react'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

type RideStatus = 'requested' | 'accepted' | 'arrived' | 'started' | 'completed' | 'cancelled' | 'all'

interface Ride {
  _id:         string
  userId:      { fullName: string; phoneNumber: string }
  driverId:    { fullName: string; phone: string; vehicleNumber: string } | null
  pickup:      { address: string }
  destination: { address: string }
  finalFare:      number | null
  estimatedFare:  number | null
  status:      RideStatus
  createdAt:   string
}

interface RidesResponse {
  rides:      Ride[]
  total:      number
  page:       number
  limit:      number
  totalPages: number
}

const STATUS_STYLES: Record<string, string> = {
  completed: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  cancelled: 'bg-red-50 text-red-600 border border-red-200',
  requested: 'bg-blue-50 text-blue-700 border border-blue-200',
  accepted:  'bg-indigo-50 text-indigo-700 border border-indigo-200',
  arrived:   'bg-purple-50 text-purple-700 border border-purple-200',
  started:   'bg-amber-50 text-amber-700 border border-amber-200',
}

const STATUS_LABEL: Record<string, string> = {
  completed: 'Completed',
  cancelled: 'Cancelled',
  requested: 'Requested',
  accepted:  'Accepted',
  arrived:   'Arrived',
  started:   'Ongoing',
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

  const [rides,      setRides     ] = useState<Ride[]>([])
  const [total,      setTotal     ] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [page,       setPage      ] = useState(1)
  const [loading,    setLoading   ] = useState(true)
  const [error,      setError     ] = useState('')

  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<RideStatus>('all')
  const [date,   setDate  ] = useState('')

  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const limit = 10

  // ── Fetch ────────────────────────────────────────────────
  const fetchRides = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const token  = localStorage.getItem('adminToken')
      const params = new URLSearchParams({
        page:  String(page),
        limit: String(limit),
        ...(status !== 'all' && { status }),
        ...(date   && { date }),
        ...(search && { search }),
      })
      const res = await fetch(`${API_BASE}/admin/rides?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('Failed to fetch rides')
      const data: RidesResponse = await res.json()
      setRides(data.rides)
      setTotal(data.total)
      setTotalPages(data.totalPages)
    } catch (err: any) {
      setError(err.message ?? 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }, [page, status, date, search])

  useEffect(() => { fetchRides() }, [fetchRides])
  useEffect(() => { setPage(1)   }, [status, date, search])

  // ── Delete ────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    try {
      const token = localStorage.getItem('adminToken')
      const res = await fetch(`${API_BASE}/admin/rides/${deleteId}`, {
        method:  'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('Delete failed')
      setDeleteId(null)
      fetchRides()
    } catch {
      alert('Failed to delete ride')
    } finally {
      setDeleting(false)
    }
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
              <option value="started">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            {/* Count + Refresh */}
            <div className="ml-auto flex items-center gap-3">
              <span className="text-sm text-slate-400 font-medium">
                Rides ({total})
              </span>
              <button
                onClick={fetchRides}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg border
                           border-slate-200 text-sm text-slate-600 hover:bg-slate-50
                           transition-colors"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
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
                        className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                          p === page
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
                disabled={deleting}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white
                           text-sm font-medium hover:bg-red-700 disabled:opacity-60
                           transition-colors"
              >
                {deleting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

    </AdminShell>
  )
}