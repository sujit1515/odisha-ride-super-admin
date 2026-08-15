'use client';

import { useEffect, useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import AdminShell from '@/components/Common/AdminShell'
import {
  getPassengers,
  getPassengerStats,
  activatePassenger,
  deactivatePassenger,
  deletePassenger,
  Passenger,
  PassengerStats,
} from '@/app/passengers/api/passengers'
import { Eye, MoreVertical, UserX, UserCheck, Trash2 } from 'lucide-react'

// ── Delete Confirm Modal ──────────────────────────────────────────────────────
function DeleteModal({
  passenger, onConfirm, onCancel, isLoading,
}: {
  passenger: Passenger
  onConfirm: () => void
  onCancel:  () => void
  isLoading: boolean
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6">

        <div className="flex items-center justify-center w-14 h-14 rounded-full
                        bg-red-100 mx-auto mb-4">
          <svg className="w-7 h-7 text-red-600" fill="none" viewBox="0 0 24 24"
               stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5
                 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </div>

        <h2 className="text-center text-lg font-bold text-slate-800 mb-1">
          Delete Passenger
        </h2>
        <p className="text-center text-sm text-slate-500 mb-1">
          Are you sure you want to delete
        </p>
        <p className="text-center text-sm font-semibold text-slate-800 mb-1">
          {passenger.fullName}
        </p>
        <p className="text-center text-xs text-slate-400 mb-2">{passenger.email}</p>
        <p className="text-center text-xs font-mono text-slate-500 mb-5">
          {passenger.passengerId ?? '—'}
        </p>

        <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 mb-6">
          <p className="text-xs text-red-600 text-center font-medium">
            ⚠️ This action cannot be undone. All data associated with this
            account will be permanently removed.
          </p>
        </div>

        <div className="flex gap-3">
          <button onClick={onCancel} disabled={isLoading}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200
                             text-sm font-medium text-slate-700 hover:bg-slate-50
                             disabled:opacity-50 transition-colors">
            Cancel
          </button>
          <button onClick={onConfirm} disabled={isLoading}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white
                             text-sm font-semibold hover:bg-red-700 disabled:opacity-50
                             transition-colors flex items-center justify-center gap-2">
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white
                                rounded-full animate-spin" />
                Deleting...
              </>
            ) : 'Yes, Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Deactivate Modal ──────────────────────────────────────────────────────────
function DeactivateModal({
  passenger, onConfirm, onCancel, isLoading,
}: {
  passenger: Passenger
  onConfirm: (reason: string) => void
  onCancel:  () => void
  isLoading: boolean
}) {
  const [reason, setReason] = useState('')

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6">

        {/* Icon */}
        <div className="flex items-center justify-center w-14 h-14 rounded-full
                        bg-amber-100 mx-auto mb-4">
          <svg className="w-7 h-7 text-amber-600" fill="none" viewBox="0 0 24 24"
               stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0
                 015.636 5.636m12.728 12.728L5.636 5.636" />
          </svg>
        </div>

        <h2 className="text-center text-lg font-bold text-slate-800 mb-1">
          Deactivate Passenger
        </h2>
        <p className="text-center text-sm text-slate-500 mb-1">
          You are deactivating
        </p>
        <p className="text-center text-sm font-semibold text-slate-800 mb-1">
          {passenger.fullName}
        </p>
        <p className="text-center text-xs font-mono text-slate-400 mb-5">
          {passenger.passengerId ?? '—'}
        </p>

        {/* Reason input */}
        <label className="text-sm font-medium text-slate-700 mb-1.5 block">
          Reason for deactivation <span className="text-red-500">*</span>
        </label>
        <textarea
          value={reason}
          onChange={e => setReason(e.target.value)}
          placeholder="e.g. Violated terms of service, suspicious activity..."
          rows={3}
          className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm
                     focus:outline-none focus:ring-2 focus:ring-amber-400
                     focus:border-transparent mb-2 resize-none transition"
        />
        <p className="text-xs text-slate-400 mb-5">
          This reason will be saved and visible in the deactivated users list.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200
                       text-sm font-medium text-slate-700 hover:bg-slate-50
                       disabled:opacity-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(reason)}
            disabled={isLoading || !reason.trim()}
            className="flex-1 px-4 py-2.5 rounded-xl bg-amber-500 text-white
                       text-sm font-semibold hover:bg-amber-600 disabled:opacity-50
                       transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white
                                rounded-full animate-spin" />
                Deactivating...
              </>
            ) : 'Deactivate'}
          </button>
        </div>

      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function PassengersPage() {

  const router = useRouter()
  const [passengers,       setPassengers      ] = useState<Passenger[]>([])
  const [stats,            setStats           ] = useState<PassengerStats>({
    total: 0, active: 0, inactive: 0, verified: 0,
  })
  const [isLoading,        setIsLoading       ] = useState(true)
  const [statsLoading,     setStatsLoading    ] = useState(true)
  const [error,            setError           ] = useState('')
  const [search,           setSearch          ] = useState('')
  const [searchInput,      setSearchInput     ] = useState('')
  const [page,             setPage            ] = useState(1)
  const [totalPages,       setTotalPages      ] = useState(1)
  const [total,            setTotal           ] = useState(0)
  const [actionLoading,    setActionLoading   ] = useState<string | null>(null)
  const [toast,            setToast           ] = useState<{ msg: string; ok: boolean } | null>(null)

  // Delete modal state
  const [deleteTarget,     setDeleteTarget    ] = useState<Passenger | null>(null)
  const [deleteLoading,    setDeleteLoading   ] = useState(false)

  // Deactivate modal state
  const [deactivateTarget,  setDeactivateTarget ] = useState<Passenger | null>(null)
  const [deactivateLoading, setDeactivateLoading] = useState(false)

  // Three-dot dropdown menu state
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const menuRef = useRef<HTMLDivElement | null>(null)

  // Close menu when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const LIMIT = 10

  // ── Fetch stats ────────────────────────────────────────────
  const fetchStats = async () => {
    setStatsLoading(true)
    try {
      const data = await getPassengerStats()
      setStats(data)
    } catch {
      // silently fail
    } finally {
      setStatsLoading(false)
    }
  }

  // ── Fetch passengers ───────────────────────────────────────
  const fetchPassengers = useCallback(async () => {
    setIsLoading(true)
    setError('')
    try {
      const data = await getPassengers(page, LIMIT, search)
      setPassengers(data.users ?? [])
      setTotalPages(data.totalPages ?? 1)
      setTotal(data.total ?? 0)
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Failed to load passengers.')
    } finally {
      setIsLoading(false)
    }
  }, [page, search])

  useEffect(() => { fetchStats() }, [])
  useEffect(() => { fetchPassengers() }, [fetchPassengers])

  // ── Toast ──────────────────────────────────────────────────
  const showToast = (msg: string, ok: boolean) => {
    setToast({ msg, ok })
    setTimeout(() => setToast(null), 3000)
  }

  // ── Activate ───────────────────────────────────────────────
  const handleActivate = async (id: string, name: string) => {
    setActionLoading(id)
    try {
      await activatePassenger(id)
      showToast(`${name} activated successfully.`, true)
      fetchPassengers()
      fetchStats()
    } catch (err: any) {
      showToast(err?.response?.data?.message ?? 'Failed to activate.', false)
    } finally {
      setActionLoading(null)
    }
  }

  // ── Deactivate (with reason) ───────────────────────────────
  const handleDeactivateConfirm = async (reason: string) => {
    if (!deactivateTarget) return
    setDeactivateLoading(true)
    try {
      await deactivatePassenger(deactivateTarget._id, reason)
      showToast(`${deactivateTarget.fullName} deactivated successfully.`, true)
      setDeactivateTarget(null)
      fetchPassengers()
      fetchStats()
    } catch (err: any) {
      showToast(err?.response?.data?.message ?? 'Failed to deactivate.', false)
    } finally {
      setDeactivateLoading(false)
    }
  }

  // ── Delete ─────────────────────────────────────────────────
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return
    setDeleteLoading(true)
    try {
      await deletePassenger(deleteTarget._id)
      showToast(`${deleteTarget.fullName} deleted successfully.`, true)
      setDeleteTarget(null)
      fetchPassengers()
      fetchStats()
    } catch (err: any) {
      showToast(err?.response?.data?.message ?? 'Failed to delete.', false)
    } finally {
      setDeleteLoading(false)
    }
  }

  // ── Search ─────────────────────────────────────────────────
  const handleSearch = () => {
    setPage(1)
    setSearch(searchInput)
  }

  // ── View Profile ───────────────────────────────────────────
  const handleViewProfile = (passengerId: string) => {
    router.push(`/passengers/${passengerId}`)
  }

  // ── Format date ────────────────────────────────────────────
  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-IN', {
      month: 'short', year: 'numeric',
    })

  return (
    <AdminShell title="Passengers">

      {/* ── Deactivate Modal ── */}
      {deactivateTarget && (
        <DeactivateModal
          passenger={deactivateTarget}
          onConfirm={handleDeactivateConfirm}
          onCancel={() => setDeactivateTarget(null)}
          isLoading={deactivateLoading}
        />
      )}

      {/* ── Delete Modal ── */}
      {deleteTarget && (
        <DeleteModal
          passenger={deleteTarget}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
          isLoading={deleteLoading}
        />
      )}

      {/* ── Toast ── */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-xl text-white
                         text-sm font-medium shadow-lg
                         ${toast.ok ? 'bg-emerald-500' : 'bg-red-500'}`}>
          {toast.msg}
        </div>
      )}

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className="bg-white rounded-xl p-4 border">
          <div className="text-xs text-slate-500">Total Passengers</div>
          <div className="text-2xl font-bold mt-1">
            {statsLoading ? '...' : stats.total.toLocaleString()}
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border">
          <div className="text-xs text-slate-500">Active</div>
          <div className="text-2xl font-bold mt-1 text-emerald-600">
            {statsLoading ? '...' : stats.active.toLocaleString()}
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border">
          <div className="text-xs text-slate-500">Inactive</div>
          <div className="text-2xl font-bold mt-1 text-slate-500">
            {statsLoading ? '...' : stats.inactive.toLocaleString()}
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border">
          <div className="text-xs text-slate-500">Verified</div>
          <div className="text-2xl font-bold mt-1 text-blue-600">
            {statsLoading ? '...' : stats.verified.toLocaleString()}
          </div>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">

        {/* Header + Search */}
        <div className="flex flex-col sm:flex-row sm:items-center
                        justify-between gap-3 mb-4">
          <h3 className="text-lg font-semibold text-slate-800">All Passengers</h3>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search name, email, phone, ID..."
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm
                         focus:outline-none focus:ring-2 focus:ring-slate-300 w-64"
            />
            <button
              onClick={handleSearch}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm
                         font-medium hover:bg-blue-700 transition-colors"
            >
              Search
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* Loading */}
        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800
                            rounded-full animate-spin" />
          </div>
        ) : passengers.length === 0 ? (
          <div className="text-center py-16 text-slate-400 text-sm">
            No passengers found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-slate-500 text-xs">
                <tr>
                  <th className="text-left font-medium px-3 py-3">Passenger ID</th>
                  <th className="text-left font-medium px-3 py-3">Name</th>
                  <th className="text-left font-medium px-3 py-3">Email</th>
                  <th className="text-left font-medium px-3 py-3">Phone</th>
                  <th className="text-left font-medium px-3 py-3">Joined</th>
                  <th className="text-left font-medium px-3 py-3">Status</th>
                  <th className="text-left font-medium px-3 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {passengers.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-50">

                    {/* Passenger ID */}
                    <td className="px-3 py-3">
                      <span className="font-mono text-xs font-semibold text-slate-500
                                       bg-slate-100 px-2.5 py-1 rounded-lg">
                        {p.passengerId ?? '—'}
                      </span>
                    </td>

                    {/* Name + Avatar */}
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center
                                        justify-center text-xs font-semibold text-slate-600
                                        overflow-hidden flex-shrink-0">
                          {p.avatarUrl
                            ? <img src={p.avatarUrl} alt={p.fullName}
                                   className="w-full h-full object-cover" />
                            : p.fullName?.charAt(0).toUpperCase() ?? '?'
                          }
                        </div>
                        <span className="font-medium text-slate-800 whitespace-nowrap">
                          {p.fullName}
                        </span>
                      </div>
                    </td>

                    <td className="px-3 py-3 text-slate-600">{p.email}</td>
                    <td className="px-3 py-3 text-slate-600">{p.phoneNumber ?? '—'}</td>
                    <td className="px-3 py-3 text-slate-500 whitespace-nowrap">
                      {formatDate(p.createdAt)}
                    </td>

                    {/* Status */}
                    <td className="px-3 py-3">
                      <span className={`inline-block px-3 py-1 rounded-full
                                        text-xs font-medium
                        ${p.isActive
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-slate-200 text-slate-600'
                        }`}>
                        {p.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>

                    {/* Actions — Three-dot dropdown */}
                    <td className="px-3 py-3">
                      <div className="relative" ref={openMenuId === p._id ? menuRef : undefined}>
                        {/* Trigger */}
                        <button
                          onClick={() => setOpenMenuId(openMenuId === p._id ? null : p._id)}
                          className="p-2 rounded-lg text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                          aria-label="Actions"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>

                        {/* Dropdown */}
                        {openMenuId === p._id && (
                          <div className="absolute right-0 top-9 z-20 w-44 rounded-xl border border-slate-100 bg-white shadow-lg py-1 animate-in fade-in slide-in-from-top-1">

                            {/* View Profile */}
                            <button
                              onClick={() => {
                                setOpenMenuId(null)
                                handleViewProfile(p.passengerId || p._id)
                              }}
                              className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                            >
                              <Eye className="h-4 w-4 text-blue-500" />
                              View Profile
                            </button>

                            {/* Divider */}
                            <div className="my-1 border-t border-slate-100" />

                            {/* Deactivate / Activate */}
                            {p.isActive ? (
                              <button
                                onClick={() => {
                                  setOpenMenuId(null)
                                  setDeactivateTarget(p)
                                }}
                                disabled={actionLoading === p._id}
                                className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-sm text-amber-700 hover:bg-amber-50 disabled:opacity-50 transition-colors"
                              >
                                <UserX className="h-4 w-4 text-amber-500" />
                                Deactivate
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  setOpenMenuId(null)
                                  handleActivate(p._id, p.fullName)
                                }}
                                disabled={actionLoading === p._id}
                                className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-sm text-emerald-700 hover:bg-emerald-50 disabled:opacity-50 transition-colors"
                              >
                                <UserCheck className="h-4 w-4 text-emerald-500" />
                                {actionLoading === p._id ? 'Activating…' : 'Activate'}
                              </button>
                            )}

                            {/* Divider */}
                            <div className="my-1 border-t border-slate-100" />

                            {/* Delete */}
                            <button
                              onClick={() => {
                                setOpenMenuId(null)
                                setDeleteTarget(p)
                              }}
                              disabled={actionLoading === p._id}
                              className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-sm text-red-700 hover:bg-red-50 disabled:opacity-50 transition-colors"
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                              Delete
                            </button>

                          </div>
                        )}
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ── Pagination ── */}
        {!isLoading && totalPages > 1 && (
          <div className="flex items-center justify-between mt-5 pt-4
                          border-t border-slate-100">
            <span className="text-xs text-slate-500">
              Showing {((page - 1) * LIMIT) + 1}–{Math.min(page * LIMIT, total)} of {total}
            </span>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 text-xs rounded-lg border border-slate-200
                           hover:bg-slate-50 disabled:opacity-40
                           disabled:cursor-not-allowed font-medium transition-colors"
              >
                ← Prev
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(p =>
                  p === 1 || p === totalPages ||
                  (p >= page - 1 && p <= page + 1)
                )
                .map((p, idx, arr) => (
                  <span key={p}>
                    {idx > 0 && arr[idx - 1] !== p - 1 && (
                      <span className="px-2 py-1.5 text-xs text-slate-400">
                        ...
                      </span>
                    )}
                    <button
                      onClick={() => setPage(p)}
                      className={`px-3 py-1.5 text-xs rounded-lg font-medium
                                  transition-colors
                        ${page === p
                          ? 'bg-slate-900 text-white'
                          : 'border border-slate-200 hover:bg-slate-50'
                        }`}
                    >
                      {p}
                    </button>
                  </span>
                ))
              }

              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 text-xs rounded-lg border border-slate-200
                           hover:bg-slate-50 disabled:opacity-40
                           disabled:cursor-not-allowed font-medium transition-colors"
              >
                Next →
              </button>
            </div>
          </div>
        )}

      </div>
    </AdminShell>
  )
}