import Link from 'next/link'

type RideStatus = 'Completed' | 'Ongoing' | 'Cancelled' | 'Pending'

interface Ride {
  id: string        // full Mongo _id — used for routing
  displayId: string // short form — shown in the table
  passenger: string
  driver: string
  fare: number
  status: RideStatus
  time: string
}

interface RecentRidesProps {
  rides: Ride[]
  loading?: boolean
}

const statusBadge = (s: RideStatus): string => {
  if (s === 'Completed') return 'bg-emerald-100 text-emerald-700'
  if (s === 'Ongoing') return 'bg-orange-100 text-orange-700'
  if (s === 'Cancelled') return 'bg-red-100 text-red-700'
  return 'bg-slate-100 text-slate-700'
}

export default function RecentRides({ rides, loading }: RecentRidesProps) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-blue-700">Recent Rides</h3>
        <Link href="/rides" className="text-sm font-semibold text-blue-600 hover:underline">
          View All
        </Link>
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
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={i}>
                  {Array.from({ length: 6 }).map((__, j) => (
                    <td key={j} className="py-3">
                      <div className="h-4 bg-slate-100 rounded animate-pulse" style={{ width: `${50 + Math.random() * 40}%` }} />
                    </td>
                  ))}
                </tr>
              ))
            ) : rides.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-400 text-sm">
                  No recent rides
                </td>
              </tr>
            ) : (
              rides.map((r) => (
                <tr key={r.id}>
                  <td className="py-3">
                    <Link
                      href={`/rides/${encodeURIComponent(r.id)}`}
                      className="text-blue-600 font-medium hover:underline"
                    >
                      {r.displayId}
                    </Link>
                  </td>
                  <td className="py-3">{r.passenger}</td>
                  <td className="py-3">{r.driver}</td>
                  <td className="py-3">₹{r.fare}</td>
                  <td className="py-3">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${statusBadge(r.status)}`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="py-3 text-slate-500">{r.time}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}