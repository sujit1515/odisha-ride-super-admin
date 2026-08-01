// ─────────────────────────────────────────────────────────────────────────────
// FILE: components/Support/TicketTable.tsx
// ─────────────────────────────────────────────────────────────────────────────

import type { SupportTicket, TicketStatus, TicketPriority } from '@/api/types/types';
import { priorityStyles, statusStyles, userTypeStyles } from '@/app/support/page'
import { Trash2, ChevronRight } from 'lucide-react'

interface Props {
  tickets:          SupportTicket[]
  isLoading:        boolean
  actionLoading:    string | null
  onSelect:         (t: SupportTicket) => void
  onStatusChange:   (id: string, s: TicketStatus) => void
  onPriorityChange: (id: string, p: TicketPriority) => void
  onDelete:         (id: string) => void
}

const STATUSES:   TicketStatus[]   = ['Open', 'In Progress', 'Resolved', 'Closed']
const PRIORITIES: TicketPriority[] = ['High', 'Medium', 'Low']

export default function TicketTable({
  tickets, isLoading, actionLoading, onSelect,
  onStatusChange, onPriorityChange, onDelete,
}: Props) {
  if (isLoading) {
    return (
      <div className="p-6 space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-12 bg-slate-100 rounded-lg animate-pulse" />
        ))}
      </div>
    )
  }

  if (tickets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <svg className="w-12 h-12 mb-3 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <p className="text-sm font-medium">No tickets found</p>
        <p className="text-xs mt-1">Try adjusting your filters</p>
      </div>
    )
  }

  const fmt = (d: string) =>
    new Date(d).toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
    })

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50 text-slate-500 text-xs border-b border-slate-100">
          <tr>
            {['Ticket ID', 'User', 'Type', 'Category', 'Subject',
              'Priority', 'Status', 'Assigned', 'Created', 'Actions'].map(h => (
              <th key={h} className="text-left font-semibold px-4 py-3 whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {tickets.map(t => (
            <tr
              key={t._id}
              className="hover:bg-slate-50 cursor-pointer transition-colors"
              onClick={() => onSelect(t)}
            >
              {/* Ticket ID */}
              <td className="px-4 py-3">
                <span className="font-mono text-xs font-semibold text-blue-600
                                 bg-blue-50 px-2 py-1 rounded-lg">
                  {t.ticketId}
                </span>
              </td>

              {/* User */}
              <td className="px-4 py-3">
                <div className="font-medium text-slate-800 whitespace-nowrap">{t.name}</div>
                <div className="text-xs text-slate-400">{t.email}</div>
              </td>

              {/* User Type */}
              <td className="px-4 py-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize
                                  ${userTypeStyles[t.userType]}`}>
                  {t.userType}
                </span>
              </td>

              {/* Category */}
              <td className="px-4 py-3">
                <span className="text-xs text-slate-500 whitespace-nowrap">{t.category}</span>
              </td>

              {/* Subject */}
              <td className="px-4 py-3 max-w-[200px]">
                <p className="text-slate-700 truncate text-xs">{t.subject}</p>
              </td>

              {/* Priority — inline dropdown */}
              <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                <select
                  value={t.priority}
                  disabled={actionLoading === t._id}
                  onChange={e => onPriorityChange(t._id, e.target.value as TicketPriority)}
                  className={`text-xs font-medium px-2 py-1 rounded-full border-0
                              cursor-pointer focus:outline-none focus:ring-2
                              focus:ring-slate-300 ${priorityStyles[t.priority]}`}
                >
                  {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </td>

              {/* Status — inline dropdown */}
              <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                <select
                  value={t.status}
                  disabled={actionLoading === t._id}
                  onChange={e => onStatusChange(t._id, e.target.value as TicketStatus)}
                  className={`text-xs font-medium px-2 py-1 rounded-full border-0
                              cursor-pointer focus:outline-none focus:ring-2
                              focus:ring-slate-300 ${statusStyles[t.status]}`}
                >
                  {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </td>

              {/* Assigned To */}
              <td className="px-4 py-3">
                <span className="text-xs text-slate-500">
                  {t.assignedTo ?? '—'}
                </span>
              </td>

              {/* Created */}
              <td className="px-4 py-3 whitespace-nowrap">
                <span className="text-xs text-slate-400">{fmt(t.createdAt)}</span>
              </td>

              {/* Actions */}
              <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onSelect(t)}
                    className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500
                               hover:text-slate-800 transition-colors"
                    title="View details"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(t._id)}
                    disabled={actionLoading === t._id}
                    className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400
                               hover:text-red-600 transition-colors disabled:opacity-40"
                    title="Delete ticket"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}