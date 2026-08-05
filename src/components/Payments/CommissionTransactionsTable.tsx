'use client'

import { useState } from 'react'
import {
  Search,
  Receipt,
  Car,
  CheckCircle2,
  Clock,
  RefreshCw,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Filter,
  Download,
} from 'lucide-react'
import { CommissionTransaction } from './types'

interface CommissionTransactionsTableProps {
  transactions: CommissionTransaction[]
}

export default function CommissionTransactionsTable({
  transactions,
}: CommissionTransactionsTableProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('All')
  const [vehicleFilter, setVehicleFilter] = useState<string>('All')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(8)

  const filtered = transactions.filter((t) => {
    const matchesSearch =
      t.rideId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === 'All' || t.status === statusFilter
    const matchesVehicle = vehicleFilter === 'All' || t.vehicleType === vehicleFilter

    return matchesSearch && matchesStatus && matchesVehicle
  })

  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  return (
    <div className="space-y-6">
      {/* Header & Filter Card */}
      <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-slate-200/80 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Receipt className="h-5 w-5 text-blue-600" />
              <span>Ride Commission Transactions Audit</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Itemized list of platform commissions calculated per completed ride
            </p>
          </div>

          <button
            onClick={() => {
              const csv = [
                'Ride ID,Driver,Vehicle,Fare,Commission %,Amount,Date,Status',
                ...filtered.map(
                  (t) =>
                    `"${t.rideId}","${t.driverName}","${t.vehicleType} - ${t.vehicleNumber}",${t.rideFare},${t.commissionPercent},${t.commissionAmount},"${t.createdDate}","${t.status}"`
                ),
              ].join('\n')
              const blob = new Blob([csv], { type: 'text/csv' })
              const url = URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = `Ride_Commissions_${new Date().toISOString().slice(0, 10)}.csv`
              a.click()
            }}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 text-xs font-semibold hover:bg-slate-100 transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Download className="h-4 w-4 text-slate-500" />
            <span>Export CSV</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1)
              }}
              placeholder="Search Ride ID, driver or vehicle..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="All">All Transaction Statuses</option>
              <option value="Charged">Charged</option>
              <option value="Pending">Pending</option>
              <option value="Waived">Waived</option>
              <option value="Refunded">Refunded</option>
            </select>
          </div>

          {/* Vehicle Filter */}
          <div>
            <select
              value={vehicleFilter}
              onChange={(e) => {
                setVehicleFilter(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="All">All Vehicle Types</option>
              <option value="Auto">Auto</option>
              <option value="Bike">Bike</option>
              <option value="Cab Sedan">Cab Sedan</option>
              <option value="Cab SUV">Cab SUV</option>
              <option value="EV Auto">EV Auto</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3.5 px-4 md:px-6">Ride ID</th>
                <th className="py-3.5 px-4">Driver</th>
                <th className="py-3.5 px-4">Vehicle</th>
                <th className="py-3.5 px-4 text-right">Ride Fare (₹)</th>
                <th className="py-3.5 px-4 text-center">Comm %</th>
                <th className="py-3.5 px-4 text-right">Comm Amount (₹)</th>
                <th className="py-3.5 px-4">Created Date</th>
                <th className="py-3.5 px-4 md:px-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    No ride commission records found matching your filters.
                  </td>
                </tr>
              ) : (
                paginated.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-4 md:px-6 font-mono font-bold text-blue-600 whitespace-nowrap">
                      {t.rideId}
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="font-semibold text-slate-900 block">{t.driverName}</span>
                      <span className="text-slate-400 text-[10px]">{t.driverId}</span>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="font-semibold text-slate-800 block">{t.vehicleType}</span>
                      <span className="font-mono text-slate-500 text-[11px]">{t.vehicleNumber}</span>
                    </td>

                    <td className="py-4 px-4 text-right font-medium text-slate-800 whitespace-nowrap">
                      ₹{t.rideFare.toLocaleString('en-IN')}
                    </td>

                    <td className="py-4 px-4 text-center whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold text-[11px]">
                        {t.commissionPercent}%
                      </span>
                    </td>

                    <td className="py-4 px-4 text-right font-extrabold text-slate-900 whitespace-nowrap">
                      ₹{t.commissionAmount.toLocaleString('en-IN')}
                    </td>

                    <td className="py-4 px-4 text-slate-500 whitespace-nowrap">
                      {t.createdDate}
                    </td>

                    <td className="py-4 px-4 md:px-6 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          t.status === 'Charged'
                            ? 'bg-emerald-100 text-emerald-700'
                            : t.status === 'Pending'
                            ? 'bg-amber-100 text-amber-800'
                            : t.status === 'Waived'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-rose-100 text-rose-700'
                        }`}
                      >
                        {t.status === 'Charged' && <CheckCircle2 className="h-3 w-3" />}
                        {t.status === 'Pending' && <Clock className="h-3 w-3" />}
                        {t.status === 'Waived' && <RefreshCw className="h-3 w-3" />}
                        {t.status === 'Refunded' && <XCircle className="h-3 w-3" />}
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div>
            Showing <strong>{(currentPage - 1) * itemsPerPage + 1}</strong> to{' '}
            <strong>{Math.min(currentPage * itemsPerPage, filtered.length)}</strong> of{' '}
            <strong>{filtered.length}</strong> ride commissions
          </div>

          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="p-2 rounded-xl border border-slate-200 disabled:opacity-40 hover:bg-slate-50 text-slate-700 cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <span className="font-semibold text-slate-800 px-2">
              Page {currentPage} of {totalPages}
            </span>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="p-2 rounded-xl border border-slate-200 disabled:opacity-40 hover:bg-slate-50 text-slate-700 cursor-pointer"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
