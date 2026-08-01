// ─────────────────────────────────────────────────────────────────────────────
// FILE: components/Support/TicketFiltersBar.tsx
// ─────────────────────────────────────────────────────────────────────────────

import type { TicketFilters, TicketCategory } from '@/api/types/types'
import { Download } from 'lucide-react'

const STATUSES   = ['All', 'Open', 'In Progress', 'Resolved', 'Closed']
const PRIORITIES = ['All', 'High', 'Medium', 'Low']
const USER_TYPES = ['All', 'passenger', 'driver']
const CATEGORIES: (TicketCategory | 'All')[] = [
  'All', 'Payment Issues', 'Ride Issues', 'Driver Complaints',
  'Passenger Complaints', 'Technical Issues', 'Account Issues',
  'Lost & Found', 'Refund Requests', 'Promotions & Coupons', 'Other',
]

interface Props {
  searchInput:    string
  setSearchInput: (v: string) => void
  onSearch:       () => void
  filters:        TicketFilters
  onFilterChange: (key: keyof TicketFilters, value: any) => void
  onExport:       (format: 'csv' | 'excel' | 'pdf') => void
}

export default function TicketFiltersBar({
  searchInput, setSearchInput, onSearch, filters, onFilterChange, onExport,
}: Props) {
  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
      {/* ── Row 1: Search + Export ── */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="flex gap-2 flex-1">
          <input
            type="text"
            placeholder="Search by ID, name, email, phone..."
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && onSearch()}
            className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm
                       focus:outline-none focus:ring-2 focus:ring-slate-300"
          />
          <button
            onClick={onSearch}
            className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm
                       font-medium hover:bg-slate-700 transition-colors"
          >
            Search
          </button>
        </div>

        {/* Export buttons */}
        <div className="flex gap-2">
          {(['csv', 'excel', 'pdf'] as const).map(fmt => (
            <button
              key={fmt}
              onClick={() => onExport(fmt)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border
                         border-slate-200 text-xs font-medium text-slate-600
                         hover:bg-slate-50 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              {fmt.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* ── Row 2: Filters ── */}
      <div className="flex flex-wrap gap-2">
        <Select
          value={filters.status ?? 'All'}
          options={STATUSES}
          onChange={v => onFilterChange('status', v)}
          label="Status"
        />
        <Select
          value={filters.priority ?? 'All'}
          options={PRIORITIES}
          onChange={v => onFilterChange('priority', v)}
          label="Priority"
        />
        <Select
          value={filters.userType ?? 'All'}
          options={USER_TYPES}
          onChange={v => onFilterChange('userType', v)}
          label="User Type"
        />
        <Select
          value={filters.category ?? 'All'}
          options={CATEGORIES}
          onChange={v => onFilterChange('category', v)}
          label="Category"
        />

        {/* Date range */}
        <input
          type="date"
          value={filters.dateFrom ?? ''}
          onChange={e => onFilterChange('dateFrom', e.target.value)}
          className="border border-slate-200 rounded-lg px-3 py-1.5 text-xs
                     text-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-300"
        />
        <span className="self-center text-xs text-slate-400">to</span>
        <input
          type="date"
          value={filters.dateTo ?? ''}
          onChange={e => onFilterChange('dateTo', e.target.value)}
          className="border border-slate-200 rounded-lg px-3 py-1.5 text-xs
                     text-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-300"
        />

        {/* Clear filters */}
        <button
          onClick={() => {
            onFilterChange('status',   'All')
            onFilterChange('priority', 'All')
            onFilterChange('userType', 'All')
            onFilterChange('category', 'All')
            onFilterChange('dateFrom', '')
            onFilterChange('dateTo',   '')
          }}
          className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-800
                     border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
        >
          Clear
        </button>
      </div>
    </div>
  )
}

function Select({
  value, options, onChange, label,
}: {
  value: string
  options: string[]
  onChange: (v: string) => void
  label: string
}) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="border border-slate-200 rounded-lg px-3 py-1.5 text-xs
                 text-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-300
                 bg-white"
    >
      {options.map(o => (
        <option key={o} value={o}>
          {label}: {o === 'All' ? 'All' : o}
        </option>
      ))}
    </select>
  )
}