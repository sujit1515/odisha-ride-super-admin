'use client'

import { useState, useEffect } from 'react'
import Loader from '@/components/Common/Loader'
import AdminShell from '@/components/Common/AdminShell'
import {
  Search, UserCheck, Ban, Calendar, Clock, Phone, Mail,
  Hash, ChevronLeft, ChevronRight, AlertTriangle,
  RefreshCw, X, Users
} from 'lucide-react'
import { getPassengers, activatePassenger } from '@/app/passengers/api/passengers'
import type { DeactivatedUser } from '@/api/types/types'


// ── Activate Confirm Modal ────────────────────────────────────────────────────
const ActivateConfirmModal = ({
  user,
  onConfirm,
  onCancel,
  loading,
}: {
  user: DeactivatedUser
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
        <UserCheck className="h-6 w-6 text-green-600" />
      </div>
      <h3 className="text-base font-semibold text-slate-800 text-center mb-1">
        Activate this user?
      </h3>
      <p className="text-sm text-slate-500 text-center mb-4">
        <span className="font-medium text-slate-700">{user.name}</span> will regain
        full access to the platform.
      </p>
      <p className="text-center text-xs font-mono font-semibold text-slate-500
                    bg-slate-100 px-3 py-1 rounded-lg inline-block w-full mb-5">
        {user.passengerId || '—'}
      </p>
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          disabled={loading}
          className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200
                     text-sm text-slate-600 font-medium hover:bg-slate-50 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={loading}
          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5
                     rounded-xl bg-green-600 text-white text-sm font-medium
                     hover:bg-green-700 disabled:opacity-50"
        >
          {loading
            ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
            : <UserCheck className="h-4 w-4" />}
          Yes, Activate
        </button>
      </div>
    </div>
  </div>
)

// ── Format date ───────────────────────────────────────────────────────────────
function formatDate(raw: string) {
  if (!raw) return { date: 'N/A', time: '' }
  const d = new Date(raw)
  if (isNaN(d.getTime())) return { date: 'N/A', time: '' }
  return {
    date: d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    time: d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }),
  }
}

const PAGE_SIZE = 10

export default function DeactivatedUsersPage() {
  const [users, setUsers] = useState<DeactivatedUser[]>([])
  const [filtered, setFiltered] = useState<DeactivatedUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [confirmUser, setConfirmUser] = useState<DeactivatedUser | null>(null)
  const [activateLoading, setActivateLoading] = useState(false)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  useEffect(() => { fetchUsers() }, [])

  useEffect(() => {
    const q = search.toLowerCase().trim()
    const result = q
      ? users.filter(u =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.phone.includes(q) ||
        u.passengerId.toLowerCase().includes(q)
      )
      : users
    setFiltered(result)
    setPage(1)
  }, [search, users])

  // ── Fetch deactivated users ─────────────────────────────────────────────────
  const fetchUsers = async () => {
    setLoading(true)
    setError(null)
    try {
      // Fetch all pages to get deactivated users
      const data = await getPassengers(1, 100, '')
      const allUsers = data.users ?? []
      const deactivated = allUsers
        .filter((u: any) => !u.isActive)
        .map((u: any) => ({
          id: u._id,
          passengerId: u.passengerId ?? '—',
          name: u.fullName ?? 'Unknown',
          email: u.email ?? '—',
          phone: u.phoneNumber ?? '—',
          createdAt: u.createdAt ?? '',
        }))
      setUsers(deactivated)
      setFiltered(deactivated)
    } catch {
      setError('Failed to load deactivated users. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // ── Activate user ───────────────────────────────────────────────────────────
  const handleActivate = async () => {
    if (!confirmUser) return
    setActivateLoading(true)
    try {
      await activatePassenger(confirmUser.id)
      setUsers(prev => prev.filter(u => u.id !== confirmUser.id))
      setSuccessMsg(`${confirmUser.name} has been activated successfully.`)
      setTimeout(() => setSuccessMsg(null), 3500)
      setConfirmUser(null)
    } catch {
      alert('Failed to activate user. Please try again.')
    } finally {
      setActivateLoading(false)
    }
  }

  // ── Pagination ──────────────────────────────────────────────────────────────
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  // ── Loading skeleton ────────────────────────────────────────────────────────
  if (loading) {
    return (
      <AdminShell title="Deactivated Users">
        <div className="bg-white rounded-2xl border border-slate-100 p-12 flex items-center justify-center">
          <Loader text="Loading deactivated users..." />
        </div>
      </AdminShell>
    )
  }

  return (
    <AdminShell title="Deactivated Users">

      {/* ── Success toast ── */}
      {successMsg && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-3 bg-green-600
                        text-white text-sm font-medium px-4 py-3 rounded-xl shadow-lg">
          <UserCheck className="h-4 w-4 flex-shrink-0" />
          {successMsg}
          <button onClick={() => setSuccessMsg(null)}>
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">Deactivated Users</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {filtered.length} user{filtered.length !== 1 ? 's' : ''} deactivated
          </p>
        </div>

        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, email, ID…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl
                         focus:outline-none focus:ring-2 focus:ring-blue-200
                         focus:border-blue-400 w-64"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2
                           text-slate-400 hover:text-slate-600"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          <button
            onClick={fetchUsers}
            className="p-2 rounded-xl border border-slate-200 text-slate-500
                       hover:bg-slate-50 transition-colors"
            title="Refresh"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* ── Error ── */}
      {error && (
        <div className="flex items-center gap-2 p-4 mb-4 bg-red-50 border
                        border-red-100 rounded-xl text-red-600 text-sm">
          <AlertTriangle className="h-4 w-4 flex-shrink-0" />
          {error}
          <button onClick={fetchUsers} className="ml-auto text-red-700 underline text-xs">
            Retry
          </button>
        </div>
      )}

      {/* ── Empty state ── */}
      {!loading && filtered.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center">
          <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center
                          justify-center mx-auto mb-4">
            <Users className="h-6 w-6 text-slate-400" />
          </div>
          <h3 className="text-sm font-semibold text-slate-700 mb-1">
            {search ? 'No results found' : 'No deactivated users'}
          </h3>
          <p className="text-xs text-slate-400">
            {search ? 'Try a different search term.' : 'All users are currently active.'}
          </p>
        </div>
      )}

      {/* ── Desktop table ── */}
      {filtered.length > 0 && (
        <>
          <div className="hidden lg:block bg-white rounded-2xl border border-slate-100
                          shadow-sm overflow-hidden mb-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left px-5 py-3 text-xs font-semibold
                                 text-slate-400 uppercase tracking-wide">
                    Passenger ID
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold
                                 text-slate-400 uppercase tracking-wide">
                    User
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold
                                 text-slate-400 uppercase tracking-wide">
                    Contact
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold
                                 text-slate-400 uppercase tracking-wide">
                    Joined
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold
                                 text-slate-400 uppercase tracking-wide">
                    Status
                  </th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {paginated.map((user, idx) => {
                  const { date, time } = formatDate(user.createdAt)
                  return (
                    <tr
                      key={user.id}
                      className={`border-b border-slate-50 hover:bg-slate-50/60
                                  transition-colors ${idx === paginated.length - 1 ? 'border-b-0' : ''
                        }`}
                    >
                      {/* Passenger ID */}
                      <td className="px-5 py-4">
                        <span className="font-mono text-xs font-semibold text-slate-500
                                         bg-slate-100 px-2.5 py-1 rounded-lg">
                          {user.passengerId}
                        </span>
                      </td>

                      {/* User info */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center
                                          justify-center text-purple-600 font-semibold
                                          text-xs flex-shrink-0">
                            {user.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                          </div>
                          <p className="font-medium text-slate-800">{user.name}</p>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="px-4 py-4">
                        <p className="flex items-center gap-1.5 text-slate-600">
                          <Mail className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
                          {user.email}
                        </p>
                        <p className="flex items-center gap-1.5 text-slate-500 mt-1">
                          <Phone className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
                          {user.phone}
                        </p>
                      </td>

                      {/* Joined */}
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
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1
                                         rounded-full text-xs font-medium bg-slate-100
                                         border border-slate-200 text-slate-600">
                          <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                          Deactivated
                        </span>
                      </td>

                      {/* Action */}
                      <td className="px-4 py-4 text-right">
                        <button
                          onClick={() => setConfirmUser(user)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5
                                     rounded-lg border border-green-200 bg-green-50
                                     text-green-700 text-xs font-medium
                                     hover:bg-green-100 transition-colors"
                        >
                          <UserCheck className="h-3.5 w-3.5" /> Activate
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* ── Mobile cards ── */}
          <div className="lg:hidden flex flex-col gap-3 mb-4">
            {paginated.map(user => {
              const { date, time } = formatDate(user.createdAt)
              return (
                <div key={user.id}
                  className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center
                                      justify-center text-purple-600 font-semibold
                                      text-sm flex-shrink-0">
                        {user.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800 text-sm">{user.name}</p>
                        <p className="text-xs font-mono text-slate-400 mt-0.5">
                          {user.passengerId}
                        </p>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full
                                     text-xs font-medium bg-slate-100 border border-slate-200
                                     text-slate-600 flex-shrink-0">
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                      Deactivated
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-3 text-sm">
                    <div>
                      <p className="text-xs text-slate-400">Email</p>
                      <p className="text-slate-700 text-xs break-words">{user.email}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Phone</p>
                      <p className="text-slate-700 text-xs">{user.phone}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Joined</p>
                      <p className="text-slate-700 text-xs">{date}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Time</p>
                      <p className="text-slate-700 text-xs">{time}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => setConfirmUser(user)}
                    className="w-full inline-flex items-center justify-center gap-2
                               px-4 py-2 rounded-xl border border-green-200 bg-green-50
                               text-green-700 text-sm font-medium hover:bg-green-100
                               transition-colors"
                  >
                    <UserCheck className="h-4 w-4" /> Activate User
                  </button>
                </div>
              )
            })}
          </div>

          {/* ── Pagination ── */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-1">
              <p className="text-xs text-slate-400">
                Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-1.5 rounded-lg border border-slate-200 text-slate-500
                             hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${page === i + 1
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
                  className="p-1.5 rounded-lg border border-slate-200 text-slate-500
                             hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* ── Activate confirm modal ── */}
      {confirmUser && (
        <ActivateConfirmModal
          user={confirmUser}
          onConfirm={handleActivate}
          onCancel={() => setConfirmUser(null)}
          loading={activateLoading}
        />
      )}

    </AdminShell>
  )
}