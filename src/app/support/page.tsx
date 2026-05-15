'use client'
import AdminShell from '@/components/Common/AdminShell'

// Types
export type TicketPriority = 'High' | 'Medium' | 'Low'
export type TicketStatus = 'Open' | 'In Progress' | 'Resolved'

export interface Ticket {
  id: string
  user: string
  subject: string
  priority: TicketPriority
  status: TicketStatus
  created: string
}

// Mock Data
const tickets: Ticket[] = [
  {
    id: 'TKT-001',
    user: 'John Doe',
    subject: 'Payment issue after ride completion',
    priority: 'High',
    status: 'Open',
    created: '2024-01-15 10:30 AM'
  },
  {
    id: 'TKT-002',
    user: 'Sarah Smith',
    subject: 'Driver cancelled ride mid-way',
    priority: 'High',
    status: 'In Progress',
    created: '2024-01-15 09:15 AM'
  },
  {
    id: 'TKT-003',
    user: 'Mike Johnson',
    subject: 'Unable to add payment method',
    priority: 'Medium',
    status: 'Open',
    created: '2024-01-14 04:20 PM'
  },
  {
    id: 'TKT-004',
    user: 'Emma Wilson',
    subject: 'Account login issue',
    priority: 'High',
    status: 'In Progress',
    created: '2024-01-14 02:10 PM'
  },
  {
    id: 'TKT-005',
    user: 'David Brown',
    subject: 'Wrong fare calculation',
    priority: 'Medium',
    status: 'Resolved',
    created: '2024-01-14 11:45 AM'
  },
  {
    id: 'TKT-006',
    user: 'Lisa Anderson',
    subject: 'Feature request: Scheduled rides',
    priority: 'Low',
    status: 'Open',
    created: '2024-01-13 03:30 PM'
  },
  {
    id: 'TKT-007',
    user: 'Robert Taylor',
    subject: 'Driver rating issue',
    priority: 'Medium',
    status: 'In Progress',
    created: '2024-01-13 10:00 AM'
  },
  {
    id: 'TKT-008',
    user: 'Maria Garcia',
    subject: 'Promo code not working',
    priority: 'Low',
    status: 'Resolved',
    created: '2024-01-12 02:15 PM'
  },
  {
    id: 'TKT-009',
    user: 'James Wilson',
    subject: 'Lost item in vehicle',
    priority: 'High',
    status: 'Open',
    created: '2024-01-12 09:30 AM'
  },
  {
    id: 'TKT-010',
    user: 'Patricia Moore',
    subject: 'App crashing on startup',
    priority: 'High',
    status: 'In Progress',
    created: '2024-01-11 05:45 PM'
  }
]

const pri = (p: TicketPriority): string =>
  p === 'High' ? 'bg-red-100 text-red-700' :
  p === 'Medium' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'

const stat = (s: TicketStatus): string =>
  s === 'Open' ? 'bg-blue-100 text-blue-700' :
  s === 'In Progress' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'

export default function SupportPage() {
  return (
    <AdminShell title="Support">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className="bg-white rounded-xl p-4 border">
          <div className="text-xs text-slate-500">Open</div>
          <div className="text-2xl font-bold mt-1 text-blue-600">14</div>
        </div>
        <div className="bg-white rounded-xl p-4 border">
          <div className="text-xs text-slate-500">In Progress</div>
          <div className="text-2xl font-bold mt-1 text-amber-600">8</div>
        </div>
        <div className="bg-white rounded-xl p-4 border">
          <div className="text-xs text-slate-500">Resolved Today</div>
          <div className="text-2xl font-bold mt-1 text-emerald-600">23</div>
        </div>
        <div className="bg-white rounded-xl p-4 border">
          <div className="text-xs text-slate-500">Avg. Response</div>
          <div className="text-2xl font-bold mt-1">12m</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 overflow-x-auto">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Support Tickets</h3>
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-slate-500 text-xs">
            <tr>
              <th className="text-left font-medium px-3 py-3">Ticket ID</th>
              <th className="text-left font-medium px-3 py-3">User</th>
              <th className="text-left font-medium px-3 py-3">Subject</th>
              <th className="text-left font-medium px-3 py-3">Priority</th>
              <th className="text-left font-medium px-3 py-3">Status</th>
              <th className="text-left font-medium px-3 py-3">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {tickets.map((t: Ticket) => (
              <tr key={t.id} className="hover:bg-slate-50">
                <td className="px-3 py-3 text-blue-600 font-medium">{t.id}</td>
                <td className="px-3 py-3 font-medium">{t.user}</td>
                <td className="px-3 py-3 text-slate-700">{t.subject}</td>
                <td className="px-3 py-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${pri(t.priority)}`}>
                    {t.priority}
                  </span>
                </td>
                <td className="px-3 py-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${stat(t.status)}`}>
                    {t.status}
                  </span>
                </td>
                <td className="px-3 py-3 text-slate-500 whitespace-nowrap">{t.created}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  )
}