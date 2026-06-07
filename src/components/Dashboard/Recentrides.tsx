import Link from 'next/link'

type RideStatus = 'Completed' | 'Ongoing' | 'Cancelled' | 'Pending'

interface Ride {
  id: string
  passenger: string
  driver: string
  fare: number
  status: RideStatus
  time: string
}

interface RecentRidesProps {
  rides: Ride[]
}

const statusBadge = (s: RideStatus): string => {
  if (s === 'Completed') return 'bg-emerald-100 text-emerald-700'
  if (s === 'Ongoing')   return 'bg-orange-100 text-orange-700'
  if (s === 'Cancelled') return 'bg-red-100 text-red-700'
  return 'bg-slate-100 text-slate-700'
}

export default function RecentRides({ rides }: RecentRidesProps) {
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
            {rides.map((r) => (
              <tr key={r.id}>
                <td className="py-3">
                  <Link
                    href={`/rides/${encodeURIComponent(r.id)}`}
                    className="text-blue-600 font-medium hover:underline"
                  >
                    {r.id}
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}