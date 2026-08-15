
'use client'

import { useState, useEffect, useRef, useCallback } from "react";
import AdminShell from '@/components/Common/AdminShell';
import { Users, Wifi, WifiOff, Clock, ShieldOff } from 'lucide-react'
import { getAllDrivers, approveDriver, rejectDriver, blockDriver, unblockDriver, } from "@/app/drivers/api/kyc";
import type { Driver, DriverStatus, ToastState, ActionModalState, } from '@/api/types/types'
import { useRouter } from 'next/navigation'

import Loader from '@/components/Common/Loader';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getDisplayStatus(driver: Driver): string {
  if (driver.isBlocked) return "Blocked";
  if (!driver.isApproved && driver.status === "pending") return "Pending";
  if (driver.status === "rejected") return "Rejected";
  if (driver.isOnline) return "Online";
  return "Offline";
}

const statusConfig: Record<string, { bg: string; text: string; dot: string }> = {
  Online: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  "On Ride": { bg: "bg-orange-50", text: "text-orange-700", dot: "bg-orange-500" },
  Offline: { bg: "bg-gray-100", text: "text-gray-600", dot: "bg-gray-400" },
  Blocked: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" },
  Pending: { bg: "bg-yellow-50", text: "text-yellow-700", dot: "bg-yellow-500" },
  Approved: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
  Rejected: { bg: "bg-rose-50", text: "text-rose-700", dot: "bg-rose-500" },
};

function StatusBadge({ status }: { status: string }) {
  const cfg = statusConfig[status] ?? statusConfig["Offline"];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full
                      text-xs font-medium ${cfg.bg} ${cfg.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}
                        ${status === "Online" ? "animate-pulse" : ""}`} />
      {status}
    </span>
  );
}

function Avatar({ name, avatarUrl, size = "md" }: {
  name: string; avatarUrl?: string; size?: "sm" | "md" | "lg"
}) {
  const sizeClasses = { sm: "w-8 h-8 text-xs", md: "w-9 h-9 text-sm", lg: "w-16 h-16 text-xl" };
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  if (avatarUrl) {
    return (
      <img src={avatarUrl} alt={name}
        className={`${sizeClasses[size]} rounded-full object-cover flex-shrink-0`} />
    );
  }
  return (
    <div className={`${sizeClasses[size]} bg-blue-100 text-blue-700 rounded-full
                     flex items-center justify-center font-semibold flex-shrink-0`}>
      {initials}
    </div>
  );
}

function SkeletonRow() {
  return (
    <tr className="border-b border-gray-100">
      {Array.from({ length: 9 }).map((_, i) => (
        <td key={i} className="px-4 py-3.5">
          <div className="h-4 bg-gray-100 rounded animate-pulse"
            style={{ width: `${60 + Math.random() * 40}%` }} />
        </td>
      ))}
    </tr>
  );
}

function formatDate(dateStr: string) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric'
  })
}

// ─── Action Modal ─────────────────────────────────────────────────────────────

function ActionModal({
  type,
  driver,
  onConfirm,
  onCancel,
  loading,
}: {
  type: 'approve' | 'reject' | 'block' | 'unblock'
  driver: Driver
  onConfirm: (reason?: string) => void
  onCancel: () => void
  loading: boolean
}) {
  const [reason, setReason] = useState('')

  const config = {
    approve: { title: 'Approve Driver', desc: 'Are you sure you want to approve this driver?', color: 'bg-blue-600 hover:bg-blue-700', btnText: 'Approve' },
    reject: { title: 'Reject Driver', desc: 'Please provide a reason for rejection.', color: 'bg-rose-600 hover:bg-rose-700', btnText: 'Reject' },
    block: { title: 'Block Driver', desc: 'Please provide a reason for blocking.', color: 'bg-red-600 hover:bg-red-700', btnText: 'Block' },
    unblock: { title: 'Unblock Driver', desc: 'Are you sure you want to unblock this driver?', color: 'bg-green-600 hover:bg-green-700', btnText: 'Unblock' },
  }[type]

  const needsReason = type === 'reject' || type === 'block'

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onCancel}>
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl"
        onClick={e => e.stopPropagation()}>
        <h3 className="text-base font-semibold text-slate-800 mb-1">{config.title}</h3>
        <p className="text-sm text-slate-500 mb-1">{config.desc}</p>
        <p className="text-sm font-semibold text-slate-800 mb-4">{driver.fullName}
          <span className="ml-2 font-mono text-xs text-slate-400">{driver.driverId}</span>
        </p>

        {needsReason && (
          <textarea
            value={reason}
            onChange={e => setReason(e.target.value)}
            placeholder="Enter reason..."
            rows={3}
            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm
                       focus:outline-none focus:ring-2 focus:ring-slate-300 mb-4 resize-none"
          />
        )}

        <div className="flex gap-3">
          <button onClick={onCancel} disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200
                             text-sm font-medium text-slate-700 hover:bg-slate-50
                             disabled:opacity-50">
            Cancel
          </button>
          <button
            onClick={() => onConfirm(reason)}
            disabled={loading || (needsReason && !reason.trim())}
            className={`flex-1 px-4 py-2.5 rounded-xl text-white text-sm font-semibold
                        disabled:opacity-50 transition-colors flex items-center
                        justify-center gap-2 ${config.color}`}
          >
            {loading
              ? <div className="w-4 h-4 border-2 border-white/30 border-t-white
                                rounded-full animate-spin" />
              : config.btnText
            }
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Driver Profile Drawer ────────────────────────────────────────────────────

function DriverDrawer({
  driver,
  onClose,
  onAction,
}: {
  driver: Driver | null
  onClose: () => void
  onAction: (type: 'approve' | 'reject' | 'block' | 'unblock', driver: Driver) => void
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!driver) return null;

  const displayStatus = getDisplayStatus(driver);

  return (
    <>
      <div className="fixed inset-0 bg-black/20 z-40" onClick={onClose} />
      <div ref={ref}
        className="fixed right-0 top-0 h-full w-full max-w-[420px] bg-white z-50
                      shadow-2xl flex flex-col overflow-hidden"
        style={{ animation: "slideIn 0.25s ease-out" }}>
        <style>{`@keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }`}</style>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-900">Driver Profile</h2>
          <button onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg
                             hover:bg-gray-100 text-gray-500 transition-colors">
            <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Hero */}
          <div className="flex flex-col items-center pt-6 pb-5 px-5">
            <div className="relative mb-3">
              <Avatar name={driver.fullName} avatarUrl={driver.avatarUrl} size="lg" />
              <span className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2
                                border-white ${driver.isOnline ? 'bg-emerald-500' : 'bg-gray-400'}`} />
            </div>
            <p className="text-base font-semibold text-gray-900">{driver.fullName}</p>
            <p className="text-xs text-gray-500 mt-0.5 font-mono">{driver.driverId}</p>
            <div className="mt-2">
              <StatusBadge status={displayStatus} />
            </div>
          </div>

          {/* Stats */}
          <div className="mx-5 grid grid-cols-3 rounded-xl border border-gray-100
                          bg-gray-50 overflow-hidden mb-5">
            {[
              { label: "Rating", value: driver.rating?.toFixed(2) ?? '—' },
              { label: "Trips", value: driver.totalTrips?.toLocaleString() ?? '0' },
              { label: "Earnings", value: `₹${(driver.totalEarnings ?? 0).toLocaleString()}` },
            ].map((stat, i) => (
              <div key={stat.label}
                className={`flex flex-col items-center py-3.5
                               ${i < 2 ? "border-r border-gray-100" : ""}`}>
                <p className="text-[11px] uppercase tracking-widest text-gray-400
                               font-medium mb-1">{stat.label}</p>
                <p className="text-lg font-semibold text-gray-900">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Personal Info */}
          <div className="px-5 mb-5">
            <p className="text-[10px] uppercase tracking-widest text-gray-400
                           font-semibold mb-3">Personal Information</p>
            <div className="space-y-3">
              {[
                { label: "Email", value: driver.email },
                { label: "Phone", value: driver.phone },
                { label: "Joined", value: formatDate(driver.createdAt) },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between gap-4">
                  <span className="text-xs text-gray-500">{label}</span>
                  <span className="text-xs text-gray-900 font-medium text-right">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mx-5 border-t border-gray-100 mb-5" />

          {/* Vehicle */}
          {driver.vehicleModel && (
            <div className="px-5 mb-5">
              <p className="text-[10px] uppercase tracking-widest text-gray-400
                             font-semibold mb-3">Vehicle Details</p>
              <div className="flex items-center gap-3 bg-blue-50 rounded-xl p-3.5">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center
                                justify-center flex-shrink-0">
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24"
                    stroke="#2563eb" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900">{driver.vehicleModel}</p>
                  <p className="text-xs text-gray-500">
                    {driver.vehiclePlate} · {driver.vehicleColor}
                  </p>
                </div>
                {driver.vehicleType && (
                  <span className="text-[10px] font-semibold text-blue-700 bg-blue-100
                                   px-2 py-1 rounded-md">{driver.vehicleType}</span>
                )}
              </div>
            </div>
          )}

          {/* Block reason */}
          {driver.isBlocked && driver.blockReason && (
            <div className="mx-5 mb-5 bg-red-50 border border-red-100 rounded-xl p-4">
              <p className="text-xs font-semibold text-red-600 mb-1">Block Reason</p>
              <p className="text-sm text-red-700">{driver.blockReason}</p>
            </div>
          )}

          {/* Rejection reason */}
          {driver.status === 'rejected' && driver.rejectionReason && (
            <div className="mx-5 mb-5 bg-rose-50 border border-rose-100 rounded-xl p-4">
              <p className="text-xs font-semibold text-rose-600 mb-1">Rejection Reason</p>
              <p className="text-sm text-rose-700">{driver.rejectionReason}</p>
            </div>
          )}

        </div>

        {/* Footer actions */}
        <div className="px-5 py-4 border-t border-gray-100 grid grid-cols-2 gap-3 bg-white">
          {driver.isBlocked ? (
            <button
              onClick={() => onAction('unblock', driver)}
              className="col-span-2 py-2.5 px-4 rounded-xl bg-green-600 text-sm
                         font-semibold text-white hover:bg-green-700 transition-colors">
              Unblock Driver
            </button>
          ) : driver.status === 'pending' && !driver.isApproved ? (
            <>
              <button
                onClick={() => onAction('reject', driver)}
                className="py-2.5 px-4 rounded-xl border border-gray-200 text-sm
                           font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                Reject KYC
              </button>
              <button
                onClick={() => onAction('approve', driver)}
                className="py-2.5 px-4 rounded-xl bg-blue-600 text-sm font-semibold
                           text-white hover:bg-blue-700 transition-colors">
                Approve KYC
              </button>
            </>
          ) : (
            <button
              onClick={() => onAction('block', driver)}
              className="col-span-2 py-2.5 px-4 rounded-xl border border-red-200
                         text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
              Block Driver
            </button>
          )}
        </div>
      </div>
    </>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function DriversPage() {
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null)
  const [actionModal, setActionModal] = useState<{
    type: 'approve' | 'reject' | 'block' | 'unblock'
    driver: Driver
  } | null>(null)
  const [actionLoading, setActionLoading] = useState(false)
  const router = useRouter()

  const LIMIT = 10

  // ── Fetch ─────────────────────────────────────────────────
  const fetchDrivers = useCallback(async () => {
    setIsLoading(true)
    setError('')
    try {
      const data = await getAllDrivers(
        statusFilter === 'All' ? undefined : statusFilter.toLowerCase()
      )
      const list: Driver[] = data.drivers ?? data ?? []
      setDrivers(list)
      setTotal(data.total ?? list.length)
      setTotalPages(data.totalPages ?? 1)
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Failed to load drivers.')
    } finally {
      setIsLoading(false)
    }
  }, [statusFilter])

  useEffect(() => { fetchDrivers() }, [fetchDrivers])

  // ── Toast ──────────────────────────────────────────────────
  const showToast = (msg: string, ok: boolean) => {
    setToast({ msg, ok })
    setTimeout(() => setToast(null), 3000)
  }

  // ── Handle action (approve/reject/block/unblock) ──────────
  const handleActionConfirm = async (reason?: string) => {
    if (!actionModal) return
    setActionLoading(true)
    try {
      const { type, driver } = actionModal
      if (type === 'approve') await approveDriver(driver.driverId, {})
      if (type === 'reject') await rejectDriver(driver.driverId, { reason: reason! })
      if (type === 'block') await blockDriver(driver.driverId, { reason: reason! })
      if (type === 'unblock') await unblockDriver(driver.driverId)

      showToast(`Driver ${type}d successfully.`, true)
      setActionModal(null)
      setSelectedDriver(null)
      fetchDrivers()
    } catch (err: any) {
      showToast(err?.response?.data?.message ?? `Failed to ${actionModal.type} driver.`, false)
    } finally {
      setActionLoading(false)
    }
  }

  // ── Client-side filter by search ──────────────────────────
  const filtered = drivers.filter(d => {
    const q = search.toLowerCase()
    return (
      d.fullName?.toLowerCase().includes(q) ||
      d.driverId?.toLowerCase().includes(q) ||
      d.email?.toLowerCase().includes(q) ||
      d.phone?.includes(q)
    )
  })

  const paginated = filtered.slice((page - 1) * LIMIT, page * LIMIT)
  const clientTotalPages = Math.max(1, Math.ceil(filtered.length / LIMIT))

  // ── Stats ─────────────────────────────────────────────────
  const stats = {
    total: drivers.length,
    online: drivers.filter(d => d.isOnline && !d.isBlocked).length,
    pending: drivers.filter(d => d.status === 'pending').length,
    blocked: drivers.filter(d => d.isBlocked).length,
    offline: drivers.filter(d => !d.isOnline && !d.isBlocked && d.status !== 'pending').length,
  }

  return (
    <AdminShell title="Drivers Management">
      <div className="min-h-screen bg-gray-50/50">

        {/* Toast */}
        {toast && (
          <div className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-xl text-white
                           text-sm font-medium shadow-lg
                           ${toast.ok ? 'bg-emerald-500' : 'bg-red-500'}`}>
            {toast.msg}
          </div>
        )}

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Drivers</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage all registered drivers and their operational status.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
          {[
            { label: "Total Drivers", value: stats.total, Icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Online", value: stats.online, Icon: Wifi, color: "text-emerald-600", bg: "bg-emerald-50" },
            { label: "Offline", value: stats.offline, Icon: WifiOff, color: "text-gray-500", bg: "bg-gray-100" },
            { label: "Pending KYC", value: stats.pending, Icon: Clock, color: "text-yellow-600", bg: "bg-yellow-50" },
            { label: "Blocked", value: stats.blocked, Icon: ShieldOff, color: "text-red-600", bg: "bg-red-50" },
          ].map(card => (
            <div key={card.label}
              className="bg-white rounded-xl border border-gray-100 p-4
                            hover:shadow-md hover:-translate-y-0.5 transition-all cursor-default">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-9 h-9 rounded-lg ${card.bg} flex items-center
                 justify-center`}>
                  <card.Icon className={`w-5 h-5 ${card.color}`} />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900 leading-none mb-1">
                {isLoading ? '...' : card.value}
              </p>
              <p className="text-xs text-gray-500 font-medium">{card.label}</p>
            </div>
          ))}
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-xl border border-gray-100 px-4 py-3 mb-4
                        flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              width="15" height="15" fill="none" stroke="currentColor"
              strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search by name, ID, phone..."
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { setSearch(searchInput); setPage(1); } }}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg
                         focus:outline-none focus:ring-2 focus:ring-blue-500/20
                         focus:border-blue-400 transition-all"
            />
          </div>

          <select
            value={statusFilter}
            onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2
                       focus:outline-none bg-white text-gray-700 min-w-[130px]"
          >
            {["All", "Pending", "Approved", "Rejected", "Blocked"].map(s => (
              <option key={s}>{s}</option>
            ))}
          </select>

          <button
            onClick={() => { setSearch(searchInput); setPage(1); }}
            className="px-4 py-2 text-sm font-semibold text-white bg-blue-600
                       rounded-lg hover:bg-blue-700 transition-colors"
          >
            Search
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/70">
                  {["Driver ID", "Name", "Email", "Phone", "Vehicle", "Status", "Joined", "Actions"].map(col => (
                    <th key={col}
                      className="px-4 py-3 text-left text-[10px] font-semibold
                                   text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={8} className="py-12">
                      <Loader text="Loading drivers..." />
                    </td>
                  </tr>
                ) : paginated.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-4 py-20 text-center">
                          <div className="flex flex-col items-center gap-3">
                            <div className="w-12 h-12 bg-gray-100 rounded-full flex
                                          items-center justify-center text-2xl">🔍</div>
                            <p className="text-sm font-medium text-gray-900">No drivers found</p>
                            <p className="text-xs text-gray-500">Try adjusting your search or filters</p>
                          </div>
                        </td>
                      </tr>
                    )
                    : paginated.map((driver, idx) => {
                      const displayStatus = getDisplayStatus(driver)
                      return (
                        <tr key={driver._id}
                          className={`border-b border-gray-50 hover:bg-blue-50/30
                                      transition-colors ${idx % 2 === 0 ? '' : 'bg-gray-50/30'}`}>

                          {/* Driver ID */}
                          <td className="px-4 py-3.5">
                            <span className="text-xs font-mono font-medium text-slate-500
                                           bg-slate-100 px-2 py-1 rounded">
                              {driver.driverId}
                            </span>
                          </td>

                          {/* Name */}
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-2.5">
                              <Avatar name={driver.fullName} avatarUrl={driver.avatarUrl} size="sm" />
                              <p className="text-sm font-semibold text-gray-900 whitespace-nowrap">
                                {driver.fullName}
                              </p>
                            </div>
                          </td>

                          <td className="px-4 py-3.5 text-sm text-gray-600">{driver.email}</td>
                          <td className="px-4 py-3.5 text-sm text-gray-600">{driver.phone}</td>

                          {/* Vehicle */}
                          <td className="px-4 py-3.5">
                            <p className="text-sm text-gray-900 whitespace-nowrap">
                              {driver.vehicleModel ?? '—'}
                            </p>
                            <p className="text-xs text-gray-400">{driver.vehiclePlate ?? ''}</p>
                          </td>

                          {/* Status */}
                          <td className="px-4 py-3.5">
                            <StatusBadge status={displayStatus} />
                          </td>

                          {/* Joined */}
                          <td className="px-4 py-3.5">
                            <span className="text-xs text-gray-500">
                              {formatDate(driver.createdAt)}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="px-4 py-3.5 relative">
                            <button
                              onClick={() => setOpenMenuId(openMenuId === driver._id ? null : driver._id)}
                              className="w-7 h-7 flex items-center justify-center rounded-lg
                                       hover:bg-gray-100 transition-colors text-gray-500"
                            >
                              <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                                <circle cx="12" cy="5" r="1.5" />
                                <circle cx="12" cy="12" r="1.5" />
                                <circle cx="12" cy="19" r="1.5" />
                              </svg>
                            </button>

                            {openMenuId === driver._id && (
                              <div className="absolute right-2 top-12 z-30 bg-white rounded-xl
                                            border border-gray-100 shadow-xl py-1.5 min-w-[160px]"
                                onMouseLeave={() => setOpenMenuId(null)}>
                                <button
                                  onClick={() => { setSelectedDriver(driver); setOpenMenuId(null); }}
                                  className="w-full text-left px-4 py-2 text-sm text-gray-700
           hover:bg-gray-50 transition-colors">
                                  View Profile
                                </button>
                                <button
                                  onClick={() => { router.push(`/drivers/${driver.driverId}`); setOpenMenuId(null); }}
                                  className="w-full text-left px-4 py-2 text-sm text-blue-600
           hover:bg-blue-50 transition-colors">
                                  View Driver Detail
                                </button>
                                {!driver.isApproved && driver.status === 'pending' && (
                                  <>
                                    <button
                                      onClick={() => { setActionModal({ type: 'approve', driver }); setOpenMenuId(null); }}
                                      className="w-full text-left px-4 py-2 text-sm text-blue-600
                                               hover:bg-blue-50 transition-colors">
                                      Approve
                                    </button>
                                    <button
                                      onClick={() => { setActionModal({ type: 'reject', driver }); setOpenMenuId(null); }}
                                      className="w-full text-left px-4 py-2 text-sm text-rose-600
                                               hover:bg-rose-50 transition-colors">
                                      Reject
                                    </button>
                                  </>
                                )}
                                {driver.isBlocked ? (
                                  <button
                                    onClick={() => { setActionModal({ type: 'unblock', driver }); setOpenMenuId(null); }}
                                    className="w-full text-left px-4 py-2 text-sm text-green-600
                                             hover:bg-green-50 transition-colors">
                                    Unblock
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => { setActionModal({ type: 'block', driver }); setOpenMenuId(null); }}
                                    className="w-full text-left px-4 py-2 text-sm text-red-600
                                             hover:bg-red-50 transition-colors">
                                    Block Driver
                                  </button>
                                )}
                              </div>
                            )}
                          </td>
                        </tr>
                      )
                    })
                }
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!isLoading && filtered.length > 0 && (
            <div className="px-4 py-3 border-t border-gray-100 flex flex-wrap
                            items-center justify-between gap-3">
              <p className="text-xs text-gray-500">
                Showing <span className="font-medium text-gray-900">
                  {(page - 1) * LIMIT + 1}
                </span>–<span className="font-medium text-gray-900">
                  {Math.min(page * LIMIT, filtered.length)}
                </span> of <span className="font-medium text-gray-900">
                  {filtered.length}
                </span> drivers
              </p>
              <div className="flex items-center gap-1">
                <button onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1.5 text-xs font-medium border border-gray-200
                                   rounded-lg hover:bg-gray-50 disabled:opacity-40
                                   disabled:cursor-not-allowed transition-colors">
                  Previous
                </button>
                {Array.from({ length: clientTotalPages }).map((_, i) => (
                  <button key={i} onClick={() => setPage(i + 1)}
                    className={`w-7 h-7 text-xs font-medium rounded-lg transition-colors ${page === i + 1
                      ? 'bg-blue-600 text-white'
                      : 'border border-gray-200 hover:bg-gray-50 text-gray-600'
                      }`}>
                    {i + 1}
                  </button>
                ))}
                <button onClick={() => setPage(p => Math.min(clientTotalPages, p + 1))}
                  disabled={page === clientTotalPages}
                  className="px-3 py-1.5 text-xs font-medium border border-gray-200
                                   rounded-lg hover:bg-gray-50 disabled:opacity-40
                                   disabled:cursor-not-allowed transition-colors">
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Driver Drawer */}
        <DriverDrawer
          driver={selectedDriver}
          onClose={() => setSelectedDriver(null)}
          onAction={(type, driver) => setActionModal({ type, driver })}
        />

        {/* Action Modal */}
        {actionModal && (
          <ActionModal
            type={actionModal.type}
            driver={actionModal.driver}
            onConfirm={handleActionConfirm}
            onCancel={() => setActionModal(null)}
            loading={actionLoading}
          />
        )}

      </div>
    </AdminShell>
  );
}