'use client'

import { useState, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import AdminShell from '@/components/Common/AdminShell'
import { 
  ArrowLeft, Phone, Mail, MapPin, Calendar, Star, 
  Award, TrendingUp, IndianRupee, Clock, Car, 
  CheckCircle2, XCircle, FileText, CreditCard, 
  AlertTriangle, User 
} from 'lucide-react'


// ── Types ─────────────────────────────────────────────────────────────────────
interface Passenger {
  _id: string
  passengerId: string
  fullName: string
  email: string
  phoneNumber: string
  city?: string
  isActive: boolean
  isVerified: boolean
  createdAt: string
  totalRides?: number
  totalSpent?: number
  rating?: number
  deactivationReason?: string
  aadharNumber?: string
  panNumber?: string
}

interface RecentRide {
  _id: string
  rideId: string
  pickup: string
  drop: string
  fare: number
  date: string
  status: 'completed' | 'cancelled' | 'ongoing'
  distance?: number
  driverName?: string
}

// ── Static Data ───────────────────────────────────────────────────────────────
// IMPORTANT: Make sure the ID matches what you're clicking from the passengers list
const STATIC_PASSENGERS: Passenger[] = [
  {
    _id: 'PSG0001',  // This must match the ID in your URL
    passengerId: 'PSG001',
    fullName: 'Sujit Patnaik',
    email: 'sujitpatnaik41@gmail.com',
    phoneNumber: '9777574423',
    city: 'Bhubaneswar',
    isActive: true,
    isVerified: true,
    createdAt: '2026-05-01T00:00:00.000Z',
    totalRides: 12,
    totalSpent: 2450,
    rating: 4.8,
    aadharNumber: 'XXXX-XXXX-1234',
    panNumber: 'ABCDE1234F'
  },
  {
    _id: '6a1dd9f7b147b4756ea30f32',
    passengerId: 'PGR-002',
    fullName: 'Rahul Mehta',
    email: 'rahul.mehta@example.com',
    phoneNumber: '+91 98765 43211',
    city: 'Cuttack',
    isActive: true,
    isVerified: true,
    createdAt: '2023-02-15T00:00:00.000Z',
    totalRides: 32,
    totalSpent: 6200,
    rating: 4.5
  },
]

const STATIC_RIDES: Record<string, RecentRide[]> = {
  'PSG001': [
    {
      _id: 'R001',
      rideId: 'RID-2026-001',
      pickup: 'Patia, Bhubaneswar',
      drop: 'Infocity, Bhubaneswar',
      fare: 185,
      date: '2026-05-15T10:30:00',
      status: 'completed',
      distance: 6.5,
      driverName: 'Rajesh Kumar'
    },
    {
      _id: 'R002',
      rideId: 'RID-2026-002',
      pickup: 'MG Road, Bhubaneswar',
      drop: 'Railway Station',
      fare: 120,
      date: '2026-05-14T14:20:00',
      status: 'completed',
      distance: 4.2,
      driverName: 'Suresh Patel'
    },
    {
      _id: 'R003',
      rideId: 'RID-2026-003',
      pickup: 'Khandagiri, Bhubaneswar',
      drop: 'Airport, Bhubaneswar',
      fare: 320,
      date: '2026-05-13T09:15:00',
      status: 'completed',
      distance: 11.3,
      driverName: 'Vikram Reddy'
    },
  ],
}

// ── Main Component ───────────────────────────────────────────────────────────
export default function PassengerDetailPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'overview' | 'rides' | 'documents' | 'banking'>('overview')

  // Debug: Log the ID being searched
  console.log('Looking for passenger with ID:', params.id)

  // Find passenger by _id (MongoDB ID) or passengerId (custom ID like PSG001)
  const passenger = useMemo(() => {
    // First try exact match by _id
    let found = STATIC_PASSENGERS.find(p => p._id === params.id)
    // If not found, try by passengerId
    if (!found) {
      found = STATIC_PASSENGERS.find(p => p.passengerId === params.id)
    }
    console.log('Found passenger:', found)
    return found
  }, [params.id])

  const recentRides = STATIC_RIDES[params.id] ?? STATIC_RIDES[passenger?._id ?? ''] ?? []

  // Format date function
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
  }

  // Format short date for table
  const formatShortDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  // If passenger not found, show error
  if (!passenger) {
    return (
      <AdminShell title="Passenger Detail">
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="h-10 w-10 text-red-500" />
          </div>
          <h2 className="text-xl font-semibold text-slate-800 mb-2">Passenger not found</h2>
          <p className="text-slate-500 mb-2">The passenger you are looking for does not exist.</p>
          <p className="text-xs text-slate-400 mb-6">ID searched: {params.id}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => router.push('/passengers')}
              className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              View All Passengers
            </button>
            <button
              onClick={() => router.back()}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </AdminShell>
    )
  }

  return (
    <AdminShell title="Passenger Management">
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white pb-8">
        
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.back()}
                className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all hover:shadow-sm"
              >
                <ArrowLeft className="h-5 w-5 text-slate-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">Passenger Profile</h1>
                <p className="text-sm text-slate-500 mt-0.5">View passenger details and ride history</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-slate-200">
            <nav className="flex gap-6">
              {[
                { id: 'overview' as const, label: 'Overview', icon: User },
                { id: 'rides' as const, label: 'Ride History', icon: Car },
                { id: 'documents' as const, label: 'Documents', icon: FileText },
                { id: 'banking' as const, label: 'Banking', icon: CreditCard },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-1 py-3 text-sm font-medium transition-all relative
                    ${activeTab === tab.id 
                      ? 'text-blue-600' 
                      : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column - Profile Card */}
          <div className="space-y-5">
            {/* Profile Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-4">
                  <div className="h-24 w-24 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                    {passenger.fullName.charAt(0)}
                  </div>
                  <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white
                    ${passenger.isActive ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                </div>
                <h2 className="text-xl font-bold text-slate-800">{passenger.fullName}</h2>
                <p className="text-sm text-slate-500 mt-0.5 font-mono">{passenger.passengerId}</p>
                <div className="mt-3">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
                    passenger.isActive 
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                      : 'bg-gray-100 text-gray-800 border-gray-200'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${passenger.isActive ? 'bg-emerald-500' : 'bg-gray-500'}`} />
                    {passenger.isActive ? 'Active' : 'Inactive'}
                  </span>
                  {passenger.isVerified && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border bg-blue-50 text-blue-800 border-blue-200 ml-2">
                      <Award className="h-3 w-3" />
                      Verified
                    </span>
                  )}
                </div>
                {passenger.rating && (
                  <div className="flex items-center gap-1 mt-3">
                    <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                    <span className="text-sm font-semibold text-slate-700">{passenger.rating}</span>
                    <span className="text-xs text-slate-400">({passenger.totalRides} rides)</span>
                  </div>
                )}
              </div>

              <div className="border-t border-slate-100 mt-5 pt-5 space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-slate-400" />
                  <span className="text-slate-600 break-all">{passenger.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 text-slate-400" />
                  <span className="text-slate-600">{passenger.phoneNumber}</span>
                </div>
                {passenger.city && (
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="h-4 w-4 text-slate-400" />
                    <span className="text-slate-600">{passenger.city}</span>
                  </div>
                )}
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  <span className="text-slate-600">Joined {formatDate(passenger.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Dynamic Content */}
          <div className="lg:col-span-2">
            
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-5">
                {/* Stats Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-blue-600" />
                      <p className="text-xs text-blue-700 font-semibold uppercase tracking-wide">Total Rides</p>
                    </div>
                    <p className="text-2xl font-bold text-blue-800">{passenger.totalRides || 0}</p>
                  </div>
                  <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-4 border border-emerald-200 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <IndianRupee className="h-4 w-4 text-emerald-600" />
                      <p className="text-xs text-emerald-700 font-semibold uppercase tracking-wide">Total Spent</p>
                    </div>
                    <p className="text-2xl font-bold text-emerald-800">₹{passenger.totalSpent?.toLocaleString() || 0}</p>
                  </div>
                  {passenger.rating && (
                    <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-4 border border-amber-200 shadow-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <Star className="h-4 w-4 text-amber-600" />
                        <p className="text-xs text-amber-700 font-semibold uppercase tracking-wide">Rating</p>
                      </div>
                      <p className="text-2xl font-bold text-amber-800">{passenger.rating} / 5</p>
                    </div>
                  )}
                </div>

                {/* Travel Insights */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                  <h3 className="text-sm font-semibold text-slate-800 mb-4 flex items-center gap-2">
                    <Award className="h-4 w-4 text-blue-500" />
                    Travel Insights
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-600">Total Distance Travelled</span>
                        <span className="font-semibold text-slate-800">~{Math.round((passenger.totalRides || 0) * 7.5)} km</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.min(100, ((passenger.totalRides || 0) / 100) * 100)}%` }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-600">Average Spend per Ride</span>
                        <span className="font-semibold text-slate-800">
                          ₹{passenger.totalRides ? Math.round((passenger.totalSpent || 0) / passenger.totalRides) : 0}
                        </span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: '65%' }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Rides Tab */}
            {activeTab === 'rides' && (
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
                  <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-500" />
                    Ride History ({recentRides.length} rides)
                  </h3>
                </div>
                {recentRides.length === 0 ? (
                  <div className="text-center py-12">
                    <Car className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-sm text-slate-500">No ride history found for this passenger</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50">
                        <tr className="border-b border-slate-200">
                          {['Ride ID', 'Driver', 'Pickup', 'Drop', 'Distance', 'Fare', 'Date', 'Status'].map(h => (
                            <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {recentRides.map((ride, idx) => (
                          <tr key={ride._id} className={`border-b border-slate-100 hover:bg-slate-50/50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}`}>
                            <td className="px-4 py-3 text-xs font-mono font-medium text-blue-600">{ride.rideId}</td>
                            <td className="px-4 py-3 text-sm text-slate-700">{ride.driverName || '—'}</td>
                            <td className="px-4 py-3 text-sm text-slate-600 max-w-[150px] truncate">{ride.pickup}</td>
                            <td className="px-4 py-3 text-sm text-slate-600 max-w-[150px] truncate">{ride.drop}</td>
                            <td className="px-4 py-3 text-sm text-slate-600">{ride.distance ? `${ride.distance} km` : '—'}</td>
                            <td className="px-4 py-3 text-sm font-semibold text-slate-800">₹{ride.fare}</td>
                            <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">{formatShortDate(ride.date)}</td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                                ride.status === 'completed'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-red-50 text-red-600 border border-red-200'
                              }`}>
                                {ride.status === 'completed' && <CheckCircle2 className="h-3 w-3" />}
                                {ride.status === 'cancelled' && <XCircle className="h-3 w-3" />}
                                {ride.status.charAt(0).toUpperCase() + ride.status.slice(1)}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Documents Tab */}
            {activeTab === 'documents' && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <h3 className="text-sm font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-blue-500" />
                  KYC Documents
                </h3>
                {passenger.aadharNumber || passenger.panNumber ? (
                  <div className="space-y-3">
                    {passenger.aadharNumber && (
                      <div className="flex items-center justify-between p-3 border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                            <FileText className="h-5 w-5 text-emerald-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-700">Aadhar Card</p>
                            <p className="text-xs text-slate-400">Verified</p>
                          </div>
                        </div>
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
                          <CheckCircle2 className="h-3 w-3 inline mr-1" />
                          Verified
                        </span>
                      </div>
                    )}
                    {passenger.panNumber && (
                      <div className="flex items-center justify-between p-3 border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                            <FileText className="h-5 w-5 text-emerald-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-700">PAN Card</p>
                            <p className="text-xs text-slate-400">Verified</p>
                          </div>
                        </div>
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
                          <CheckCircle2 className="h-3 w-3 inline mr-1" />
                          Verified
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-slate-300 mx-auto mb-2" />
                    <p className="text-sm text-slate-500">No documents uploaded yet</p>
                  </div>
                )}
              </div>
            )}

            {/* Banking Tab */}
            {activeTab === 'banking' && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <h3 className="text-sm font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-blue-500" />
                  Banking & KYC Information
                </h3>
                <div className="space-y-4">
                  {passenger.aadharNumber && (
                    <div className="p-3 bg-gradient-to-br from-slate-50 to-white rounded-lg border border-slate-100">
                      <p className="text-xs text-slate-500 mb-1">Aadhar Number</p>
                      <p className="text-sm font-mono font-semibold text-slate-800">{passenger.aadharNumber}</p>
                    </div>
                  )}
                  {passenger.panNumber && (
                    <div className="p-3 bg-gradient-to-br from-slate-50 to-white rounded-lg border border-slate-100">
                      <p className="text-xs text-slate-500 mb-1">PAN Number</p>
                      <p className="text-sm font-mono font-semibold text-slate-800">{passenger.panNumber}</p>
                    </div>
                  )}
                  {!passenger.aadharNumber && !passenger.panNumber && (
                    <div className="text-center py-8">
                      <CreditCard className="h-12 w-12 text-slate-300 mx-auto mb-2" />
                      <p className="text-sm text-slate-500">No banking or KYC information available</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminShell>
  )
}