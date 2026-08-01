'use client'

import { useState, useEffect } from 'react'
import AdminShell from '@/components/Common/AdminShell'
import {
  Search, Unlock, Ban, Calendar, Clock, Phone, Mail,
  User, Hash, ChevronLeft, ChevronRight, AlertTriangle,
  RefreshCw, X
} from 'lucide-react'
import { getBlockedDrivers, unblockDriver } from '@/api/kyc'
import type { BlockedDriver } from '@/api/types/types'


// ── Unblock Confirm Modal ─────────────────────────────────────────────────────
const UnblockConfirmModal = ({
  driver,
  onConfirm,
  onCancel,
  loading,
}: {
  driver: BlockedDriver
  onConfirm: () => void
  onCancel: () => void
  loading: boolean
}) => (
  <div
    className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
    onClick={onCancel}
  >
    <div
      className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl"
      onClick={e => e.stopPropagation()}
    >
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mx-auto mb-4">
        <Unlock className="h-6 w-6 text-green-600" />
      </div>
      <h3 className="text-base font-semibold text-slate-800 text-center mb-1">
        Unblock this driver?
      </h3>
      <p className="text-sm text-slate-500 text-center mb-4">
        <span className="font-medium text-slate-700">{driver.name}</span> will regain
        full access to the platform.
      </p>
      <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 mb-5 text-sm text-slate-600">
        <span className="block text-xs text-slate-400 mb-1">Originally blocked for</span>
        {driver.blockedReason}
      </div>
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          disabled={loading}
          className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-600 font-medium hover:bg-slate-50 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={loading}
          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-green-600 text-white text-sm font-medium hover:bg-green-700 disabled:opacity-50"
        >
          {loading
            ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
            : <Unlock className="h-4 w-4" />}
          Yes, unblock
        </button>
      </div>
    </div>
  </div>
)

// ── Reason tooltip / expand ───────────────────────────────────────────────────
const ReasonCell = ({ reason }: { reason: string }) => {
  const [expanded, setExpanded] = useState(false)
  const short = reason.length > 48
  return (
    <div>
      <p className="text-sm text-slate-700 leading-snug">
        {short && !expanded ? `${reason.slice(0, 48)}…` : reason}
      </p>
      {short && (
        <button
          onClick={() => setExpanded(p => !p)}
          className="text-xs text-blue-500 hover:text-blue-700 mt-0.5"
        >
          {expanded ? 'Show less' : 'Show more'}
        </button>
      )}
    </div>
  )
}

// ── Format date ───────────────────────────────────────────────────────────────
function formatBlockedAt(raw: string) {
  if (!raw) return { date: 'N/A', time: '' }
  const d = new Date(raw)
  if (isNaN(d.getTime())) return { date: 'N/A', time: '' }
  return {
    date: d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    time: d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }),
  }
}

const PAGE_SIZE = 10

export default function BlockedDriversPage() {
  const [drivers, setDrivers]           = useState<BlockedDriver[]>([])
  const [filtered, setFiltered]         = useState<BlockedDriver[]>([])
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState<string | null>(null)
  const [search, setSearch]             = useState('')
  const [page, setPage]                 = useState(1)
  const [confirmDriver, setConfirmDriver] = useState<BlockedDriver | null>(null)
  const [unblockLoading, setUnblockLoading] = useState(false)
  const [successMsg, setSuccessMsg]     = useState<string | null>(null)

  useEffect(() => { fetchDrivers() }, [])

  useEffect(() => {
    const q = search.toLowerCase().trim()
    const result = q
      ? drivers.filter(d =>
          d.name.toLowerCase().includes(q) ||
          d.email.toLowerCase().includes(q) ||
          d.phone.includes(q) ||
          d.driverId.toLowerCase().includes(q)
        )
      : drivers
    setFiltered(result)
    setPage(1)
  }, [search, drivers])

  const fetchDrivers = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await getBlockedDrivers()
      const list: BlockedDriver[] = (res.drivers || res || []).map((d: any) => ({
        id:            d._id,
        driverId:      d._id?.slice(-8).toUpperCase() || 'N/A',
        name:          d.fullName || d.name || 'Unknown',
        email:         d.email    || '—',
        phone:         d.phone    || '—',
        blockedAt:     d.blockedAt || d.updatedAt || '',
        blockedReason: d.blockedReason || d.blockReason || 'No reason provided',
        blockedBy:     d.blockedBy || 'Admin',
      }))
      setDrivers(list)
      setFiltered(list)
    } catch {
      setError('Failed to load blocked drivers. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleUnblock = async () => {
    if (!confirmDriver) return
    setUnblockLoading(true)
    try {
      await unblockDriver(confirmDriver.id)
      setDrivers(prev => prev.filter(d => d.id !== confirmDriver.id))
      setSuccessMsg(`${confirmDriver.name} has been unblocked successfully.`)
      setTimeout(() => setSuccessMsg(null), 3500)
      setConfirmDriver(null)
    } catch {
      alert('Failed to unblock driver. Please try again.')
    } finally {
      setUnblockLoading(false)
    }
  }

  // ── Pagination ──────────────────────────────────────────────────────────────
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  // ── Loading skeleton ────────────────────────────────────────────────────────
  if (loading) {
    return (
      <AdminShell title="Blocked Driver" >
        <div className="animate-pulse space-y-3">
          <div className="h-10 bg-slate-100 rounded-xl w-72" />
          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex gap-4 px-5 py-4 border-b border-slate-50">
                <div className="h-4 w-24 bg-slate-100 rounded" />
                <div className="h-4 w-32 bg-slate-100 rounded" />
                <div className="h-4 w-40 bg-slate-100 rounded" />
                <div className="h-4 w-28 bg-slate-100 rounded" />
                <div className="h-4 w-20 bg-slate-100 rounded ml-auto" />
              </div>
            ))}
          </div>
        </div>
      </AdminShell>
    )
  }

  return (
    <AdminShell title="Blocked Drivers">

      {/* ── Success toast ─────────────────────────────────────────────────── */}
      {successMsg && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-3 bg-green-600 text-white text-sm font-medium px-4 py-3 rounded-xl shadow-lg">
          <Unlock className="h-4 w-4 flex-shrink-0" />
          {successMsg}
          <button onClick={() => setSuccessMsg(null)}><X className="h-4 w-4" /></button>
        </div>
      )}

      {/* ── Header row ────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">Blocked Drivers</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {filtered.length} driver{filtered.length !== 1 ? 's' : ''} blocked
          </p>
        </div>

        <div className="flex gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, email, phone…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 w-64"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Refresh */}
          <button
            onClick={fetchDrivers}
            className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors"
            title="Refresh"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* ── Error ─────────────────────────────────────────────────────────── */}
      {error && (
        <div className="flex items-center gap-2 p-4 mb-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm">
          <AlertTriangle className="h-4 w-4 flex-shrink-0" />
          {error}
          <button onClick={fetchDrivers} className="ml-auto text-red-700 underline text-xs">Retry</button>
        </div>
      )}

      {/* ── Empty state ───────────────────────────────────────────────────── */}
      {!loading && filtered.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center">
          <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <Ban className="h-6 w-6 text-slate-400" />
          </div>
          <h3 className="text-sm font-semibold text-slate-700 mb-1">
            {search ? 'No results found' : 'No blocked drivers'}
          </h3>
          <p className="text-xs text-slate-400">
            {search ? 'Try a different search term.' : 'All drivers are currently active.'}
          </p>
        </div>
      )}

      {/* ── Desktop table ─────────────────────────────────────────────────── */}
      {filtered.length > 0 && (
        <>
          <div className="hidden lg:block bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mb-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">Driver</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">Contact</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">Block Reason</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">Blocked On</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">Status</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {paginated.map((driver, idx) => {
                  const { date, time } = formatBlockedAt(driver.blockedAt)
                  return (
                    <tr
                      key={driver.id}
                      className={`border-b border-slate-50 hover:bg-slate-50/60 transition-colors ${
                        idx === paginated.length - 1 ? 'border-b-0' : ''
                      }`}
                    >
                      {/* Driver info */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-semibold text-xs flex-shrink-0">
                            {driver.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-slate-800">{driver.name}</p>
                            <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                              <Hash className="h-3 w-3" />{driver.driverId}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="px-4 py-4">
                        <p className="flex items-center gap-1.5 text-slate-600">
                          <Mail className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
                          {driver.email}
                        </p>
                        <p className="flex items-center gap-1.5 text-slate-500 mt-1">
                          <Phone className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
                          {driver.phone}
                        </p>
                      </td>

                      {/* Reason */}
                      <td className="px-4 py-4 max-w-[220px]">
                        <ReasonCell reason={driver.blockedReason} />
                      </td>

                      {/* Blocked on */}
                      <td className="px-4 py-4">
                        <p className="flex items-center gap-1.5 text-slate-700 font-medium">
                          <Calendar className="h-3.5 w-3.5 text-slate-400" />
                          {date}
                        </p>
                        <p className="flex items-center gap-1.5 text-slate-400 text-xs mt-1">
                          <Clock className="h-3 w-3" />
                          {time}
                        </p>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 border border-red-100 text-red-600">
                          <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                          Blocked
                        </span>
                      </td>

                      {/* Action */}
                      <td className="px-4 py-4 text-right">
                        <button
                          onClick={() => setConfirmDriver(driver)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-green-200 bg-green-50 text-green-700 text-xs font-medium hover:bg-green-100 transition-colors"
                        >
                          <Unlock className="h-3.5 w-3.5" /> Unblock
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* ── Mobile cards ──────────────────────────────────────────────── */}
          <div className="lg:hidden flex flex-col gap-3 mb-4">
            {paginated.map(driver => {
              const { date, time } = formatBlockedAt(driver.blockedAt)
              return (
                <div
                  key={driver.id}
                  className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4"
                >
                  {/* Top row */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-semibold text-sm flex-shrink-0">
                        {driver.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800 text-sm">{driver.name}</p>
                        <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                          <Hash className="h-3 w-3" />{driver.driverId}
                        </p>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 border border-red-100 text-red-600 flex-shrink-0">
                      <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                      Blocked
                    </span>
                  </div>

                  {/* Details grid */}
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-3 text-sm">
                    <div>
                      <p className="text-xs text-slate-400">Email</p>
                      <p className="text-slate-700 text-xs break-words">{driver.email}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Phone</p>
                      <p className="text-slate-700 text-xs">{driver.phone}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Blocked date</p>
                      <p className="text-slate-700 text-xs">{date}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Time</p>
                      <p className="text-slate-700 text-xs">{time}</p>
                    </div>
                  </div>

                  {/* Reason */}
                  <div className="bg-red-50 border border-red-100 rounded-lg p-2.5 mb-3">
                    <p className="text-xs text-red-500 font-medium mb-1">Block reason</p>
                    <ReasonCell reason={driver.blockedReason} />
                  </div>

                  <button
                    onClick={() => setConfirmDriver(driver)}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-green-200 bg-green-50 text-green-700 text-sm font-medium hover:bg-green-100 transition-colors"
                  >
                    <Unlock className="h-4 w-4" /> Unblock Driver
                  </button>
                </div>
              )
            })}
          </div>

          {/* ── Pagination ────────────────────────────────────────────────── */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-1">
              <p className="text-xs text-slate-400">
                Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                      page === i + 1
                        ? 'bg-blue-600 text-white'
                        : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* ── Unblock confirm modal ──────────────────────────────────────────── */}
      {confirmDriver && (
        <UnblockConfirmModal
          driver={confirmDriver}
          onConfirm={handleUnblock}
          onCancel={() => setConfirmDriver(null)}
          loading={unblockLoading}
        />
      )}

    </AdminShell>
  )
}