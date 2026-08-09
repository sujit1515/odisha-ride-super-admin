'use client'
import { useEffect, useState } from 'react'
import AdminShell from '@/components/Common/AdminShell'
import LiveCard from '@/components/Dashboard/Livecard'
import SosCard from '@/components/Dashboard/Soscard'
import MiniStat from '@/components/Dashboard/Ministat'
import RecentRides from '@/components/Dashboard/Recentrides'
import DriverStatus from '@/components/Dashboard/Driverstatus'
import AlertsAndPending from '@/components/Dashboard/Alertsandpending'
import WelcomeHeader from '@/components/Dashboard/WelcomeHeader'
import { useDriverStatusSummary } from '@/hooks/useDriverStatusSummary'
import { useRegistrationStats } from '@/hooks/useRegistrationStats'
import { useSosStats } from '@/hooks/useSosStats'
import { useSosSocket } from '@/hooks/useSosSocket'
import { getRecentRides, getRideStats, type Ride as ApiRide, type RideStats } from '@/api/rides'
import type { MappedRide, RideStatus } from '@/components/Types/types'

 

const STATUS_MAP: Record<string, RideStatus> = {
  completed: 'Completed',
  cancelled: 'Cancelled',
  requested: 'Pending',
  accepted: 'Ongoing',
  arrived: 'Ongoing',
  started: 'Ongoing',
}

const mapRide = (r: ApiRide): MappedRide => ({
  id: r._id,
  displayId: r._id.slice(-6).toUpperCase(),
  passenger: r.userId?.fullName ?? '—',
  driver: r.driverId?.fullName ?? '—',
  fare: r.finalFare ?? r.estimatedFare ?? 0,
  status: STATUS_MAP[r.status?.toLowerCase()] ?? 'Pending',
  time: new Date(r.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }),
})

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const [recentRides, setRecentRides] = useState<MappedRide[]>([])
  const [ridesLoading, setRidesLoading] = useState(true)

  const [rideStats, setRideStats] = useState<RideStats | null>(null)
  const [statsLoading, setStatsLoading] = useState(true)

  const { data: driverSummary } = useDriverStatusSummary(15_000)
  const driversOnlineNow = driverSummary ? driverSummary.online : null
  const { data: registrationStats } = useRegistrationStats()
  const { data: sosStats, refetch: refetchSos } = useSosStats()

  useSosSocket({
    onNew: refetchSos,
    onResolved: refetchSos,
  })

  useEffect(() => {
    let active = true
    getRecentRides(4)
      .then(res => { if (active) setRecentRides(res.rides.map(mapRide)) })
      .catch(err => console.error('Failed to load recent rides', err))
      .finally(() => { if (active) setRidesLoading(false) })
    return () => { active = false }
  }, [])

  useEffect(() => {
    let active = true

    const loadStats = () =>
      getRideStats()
        .then(res => { if (active) { setRideStats(res); setStatsLoading(false) } })
        .catch(err => { console.error('Failed to load ride stats', err); if (active) setStatsLoading(false) })

    loadStats()
    // Poll every 15 seconds so the card value updates in real time
    const statsInterval = setInterval(loadStats, 15_000)
    return () => { active = false; clearInterval(statsInterval) }
  }, [])

  // Derived stats
  const cancellationRate = rideStats && rideStats.total > 0
    ? ((rideStats.cancelled / rideStats.total) * 100).toFixed(1) + '%'
    : '0'

  const averageFare = rideStats && rideStats.completed > 0
    ? `₹${Math.round(rideStats.todayRevenue / Math.max(rideStats.todayTotal, 1))}`
    : '0'

  return (
    <AdminShell title="Odisha Ride Admin">

      <WelcomeHeader />

      {/* ── Row 1: Live Cards + SOS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <LiveCard
          label="Ongoing rides right now"
          value={statsLoading ? '0' : String(rideStats?.ongoing ?? 0)}
          href="/rides/ongoing"
        />
        <LiveCard
          label="Drivers online right now"
          value={driversOnlineNow !== null ? String(driversOnlineNow) : '0'}
          href="/drivers/online"
        />
        <LiveCard
          label="Passengers waiting for ride"
          value={statsLoading ? '0' : String(rideStats?.waiting ?? 0)}
          dotClass="bg-amber-400"
        />
        <SosCard
          count={sosStats?.active ?? 0}
          activeCount={sosStats?.active ?? 0}
        />
      </div>

      {/* ── Row 2: Mini Stats ── */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <MiniStat
          label="Total rides completed"
          value={statsLoading ? '0' : (rideStats?.completed ?? 0).toLocaleString('en-IN')}
          live
        />
        <MiniStat
          label="Total revenue earned (₹)"
          value={statsLoading ? '0' : `₹${(rideStats?.todayRevenue ?? 0).toLocaleString('en-IN')}`}
        />
        <MiniStat
          label="Cancellation rate %"
          value={statsLoading ? '0' : cancellationRate}
          valueClass="text-red-600"
        />
        <MiniStat
          label="Average fare (₹)"
          value={statsLoading ? '0' : averageFare}
        />
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
          <RecentRides rides={recentRides} loading={ridesLoading} />
        </div>
        <DriverStatus />
      </div>

      {/* ── Row 4: Alerts & Pending ── */}
      <div className="mt-6">
        <AlertsAndPending
          disputedCount={0}
          failedPaymentsCount={0}
          pendingKycCount={0}
        />
      </div>

    </AdminShell>
  )
}