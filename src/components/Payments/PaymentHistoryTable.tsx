'use client'

import { useState } from 'react'
import {
  Search,
  Calendar,
  Filter,
  Download,
  Receipt,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  X,
  Printer,
  Copy,
  Check,
} from 'lucide-react'
import { PaymentHistoryItem, PaymentMethod, PaymentStatus } from './types'

interface PaymentHistoryTableProps {
  payments: PaymentHistoryItem[]
}

export default function PaymentHistoryTable({ payments }: PaymentHistoryTableProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [dateRange, setDateRange] = useState('All Time')
  const [methodFilter, setMethodFilter] = useState<string>('All')
  const [statusFilter, setStatusFilter] = useState<string>('All')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(6)
  const [selectedReceipt, setSelectedReceipt] = useState<PaymentHistoryItem | null>(null)
  const [copied, setCopied] = useState(false)

  // Filter logic
  const filtered = payments.filter((item) => {
    const matchesSearch =
      item.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.driverPhone.includes(searchTerm) ||
      item.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.receiptNo.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesMethod = methodFilter === 'All' || item.paymentMethod === methodFilter
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter

    return matchesSearch && matchesMethod && matchesStatus
  })

  // Pagination calculation
  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleCopyRef = (ref: string) => {
    navigator.clipboard.writeText(ref)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      {/* Filters Bar */}
      <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-slate-200/80 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Receipt className="h-5 w-5 text-blue-600" />
            <span>Driver Payment Logs</span>
          </h2>

          <button
            onClick={() => {
              const csv = [
                'Receipt No,Date,Driver,Phone,Amount,Method,Reference,Status,Collected By',
                ...filtered.map(
                  (p) =>
                    `"${p.receiptNo}","${p.date}","${p.driverName}","${p.driverPhone}",${p.amount},"${p.paymentMethod}","${p.referenceNumber}","${p.status}","${p.collectedBy}"`
                ),
              ].join('\n')
              const blob = new Blob([csv], { type: 'text/csv' })
              const url = URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = `Payment_History_${new Date().toISOString().slice(0, 10)}.csv`
              a.click()
            }}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 text-xs font-semibold hover:bg-slate-100 transition-colors cursor-pointer self-start md:self-auto"
          >
            <Download className="h-4 w-4 text-slate-500" />
            <span>Export Filtered CSV</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
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
              placeholder="Search driver, phone, UTR..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Date Range Dropdown */}
          <div className="relative">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="All Time">All Time</option>
              <option value="Today">Today</option>
              <option value="Yesterday">Yesterday</option>
              <option value="Last 7 Days">Last 7 Days</option>
              <option value="Last 30 Days">Last 30 Days</option>
            </select>
          </div>

          {/* Payment Method Filter */}
          <div className="relative">
            <select
              value={methodFilter}
              onChange={(e) => {
                setMethodFilter(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="All">All Payment Methods</option>
              <option value="UPI">UPI</option>
              <option value="Cash">Cash</option>
              <option value="Razorpay">Razorpay</option>
              <option value="Bank Transfer">Bank Transfer</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Success">Success</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
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
                <th className="py-3.5 px-4 md:px-6">Receipt & Date</th>
                <th className="py-3.5 px-4">Driver Name</th>
                <th className="py-3.5 px-4 text-right">Amount Paid</th>
                <th className="py-3.5 px-4">Method</th>
                <th className="py-3.5 px-4">Reference No / UTR</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Collected By</th>
                <th className="py-3.5 px-4 md:px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    No payment history matches your filters.
                  </td>
                </tr>
              ) : (
                paginated.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                    onClick={() => setSelectedReceipt(item)}
                  >
                    <td className="py-4 px-4 md:px-6 font-medium whitespace-nowrap">
                      <span className="font-mono font-bold text-slate-800 block group-hover:text-blue-600">
                        {item.receiptNo}
                      </span>
                      <span className="text-slate-400 text-[11px]">{item.date}</span>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="font-semibold text-slate-900 block">{item.driverName}</span>
                      <span className="text-slate-500 text-[11px]">{item.driverPhone}</span>
                    </td>

                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <span className="font-extrabold text-slate-900 text-sm">
                        ₹{item.amount.toLocaleString('en-IN')}
                      </span>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-lg text-[11px] font-semibold ${
                          item.paymentMethod === 'UPI'
                            ? 'bg-blue-50 text-blue-700'
                            : item.paymentMethod === 'Cash'
                            ? 'bg-emerald-50 text-emerald-700'
                            : item.paymentMethod === 'Razorpay'
                            ? 'bg-purple-50 text-purple-700'
                            : 'bg-amber-50 text-amber-800'
                        }`}
                      >
                        {item.paymentMethod}
                      </span>
                    </td>

                    <td className="py-4 px-4 font-mono text-slate-700 whitespace-nowrap max-w-[180px] truncate">
                      {item.referenceNumber}
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          item.status === 'Success'
                            ? 'bg-emerald-100 text-emerald-700'
                            : item.status === 'Pending'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-700'
                        }`}
                      >
                        {item.status === 'Success' && <CheckCircle2 className="h-3 w-3" />}
                        {item.status === 'Pending' && <Clock className="h-3 w-3" />}
                        {item.status === 'Failed' && <XCircle className="h-3 w-3" />}
                        {item.status}
                      </span>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap text-slate-600">
                      {item.collectedBy}
                    </td>

                    <td className="py-4 px-4 md:px-6 text-right whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedReceipt(item)
                        }}
                        className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-blue-50 hover:text-blue-600 text-slate-700 font-semibold text-[11px] transition-colors cursor-pointer"
                      >
                        Receipt
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            Showing <strong>{(currentPage - 1) * itemsPerPage + 1}</strong> to{' '}
            <strong>{Math.min(currentPage * itemsPerPage, filtered.length)}</strong> of{' '}
            <strong>{filtered.length}</strong> transactions
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

      {/* Printable Receipt Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-fade-in">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Receipt className="h-5 w-5 text-blue-400" />
                <h3 className="font-bold text-base">Payment Receipt Details</h3>
              </div>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="text-center pb-3 border-b border-slate-100">
                <h4 className="text-lg font-bold text-slate-900">Odisha Ride Super Admin</h4>
                <p className="text-slate-400">Driver Commission Payment Receipt</p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Receipt No:</span>
                  <span className="font-mono font-bold text-slate-900">{selectedReceipt.receiptNo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Date & Time:</span>
                  <span className="font-medium text-slate-800">{selectedReceipt.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Driver Name:</span>
                  <span className="font-semibold text-slate-900">{selectedReceipt.driverName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Phone:</span>
                  <span className="text-slate-800">{selectedReceipt.driverPhone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Payment Mode:</span>
                  <span className="font-bold text-blue-600">{selectedReceipt.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Reference / UTR:</span>
                  <span className="font-mono text-slate-700">{selectedReceipt.referenceNumber}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-200">
                  <span className="font-bold text-slate-800 text-sm">Amount Paid:</span>
                  <span className="font-extrabold text-emerald-600 text-base">
                    ₹{selectedReceipt.amount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleCopyRef(selectedReceipt.referenceNumber)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                  <span>{copied ? 'Copied UTR' : 'Copy UTR'}</span>
                </button>
                <button
                  onClick={() => window.print()}
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                >
                  <Printer className="h-4 w-4" />
                  <span>Print Receipt</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
