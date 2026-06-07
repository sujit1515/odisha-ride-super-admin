'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import {
  Search, Eye, ChevronLeft, ChevronRight,
  AlertTriangle, CheckCircle2, Clock, ShieldAlert,
} from 'lucide-react'
import AdminShell from '@/components/Common/AdminShell'

type DisputeStatus = 'open' | 'in_review' | 'resolved' | 'all'
type RaisedBy      = 'passenger' | 'driver'
type IssueType     = 'fare_dispute' | 'driver_behaviour' | 'route_deviation' | 'no_show' | 'safety' | 'other'

interface DisputedRide {
  _id:         string
  rideId:      string
  userId:      { fullName: string; phoneNumber: string }
  driverId:    { fullName: string; phone: string; vehicleNumber: string } | null
  pickup:      { address: string }
  destination: { address: string }
  fare:        number
  issueType:   IssueType
  description: string
  raisedBy:    RaisedBy
  status:      Exclude<DisputeStatus, 'all'>
  createdAt:   string
  resolvedAt:  string | null
}

// ── Static data ───────────────────────────────────────────
const STATIC_DISPUTED: DisputedRide[] = [
  { _id: 'd001', rideId: 'c8a001', userId: { fullName: 'Arjun Mohanty',  phoneNumber: '+91 98765 11001' }, driverId: { fullName: 'Rajesh Kumar',  phone: '+91 91234 56789', vehicleNumber: 'OD-05-AB-1234' }, pickup: { address: 'MG Road, Bhubaneswar'       }, destination: { address: 'Airport, Bhubaneswar'    }, fare: 320, issueType: 'fare_dispute',     description: 'Driver charged extra ₹80 for luggage which was not agreed upon.',          raisedBy: 'passenger', status: 'open',      createdAt: '2024-01-15T10:30:00Z', resolvedAt: null                  },
  { _id: 'd002', rideId: 'c8a002', userId: { fullName: 'Sunita Panda',   phoneNumber: '+91 98765 11002' }, driverId: { fullName: 'Suresh Patel',  phone: '+91 91234 56790', vehicleNumber: 'OD-05-CD-5678' }, pickup: { address: 'Patia, Bhubaneswar'         }, destination: { address: 'AIIMS Bhubaneswar'       }, fare: 180, issueType: 'driver_behaviour', description: 'Driver was rude and used inappropriate language during the trip.',         raisedBy: 'passenger', status: 'in_review', createdAt: '2024-01-14T09:00:00Z', resolvedAt: null                  },
  { _id: 'd003', rideId: 'c8a003', userId: { fullName: 'Rahul Das',      phoneNumber: '+91 98765 11003' }, driverId: { fullName: 'Amit Singh',    phone: '+91 91234 56791', vehicleNumber: 'OD-05-EF-9012' }, pickup: { address: 'Infocity, Bhubaneswar'      }, destination: { address: 'Cuttack Bus Stand'       }, fare: 450, issueType: 'route_deviation',  description: 'Driver took a longer route increasing fare by ₹120.',                     raisedBy: 'passenger', status: 'resolved',  createdAt: '2024-01-13T14:00:00Z', resolvedAt: '2024-01-14T10:00:00Z'},
  { _id: 'd004', rideId: 'c8a004', userId: { fullName: 'Priya Sahoo',    phoneNumber: '+91 98765 11004' }, driverId: { fullName: 'Vikram Reddy',  phone: '+91 91234 56792', vehicleNumber: 'OD-05-GH-3456' }, pickup: { address: 'Saheed Nagar, Bhubaneswar'  }, destination: { address: 'Puri Beach'             }, fare: 850, issueType: 'no_show',          description: 'Passenger did not show up at pickup point. Waited 15 minutes.',           raisedBy: 'driver',    status: 'resolved',  createdAt: '2024-01-12T08:00:00Z', resolvedAt: '2024-01-13T11:00:00Z'},
  { _id: 'd005', rideId: 'c8a005', userId: { fullName: 'Bikash Nayak',   phoneNumber: '+91 98765 11005' }, driverId: { fullName: 'Manish Gupta',  phone: '+91 91234 56793', vehicleNumber: 'OD-05-IJ-7890' }, pickup: { address: 'Khandagiri, Bhubaneswar'    }, destination: { address: 'Railway Station'         }, fare: 150, issueType: 'safety',           description: 'Driver was driving very fast and ran a red light. Felt unsafe.',          raisedBy: 'passenger', status: 'open',      createdAt: '2024-01-15T16:00:00Z', resolvedAt: null                  },
  { _id: 'd006', rideId: 'c8a006', userId: { fullName: 'Mamata Rath',    phoneNumber: '+91 98765 11006' }, driverId: { fullName: 'Rahul Verma',   phone: '+91 91234 56794', vehicleNumber: 'OD-05-KL-2345' }, pickup: { address: 'Jaydev Vihar, Bhubaneswar'  }, destination: { address: 'Airport, Bhubaneswar'   }, fare: 280, issueType: 'fare_dispute',     description: 'App showed ₹280 but driver demanded ₹350 in cash.',                       raisedBy: 'passenger', status: 'in_review', createdAt: '2024-01-15T06:00:00Z', resolvedAt: null                  },
  { _id: 'd007', rideId: 'c8a007', userId: { fullName: 'Deepak Mishra',  phoneNumber: '+91 98765 11007' }, driverId: { fullName: 'Pankaj Singh',  phone: '+91 91234 56795', vehicleNumber: 'OD-05-MN-6789' }, pickup: { address: 'Unit-4, Bhubaneswar'        }, destination: { address: 'Bomikhal, Bhubaneswar'  }, fare: 198, issueType: 'other',            description: 'Driver cancelled mid-trip and asked to book a new ride.',                 raisedBy: 'passenger', status: 'open',      createdAt: '2024-01-15T19:00:00Z', resolvedAt: null                  },
  { _id: 'd008', rideId: 'c8a008', userId: { fullName: 'Smita Tripathy', phoneNumber: '+91 98765 11008' }, driverId: { fullName: 'Deepak Sharma', phone: '+91 91234 56796', vehicleNumber: 'OD-05-OP-0123' }, pickup: { address: 'Baramunda, Bhubaneswar'     }, destination: { address: 'Medical College Cuttak' }, fare: 390, issueType: 'driver_behaviour', description: 'Driver was on phone throughout the trip and almost caused an accident.',    raisedBy: 'passenger', status: 'in_review', createdAt: '2024-01-14T13:00:00Z', resolvedAt: null                  },
]

const STATUS_STYLES: Record<string, string> = {
  open:      'bg-red-50    text-red-600    border border-red-200',
  in_review: 'bg-amber-50  text-amber-700  border border-amber-200',
  resolved:  'bg-emerald-50 text-emerald-700 border border-emerald-200',
}

const STATUS_LABEL: Record<string, string> = {
  open:      'Open',
  in_review: 'In Review',
  resolved:  'Resolved',
}

const ISSUE_LABEL: Record<IssueType, string> = {
  fare_dispute:     'Fare Dispute',
  driver_behaviour: 'Driver Behaviour',
  route_deviation:  'Route Deviation',
  no_show:          'No Show',
  safety:           'Safety',
  other:            'Other',
}

const ISSUE_STYLES: Record<IssueType, string> = {
  fare_dispute:     'bg-orange-50 text-orange-700',
  driver_behaviour: 'bg-purple-50 text-purple-700',
  route_deviation:  'bg-blue-50   text-blue-700',
  no_show:          'bg-slate-100 text-slate-600',
  safety:           'bg-red-50    text-red-700',
  other:            'bg-slate-100 text-slate-600',
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_STYLES[status] ?? 'bg-slate-100 text-slate-600'}`}>
      {status === 'open'      && <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1.5" />}
      {status === 'in_review' && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5 animate-pulse" />}
      {status === 'resolved'  && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5" />}
      {STATUS_LABEL[status] ?? status}
    </span>
  )
}

const LIMIT = 10

export default function DisputedRidesPage() {
  const router = useRouter()

  const [search,   setSearch  ] = useState('')
  const [status,   setStatus  ] = useState<DisputeStatus>('all')
  const [date,     setDate    ] = useState('')
  const [page,     setPage    ] = useState(1)
  const [disputes, setDisputes] = useState<DisputedRide[]>(STATIC_DISPUTED)

  // Detail modal
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selected = disputes.find(d => d._id === selectedId)

  const filtered = useMemo(() => {
    return disputes.filter(r => {
      const matchStatus = status === 'all' || r.status === status
      const matchDate   = !date || r.createdAt.startsWith(date)
      const matchSearch = !search ||
        r.userId.fullName.toLowerCase().includes(search.toLowerCase()) ||
        r.rideId.toLowerCase().includes(search.toLowerCase()) ||
        ISSUE_LABEL[r.issueType].toLowerCase().includes(search.toLowerCase())
      return matchStatus && matchDate && matchSearch
    })
  }, [disputes, status, date, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / LIMIT))
  const paginated  = filtered.slice((page - 1) * LIMIT, page * LIMIT)

  const markResolved = (id: string) => {
    setDisputes(prev => prev.map(d =>
      d._id === id ? { ...d, status: 'resolved', resolvedAt: new Date().toISOString() } : d
    ))
    setSelectedId(null)
  }

  const markInReview = (id: string) => {
    setDisputes(prev => prev.map(d =>
      d._id === id ? { ...d, status: 'in_review' } : d
    ))
  }

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })

  const openCount     = disputes.filter(d => d.status === 'open').length
  const inReviewCount = disputes.filter(d => d.status === 'in_review').length
  const resolvedCount = disputes.filter(d => d.status === 'resolved').length

  return (
    <AdminShell title="Disputed Rides">
      <div className="space-y-5">

        {/* Header */}
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-6 w-6 text-red-500" />
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Disputed Rides</h1>
            <p className="text-sm text-slate-500">Complaints raised by passengers and drivers</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 border border-slate-200">
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Total Disputes</p>
            <p className="text-2xl font-bold text-slate-700 mt-1">{disputes.length}</p>
          </div>
          <div className="bg-red-50 rounded-xl p-4 border border-red-100">
            <p className="text-xs text-red-500 font-medium uppercase tracking-wide">Open</p>
            <p className="text-2xl font-bold text-red-700 mt-1">{openCount}</p>
          </div>
          <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
            <p className="text-xs text-amber-600 font-medium uppercase tracking-wide">In Review</p>
            <p className="text-2xl font-bold text-amber-700 mt-1">{inReviewCount}</p>
          </div>
          <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
            <p className="text-xs text-emerald-600 font-medium uppercase tracking-wide">Resolved</p>
            <p className="text-2xl font-bold text-emerald-700 mt-1">{resolvedCount}</p>
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
                placeholder="Search passenger / issue type..."
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
              onChange={e => { setStatus(e.target.value as DisputeStatus); setPage(1) }}
              className="bg-slate-50 text-sm text-slate-700 rounded-lg px-3 py-2 border border-slate-200 outline-none"
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="in_review">In Review</option>
              <option value="resolved">Resolved</option>
            </select>
            <span className="ml-auto text-sm text-slate-400 font-medium">Total ({filtered.length})</span>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60">
                  {['Ride ID', 'Passenger', 'Driver', 'Issue Type', 'Raised By', 'Description', 'Fare', 'Date', 'Status', ''].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="px-4 py-16 text-center">
                      <AlertTriangle className="h-10 w-10 text-slate-200 mx-auto mb-3" />
                      <p className="text-slate-400 text-sm">No disputed rides found</p>
                    </td>
                  </tr>
                ) : (
                  paginated.map(dispute => (
                    <tr key={dispute._id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-3">
                        <button
                          onClick={() => router.push(`/rides/${dispute.rideId}`)}
                          className="text-blue-600 hover:text-blue-800 font-medium text-xs"
                        >
                          {dispute.rideId.slice(-6).toUpperCase()}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-slate-700 font-medium whitespace-nowrap">{dispute.userId.fullName}</div>
                        <div className="text-xs text-slate-400">{dispute.userId.phoneNumber}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-slate-700 whitespace-nowrap text-xs">{dispute.driverId?.fullName ?? '—'}</div>
                        <div className="text-xs text-slate-400">{dispute.driverId?.vehicleNumber ?? ''}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${ISSUE_STYLES[dispute.issueType]}`}>
                          {ISSUE_LABEL[dispute.issueType]}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize ${
                          dispute.raisedBy === 'passenger'
                            ? 'bg-blue-50 text-blue-700'
                            : 'bg-purple-50 text-purple-700'
                        }`}>
                          {dispute.raisedBy}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-500 max-w-[200px]">
                        <p className="truncate text-xs">{dispute.description}</p>
                      </td>
                      <td className="px-4 py-3 text-slate-700 font-medium whitespace-nowrap">₹{dispute.fare}</td>
                      <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{formatDate(dispute.createdAt)}</td>
                      <td className="px-4 py-3"><StatusBadge status={dispute.status} /></td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedId(dispute._id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                            title="View & Resolve"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          {dispute.status === 'open' && (
                            <button
                              onClick={() => markInReview(dispute._id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                              title="Mark In Review"
                            >
                              <Clock className="h-4 w-4" />
                            </button>
                          )}
                          {dispute.status !== 'resolved' && (
                            <button
                              onClick={() => markResolved(dispute._id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                              title="Mark Resolved"
                            >
                              <CheckCircle2 className="h-4 w-4" />
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

      {/* Detail / Resolve Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">

            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                <h3 className="text-base font-semibold text-slate-800">Dispute Detail</h3>
              </div>
              <button onClick={() => setSelectedId(null)} className="text-slate-400 hover:text-slate-600 text-xl font-light">✕</button>
            </div>

            {/* Modal body */}
            <div className="px-6 py-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-400 font-medium uppercase">Passenger</p>
                  <p className="text-sm text-slate-700 font-medium mt-1">{selected.userId.fullName}</p>
                  <p className="text-xs text-slate-400">{selected.userId.phoneNumber}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium uppercase">Driver</p>
                  <p className="text-sm text-slate-700 font-medium mt-1">{selected.driverId?.fullName ?? '—'}</p>
                  <p className="text-xs text-slate-400">{selected.driverId?.vehicleNumber ?? ''}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium uppercase">Issue Type</p>
                  <span className={`inline-flex items-center mt-1 px-2 py-1 rounded-full text-xs font-medium ${ISSUE_STYLES[selected.issueType]}`}>
                    {ISSUE_LABEL[selected.issueType]}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium uppercase">Raised By</p>
                  <p className="text-sm text-slate-700 capitalize mt-1">{selected.raisedBy}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium uppercase">Fare</p>
                  <p className="text-sm font-semibold text-slate-700 mt-1">₹{selected.fare}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium uppercase">Status</p>
                  <div className="mt-1"><StatusBadge status={selected.status} /></div>
                </div>
              </div>

              <div>
                <p className="text-xs text-slate-400 font-medium uppercase mb-1">Description</p>
                <p className="text-sm text-slate-700 bg-slate-50 rounded-lg p-3 border border-slate-100">
                  {selected.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs text-slate-400">
                <div>
                  <span className="uppercase font-medium">Pickup</span>
                  <p className="text-slate-600 mt-0.5">{selected.pickup.address}</p>
                </div>
                <div>
                  <span className="uppercase font-medium">Drop</span>
                  <p className="text-slate-600 mt-0.5">{selected.destination.address}</p>
                </div>
              </div>
            </div>

            {/* Modal actions */}
            <div className="flex gap-3 px-6 py-4 border-t border-slate-100">
              <button
                onClick={() => setSelectedId(null)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Close
              </button>
              {selected.status === 'open' && (
                <button
                  onClick={() => markInReview(selected._id)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-amber-500 text-white text-sm font-medium hover:bg-amber-600 transition-colors"
                >
                  Mark In Review
                </button>
              )}
              {selected.status !== 'resolved' && (
                <button
                  onClick={() => markResolved(selected._id)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors"
                >
                  Mark Resolved
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  )
}