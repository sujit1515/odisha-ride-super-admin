'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import {
  Search, Eye, ChevronLeft, ChevronRight,
  CalendarClock, UserCheck, Trash2,
} from 'lucide-react'
import AdminShell from '@/components/Common/AdminShell'

type ScheduledStatus = 'pending' | 'assigned' | 'cancelled' | 'all'

interface ScheduledRide {
  _id:           string
  userId:        { fullName: string; phoneNumber: string }
  driverId:      { fullName: string; phone: string; vehicleNumber: string } | null
  pickup:        { address: string }
  destination:   { address: string }
  estimatedFare: number
  vehicleType:   'auto' | 'bike' | 'car'
  scheduledAt:   string   // when the ride is booked FOR
  createdAt:     string   // when booking was made
  status:        Exclude<ScheduledStatus, 'all'>
}

// ── Static data ───────────────────────────────────────────
const STATIC_SCHEDULED: ScheduledRide[] = [
  { _id: 's001', userId: { fullName: 'Arjun Mohanty',  phoneNumber: '+91 98765 11001' }, driverId: { fullName: 'Rajesh Kumar', phone: '+91 91234 56789', vehicleNumber: 'OD-05-AB-1234' }, pickup: { address: 'Bhubaneswar Railway Station' }, destination: { address: 'Bhubaneswar Airport'         }, estimatedFare: 320, vehicleType: 'car',  scheduledAt: '2024-06-10T05:30:00Z', createdAt: '2024-06-09T18:00:00Z', status: 'assigned'  },
  { _id: 's002', userId: { fullName: 'Sunita Panda',   phoneNumber: '+91 98765 11002' }, driverId: null,                                                                                    pickup: { address: 'Patia, Bhubaneswar'              }, destination: { address: 'AIIMS Bhubaneswar'           }, estimatedFare: 180, vehicleType: 'auto', scheduledAt: '2024-06-10T08:00:00Z', createdAt: '2024-06-09T20:00:00Z', status: 'pending'   },
  { _id: 's003', userId: { fullName: 'Rahul Das',      phoneNumber: '+91 98765 11003' }, driverId: { fullName: 'Amit Singh',   phone: '+91 91234 56791', vehicleNumber: 'OD-05-EF-9012' }, pickup: { address: 'Infocity, Bhubaneswar'           }, destination: { address: 'Cuttack Bus Stand'           }, estimatedFare: 450, vehicleType: 'car',  scheduledAt: '2024-06-10T09:15:00Z', createdAt: '2024-06-09T21:00:00Z', status: 'assigned'  },
  { _id: 's004', userId: { fullName: 'Priya Sahoo',    phoneNumber: '+91 98765 11004' }, driverId: null,                                                                                    pickup: { address: 'Saheed Nagar, Bhubaneswar'       }, destination: { address: 'Puri Beach'                  }, estimatedFare: 850, vehicleType: 'car',  scheduledAt: '2024-06-11T06:00:00Z', createdAt: '2024-06-09T22:00:00Z', status: 'pending'   },
  { _id: 's005', userId: { fullName: 'Bikash Nayak',   phoneNumber: '+91 98765 11005' }, driverId: null,                                                                                    pickup: { address: 'Khandagiri, Bhubaneswar'         }, destination: { address: 'Bhubaneswar Railway Station' }, estimatedFare: 150, vehicleType: 'bike', scheduledAt: '2024-06-10T07:30:00Z', createdAt: '2024-06-09T19:30:00Z', status: 'cancelled' },
  { _id: 's006', userId: { fullName: 'Mamata Rath',    phoneNumber: '+91 98765 11006' }, driverId: { fullName: 'Sunil Reddy',  phone: '+91 91234 56798', vehicleNumber: 'OD-05-ST-8901' }, pickup: { address: 'Jaydev Vihar, Bhubaneswar'       }, destination: { address: 'Bhubaneswar Airport'         }, estimatedFare: 280, vehicleType: 'car',  scheduledAt: '2024-06-12T04:45:00Z', createdAt: '2024-06-10T10:00:00Z', status: 'assigned'  },
  { _id: 's007', userId: { fullName: 'Deepak Mishra',  phoneNumber: '+91 98765 11007' }, driverId: null,                                                                                    pickup: { address: 'Vani Vihar, Bhubaneswar'         }, destination: { address: 'Konark Sun Temple'           }, estimatedFare: 620, vehicleType: 'car',  scheduledAt: '2024-06-13T07:00:00Z', createdAt: '2024-06-10T11:00:00Z', status: 'pending'   },
  { _id: 's008', userId: { fullName: 'Smita Tripathy', phoneNumber: '+91 98765 11008' }, driverId: { fullName: 'Gopal Das',    phone: '+91 91234 56799', vehicleNumber: 'OD-05-UV-2345' }, pickup: { address: 'Baramunda Bus Stand'             }, destination: { address: 'Cuttack Medical College'    }, estimatedFare: 390, vehicleType: 'auto', scheduledAt: '2024-06-10T10:00:00Z', createdAt: '2024-06-09T23:00:00Z', status: 'assigned'  },
]

const STATUS_STYLES: Record<string, string> = {
  pending:   'bg-amber-50  text-amber-700  border border-amber-200',
  assigned:  'bg-blue-50   text-blue-700   border border-blue-200',
  cancelled: 'bg-red-50    text-red-600    border border-red-200',
}

const STATUS_LABEL: Record<string, string> = {
  pending:   'Pending',
  assigned:  'Driver Assigned',
  cancelled: 'Cancelled',
}

const VEHICLE_BADGE: Record<string, string> = {
  auto: 'bg-indigo-50 text-indigo-700',
  bike: 'bg-green-50  text-green-700',
  car:  'bg-slate-100 text-slate-700',
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_STYLES[status] ?? 'bg-slate-100 text-slate-600'}`}>
      {STATUS_LABEL[status] ?? status}
    </span>
  )
}

const LIMIT = 10

export default function ScheduledRidesPage() {
  const router = useRouter()

  const [search, setSearch]   = useState('')
  const [status, setStatus]   = useState<ScheduledStatus>('all')
  const [date,   setDate  ]   = useState('')
  const [page,   setPage  ]   = useState(1)
  const [rides,  setRides ]   = useState<ScheduledRide[]>(STATIC_SCHEDULED)
  const [deleteId, setDeleteId] = useState<string | null>(null)

const handleDelete = () => {
  setRides(prev => prev.filter(r => r._id !== deleteId))
  setDeleteId(null)
}

  const filtered = useMemo(() => {
    return rides.filter(r => {
      const matchStatus = status === 'all' || r.status === status
      const matchDate   = !date || r.scheduledAt.startsWith(date)
      const matchSearch = !search ||
        r.userId.fullName.toLowerCase().includes(search.toLowerCase()) ||
        r._id.toLowerCase().includes(search.toLowerCase())
      return matchStatus && matchDate && matchSearch
    })
  }, [rides, status, date, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / LIMIT))
  const paginated  = filtered.slice((page - 1) * LIMIT, page * LIMIT)

 

  const formatDateTime = (iso: string) =>
    new Date(iso).toLocaleString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: true,
    })

  // How far in future the ride is
  const timeUntil = (iso: string) => {
    const diff = new Date(iso).getTime() - Date.now()
    if (diff < 0) return 'Overdue'
    const h = Math.floor(diff / 3600000)
    const m = Math.floor((diff % 3600000) / 60000)
    if (h >= 24) return `${Math.floor(h / 24)}d ${h % 24}h`
    return h > 0 ? `${h}h ${m}m` : `${m}m`
  }

  const pendingCount   = rides.filter(r => r.status === 'pending').length
  const assignedCount  = rides.filter(r => r.status === 'assigned').length
  const cancelledCount = rides.filter(r => r.status === 'cancelled').length

  return (
    <AdminShell title="Scheduled Rides">
      <div className="space-y-5">

        {/* Header */}
        <div className="flex items-center gap-2">
          <CalendarClock className="h-6 w-6 text-blue-500" />
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Scheduled Rides</h1>
            <p className="text-sm text-slate-500">Advance bookings — airport drops, early morning rides</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 border border-slate-200">
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Total Scheduled</p>
            <p className="text-2xl font-bold text-slate-700 mt-1">{rides.length}</p>
          </div>
          <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
            <p className="text-xs text-amber-600 font-medium uppercase tracking-wide">Awaiting Driver</p>
            <p className="text-2xl font-bold text-amber-700 mt-1">{pendingCount}</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
            <p className="text-xs text-blue-600 font-medium uppercase tracking-wide">Driver Assigned</p>
            <p className="text-2xl font-bold text-blue-700 mt-1">{assignedCount}</p>
          </div>
          <div className="bg-red-50 rounded-xl p-4 border border-red-100">
            <p className="text-xs text-red-500 font-medium uppercase tracking-wide">Cancelled</p>
            <p className="text-2xl font-bold text-red-700 mt-1">{cancelledCount}</p>
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
                onChange={e => { setSearch(e.target.value); setPage(1) }}
                placeholder="Search passenger / ride ID..."
                className="bg-transparent text-sm text-slate-700 outline-none w-full placeholder:text-slate-400"
              />
            </div>
            <div className="bg-slate-50 rounded-lg px-3 py-2 border border-slate-200">
              <input
                type="date"
                value={date}
                onChange={e => { setDate(e.target.value); setPage(1) }}
                className="bg-transparent text-sm text-slate-700 outline-none"
              />
            </div>
            <select
              value={status}
              onChange={e => { setStatus(e.target.value as ScheduledStatus); setPage(1) }}
              className="bg-slate-50 text-sm text-slate-700 rounded-lg px-3 py-2 border border-slate-200 outline-none"
            >
              <option value="all">All Status</option>
              <option value="pending">Awaiting Driver</option>
              <option value="assigned">Driver Assigned</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <span className="ml-auto text-sm text-slate-400 font-medium">Total ({filtered.length})</span>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60">
                  {['Ride ID', 'Passenger', 'Pickup', 'Drop', 'Vehicle', 'Est. Fare', 'Scheduled For', 'Time Until', 'Driver', 'Status', ''].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="px-4 py-16 text-center">
                      <CalendarClock className="h-10 w-10 text-slate-200 mx-auto mb-3" />
                      <p className="text-slate-400 text-sm">No scheduled rides found</p>
                    </td>
                  </tr>
                ) : (
                  paginated.map(ride => (
                    <tr key={ride._id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-3">
                        <button
                          onClick={() => router.push(`/rides/${ride._id}`)}
                          className="text-blue-600 hover:text-blue-800 font-medium text-xs"
                        >
                          {ride._id.toUpperCase()}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-slate-700 font-medium whitespace-nowrap">{ride.userId.fullName}</div>
                        <div className="text-xs text-slate-400">{ride.userId.phoneNumber}</div>
                      </td>
                      <td className="px-4 py-3 text-slate-600 max-w-[140px] truncate">{ride.pickup.address}</td>
                      <td className="px-4 py-3 text-slate-600 max-w-[140px] truncate">{ride.destination.address}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize ${VEHICLE_BADGE[ride.vehicleType]}`}>
                          {ride.vehicleType}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-700 font-medium">₹{ride.estimatedFare}</td>
                      <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{formatDateTime(ride.scheduledAt)}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-semibold ${
                          timeUntil(ride.scheduledAt) === 'Overdue'
                            ? 'text-red-500'
                            : 'text-emerald-600'
                        }`}>
                          {timeUntil(ride.scheduledAt)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {ride.driverId ? (
                          <div>
                            <div className="text-slate-700 whitespace-nowrap text-xs font-medium">{ride.driverId.fullName}</div>
                            <div className="text-xs text-slate-400">{ride.driverId.vehicleNumber}</div>
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-amber-50 text-amber-600 border border-amber-200">
                            <UserCheck className="h-3 w-3" />
                            Not assigned
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3"><StatusBadge status={ride.status} /></td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => router.push(`/rides/${ride._id}`)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                            title="View"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          {ride.status !== 'cancelled' && (
                            <button
                              onClick={() => setDeleteId(ride._id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                              title="Cancel"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
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
                Showing {(page - 1) * LIMIT + 1}–{Math.min(page * LIMIT, filtered.length)} of {filtered.length}
              </p>
              <div className="flex items-center gap-1">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed">
                  <ChevronLeft className="h-4 w-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                  .map((p, idx, arr) => (
                    <span key={p} className="flex items-center">
                      {idx > 0 && arr[idx - 1] !== p - 1 && <span className="px-2 text-slate-400 text-sm">…</span>}
                      <button onClick={() => setPage(p)}
                        className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${p === page ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>
                        {p}
                      </button>
                    </span>
                  ))}
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                  className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed">
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4">
            <div className="flex items-center justify-center w-12 h-12 bg-red-50 rounded-full mx-auto mb-4">
              <Trash2 className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-base font-semibold text-slate-800 text-center mb-1">Cancel Scheduled Ride</h3>
            <p className="text-sm text-slate-500 text-center mb-6">
              Are you sure you want to cancel this scheduled ride?
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                Back
              </button>
              <button onClick={handleDelete}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors">
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  )
}