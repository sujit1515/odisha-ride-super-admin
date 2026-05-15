'use client'
import { useState, ChangeEvent } from 'react'
import Link from 'next/link'
import AdminShell from '@/components/Common/AdminShell'
import { Search, Calendar } from 'lucide-react'

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
  {
    id: 'RIDE-001',
    passenger: 'John Doe',
    driver: 'Rajesh Kumar',
    fare: 245,
    status: 'Completed',
    time: '10:30 AM',
    date: '2024-01-15',
    pickup: 'MG Road, Bangalore',
    drop: 'Indiranagar, Bangalore'
  },
  {
    id: 'RIDE-002',
    passenger: 'Jane Smith',
    driver: 'Suresh Patel',
    fare: 189,
    status: 'Ongoing',
    time: '11:15 AM',
    date: '2024-01-15',
    pickup: 'Koramangala, Bangalore',
    drop: 'HSR Layout, Bangalore'
  },
  {
    id: 'RIDE-003',
    passenger: 'Mike Johnson',
    driver: 'Amit Singh',
    fare: 320,
    status: 'Completed',
    time: '09:45 AM',
    date: '2024-01-15',
    pickup: 'Whitefield, Bangalore',
    drop: 'Electronic City, Bangalore'
  },
  {
    id: 'RIDE-004',
    passenger: 'Sarah Williams',
    driver: 'Vikram Reddy',
    fare: 156,
    status: 'Cancelled',
    time: '08:30 AM',
    date: '2024-01-14',
    pickup: 'Jayanagar, Bangalore',
    drop: 'Banashankari, Bangalore'
  },
  {
    id: 'RIDE-005',
    passenger: 'David Brown',
    driver: 'Manish Gupta',
    fare: 278,
    status: 'Completed',
    time: '02:30 PM',
    date: '2024-01-14',
    pickup: 'Hebbal, Bangalore',
    drop: 'Yeshwanthpur, Bangalore'
  },
  {
    id: 'RIDE-006',
    passenger: 'Emma Wilson',
    driver: 'Rahul Verma',
    fare: 342,
    status: 'Completed',
    time: '06:45 PM',
    date: '2024-01-13',
    pickup: 'Marathahalli, Bangalore',
    drop: 'Bellandur, Bangalore'
  },
  {
    id: 'RIDE-007',
    passenger: 'James Taylor',
    driver: 'Pankaj Singh',
    fare: 198,
    status: 'Ongoing',
    time: '07:20 PM',
    date: '2024-01-13',
    pickup: 'Ulsoor, Bangalore',
    drop: 'Richmond Town, Bangalore'
  },
  {
    id: 'RIDE-008',
    passenger: 'Lisa Anderson',
    driver: 'Deepak Sharma',
    fare: 267,
    status: 'Completed',
    time: '12:15 PM',
    date: '2024-01-12',
    pickup: 'BTM Layout, Bangalore',
    drop: 'JP Nagar, Bangalore'
  },
  {
    id: 'RIDE-009',
    passenger: 'Robert Taylor',
    driver: 'Anil Kumar',
    fare: 185,
    status: 'Cancelled',
    time: '04:30 PM',
    date: '2024-01-12',
    pickup: 'Frazer Town, Bangalore',
    drop: 'Shivajinagar, Bangalore'
  },
  {
    id: 'RIDE-010',
    passenger: 'Maria Garcia',
    driver: 'Sunil Reddy',
    fare: 412,
    status: 'Completed',
    time: '09:00 PM',
    date: '2024-01-11',
    pickup: 'Airport Road, Bangalore',
    drop: 'Domlur, Bangalore'
  }
]

type StatusFilter = 'All' | RideStatus

const statusBadge = (s: RideStatus): string => {
  if (s === 'Completed') return 'bg-emerald-100 text-emerald-700'
  if (s === 'Ongoing') return 'bg-orange-100 text-orange-700'
  if (s === 'Cancelled') return 'bg-red-100 text-red-700'
  return 'bg-slate-100 text-slate-700'
}

export default function RidesPage() {
  const [q, setQ] = useState<string>('')
  const [status, setStatus] = useState<StatusFilter>('All')
  const [date, setDate] = useState<string>('')

  const filtered = rides.filter(r => {
    const matchQ = !q || `${r.id} ${r.passenger} ${r.driver}`.toLowerCase().includes(q.toLowerCase())
    const matchStatus = status === 'All' || r.status === status
    const matchDate = !date || r.date === date
    return matchQ && matchStatus && matchDate
  })

  return (
    <AdminShell title="All Rides">
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
        <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
          <div>
            <h3 className="text-xl font-bold text-slate-800">Rides ({filtered.length})</h3>
            <p className="text-sm text-slate-500">All rides with date &amp; time</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input 
                value={q} 
                onChange={(e: ChangeEvent<HTMLInputElement>) => setQ(e.target.value)} 
                placeholder="Search ride / user..." 
                className="pl-9 pr-3 py-2 rounded-lg border border-slate-200 text-sm" 
              />
            </div>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              <input 
                value={date} 
                onChange={(e: ChangeEvent<HTMLInputElement>) => setDate(e.target.value)} 
                type="date" 
                className="pl-9 pr-3 py-2 rounded-lg border border-slate-200 text-sm" 
              />
            </div>
            <select 
              value={status} 
              onChange={(e: ChangeEvent<HTMLSelectElement>) => setStatus(e.target.value as StatusFilter)} 
              className="px-3 py-2 rounded-lg border border-slate-200 text-sm"
            >
              <option>All</option>
              <option>Completed</option>
              <option>Ongoing</option>
              <option>Cancelled</option>
            </select>
          </div>
        </div>

        <div className="mt-5 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-slate-500 text-xs bg-slate-50">
                <th className="text-left font-medium px-3 py-3">Ride ID</th>
                <th className="text-left font-medium px-3 py-3">Passenger</th>
                <th className="text-left font-medium px-3 py-3">Driver</th>
                <th className="text-left font-medium px-3 py-3">Pickup</th>
                <th className="text-left font-medium px-3 py-3">Drop</th>
                <th className="text-left font-medium px-3 py-3">Fare</th>
                <th className="text-left font-medium px-3 py-3">Status</th>
                <th className="text-left font-medium px-3 py-3">Date</th>
                <th className="text-left font-medium px-3 py-3">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(r => (
                <tr key={r.id} className="hover:bg-slate-50">
                  <td className="px-3 py-3">
                    <Link href={`/rides/${encodeURIComponent(r.id)}`} className="text-blue-600 font-medium hover:underline">
                      {r.id}
                    </Link>
                  </td>
                  <td className="px-3 py-3">{r.passenger}</td>
                  <td className="px-3 py-3">{r.driver}</td>
                  <td className="px-3 py-3 text-slate-600">{r.pickup}</td>
                  <td className="px-3 py-3 text-slate-600">{r.drop}</td>
                  <td className="px-3 py-3 font-medium">₹{r.fare}</td>
                  <td className="px-3 py-3">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${statusBadge(r.status)}`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-slate-500 whitespace-nowrap">{r.date}</td>
                  <td className="px-3 py-3 text-slate-500 whitespace-nowrap">{r.time}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="text-center py-10 text-slate-400">No rides found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  )
}