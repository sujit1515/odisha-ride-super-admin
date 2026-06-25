'use client'
import AdminShell from '@/components/Common/AdminShell'
import LiveCard from '@/components/Dashboard/Livecard'
import SosCard from '@/components/Dashboard/Soscard'
import MiniStat from '@/components/Dashboard/Ministat'
import RecentRides from '@/components/Dashboard/Recentrides'
import DriverStatus from '@/components/Dashboard/Driverstatus'
import AlertsAndPending from '@/components/Dashboard/Alertsandpending'
import { useDriverStatusSummary } from '@/hooks/useDriverStatusSummary'
import { useRegistrationStats } from '@/hooks/useRegistrationStats'
import { useSosStats } from '@/hooks/useSosStats'
import { useSosSocket } from '@/hooks/useSosSocket'

// ─── Types ────────────────────────────────────────────────────────────────────
type RideStatus = 'Completed' | 'Ongoing' | 'Cancelled' | 'Pending'

interface Ride {
  id: string
  passenger: string
  driver: string
  fare: number
  status: RideStatus
  time: string
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
const rides: Ride[] = [
  { id: 'RIDE-001', passenger: 'John Doe', driver: 'Rajesh Kumar', fare: 245, status: 'Completed', time: '10:30 AM' },
  { id: 'RIDE-002', passenger: 'Jane Smith', driver: 'Suresh Patel', fare: 189, status: 'Ongoing', time: '11:15 AM' },
  { id: 'RIDE-003', passenger: 'Mike Johnson', driver: 'Amit Singh', fare: 320, status: 'Completed', time: '09:45 AM' },
  { id: 'RIDE-004', passenger: 'Sarah Williams', driver: 'Vikram Reddy', fare: 156, status: 'Cancelled', time: '08:30 AM' },
  { id: 'RIDE-005', passenger: 'David Brown', driver: 'Manish Gupta', fare: 278, status: 'Completed', time: 'Yesterday' },
  { id: 'RIDE-006', passenger: 'Emma Wilson', driver: 'Rahul Verma', fare: 342, status: 'Completed', time: 'Yesterday' },
  { id: 'RIDE-007', passenger: 'James Taylor', driver: 'Pankaj Singh', fare: 198, status: 'Ongoing', time: '12:00 PM' },
]

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const recentRides = rides.slice(0, 4)
  const { data: driverSummary } = useDriverStatusSummary(15_000)
  const driversOnlineNow = driverSummary ? driverSummary.online : null
  const { data: registrationStats } = useRegistrationStats()
  const { data: sosStats, refetch: refetchSos } = useSosStats()

  useSosSocket({
    onNew: refetchSos,
    onResolved: refetchSos,
  })

  return (
    <AdminShell title="Odisha Ride Admin">

      {/* ── Row 1: Live Cards + SOS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <LiveCard label="Active rides right now" value="142" />
        <LiveCard
          label="Drivers online right now"
          value={driversOnlineNow !== null ? String(driversOnlineNow) : '—'}
        />
        <LiveCard label="Passengers waiting right now" value="84" dotClass="bg-amber-400" />
       <SosCard
  count={sosStats?.active ?? 0}
  activeCount={sosStats?.active ?? 0}
/>
      </div>

      {/* ── Row 2: Mini Stats ── */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <MiniStat label="Total rides completed" value="1,142" />
        <MiniStat label="Total revenue earned (₹)" value="₹38,240" />
        <MiniStat label="Cancellation rate %" value="4.2%" valueClass="text-red-600" />
        <MiniStat label="Average fare (₹)" value="₹245" />
        {/* <MiniStat label="Avg. wait time (mins)" value="4.5m" /> */}
        <MiniStat
          label="New registrations today"
          value={registrationStats?.today != null ? String(registrationStats.today) : '0'}
          valueClass="text-blue-600"
        />
        <MiniStat
          label="Total joined users"
          value={registrationStats?.total != null ? String(registrationStats.total) : '0'}
          valueClass="text-green-600"
        />

      </div>

      {/* ── Row 3: Recent Rides + Driver Status ── */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <RecentRides rides={recentRides} />
        </div>
        <DriverStatus />
      </div>

      {/* ── Row 4: Alerts & Pending ── */}
      <div className="mt-6">
        <AlertsAndPending
          disputedCount={4}
          failedPaymentsCount={12}
          pendingKycCount={24}
        />
      </div>

    </AdminShell>
  )
}