 'use client'

import { useState, useEffect, useCallback } from 'react'
import AdminShell from '@/components/Common/AdminShell'
import {
  getTickets,
  getTicketStats,
  updateTicketStatus,
  updateTicketPriority,
  deleteTicket,
  exportTickets,
} from '@/app/support/api/support'
import  {
  SupportTicket,
  TicketStats,
  TicketFilters,
  TicketStatus,
  TicketPriority,
  TicketCategory,
  UserType,
} from '@/api/types/types'
 import {
  Ticket, CircleDot, Clock, CheckCircle, XCircle,
  AlertTriangle, Car, User, Timer,
} from 'lucide-react'

import TicketDrawer   from '@/components/Support/TicketDrawer'
import TicketFiltersBar from '@/components/Support/TicketFiltersBar'
import TicketTable    from '@/components/Support/TicketTable'
import Pagination     from '@/components/Support/Pagination'
import Toast          from '@/components/Support/Toast'

// ── Helpers ───────────────────────────────────────────────────────────────────
export const priorityStyles: Record<TicketPriority, string> = {
  High:   'bg-red-100 text-red-700',
  Medium: 'bg-amber-100 text-amber-700',
  Low:    'bg-slate-100 text-slate-600',
}

export const statusStyles: Record<TicketStatus, string> = {
  'Open':        'bg-blue-100 text-blue-700',
  'In Progress': 'bg-amber-100 text-amber-700',
  'Resolved':    'bg-emerald-100 text-emerald-700',
  'Closed':      'bg-slate-200 text-slate-600',
}

export const userTypeStyles: Record<UserType, string> = {
  passenger: 'bg-purple-100 text-purple-700',
  driver:    'bg-cyan-100 text-cyan-700',
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function SupportPage() {
  // ── State ──────────────────────────────────────────────
  const [tickets,       setTickets      ] = useState<SupportTicket[]>([])
  const [stats,         setStats        ] = useState<TicketStats | null>(null)
  const [selectedTicket,setSelectedTicket] = useState<SupportTicket | null>(null)
  const [isLoading,     setIsLoading    ] = useState(true)
  const [statsLoading,  setStatsLoading ] = useState(true)
  const [total,         setTotal        ] = useState(0)
  const [totalPages,    setTotalPages   ] = useState(1)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [toast,         setToast        ] = useState<{ msg: string; ok: boolean } | null>(null)
  const [error,         setError        ] = useState('')

  // ── Filters ────────────────────────────────────────────
  const [filters, setFilters] = useState<TicketFilters>({
    page:     1,
    limit:    10,
    search:   '',
    status:   'All',
    priority: 'All',
    userType: 'All',
    category: 'All',
  })
  const [searchInput, setSearchInput] = useState('')

  const LIMIT = 10

  // ── Fetch stats ────────────────────────────────────────
  const fetchStats = async () => {
    setStatsLoading(true)
    try {
      const data = await getTicketStats()
      setStats(data)
    } catch { /* silently fail */ }
    finally { setStatsLoading(false) }
  }

  // ── Fetch tickets ──────────────────────────────────────
  const fetchTickets = useCallback(async () => {
    setIsLoading(true)
    setError('')
    try {
      const data = await getTickets(filters)
      setTickets(data.tickets ?? [])
      setTotal(data.total ?? 0)
      setTotalPages(data.totalPages ?? 1)
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Failed to load tickets.')
    } finally {
      setIsLoading(false)
    }
  }, [filters])

  useEffect(() => { fetchStats() }, [])
  useEffect(() => { fetchTickets() }, [fetchTickets])

  // ── Toast ──────────────────────────────────────────────
  const showToast = (msg: string, ok: boolean) => {
    setToast({ msg, ok })
    setTimeout(() => setToast(null), 3500)
  }

  // ── Search ─────────────────────────────────────────────
  const handleSearch = () => {
    setFilters(f => ({ ...f, search: searchInput, page: 1 }))
  }

  const handleFilterChange = (key: keyof TicketFilters, value: any) => {
    setFilters(f => ({ ...f, [key]: value, page: 1 }))
  }

  // ── Status change ──────────────────────────────────────
  const handleStatusChange = async (id: string, status: TicketStatus) => {
    setActionLoading(id)
    try {
      await updateTicketStatus(id, status)
      showToast(`Status updated to ${status}`, true)
      fetchTickets()
      fetchStats()
      // Update drawer if open
      if (selectedTicket?._id === id) {
        setSelectedTicket(t => t ? { ...t, status } : null)
      }
    } catch (err: any) {
      showToast(err?.response?.data?.message ?? 'Failed to update status.', false)
    } finally {
      setActionLoading(null)
    }
  }

  // ── Priority change ────────────────────────────────────
  const handlePriorityChange = async (id: string, priority: TicketPriority) => {
    setActionLoading(id)
    try {
      await updateTicketPriority(id, priority)
      showToast(`Priority updated to ${priority}`, true)
      fetchTickets()
      fetchStats()
      if (selectedTicket?._id === id) {
        setSelectedTicket(t => t ? { ...t, priority } : null)
      }
    } catch (err: any) {
      showToast(err?.response?.data?.message ?? 'Failed to update priority.', false)
    } finally {
      setActionLoading(null)
    }
  }

  // ── Delete ─────────────────────────────────────────────
  const handleDelete = async (id: string) => {
    if (!confirm('Delete this ticket? This cannot be undone.')) return
    setActionLoading(id)
    try {
      await deleteTicket(id)
      showToast('Ticket deleted.', true)
      if (selectedTicket?._id === id) setSelectedTicket(null)
      fetchTickets()
      fetchStats()
    } catch (err: any) {
      showToast(err?.response?.data?.message ?? 'Failed to delete ticket.', false)
    } finally {
      setActionLoading(null)
    }
  }

  // ── Export ─────────────────────────────────────────────
  const handleExport = async (format: 'csv' | 'excel' | 'pdf') => {
    try {
      const blob = await exportTickets(format, filters)
      const url  = URL.createObjectURL(blob)
      const a    = document.createElement('a')
      a.href     = url
      a.download = `tickets-${Date.now()}.${format === 'excel' ? 'xlsx' : format}`
      a.click()
      URL.revokeObjectURL(url)
      showToast(`Exported as ${format.toUpperCase()}`, true)
    } catch {
      showToast('Export failed.', false)
    }
  }

  return (
    <AdminShell title="Support">

      {/* ── Toast ── */}
      {toast && <Toast message={toast.msg} success={toast.ok} />}

      {/* ── Drawer ── */}
      {selectedTicket && (
        <TicketDrawer
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
          onStatusChange={handleStatusChange}
          onPriorityChange={handlePriorityChange}
          onDelete={handleDelete}
          showToast={showToast}
          actionLoading={actionLoading}
          onRefresh={() => { fetchTickets(); fetchStats() }}
        />
      )}

      {/* ── Stats Grid ── */}
     {/* ── Stats Grid ── */}
<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">

  <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
    <div className="flex items-center justify-between mb-2">
      <span className="text-xs text-slate-500 font-medium">Total Tickets</span>
      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
        <Ticket className="w-4 h-4 text-slate-600" />
      </div>
    </div>
    <div className="text-2xl font-bold text-slate-800">
      {statsLoading ? '...' : (stats?.total ?? 0).toLocaleString()}
    </div>
  </div>

  <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
    <div className="flex items-center justify-between mb-2">
      <span className="text-xs text-slate-500 font-medium">Open</span>
      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
        <CircleDot className="w-4 h-4 text-blue-600" />
      </div>
    </div>
    <div className="text-2xl font-bold text-blue-600">
      {statsLoading ? '...' : (stats?.open ?? 0).toLocaleString()}
    </div>
  </div>

  <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
    <div className="flex items-center justify-between mb-2">
      <span className="text-xs text-slate-500 font-medium">In Progress</span>
      <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
        <Clock className="w-4 h-4 text-amber-600" />
      </div>
    </div>
    <div className="text-2xl font-bold text-amber-600">
      {statsLoading ? '...' : (stats?.inProgress ?? 0).toLocaleString()}
    </div>
  </div>

  <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
    <div className="flex items-center justify-between mb-2">
      <span className="text-xs text-slate-500 font-medium">Resolved Today</span>
      <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
        <CheckCircle className="w-4 h-4 text-emerald-600" />
      </div>
    </div>
    <div className="text-2xl font-bold text-emerald-600">
      {statsLoading ? '...' : (stats?.resolvedToday ?? 0).toLocaleString()}
    </div>
  </div>

  <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
    <div className="flex items-center justify-between mb-2">
      <span className="text-xs text-slate-500 font-medium">Closed</span>
      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
        <XCircle className="w-4 h-4 text-slate-500" />
      </div>
    </div>
    <div className="text-2xl font-bold text-slate-600">
      {statsLoading ? '...' : (stats?.closed ?? 0).toLocaleString()}
    </div>
  </div>

  <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
    <div className="flex items-center justify-between mb-2">
      <span className="text-xs text-slate-500 font-medium">High Priority</span>
      <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
        <AlertTriangle className="w-4 h-4 text-red-600" />
      </div>
    </div>
    <div className="text-2xl font-bold text-red-600">
      {statsLoading ? '...' : (stats?.highPriority ?? 0).toLocaleString()}
    </div>
  </div>

  <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
    <div className="flex items-center justify-between mb-2">
      <span className="text-xs text-slate-500 font-medium">Driver Complaints</span>
      <div className="w-8 h-8 rounded-lg bg-cyan-50 flex items-center justify-center">
        <Car className="w-4 h-4 text-cyan-600" />
      </div>
    </div>
    <div className="text-2xl font-bold text-cyan-600">
      {statsLoading ? '...' : (stats?.driverComplaints ?? 0).toLocaleString()}
    </div>
  </div>

  <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
    <div className="flex items-center justify-between mb-2">
      <span className="text-xs text-slate-500 font-medium">Passenger Complaints</span>
      <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
        <User className="w-4 h-4 text-purple-600" />
      </div>
    </div>
    <div className="text-2xl font-bold text-purple-600">
      {statsLoading ? '...' : (stats?.passengerComplaints ?? 0).toLocaleString()}
    </div>
  </div>

  <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
    <div className="flex items-center justify-between mb-2">
      <span className="text-xs text-slate-500 font-medium">Avg. Response</span>
      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
        <Timer className="w-4 h-4 text-slate-600" />
      </div>
    </div>
    <div className="text-2xl font-bold text-slate-700">
      {statsLoading ? '...' : (stats?.avgResponseTime ?? '—')}
    </div>
  </div>

</div>

      {/* ── Filters Bar ── */}
      <TicketFiltersBar
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        onSearch={handleSearch}
        filters={filters}
        onFilterChange={handleFilterChange}
        onExport={handleExport}
      />

      {/* ── Table ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mt-4">
        {error && (
          <div className="bg-red-50 text-red-600 text-sm px-5 py-3 border-b border-red-100">
            {error}
          </div>
        )}

        <TicketTable
          tickets={tickets}
          isLoading={isLoading}
          actionLoading={actionLoading}
          onSelect={setSelectedTicket}
          onStatusChange={handleStatusChange}
          onPriorityChange={handlePriorityChange}
          onDelete={handleDelete}
        />

        {/* ── Pagination ── */}
        {!isLoading && totalPages > 1 && (
          <Pagination
            page={filters.page ?? 1}
            totalPages={totalPages}
            total={total}
            limit={LIMIT}
            onPageChange={(p) => setFilters(f => ({ ...f, page: p }))}
          />
        )}
      </div>
    </AdminShell>
  )
}