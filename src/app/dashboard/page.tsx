'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import AdminShell from '@/components/Common/AdminShell'
import { AlertTriangle, CreditCard, Shield } from 'lucide-react'

// Types
type RideStatus = 'Completed' | 'Ongoing' | 'Cancelled' | 'Pending'

interface Ride {
  id: string
  passenger: string
  driver: string
  fare: number
  status: RideStatus
  time: string
}

// Mock Data
const rides: Ride[] = [
  {
    id: 'RIDE-001',
    passenger: 'John Doe',
    driver: 'Rajesh Kumar',
    fare: 245,
    status: 'Completed',
    time: '10:30 AM'
  },
  {
    id: 'RIDE-002',
    passenger: 'Jane Smith',
    driver: 'Suresh Patel',
    fare: 189,
    status: 'Ongoing',
    time: '11:15 AM'
  },
  {
    id: 'RIDE-003',
    passenger: 'Mike Johnson',
    driver: 'Amit Singh',
    fare: 320,
    status: 'Completed',
    time: '09:45 AM'
  },
  {
    id: 'RIDE-004',
    passenger: 'Sarah Williams',
    driver: 'Vikram Reddy',
    fare: 156,
    status: 'Cancelled',
    time: '08:30 AM'
  },
  {
    id: 'RIDE-005',
    passenger: 'David Brown',
    driver: 'Manish Gupta',
    fare: 278,
    status: 'Completed',
    time: 'Yesterday'
  },
  {
    id: 'RIDE-006',
    passenger: 'Emma Wilson',
    driver: 'Rahul Verma',
    fare: 342,
    status: 'Completed',
    time: 'Yesterday'
  },
  {
    id: 'RIDE-007',
    passenger: 'James Taylor',
    driver: 'Pankaj Singh',
    fare: 198,
    status: 'Ongoing',
    time: '12:00 PM'
  }
]

interface LiveCardProps {
  label: string
  value: string
  dotClass?: string
  href?: string
}

const LiveCard = ({ label, value, dotClass = 'bg-emerald-500', href = '/live-map' }: LiveCardProps) => (
  <Link
    href={href}
    className="block bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition"
  >
    <div className="flex items-center gap-2 text-xs text-slate-500">
      <span className={`h-2 w-2 rounded-full ${dotClass} animate-pulse`} />
      Live Now
    </div>
    <div className="mt-3 text-sm text-slate-600">{label}</div>
    <div className="mt-2 text-4xl font-bold text-slate-900">{value}</div>
  </Link>
)

interface MiniStatProps {
  label: string
  value: string
  valueClass?: string
}

const MiniStat = ({ label, value, valueClass = 'text-slate-900' }: MiniStatProps) => (
  <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
    <div className="text-xs text-slate-500 leading-snug">{label}</div>
    <div className={`mt-3 text-2xl font-bold ${valueClass}`}>{value}</div>
  </div>
)

const statusBadge = (s: RideStatus): string => {
  if (s === 'Completed') return 'bg-emerald-100 text-emerald-700'
  if (s === 'Ongoing') return 'bg-orange-100 text-orange-700'
  if (s === 'Cancelled') return 'bg-red-100 text-red-700'
  return 'bg-slate-100 text-slate-700'
}

export default function DashboardPage() {
  const router = useRouter()
  const recent = rides.slice(0, 4)
  
  const handleNavigation = (path: string) => {
    router.push(path)
  }
  
  return (
    <AdminShell title="Odisha Ride Admin">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <LiveCard label="Active rides right now" value="142" />
        <LiveCard label="Drivers online right now" value="310" />
        <LiveCard label="Passengers waiting right now" value="84" dotClass="bg-amber-400" />
        
        {/* SOS Emergency Card - Using router.push */}
        <div 
          onClick={() => handleNavigation('/support')}
          className="block bg-red-50 rounded-2xl p-5 border border-red-100 hover:shadow-md transition cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-red-600 font-medium">
              <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" /> Emergency
            </div>
            <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-full">3 ACTIVE</span>
          </div>
          <div className="mt-3 text-sm text-red-700">SOS alerts</div>
          <div className="mt-2 text-4xl font-bold text-red-700">03</div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <MiniStat label="Total rides completed" value="1,142" />
        <MiniStat label="Total revenue earned (₹)" value="₹38,240" />
        <MiniStat label="Cancellation rate %" value="4.2%" valueClass="text-red-600" />
        <MiniStat label="Average fare (₹)" value="₹245" />
        <MiniStat label="Avg. wait time (mins)" value="4.5m" />
        <MiniStat label="New registrations" value="12" valueClass="text-blue-600" />
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-blue-700">Recent Rides</h3>
            <Link href="/rides" className="text-sm font-semibold text-blue-600 hover:underline">View All</Link>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-slate-500 text-xs">
                  <th className="text-left font-medium pb-3">Ride ID</th>
                  <th className="text-left font-medium pb-3">Passenger</th>
                  <th className="text-left font-medium pb-3">Driver</th>
                  <th className="text-left font-medium pb-3">Fare</th>
                  <th className="text-left font-medium pb-3">Status</th>
                  <th className="text-left font-medium pb-3">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recent.map(r => (
                  <tr key={r.id}>
                    <td className="py-3">
                      <Link href={`/rides/${encodeURIComponent(r.id)}`} className="text-blue-600 font-medium hover:underline">
                        {r.id}
                      </Link>
                    </td>
                    <td className="py-3">{r.passenger}</td>
                    <td className="py-3">{r.driver}</td>
                    <td className="py-3">₹{r.fare}</td>
                    <td className="py-3">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${statusBadge(r.status)}`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="py-3 text-slate-500">{r.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-blue-700">Driver Status</h3>
          <div className="mt-5 space-y-5">
            <div>
              <div className="flex justify-between text-sm"><span>Online</span><span className="font-semibold">310</span></div>
              <div className="mt-2 h-2 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-emerald-500" style={{ width: '70%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm"><span>On a Ride</span><span className="font-semibold">122</span></div>
              <div className="mt-2 h-2 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-orange-500" style={{ width: '45%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm"><span>Offline</span><span className="font-semibold">20</span></div>
              <div className="mt-2 h-2 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-slate-400" style={{ width: '8%' }} />
              </div>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t flex justify-between text-sm">
            <span className="text-slate-500">Total Fleet</span>
            <span className="font-semibold">452 Drivers</span>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
        <h3 className="text-lg font-semibold text-blue-700">Alerts &amp; Pending</h3>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Disputed Rides */}
          <div 
            onClick={() => router.push('/rides/disputed')}
            className="bg-blue-50 rounded-xl p-4 flex gap-3 cursor-pointer hover:bg-blue-100 transition-colors"
          >
            <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <div className="font-semibold text-slate-800">04 Disputed Rides</div>
              <div className="text-xs text-slate-500 mt-1">Action required immediately</div>
            </div>
          </div>

          {/* Failed Payments */}
          <div 
            onClick={() => router.push('/payments/failed')}
            className="bg-blue-50 rounded-xl p-4 flex gap-3 cursor-pointer hover:bg-blue-100 transition-colors"
          >
            <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
              <CreditCard className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <div className="font-semibold text-slate-800">12 Failed Payments</div>
              <div className="text-xs text-slate-500 mt-1">Server-side timeout errors</div>
            </div>
          </div>

          {/* Pending KYC */}
          <div 
            onClick={() => router.push('/kyc-review')}
            className="bg-blue-50 rounded-xl p-4 flex gap-3 cursor-pointer hover:bg-blue-100 transition-colors"
          >
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
              <Shield className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-800">Pending KYC</span>
                <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">24</span>
              </div>
              <div className="text-xs text-slate-500 mt-1">Drivers awaiting verification</div>
            </div>
          </div>
        </div>
        <div className="mt-5 flex justify-end">
          <div 
            onClick={() => router.push('/support')}
            className="px-5 py-2 rounded-lg border border-slate-200 text-sm font-medium hover:bg-slate-50 cursor-pointer inline-block"
          >
            View All Alerts
          </div>
        </div>
      </div>
    </AdminShell>
  )
}