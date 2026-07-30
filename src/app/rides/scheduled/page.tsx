  'use client'

  import { useState, useMemo } from 'react'
  import { useRouter } from 'next/navigation'
  import { motion, AnimatePresence } from 'framer-motion'
  import {
    Search, Eye, ChevronLeft, ChevronRight,
    CalendarClock, UserCheck, Trash2, RefreshCw,
    Download, Copy, Check, Plane, Hospital,
    Crown, User, Star, MapPin, Car, Bike,
    Phone, Clock, AlertCircle,
  } from 'lucide-react'
  import AdminShell from '@/components/Common/AdminShell'

  type ScheduledStatus = 'pending' | 'assigned' | 'cancelled' | 'all'
  type BookingSource = 'app' | 'web' | 'admin' | 'call'
  type PriorityType = 'airport' | 'hospital' | 'vip' | 'regular'

  interface ScheduledRide {
    _id:           string
    userId:        { fullName: string; phoneNumber: string; rating?: number }
    driverId:      { fullName: string; phone: string; vehicleNumber: string; rating?: number; isOnline?: boolean } | null
    pickup:        { address: string }
    destination:   { address: string }
    estimatedFare: number
    vehicleType:   'auto' | 'bike' | 'car'
    scheduledAt:   string
    createdAt:     string
    status:        Exclude<ScheduledStatus, 'all'>
    bookingSource?: BookingSource
    priority?:     PriorityType
  }

  // ── Static data ───────────────────────────────────────────
  const STATIC_SCHEDULED: ScheduledRide[] = [
    { _id: 's001', userId: { fullName: 'Arjun Mohanty',  phoneNumber: '+91 98765 11001', rating: 4.8 }, driverId: { fullName: 'Rajesh Kumar', phone: '+91 91234 56789', vehicleNumber: 'OD-05-AB-1234', rating: 4.9, isOnline: true  }, pickup: { address: 'Bhubaneswar Railway Station' }, destination: { address: 'Bhubaneswar Airport'         }, estimatedFare: 320, vehicleType: 'car',  scheduledAt: '2024-06-10T05:30:00Z', createdAt: '2024-06-09T18:00:00Z', status: 'assigned',  bookingSource: 'app',  priority: 'airport'  },
    { _id: 's002', userId: { fullName: 'Sunita Panda',   phoneNumber: '+91 98765 11002', rating: 4.5 }, driverId: null,                                                                                    pickup: { address: 'Patia, Bhubaneswar'              }, destination: { address: 'AIIMS Bhubaneswar'           }, estimatedFare: 180, vehicleType: 'auto', scheduledAt: '2024-06-10T08:00:00Z', createdAt: '2024-06-09T20:00:00Z', status: 'pending',   bookingSource: 'web',  priority: 'hospital' },
    { _id: 's003', userId: { fullName: 'Rahul Das',      phoneNumber: '+91 98765 11003', rating: 4.7 }, driverId: { fullName: 'Amit Singh',   phone: '+91 91234 56791', vehicleNumber: 'OD-05-EF-9012', rating: 4.6, isOnline: true  }, pickup: { address: 'Infocity, Bhubaneswar'           }, destination: { address: 'Cuttack Bus Stand'           }, estimatedFare: 450, vehicleType: 'car',  scheduledAt: '2024-06-10T09:15:00Z', createdAt: '2024-06-09T21:00:00Z', status: 'assigned',  bookingSource: 'app',  priority: 'regular'  },
    { _id: 's004', userId: { fullName: 'Priya Sahoo',    phoneNumber: '+91 98765 11004', rating: 4.9 }, driverId: null,                                                                                    pickup: { address: 'Saheed Nagar, Bhubaneswar'       }, destination: { address: 'Puri Beach'                  }, estimatedFare: 850, vehicleType: 'car',  scheduledAt: '2024-06-11T06:00:00Z', createdAt: '2024-06-09T22:00:00Z', status: 'pending',   bookingSource: 'call', priority: 'vip'      },
    { _id: 's005', userId: { fullName: 'Bikash Nayak',   phoneNumber: '+91 98765 11005', rating: 4.2 }, driverId: null,                                                                                    pickup: { address: 'Khandagiri, Bhubaneswar'         }, destination: { address: 'Bhubaneswar Railway Station' }, estimatedFare: 150, vehicleType: 'bike', scheduledAt: '2024-06-10T07:30:00Z', createdAt: '2024-06-09T19:30:00Z', status: 'cancelled', bookingSource: 'app',  priority: 'regular'  },
    { _id: 's006', userId: { fullName: 'Mamata Rath',    phoneNumber: '+91 98765 11006', rating: 4.6 }, driverId: { fullName: 'Sunil Reddy',  phone: '+91 91234 56798', vehicleNumber: 'OD-05-ST-8901', rating: 4.8, isOnline: false }, pickup: { address: 'Jaydev Vihar, Bhubaneswar'       }, destination: { address: 'Bhubaneswar Airport'         }, estimatedFare: 280, vehicleType: 'car',  scheduledAt: '2024-06-12T04:45:00Z', createdAt: '2024-06-10T10:00:00Z', status: 'assigned',  bookingSource: 'web',  priority: 'airport'  },
    { _id: 's007', userId: { fullName: 'Deepak Mishra',  phoneNumber: '+91 98765 11007', rating: 4.4 }, driverId: null,                                                                                    pickup: { address: 'Vani Vihar, Bhubaneswar'         }, destination: { address: 'Konark Sun Temple'           }, estimatedFare: 620, vehicleType: 'car',  scheduledAt: '2024-06-13T07:00:00Z', createdAt: '2024-06-10T11:00:00Z', status: 'pending',   bookingSource: 'app',  priority: 'regular'  },
    { _id: 's008', userId: { fullName: 'Smita Tripathy', phoneNumber: '+91 98765 11008', rating: 4.8 }, driverId: { fullName: 'Gopal Das',    phone: '+91 91234 56799', vehicleNumber: 'OD-05-UV-2345', rating: 4.7, isOnline: true  }, pickup: { address: 'Baramunda Bus Stand'             }, destination: { address: 'Cuttack Medical College'    }, estimatedFare: 390, vehicleType: 'auto', scheduledAt: '2024-06-10T10:00:00Z', createdAt: '2024-06-09T23:00:00Z', status: 'assigned',  bookingSource: 'admin', priority: 'hospital' },
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
    auto: 'bg-indigo-50 text-indigo-700 border border-indigo-100',
    bike: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
    car:  'bg-slate-100 text-slate-700 border border-slate-200',
  }

  const SOURCE_STYLES: Record<BookingSource, string> = {
    app:   'bg-blue-50 text-blue-700 border-blue-100',
    web:   'bg-violet-50 text-violet-700 border-violet-100',
    admin: 'bg-slate-100 text-slate-700 border-slate-200',
    call:  'bg-teal-50 text-teal-700 border-teal-100',
  }

  const SOURCE_LABEL: Record<BookingSource, string> = {
    app:   'App',
    web:   'Web',
    admin: 'Admin',
    call:  'Call Center',
  }

  const PRIORITY_CONFIG: Record<PriorityType, { label: string; className: string; icon: typeof Plane }> = {
    airport:  { label: 'Airport',  className: 'bg-sky-50 text-sky-700 border-sky-200',       icon: Plane },
    hospital: { label: 'Hospital', className: 'bg-rose-50 text-rose-700 border-rose-200',     icon: Hospital },
    vip:      { label: 'VIP',      className: 'bg-amber-50 text-amber-700 border-amber-200',  icon: Crown },
    regular:  { label: 'Regular',  className: 'bg-slate-50 text-slate-600 border-slate-200',  icon: User },
  }

  function StatusBadge({ status }: { status: string }) {
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_STYLES[status] ?? 'bg-slate-100 text-slate-600'}`}>
        <span className={`h-1.5 w-1.5 rounded-full ${
          status === 'pending' ? 'bg-amber-500 animate-pulse' :
          status === 'assigned' ? 'bg-blue-500' : 'bg-red-500'
        }`} />
        {STATUS_LABEL[status] ?? status}
      </span>
    )
  }

  function PriorityBadge({ priority }: { priority?: PriorityType }) {
    const key = priority ?? 'regular'
    const config = PRIORITY_CONFIG[key]
    const Icon = config.icon
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${config.className}`}>
        <Icon className="h-3 w-3" />
        {config.label}
      </span>
    )
  }

  function SourceBadge({ source }: { source?: BookingSource }) {
    const key = source ?? 'app'
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border ${SOURCE_STYLES[key]}`}>
        {SOURCE_LABEL[key]}
      </span>
    )
  }

  function RatingStars({ rating }: { rating?: number }) {
    if (rating == null) return null
    return (
      <span className="inline-flex items-center gap-0.5 text-[11px] font-medium text-amber-600">
        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
        {rating.toFixed(1)}
      </span>
    )
  }

  function VehicleIcon({ type }: { type: string }) {
    if (type === 'bike') return <Bike className="h-3 w-3" />
    return <Car className="h-3 w-3" />
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
    const [copiedId, setCopiedId] = useState<string | null>(null)
    const [isRefreshing, setIsRefreshing] = useState(false)

    const handleDelete = () => {
      setRides(prev => prev.filter(r => r._id !== deleteId))
      setDeleteId(null)
    }

    const handleRefresh = () => {
      setIsRefreshing(true)
      window.setTimeout(() => {
        setRides([...STATIC_SCHEDULED])
        setIsRefreshing(false)
      }, 600)
    }

    const handleExport = () => {
      // UI-only export action
    }

    const handleCopyId = async (id: string) => {
      try {
        await navigator.clipboard.writeText(id.toUpperCase())
        setCopiedId(id)
        window.setTimeout(() => setCopiedId(null), 1500)
      } catch {
        // clipboard unavailable
      }
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

          {/* Sticky Page Header */}
          <div className="sticky top-0 z-10 -mx-4 md:-mx-8 px-4 md:px-8 py-3 bg-slate-50/90 backdrop-blur border-b border-slate-200/60">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 border border-blue-100 shrink-0">
                  <CalendarClock className="h-5 w-5 text-blue-600" />
                </div>
                <div className="min-w-0">
                  <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">Scheduled Rides</h1>
                  <p className="text-sm text-slate-500 truncate">
                    Advance bookings — airport drops, hospital trips & early morning rides
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleRefresh}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-600 hover:bg-slate-50 hover:border-slate-300 shadow-sm transition-colors"
                >
                  <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
                <button
                  type="button"
                  onClick={handleExport}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-600 hover:bg-slate-50 hover:border-slate-300 shadow-sm transition-colors"
                >
                  <Download className="h-4 w-4" />
                  Export
                </button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
            {[
              { label: 'Total Scheduled', value: rides.length,   valueClass: 'text-slate-900',  wrap: 'bg-white border-slate-200', labelClass: 'text-slate-500' },
              { label: 'Awaiting Driver', value: pendingCount,   valueClass: 'text-amber-700',  wrap: 'bg-amber-50/80 border-amber-100', labelClass: 'text-amber-600' },
              { label: 'Driver Assigned', value: assignedCount,  valueClass: 'text-blue-700',   wrap: 'bg-blue-50/80 border-blue-100', labelClass: 'text-blue-600' },
              { label: 'Cancelled',       value: cancelledCount, valueClass: 'text-red-700',    wrap: 'bg-red-50/80 border-red-100', labelClass: 'text-red-500' },
            ].map((stat) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className={`rounded-2xl p-4 border shadow-sm ${stat.wrap}`}
              >
                <p className={`text-[11px] font-semibold uppercase tracking-wide ${stat.labelClass}`}>{stat.label}</p>
                <p className={`text-2xl font-bold mt-1.5 tabular-nums ${stat.valueClass}`}>{stat.value}</p>
              </motion.div>
            ))}
          </div>

          {/* Table Card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
          >

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3 px-5 py-4 border-b border-slate-100 bg-slate-50/40">
              <div className="flex items-center gap-2 flex-1 min-w-[200px] max-w-sm bg-white rounded-xl px-3 py-2.5 border border-slate-200 shadow-sm focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                <Search className="h-4 w-4 text-slate-400 shrink-0" />
                <input
                  value={search}
                  onChange={e => { setSearch(e.target.value); setPage(1) }}
                  placeholder="Search passenger / ride ID..."
                  className="bg-transparent text-sm text-slate-700 outline-none w-full placeholder:text-slate-400"
                />
              </div>
              <div className="bg-white rounded-xl px-3 py-2.5 border border-slate-200 shadow-sm">
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
                className="bg-white text-sm text-slate-700 rounded-xl px-3 py-2.5 border border-slate-200 outline-none shadow-sm"
              >
                <option value="all">All Status</option>
                <option value="pending">Awaiting Driver</option>
                <option value="assigned">Driver Assigned</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <span className="ml-auto text-sm text-slate-500 font-medium tabular-nums">
                {filtered.length} result{filtered.length === 1 ? '' : 's'}
              </span>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/70">
                    {[
                      'Ride ID', 'Passenger', 'Pickup & Drop', 'Vehicle',
                      'Est. Fare', 'Scheduled For', 'Time Until', 'Driver',
                      'Priority', 'Source', 'Status', '',
                    ].map(h => (
                      <th key={h} className="px-4 py-3.5 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginated.length === 0 ? (
                    <tr>
                      <td colSpan={12} className="px-4 py-20 text-center">
                        <div className="flex flex-col items-center max-w-sm mx-auto">
                          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 border border-slate-100 mb-4">
                            <CalendarClock className="h-7 w-7 text-slate-300" />
                          </div>
                          <p className="text-slate-800 font-semibold text-base">No scheduled rides found</p>
                          <p className="text-slate-400 text-sm mt-1.5 leading-relaxed">
                            Try adjusting your search, date filter, or status to see matching advance bookings.
                          </p>
                          {(search || date || status !== 'all') && (
                            <button
                              type="button"
                              onClick={() => { setSearch(''); setDate(''); setStatus('all'); setPage(1) }}
                              className="mt-4 px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                            >
                              Clear filters
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginated.map((ride, index) => (
                      <motion.tr
                        key={ride._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.25, delay: index * 0.03 }}
                        className="border-b border-slate-100 hover:bg-slate-50/60 transition-colors group"
                      >
                        {/* Ride ID */}
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => router.push(`/rides/${ride._id}`)}
                              className="text-blue-600 hover:text-blue-800 font-semibold text-xs tracking-wide"
                            >
                              {ride._id.toUpperCase()}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleCopyId(ride._id)}
                              className="p-1 rounded-md text-slate-300 hover:text-slate-600 hover:bg-slate-100 opacity-0 group-hover:opacity-100 transition-all"
                              title="Copy Ride ID"
                            >
                              {copiedId === ride._id
                                ? <Check className="h-3.5 w-3.5 text-emerald-500" />
                                : <Copy className="h-3.5 w-3.5" />}
                            </button>
                          </div>
                        </td>

                        {/* Passenger */}
                        <td className="px-4 py-4">
                          <div className="text-slate-800 font-semibold whitespace-nowrap">{ride.userId.fullName}</div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="inline-flex items-center gap-1 text-[11px] text-slate-400">
                              <Phone className="h-3 w-3" />
                              {ride.userId.phoneNumber}
                            </span>
                            <RatingStars rating={ride.userId.rating} />
                          </div>
                        </td>

                        {/* Pickup & Drop */}
                        <td className="px-4 py-4 min-w-[200px]">
                          <div className="space-y-1.5">
                            <div className="flex items-start gap-1.5">
                              <MapPin className="h-3.5 w-3.5 text-emerald-500 mt-0.5 shrink-0" />
                              <span className="text-slate-700 text-xs line-clamp-1">{ride.pickup.address}</span>
                            </div>
                            <div className="flex items-start gap-1.5">
                              <MapPin className="h-3.5 w-3.5 text-red-500 mt-0.5 shrink-0" />
                              <span className="text-slate-700 text-xs line-clamp-1">{ride.destination.address}</span>
                            </div>
                          </div>
                        </td>

                        {/* Vehicle */}
                        <td className="px-4 py-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${VEHICLE_BADGE[ride.vehicleType]}`}>
                            <VehicleIcon type={ride.vehicleType} />
                            {ride.vehicleType}
                          </span>
                        </td>

                        {/* Fare */}
                        <td className="px-4 py-4 text-slate-900 font-semibold tabular-nums">₹{ride.estimatedFare}</td>

                        {/* Scheduled For */}
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-1.5 text-slate-700 whitespace-nowrap text-xs font-medium">
                            <Clock className="h-3.5 w-3.5 text-slate-400" />
                            {formatDateTime(ride.scheduledAt)}
                          </div>
                        </td>

                        {/* Time Until */}
                        <td className="px-4 py-4">
                          <span className={`inline-flex items-center gap-1 text-xs font-bold ${
                            timeUntil(ride.scheduledAt) === 'Overdue'
                              ? 'text-red-600'
                              : 'text-emerald-600'
                          }`}>
                            {timeUntil(ride.scheduledAt) === 'Overdue' && (
                              <AlertCircle className="h-3 w-3" />
                            )}
                            {timeUntil(ride.scheduledAt)}
                          </span>
                        </td>

                        {/* Driver */}
                        <td className="px-4 py-4">
                          {ride.driverId ? (
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-slate-800 whitespace-nowrap text-xs font-semibold">{ride.driverId.fullName}</span>
                                <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                                  ride.driverId.isOnline
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                    : 'bg-slate-50 text-slate-500 border-slate-200'
                                }`}>
                                  <span className={`h-1 w-1 rounded-full mr-1 ${ride.driverId.isOnline ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                                  {ride.driverId.isOnline ? 'Online' : 'Offline'}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[11px] text-slate-400">{ride.driverId.vehicleNumber}</span>
                                <RatingStars rating={ride.driverId.rating} />
                              </div>
                            </div>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                              <UserCheck className="h-3 w-3" />
                              Not assigned
                            </span>
                          )}
                        </td>

                        {/* Priority */}
                        <td className="px-4 py-4">
                          <PriorityBadge priority={ride.priority} />
                        </td>

                        {/* Source */}
                        <td className="px-4 py-4">
                          <SourceBadge source={ride.bookingSource} />
                        </td>

                        {/* Status */}
                        <td className="px-4 py-4"><StatusBadge status={ride.status} /></td>

                        {/* Actions */}
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => router.push(`/rides/${ride._id}`)}
                              className="p-2 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                              title="View details"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            {ride.status !== 'cancelled' && (
                              <button
                                onClick={() => setDeleteId(ride._id)}
                                className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                title="Cancel ride"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-5 py-4 border-t border-slate-100 bg-slate-50/30">
                <p className="text-sm text-slate-500">
                  Showing <span className="font-medium text-slate-700">{(page - 1) * LIMIT + 1}</span>–
                  <span className="font-medium text-slate-700">{Math.min(page * LIMIT, filtered.length)}</span> of{' '}
                  <span className="font-medium text-slate-700">{filtered.length}</span>
                </p>
                <div className="flex items-center gap-1">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                    className="p-2 rounded-xl text-slate-500 hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                    .map((p, idx, arr) => (
                      <span key={p} className="flex items-center">
                        {idx > 0 && arr[idx - 1] !== p - 1 && <span className="px-2 text-slate-400 text-sm">…</span>}
                        <button onClick={() => setPage(p)}
                          className={`w-8 h-8 rounded-xl text-sm font-semibold transition-all ${
                            p === page
                              ? 'bg-blue-600 text-white shadow-sm'
                              : 'text-slate-600 hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200'
                          }`}>
                          {p}
                        </button>
                      </span>
                    ))}
                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                    className="p-2 rounded-xl text-slate-500 hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Cancel Confirmation Modal */}
        <AnimatePresence>
          {deleteId && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px]"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 8 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 w-full max-w-sm mx-4"
              >
                <div className="flex items-center justify-center w-12 h-12 bg-red-50 rounded-full mx-auto mb-4 border border-red-100">
                  <Trash2 className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-base font-semibold text-slate-900 text-center mb-1">Cancel Scheduled Ride</h3>
                <p className="text-sm text-slate-500 text-center mb-6 leading-relaxed">
                  Are you sure you want to cancel this scheduled ride? This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <button onClick={() => setDeleteId(null)}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                    Back
                  </button>
                  <button onClick={handleDelete}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white text-sm font-medium hover:bg-red-700 shadow-sm transition-colors">
                    Yes, Cancel
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </AdminShell>
    )
  }
