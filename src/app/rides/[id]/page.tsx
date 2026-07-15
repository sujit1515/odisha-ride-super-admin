'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import AdminShell from '@/components/Common/AdminShell'
import {
  ArrowLeft, Navigation, Clock, Calendar, IndianRupee,
  Car, User, Phone, Star, CreditCard, Route, CheckCircle2,
  XCircle, AlertCircle, MessageSquare, Download,
} from 'lucide-react'
import { JSX } from 'react'
import { getRideById, downloadInvoice, type Ride } from '@/api/rides'


const STATUS_STYLES: Record<string, string> = {
  completed: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  cancelled: 'bg-red-100 text-red-700 border-red-200',
  requested: 'bg-blue-100 text-blue-700 border-blue-200',
  accepted: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  arrived: 'bg-purple-100 text-purple-700 border-purple-200',
  started: 'bg-orange-100 text-orange-700 border-orange-200',
}

const STATUS_LABEL: Record<string, string> = {
  completed: 'Completed',
  cancelled: 'Cancelled',
  requested: 'Requested',
  accepted: 'Accepted',
  arrived: 'Arrived',
  started: 'Ongoing',
}

const statusIcon = (s: string): JSX.Element => {
  if (s === 'completed') return <CheckCircle2 className="h-5 w-5 text-emerald-600" />
  if (s === 'cancelled') return <XCircle className="h-5 w-5 text-red-600" />
  if (s === 'requested' || s === 'accepted' || s === 'arrived' || s === 'started')
    return <AlertCircle className="h-5 w-5 text-orange-600" />
  return <AlertCircle className="h-5 w-5 text-slate-600" />
}

const fmtDate = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'

const fmtTime = (iso: string | null) =>
  iso ? new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }) : '—'

interface TimelineStep {
  label: string
  time: string | null
  done: boolean
  bad?: boolean
}

const buildTimeline = (ride: Ride): TimelineStep[] => {
  const cancelled = ride.status === 'cancelled'
  return [
    { label: 'Ride Requested', time: ride.createdAt, done: true },
    { label: 'Driver Assigned', time: ride.acceptedAt, done: !!ride.acceptedAt },
    { label: 'Ride Started', time: ride.startedAt, done: !!ride.startedAt },
    cancelled
      ? { label: 'Ride Cancelled', time: ride.cancelledAt, done: true, bad: true }
      : { label: 'Ride Completed', time: ride.completedAt, done: !!ride.completedAt },
  ]
}

export default function RideDetailPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const decodedId = decodeURIComponent(params.id)

  const [ride, setRide] = useState<Ride | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')
    getRideById(decodedId)
      .then(res => { if (active) setRide(res.ride) })
      .catch(err => { console.error(err); if (active) setError('Ride not found') })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [decodedId])

  if (loading) {
    return (
      <AdminShell title="Loading...">
        <div className="bg-white rounded-2xl p-10 text-center border animate-pulse text-slate-400">
          Loading ride details…
        </div>
      </AdminShell>
    )
  }

  if (error || !ride) {
    return (
      <AdminShell title="Ride Not Found">
        <div className="bg-white rounded-2xl p-10 text-center border">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
          <h2 className="mt-4 text-xl font-bold">Ride {decodedId} not found</h2>
          <p className="text-sm text-slate-500 mt-1">The ride you are looking for does not exist.</p>
          <Link href="/rides" className="mt-6 inline-block px-5 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium">
            Back to All Rides
          </Link>
        </div>
      </AdminShell>
    )
  }

  const timeline = buildTimeline(ride)
  const statusKey = ride.status?.toLowerCase() ?? ''
  const originCoords = `${ride.pickup.latitude},${ride.pickup.longitude}`
  const destCoords = `${ride.destination.latitude},${ride.destination.longitude}`
  const mapsKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  const fare = ride.finalFare ?? ride.estimatedFare ?? 0
  const tax = Math.round(fare * 0.05)
  const platform = Math.round(fare * 0.15)
  const driverEarn = fare - tax - platform

  return (
    <AdminShell title={`Ride ${ride._id}`}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-slate-800">Ride {ride._id.slice(-6).toUpperCase()}</h2>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${STATUS_STYLES[statusKey] ?? 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                {statusIcon(statusKey)} {STATUS_LABEL[statusKey] ?? ride.status}
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-1 flex items-center gap-3">
              <span className="inline-flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {fmtDate(ride.createdAt)}</span>
              <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {fmtTime(ride.createdAt)}</span>
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => downloadInvoice(ride._id)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-indigo-200 bg-indigo-50 text-indigo-700 text-sm font-medium transition-all duration-200 hover:bg-indigo-100 hover:border-indigo-300 hover:shadow-sm"
          >
            <Download className="h-4 w-4" /> Invoice
          </button>

        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="h-64 md:h-80 relative">
              {mapsKey ? (
                <iframe
                  title="route-map"
                  src={`https://www.google.com/maps/embed/v1/directions?key=${mapsKey}&origin=${originCoords}&destination=${destCoords}&mode=driving`}
                  className="absolute inset-0 w-full h-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-sm text-slate-400 bg-slate-50">
                  Map unavailable — missing API key
                </div>
              )}
            </div>
            <div className="p-5">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <Route className="h-5 w-5 text-blue-600" /> Trip Route
              </h3>
              <div className="relative pl-8 space-y-6">
                <div className="absolute left-3 top-3 bottom-3 w-0.5 bg-slate-200" />
                <div className="relative">
                  <span className="absolute -left-7 top-0.5 flex h-4 w-4">
                    <span className="animate-ping-slow absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 ring-4 ring-emerald-100" />
                  </span>
                  <div className="text-xs text-slate-500 font-medium uppercase">Pickup</div>
                  <div className="text-base font-semibold text-slate-800 mt-0.5">{ride.pickup.address}</div>
                </div>
                <div className="relative">
                  <span className="absolute -left-7 top-0.5 flex h-4 w-4">
                    <span className="animate-ping-slow absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 ring-4 ring-red-100" />
                  </span>
                  <div className="text-xs text-slate-500 font-medium uppercase">Drop</div>
                  <div className="text-base font-semibold text-slate-800 mt-0.5">{ride.destination.address}</div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3 pt-5 border-t">
                <div className="text-center">
                  <Navigation className="h-5 w-5 text-blue-600 mx-auto" />
                  <div className="mt-2 text-xs text-slate-500">Distance</div>
                  <div className="text-lg font-bold">{ride.distance ?? '—'}</div>
                </div>
                <div className="text-center">
                  <Clock className="h-5 w-5 text-blue-600 mx-auto" />
                  <div className="mt-2 text-xs text-slate-500">Duration</div>
                  <div className="text-lg font-bold">{ride.duration ?? '—'}</div>
                </div>
                <div className="text-center">
                  <IndianRupee className="h-5 w-5 text-blue-600 mx-auto" />
                  <div className="mt-2 text-xs text-slate-500">Fare</div>
                  <div className="text-lg font-bold">₹{fare}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-800 mb-5">Ride Timeline</h3>
            <div className="relative pl-8">
              <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-slate-200" />
              {timeline.map((t, i) => (
                <div key={i} className="relative pb-5 last:pb-0">
                  <span className="absolute -left-6 top-1 flex h-3 w-3">
                    <span className={`animate-ping-slow absolute inline-flex h-full w-full rounded-full opacity-75 ${t.bad ? 'bg-red-400' : t.done ? 'bg-emerald-400' : 'bg-slate-300'
                      }`} />
                    <span className={`relative inline-flex h-3 w-3 rounded-full ring-4 ${t.bad ? 'bg-red-500 ring-red-100' :
                      t.done ? 'bg-emerald-500 ring-emerald-100' : 'bg-slate-300 ring-slate-100'
                      }`} />
                  </span>
                  <div className="flex justify-between items-center">
                    <div className={`font-medium ${t.done ? 'text-slate-800' : 'text-slate-400'}`}>{t.label}</div>
                    <div className="text-xs text-slate-500">{fmtTime(t.time)}</div>
                  </div>
                </div>
              ))}
              {ride.status === 'cancelled' && ride.cancellationReason && (
                <p className="text-xs text-red-500 mt-2">
                  Reason: {ride.cancellationReason} {ride.cancelledBy ? `(by ${ride.cancelledBy})` : ''}
                </p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-blue-600" /> Fare Breakdown
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-2"><span className="text-slate-600">Estimated Fare</span><span className="font-medium">₹{ride.estimatedFare ?? '—'}</span></div>
              <div className="flex justify-between py-2"><span className="text-slate-600">Platform Fee (~15%)</span><span className="font-medium">₹{platform}</span></div>
              <div className="flex justify-between py-2"><span className="text-slate-600">Tax (~5%)</span><span className="font-medium">₹{tax}</span></div>
              {ride.cancellationFee > 0 && (
                <div className="flex justify-between py-2"><span className="text-slate-600">Cancellation Fee</span><span className="font-medium">₹{ride.cancellationFee}</span></div>
              )}
              <div className="flex justify-between py-3 border-t mt-2">
                <span className="font-semibold text-slate-800">Total Charged</span>
                <span className="text-xl font-bold text-blue-600">₹{fare}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-500 pt-2">
                <span>Driver Earnings (est.)</span>
                <span>₹{driverEarn}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-500">
                <span>Payment Method</span>
                <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">{ride.paymentMethod}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">Passenger</h3>
            <div className="flex items-center gap-3">
              <div className="h-14 w-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xl overflow-hidden">
                {ride.userId.avatarUrl
                  ? <img src={ride.userId.avatarUrl} alt="" className="h-full w-full object-cover" />
                  : ride.userId.fullName.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="font-semibold text-slate-800">{ride.userId.fullName}</div>
                <div className="text-xs text-slate-500 mt-0.5">{ride.userId.email}</div>
              </div>
            </div>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex items-center gap-2 text-slate-600"><Phone className="h-4 w-4" /> {ride.userId.phoneNumber}</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">Driver</h3>
            {ride.driverId ? (
              <>
                <div className="flex items-center gap-3">
                  <div className="h-14 w-14 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xl overflow-hidden">
                    {ride.driverId.profileImage
                      ? <img src={ride.driverId.profileImage} alt="" className="h-full w-full object-cover" />
                      : ride.driverId.fullName.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-slate-800">{ride.driverId.fullName}</div>
                    {ride.driverId.rating != null && (
                      <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <Star className="h-3 w-3 text-amber-500 fill-amber-500" /> {ride.driverId.rating.toFixed(1)}
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-slate-600"><Phone className="h-4 w-4" /> {ride.driverId.phone}</div>
                  <div className="flex items-center gap-2 text-slate-600"><Car className="h-4 w-4" /> {ride.driverId.vehicleType} · {ride.driverId.vehicleNumber}</div>
                  <div className="flex items-center gap-2 text-slate-600"><User className="h-4 w-4" /> {ride.driverId.driverId}</div>
                </div>
                <Link href="/drivers" className="mt-4 block text-center w-full px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium hover:bg-slate-50">View Driver</Link>
              </>
            ) : (
              <p className="text-sm text-slate-400">No driver assigned</p>
            )}
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">Ride Info</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-slate-500">Ride ID</span><span className="font-medium">{ride._id}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Booked At</span><span className="font-medium">{fmtDate(ride.createdAt)} {fmtTime(ride.createdAt)}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Vehicle Type</span><span className="font-medium">{ride.vehicleType}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Payment</span><span className="font-medium">{ride.paymentMethod}</span></div>
              {ride.otp && (
                <div className="flex justify-between"><span className="text-slate-500">OTP</span><span className="font-medium">{ride.otp}</span></div>
              )}
            <div className="flex justify-between items-center"><span className="text-slate-500">Status</span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${STATUS_STYLES[statusKey] ?? 'bg-slate-100 text-slate-600 border-slate-200'}`}>{STATUS_LABEL[statusKey] ?? ride.status}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  )
}