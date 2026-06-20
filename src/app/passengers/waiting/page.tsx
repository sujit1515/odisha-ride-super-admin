'use client'
import { useState, useMemo } from 'react'
import {
  Search, RefreshCw, MapPin, Clock, IndianRupee,
  UserX, Car, Phone, X, ChevronDown
} from 'lucide-react'
import AdminShell from '@/components/Common/AdminShell'  


// ─── Mock data — replace with your API response shape ───────────────
const SEARCHING_PASSENGERS = [
  {
    id: 'REQ-1042',
    passenger: 'Ananya Patnaik',
    phone: '+91 98765 43210',
    pickup: 'Master Canteen Square, Bhubaneswar',
    drop: 'Patia, Bhubaneswar',
    fareEstimate: 145,
    waitingSince: '2 min ago',
    waitSeconds: 120,
  },
  {
    id: 'REQ-1043',
    passenger: 'Rakesh Mohanty',
    phone: '+91 98123 45678',
    pickup: 'Rajmahal Square, Cuttack',
    drop: 'Badambadi Bus Stand, Cuttack',
    fareEstimate: 95,
    waitingSince: '4 min ago',
    waitSeconds: 240,
  },
  {
    id: 'REQ-1044',
    passenger: 'Sneha Das',
    phone: '+91 90090 11223',
    pickup: 'Khandagiri Square, Bhubaneswar',
    drop: 'Biju Patnaik Airport, Bhubaneswar',
    fareEstimate: 220,
    waitingSince: '6 min ago',
    waitSeconds: 360,
  },
]

const MATCHED_PASSENGERS = [
  {
    id: 'REQ-1038',
    passenger: 'Bibhuti Nayak',
    phone: '+91 99887 66554',
    pickup: 'Jaydev Vihar, Bhubaneswar',
    drop: 'Infocity, Bhubaneswar',
    fareEstimate: 110,
    driver: 'Suresh Patel',
    driverPhone: '+91 91234 56780',
    eta: '3 min',
    waitingSince: '5 min ago',
    waitSeconds: 300,
  },
  {
    id: 'REQ-1039',
    passenger: 'Manisha Sahoo',
    phone: '+91 98456 12378',
    pickup: 'Saheed Nagar, Bhubaneswar',
    drop: 'Forest Park, Bhubaneswar',
    fareEstimate: 80,
    driver: 'Amit Singh',
    driverPhone: '+91 90123 45670',
    eta: '6 min',
    waitingSince: '3 min ago',
    waitSeconds: 180,
  },
]

function formatWait(seconds: number) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}m ${s.toString().padStart(2, '0')}s`
}

function waitSeverity(seconds: number) {
  if (seconds >= 300) return 'critical'
  if (seconds >= 150) return 'warning'
  return 'normal'
}

const severityStyles = {
  normal: { bg: '#ECFDF5', text: '#059669', dot: '#10B981' },
  warning: { bg: '#FFFBEB', text: '#B45309', dot: '#F59E0B' },
  critical: { bg: '#FEF2F2', text: '#DC2626', dot: '#EF4444' },
}

function WaitBadge({ seconds }: { seconds: number }) {
  const sev = waitSeverity(seconds) as keyof typeof severityStyles
  const style = severityStyles[sev]
  return (
    <span
      style={{ backgroundColor: style.bg, color: style.text }}
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
    >
      <span style={{ backgroundColor: style.dot }} className="h-1.5 w-1.5 rounded-full" />
      {formatWait(seconds)}
    </span>
  )
}

function RouteLine({ pickup, drop }: { pickup: string; drop: string }) {
  return (
    <div className="flex flex-col gap-1.5 text-sm">
      <div className="flex items-start gap-2">
        <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
        <span className="text-gray-700 leading-snug">{pickup}</span>
      </div>
      <div className="ml-[3px] h-3 w-px bg-gray-300" />
      <div className="flex items-start gap-2">
        <span className="mt-0.5 h-2 w-2 shrink-0 rounded-sm bg-blue-600" />
        <span className="text-gray-700 leading-snug">{drop}</span>
      </div>
    </div>
  )
}

function ActionMenu({
  onAssign,
  onCancel,
  onCall,
}: {
  onAssign?: () => void
  onCancel: () => void
  onCall: () => void
}) {
  const [open, setOpen] = useState(false)
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        Actions
        <ChevronDown className="h-3.5 w-3.5" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-20 mt-1 w-44 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
            {onAssign && (
              <button
                onClick={() => {
                  onAssign()
                  setOpen(false)
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
              >
                <Car className="h-3.5 w-3.5" />
                Assign driver
              </button>
            )}
            <button
              onClick={() => {
                onCall()
                setOpen(false)
              }}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
            >
              <Phone className="h-3.5 w-3.5" />
              Call passenger
            </button>
            <button
              onClick={() => {
                onCancel()
                setOpen(false)
              }}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
            >
              <UserX className="h-3.5 w-3.5" />
              Cancel request
            </button>
          </div>
        </>
      )}
    </div>
  )
}

function SectionCard({
  title,
  liveDotColor,
  count,
  children,
}: {
  title: string
  liveDotColor: string
  count: number
  children: React.ReactNode
}) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
        <div className="flex items-center gap-2">
          <span style={{ backgroundColor: liveDotColor }} className="h-2 w-2 rounded-full" />
          <h2 className="text-base font-semibold text-gray-900">{title}</h2>
        </div>
        <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-600">
          {count}
        </span>
      </div>
      {children}
    </div>
  )
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
        <Clock className="h-5 w-5 text-gray-400" />
      </div>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  )
}

export default function PassengersWaitingPage() {
  const [query, setQuery] = useState('')
  const [cancelTarget, setCancelTarget] = useState<any>(null)

  const filteredSearching = useMemo(
    () =>
      SEARCHING_PASSENGERS.filter((p) =>
        `${p.passenger} ${p.id} ${p.pickup} ${p.drop}`.toLowerCase().includes(query.toLowerCase()),
      ),
    [query],
  )

  const filteredMatched = useMemo(
    () =>
      MATCHED_PASSENGERS.filter((p) =>
        `${p.passenger} ${p.id} ${p.pickup} ${p.drop} ${p.driver}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      ),
    [query],
  )

  const totalWaiting = SEARCHING_PASSENGERS.length + MATCHED_PASSENGERS.length

  return (
    <AdminShell title="Passengers Waiting">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Passengers Waiting</h1>
          <p className="mt-1 text-sm text-gray-500">
            {totalWaiting} passengers waiting right now across Odisha
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="mb-2 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            <span className="text-sm text-gray-500">Live Now</span>
          </div>
          <p className="text-sm text-gray-600">Passengers waiting right now</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">{totalWaiting}</p>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="mb-2 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-blue-500" />
            <span className="text-sm text-gray-500">Searching</span>
          </div>
          <p className="text-sm text-gray-600">No driver accepted yet</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">{SEARCHING_PASSENGERS.length}</p>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="mb-2 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-sm text-gray-500">Matched</span>
          </div>
          <p className="text-sm text-gray-600">Driver assigned, arriving</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">{MATCHED_PASSENGERS.length}</p>
        </div>
      </div>

      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by passenger, request ID, or address..."
            className="w-full rounded-full border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>

      <div className="mb-6">
        <SectionCard title="Searching for a driver" liveDotColor="#3B82F6" count={filteredSearching.length}>
          {filteredSearching.length === 0 ? (
            <EmptyState label="No passengers currently searching for a driver." />
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredSearching.map((p) => (
                <div
                  key={p.id}
                  className="grid grid-cols-1 gap-4 px-6 py-4 sm:grid-cols-[1fr_1.4fr_auto_auto_auto] sm:items-center"
                >
                  <div>
                    <p className="text-xs font-medium text-blue-600">{p.id}</p>
                    <p className="text-sm font-semibold text-gray-900">{p.passenger}</p>
                    <p className="text-xs text-gray-500">{p.phone}</p>
                  </div>

                  <RouteLine pickup={p.pickup} drop={p.drop} />

                  <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-900">
                    <IndianRupee className="h-3.5 w-3.5 text-gray-400" />
                    {p.fareEstimate}
                  </div>

                  <WaitBadge seconds={p.waitSeconds} />

                  <ActionMenu onCall={() => {}} onCancel={() => setCancelTarget(p)} />
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      </div>

      <div>
        <SectionCard title="Driver assigned · en route" liveDotColor="#10B981" count={filteredMatched.length}>
          {filteredMatched.length === 0 ? (
            <EmptyState label="No passengers currently waiting on an assigned driver." />
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredMatched.map((p) => (
                <div
                  key={p.id}
                  className="grid grid-cols-1 gap-4 px-6 py-4 sm:grid-cols-[1fr_1.4fr_auto_auto_auto_auto] sm:items-center"
                >
                  <div>
                    <p className="text-xs font-medium text-blue-600">{p.id}</p>
                    <p className="text-sm font-semibold text-gray-900">{p.passenger}</p>
                    <p className="text-xs text-gray-500">{p.phone}</p>
                  </div>

                  <RouteLine pickup={p.pickup} drop={p.drop} />

                  <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-900">
                    <IndianRupee className="h-3.5 w-3.5 text-gray-400" />
                    {p.fareEstimate}
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-900">{p.driver}</p>
                    <p className="flex items-center gap-1 text-xs text-gray-500">
                      <Car className="h-3 w-3" />
                      ETA {p.eta}
                    </p>
                  </div>

                  <WaitBadge seconds={p.waitSeconds} />

                  <ActionMenu onCall={() => {}} onCancel={() => setCancelTarget(p)} />
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      </div>

      {cancelTarget && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-start justify-between">
              <h3 className="text-base font-semibold text-gray-900">Cancel this request?</h3>
              <button onClick={() => setCancelTarget(null)} className="text-gray-400 hover:text-gray-600">
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="mb-5 text-sm text-gray-600">
              {cancelTarget.passenger}&apos;s ride request ({cancelTarget.id}) will be cancelled and
              they&apos;ll be notified to request again.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setCancelTarget(null)}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Keep waiting
              </button>
              <button
                onClick={() => setCancelTarget(null)}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                Cancel request
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  )
}