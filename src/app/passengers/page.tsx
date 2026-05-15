'use client'
import AdminShell from '@/components/Common/AdminShell'

// Types
type PassengerStatus = 'Active' | 'Inactive' | 'Blocked'

interface Passenger {
  id: string
  name: string
  phone: string
  rides: number
  totalSpent: number
  joined: string
  status: PassengerStatus
}

// Mock Data
const passengers: Passenger[] = [
  {
    id: 'P-1001',
    name: 'John Doe',
    phone: '+91 98765 43210',
    rides: 45,
    totalSpent: 12540,
    joined: 'Jan 2023',
    status: 'Active'
  },
  {
    id: 'P-1002',
    name: 'Jane Smith',
    phone: '+91 87654 32109',
    rides: 32,
    totalSpent: 8750,
    joined: 'Mar 2023',
    status: 'Active'
  },
  {
    id: 'P-1003',
    name: 'Mike Johnson',
    phone: '+91 76543 21098',
    rides: 28,
    totalSpent: 7420,
    joined: 'Jun 2023',
    status: 'Active'
  },
  {
    id: 'P-1004',
    name: 'Sarah Williams',
    phone: '+91 65432 10987',
    rides: 52,
    totalSpent: 15680,
    joined: 'Dec 2022',
    status: 'Active'
  },
  {
    id: 'P-1005',
    name: 'David Brown',
    phone: '+91 54321 09876',
    rides: 12,
    totalSpent: 3240,
    joined: 'Aug 2023',
    status: 'Inactive'
  },
  {
    id: 'P-1006',
    name: 'Emma Wilson',
    phone: '+91 43210 98765',
    rides: 67,
    totalSpent: 21450,
    joined: 'Sep 2022',
    status: 'Active'
  },
  {
    id: 'P-1007',
    name: 'James Taylor',
    phone: '+91 32109 87654',
    rides: 8,
    totalSpent: 2150,
    joined: 'Oct 2023',
    status: 'Active'
  },
  {
    id: 'P-1008',
    name: 'Lisa Anderson',
    phone: '+91 21098 76543',
    rides: 23,
    totalSpent: 6890,
    joined: 'Feb 2023',
    status: 'Blocked'
  },
  {
    id: 'P-1009',
    name: 'Robert Taylor',
    phone: '+91 10987 65432',
    rides: 41,
    totalSpent: 11230,
    joined: 'Nov 2022',
    status: 'Active'
  },
  {
    id: 'P-1010',
    name: 'Maria Garcia',
    phone: '+91 09876 54321',
    rides: 19,
    totalSpent: 4980,
    joined: 'Apr 2023',
    status: 'Active'
  },
  {
    id: 'P-1011',
    name: 'Patricia Moore',
    phone: '+91 98765 12345',
    rides: 35,
    totalSpent: 9650,
    joined: 'Jul 2023',
    status: 'Active'
  },
  {
    id: 'P-1012',
    name: 'Jennifer Lee',
    phone: '+91 87654 23456',
    rides: 0,
    totalSpent: 0,
    joined: 'Jan 2024',
    status: 'Inactive'
  }
]

export default function PassengersPage() {
  return (
    <AdminShell title="Passengers">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className="bg-white rounded-xl p-4 border">
          <div className="text-xs text-slate-500">Total Passengers</div>
          <div className="text-2xl font-bold mt-1">8,420</div>
        </div>
        <div className="bg-white rounded-xl p-4 border">
          <div className="text-xs text-slate-500">Active this month</div>
          <div className="text-2xl font-bold mt-1 text-emerald-600">3,124</div>
        </div>
        <div className="bg-white rounded-xl p-4 border">
          <div className="text-xs text-slate-500">New this week</div>
          <div className="text-2xl font-bold mt-1 text-blue-600">182</div>
        </div>
        <div className="bg-white rounded-xl p-4 border">
          <div className="text-xs text-slate-500">Total bookings</div>
          <div className="text-2xl font-bold mt-1">42,180</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 overflow-x-auto">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">All Passengers</h3>
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-slate-500 text-xs">
            <tr>
              <th className="text-left font-medium px-3 py-3">Passenger ID</th>
              <th className="text-left font-medium px-3 py-3">Name</th>
              <th className="text-left font-medium px-3 py-3">Phone</th>
              <th className="text-left font-medium px-3 py-3">Total Rides</th>
              <th className="text-left font-medium px-3 py-3">Total Spent</th>
              <th className="text-left font-medium px-3 py-3">Joined</th>
              <th className="text-left font-medium px-3 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {passengers.map((p: Passenger) => (
              <tr key={p.id} className="hover:bg-slate-50">
                <td className="px-3 py-3 text-blue-600 font-medium">{p.id}</td>
                <td className="px-3 py-3 font-medium">{p.name}</td>
                <td className="px-3 py-3 text-slate-600">{p.phone}</td>
                <td className="px-3 py-3">{p.rides}</td>
                <td className="px-3 py-3 font-medium">₹{p.totalSpent.toLocaleString()}</td>
                <td className="px-3 py-3 text-slate-500">{p.joined}</td>
                <td className="px-3 py-3">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                    p.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 
                    p.status === 'Blocked' ? 'bg-red-100 text-red-700' : 
                    'bg-slate-200 text-slate-700'
                  }`}>
                    {p.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  )
}