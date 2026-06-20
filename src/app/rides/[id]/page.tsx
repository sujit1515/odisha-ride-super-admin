'use client'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import AdminShell from '@/components/Common/AdminShell'
import {
  ArrowLeft, Navigation, Clock, Calendar, IndianRupee,
  Car, User, Phone, Star, CreditCard, Route, CheckCircle2,
  XCircle, AlertCircle, MessageSquare, Download, RefreshCw,
} from 'lucide-react'
import { JSX } from 'react'

// Types
type RideStatus = 'Completed' | 'Ongoing' | 'Cancelled' | 'Pending'

interface Ride {
  id: string
  passenger: string
  driver: string
  fare: number
  status: RideStatus
  time: string
  date: string
  pickup: string
  drop: string
}

// Mock Data
const rides: Ride[] = [
  { id: '6650a1b2c3d4e5f6a7b8c001', passenger: 'John Doe',      driver: 'Rajesh Kumar', fare: 245, status: 'Completed', time: '04:00 PM', date: '15 Jan 2024', pickup: 'MG Road, Bhubaneswar',      drop: 'Infocity, Bhubaneswar'    },
  { id: '6650a1b2c3d4e5f6a7b8c002', passenger: 'Jane Smith',    driver: 'Suresh Patel', fare: 189, status: 'Ongoing',   time: '04:45 PM', date: '15 Jan 2024', pickup: 'Patia, Bhubaneswar',        drop: 'Esplanade, Bhubaneswar'   },
  { id: '6650a1b2c3d4e5f6a7b8c003', passenger: 'Mike Johnson',  driver: 'Amit Singh',   fare: 320, status: 'Completed', time: '03:15 PM', date: '15 Jan 2024', pickup: 'Cuttack Road, Bhubaneswar', drop: 'Airport, Bhubaneswar'     },
  { id: '6650a1b2c3d4e5f6a7b8c004', passenger: 'Sarah Williams',driver: 'Vikram Reddy', fare: 156, status: 'Cancelled', time: '02:00 PM', date: '14 Jan 2024', pickup: 'Jaydev Vihar, Bhubaneswar', drop: 'Ram Mandir, Bhubaneswar'  },
  { id: '6650a1b2c3d4e5f6a7b8c005', passenger: 'David Brown',   driver: 'Manish Gupta', fare: 278, status: 'Completed', time: '08:00 PM', date: '14 Jan 2024', pickup: 'Saheed Nagar, Bhubaneswar', drop: 'Rasulgarh, Bhubaneswar'   },
  { id: '6650a1b2c3d4e5f6a7b8c006', passenger: 'Emma Wilson',   driver: 'Rahul Verma',  fare: 342, status: 'Pending',   time: '12:15 AM', date: '13 Jan 2024', pickup: 'Khandagiri, Bhubaneswar',   drop: 'Nayapalli, Bhubaneswar'   },
  { id: '6650a1b2c3d4e5f6a7b8c007', passenger: 'James Taylor',  driver: 'Pankaj Singh', fare: 198, status: 'Ongoing',   time: '12:50 AM', date: '13 Jan 2024', pickup: 'Unit-4, Bhubaneswar',       drop: 'Bomikhal, Bhubaneswar'    },
  { id: '6650a1b2c3d4e5f6a7b8c008', passenger: 'Lisa Anderson', driver: 'Deepak Sharma',fare: 267, status: 'Completed', time: '05:45 PM', date: '12 Jan 2024', pickup: 'Bapuji Nagar, Bhubaneswar', drop: 'Sundarpada, Bhubaneswar'  },
  { id: '6650a1b2c3d4e5f6a7b8c009', passenger: 'Robert Taylor', driver: 'Anil Kumar',   fare: 185, status: 'Cancelled', time: '10:00 PM', date: '12 Jan 2024', pickup: 'Vani Vihar, Bhubaneswar',   drop: 'Mancheswar, Bhubaneswar'  },
  { id: '6650a1b2c3d4e5f6a7b8c010', passenger: 'Maria Garcia',  driver: 'Sunil Reddy',  fare: 412, status: 'Completed', time: '02:30 PM', date: '11 Jan 2024', pickup: 'Airport Road, Bhubaneswar', drop: 'Domlur, Bhubaneswar'      },
]

const statusBadge = (s: RideStatus): string => {
  if (s === 'Completed') return 'bg-emerald-100 text-emerald-700 border-emerald-200'
  if (s === 'Ongoing') return 'bg-orange-100 text-orange-700 border-orange-200'
  if (s === 'Cancelled') return 'bg-red-100 text-red-700 border-red-200'
  return 'bg-slate-100 text-slate-700 border-slate-200'
}

const statusIcon = (s: RideStatus): JSX.Element => {
  if (s === 'Completed') return <CheckCircle2 className="h-5 w-5 text-emerald-600" />
  if (s === 'Ongoing') return <RefreshCw className="h-5 w-5 text-orange-600 animate-spin" />
  if (s === 'Cancelled') return <XCircle className="h-5 w-5 text-red-600" />
  return <AlertCircle className="h-5 w-5 text-slate-600" />
}

interface RideExtra {
  distance: string
  duration: number
  base: number
  perKm: number
  distanceFare: number
  tax: number
  platform: number
  driverEarn: number
  paymentMethod: string
  passengerRating: string
  driverRating: string
  bookedAt: string
  pickupTime: string
  dropTime: string
}

interface TimelineStep {
  label: string
  time: string
  done: boolean
  bad?: boolean
}

const buildExtra = (ride: Ride): RideExtra => {
  const seed = parseInt(String(ride.id).replace(/\D/g, '')) || 1
  const distance = ((seed % 18) + 3.5).toFixed(1)
  const duration = (seed % 35) + 8
  const base = 50
  const perKm = 12
  const distanceFare = Math.round(parseFloat(distance) * perKm)
  const tax = Math.round(ride.fare * 0.05)
  const platform = Math.round(ride.fare * 0.15)
  const driverEarn = ride.fare - tax - platform
  const paymentMethod = ['UPI', 'Cash', 'Card', 'Wallet'][seed % 4]
  const passengerRating = (4 + ((seed % 9) / 10)).toFixed(1)
  const driverRating = (4 + (((seed + 3) % 9) / 10)).toFixed(1)
  return {
    distance, duration, base, perKm, distanceFare, tax, platform, driverEarn,
    paymentMethod, passengerRating, driverRating,
    bookedAt: `${ride.date} ${ride.time}`,
    pickupTime: ride.time,
    dropTime: ride.status === 'Completed'
      ? ride.time.replace(/(\d+):(\d+)/, (_, h: string, m: string) => `${h}:${String((parseInt(m) + duration) % 60).padStart(2, '0')}`)
      : '—',
  }
}

const buildTimeline = (ride: Ride): TimelineStep[] => {
  const isCancelled = ride.status === 'Cancelled'
  const isOngoing = ride.status === 'Ongoing'
  return [
    { label: 'Ride Requested', time: ride.time, done: true },
    { label: 'Driver Assigned', time: ride.time, done: true },
    { label: 'Driver Arrived at Pickup', time: ride.time, done: !isCancelled },
    { label: 'Ride Started', time: ride.time, done: !isCancelled },
    {
      label: isCancelled ? 'Ride Cancelled' : 'Ride Completed',
      time: isCancelled ? ride.time : (isOngoing ? '—' : ride.time),
      done: !isOngoing,
      bad: isCancelled,
    },
  ]
}

export default function RideDetailPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const decodedId = decodeURIComponent(params.id)
  const ride: Ride | undefined = rides.find(
    r => r.id === decodedId || r.id === `#${decodedId}` || r.id.replace('#', '') === decodedId
  )

  if (!ride) {
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

  const extra = buildExtra(ride)
  const timeline = buildTimeline(ride)
  const mapQuery = encodeURIComponent(`${ride.pickup}, Bhubaneswar`)
  const idDigits = String(ride.id).replace(/\D/g, '')

  return (
    <AdminShell title={`Ride ${ride.id}`}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-slate-800">Ride {ride.id}</h2>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${statusBadge(ride.status)}`}>
                {statusIcon(ride.status)} {ride.status}
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-1 flex items-center gap-3">
              <span className="inline-flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {ride.date}</span>
              <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {ride.time}</span>
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium hover:bg-slate-50">
            <Download className="h-4 w-4" /> Invoice
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700">
            <MessageSquare className="h-4 w-4" /> Contact Support
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="h-64 md:h-80 relative">
              <iframe
                title="route-map"
                src={`https://maps.google.com/maps?q=${mapQuery}&t=&z=12&ie=UTF8&iwloc=&output=embed`}
                className="absolute inset-0 w-full h-full"
              />
            </div>
            <div className="p-5">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <Route className="h-5 w-5 text-blue-600" /> Trip Route
              </h3>
              <div className="relative pl-8 space-y-6">
                <div className="absolute left-3 top-3 bottom-3 w-0.5 bg-slate-200" />
                <div className="relative">
                  <span className="absolute -left-6 top-1 h-3 w-3 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
                  <div className="text-xs text-slate-500 font-medium uppercase">Pickup</div>
                  <div className="text-base font-semibold text-slate-800 mt-0.5">{ride.pickup}</div>
                  <div className="text-xs text-slate-500 mt-1">at {extra.pickupTime}</div>
                </div>
                <div className="relative">
                  <span className="absolute -left-6 top-1 h-3 w-3 rounded-full bg-red-500 ring-4 ring-red-100" />
                  <div className="text-xs text-slate-500 font-medium uppercase">Drop</div>
                  <div className="text-base font-semibold text-slate-800 mt-0.5">{ride.drop}</div>
                  <div className="text-xs text-slate-500 mt-1">at {extra.dropTime}</div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3 pt-5 border-t">
                <div className="text-center">
                  <Navigation className="h-5 w-5 text-blue-600 mx-auto" />
                  <div className="mt-2 text-xs text-slate-500">Distance</div>
                  <div className="text-lg font-bold">{extra.distance} km</div>
                </div>
                <div className="text-center">
                  <Clock className="h-5 w-5 text-blue-600 mx-auto" />
                  <div className="mt-2 text-xs text-slate-500">Duration</div>
                  <div className="text-lg font-bold">{extra.duration} min</div>
                </div>
                <div className="text-center">
                  <IndianRupee className="h-5 w-5 text-blue-600 mx-auto" />
                  <div className="mt-2 text-xs text-slate-500">Fare</div>
                  <div className="text-lg font-bold">₹{ride.fare}</div>
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
                  <span className={`absolute -left-6 top-1 h-3 w-3 rounded-full ring-4 ${
                    t.bad ? 'bg-red-500 ring-red-100' :
                    t.done ? 'bg-emerald-500 ring-emerald-100' : 'bg-slate-300 ring-slate-100'
                  }`} />
                  <div className="flex justify-between items-center">
                    <div className={`font-medium ${t.done ? 'text-slate-800' : 'text-slate-400'}`}>{t.label}</div>
                    <div className="text-xs text-slate-500">{t.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-blue-600" /> Fare Breakdown
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-2"><span className="text-slate-600">Base Fare</span><span className="font-medium">₹{extra.base}</span></div>
              <div className="flex justify-between py-2"><span className="text-slate-600">Distance ({extra.distance} km × ₹{extra.perKm})</span><span className="font-medium">₹{extra.distanceFare}</span></div>
              <div className="flex justify-between py-2"><span className="text-slate-600">Platform Fee</span><span className="font-medium">₹{extra.platform}</span></div>
              <div className="flex justify-between py-2"><span className="text-slate-600">Tax (GST 5%)</span><span className="font-medium">₹{extra.tax}</span></div>
              <div className="flex justify-between py-3 border-t mt-2">
                <span className="font-semibold text-slate-800">Total Charged</span>
                <span className="text-xl font-bold text-blue-600">₹{ride.fare}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-500 pt-2">
                <span>Driver Earnings</span>
                <span>₹{extra.driverEarn}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-500">
                <span>Payment Method</span>
                <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">{extra.paymentMethod}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">Passenger</h3>
            <div className="flex items-center gap-3">
              <div className="h-14 w-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xl">
                {ride.passenger.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="font-semibold text-slate-800">{ride.passenger}</div>
                <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                  <Star className="h-3 w-3 text-amber-500 fill-amber-500" /> {extra.passengerRating}
                </div>
              </div>
            </div>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex items-center gap-2 text-slate-600"><Phone className="h-4 w-4" /> +91 98765 4{idDigits.slice(-4)}</div>
              <div className="flex items-center gap-2 text-slate-600"><User className="h-4 w-4" /> Passenger ID: P-{idDigits}</div>
            </div>
            <button className="mt-4 w-full px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium hover:bg-slate-50">View Profile</button>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">Driver</h3>
            <div className="flex items-center gap-3">
              <div className="h-14 w-14 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xl">
                {ride.driver.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="font-semibold text-slate-800">{ride.driver}</div>
                <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                  <Star className="h-3 w-3 text-amber-500 fill-amber-500" /> {extra.driverRating}
                </div>
              </div>
            </div>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex items-center gap-2 text-slate-600"><Phone className="h-4 w-4" /> +91 99887 7{idDigits.slice(-4)}</div>
              <div className="flex items-center gap-2 text-slate-600"><Car className="h-4 w-4" /> Maruti Swift · OD02AB{idDigits.slice(-4)}</div>
            </div>
            <Link href="/drivers" className="mt-4 block text-center w-full px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium hover:bg-slate-50">View Driver</Link>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">Ride Info</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-slate-500">Ride ID</span><span className="font-medium">{ride.id}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Booked At</span><span className="font-medium">{extra.bookedAt}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Vehicle Type</span><span className="font-medium">Mini</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Payment</span><span className="font-medium">{extra.paymentMethod}</span></div>
              <div className="flex justify-between items-center"><span className="text-slate-500">Status</span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusBadge(ride.status)}`}>{ride.status}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  )
}