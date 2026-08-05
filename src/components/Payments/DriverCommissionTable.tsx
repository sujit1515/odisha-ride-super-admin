'use client'

import { useState } from 'react'
import {
  Search,
  Filter,
  Eye,
  PlusCircle,
  Car,
  Phone,
  AlertTriangle,
  CheckCircle2,
  UserX,
  IndianRupee,
  RefreshCw,
  SlidersHorizontal,
  ChevronDown,
  Lock,
  Unlock,
} from 'lucide-react'
import { DriverCommission, DriverStatus, VehicleType } from './types'

interface DriverCommissionTableProps {
  drivers: DriverCommission[]
  onViewDriver: (driver: DriverCommission) => void
  onReceivePayment: (driver: DriverCommission) => void
  onToggleBlock?: (driverId: string, block: boolean) => void
  isLoading?: boolean
  selectedStatus?: string
  onStatusChange?: (status: string) => void
}

export default function DriverCommissionTable({
  drivers,
  onViewDriver,
  onReceivePayment,
  onToggleBlock,
  isLoading = false,
  selectedStatus = 'All',
  onStatusChange,
}: DriverCommissionTableProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>(selectedStatus)
  const [vehicleFilter, setVehicleFilter] = useState<string>('All')

  // Keep local filter synced with prop if passed
  const currentStatusFilter = onStatusChange ? selectedStatus : statusFilter
  const setStatus = (val: string) => {
    if (onStatusChange) {
      onStatusChange(val)
    } else {
      setStatusFilter(val)
    }
  }

  // Filtered dataset
  const filteredDrivers = drivers.filter((driver) => {
    const matchesSearch =
      driver.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.phone.includes(searchTerm) ||
      driver.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.driverId.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus =
      currentStatusFilter === 'All' || driver.status === currentStatusFilter

    const matchesVehicle =
      vehicleFilter === 'All' || driver.vehicleType === vehicleFilter

    return matchesSearch && matchesStatus && matchesVehicle
  })

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden transition-all">
      {/* Search & Filter Header Bar */}
      <div className="p-4 md:p-6 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Search Box */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search driver by name, phone, ID, or vehicle no..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-3 text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-3 overflow-x-auto pb-1 lg:pb-0 shrink-0 flex-wrap">
          {/* Status Filter Tabs */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl">
            {['All', 'Active', 'Warning', 'Blocked'].map((st) => {
              const active = currentStatusFilter === st
              return (
                <button
                  key={st}
                  onClick={() => setStatus(st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    active
                      ? 'bg-white text-blue-600 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {st}
                  {st !== 'All' && (
                    <span className="ml-1 text-[10px] opacity-75">
                      ({drivers.filter((d) => d.status === st).length})
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          {/* Vehicle Type Filter Dropdown */}
          <div className="relative">
            <select
              value={vehicleFilter}
              onChange={(e) => setVehicleFilter(e.target.value)}
              className="pl-3 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer appearance-none"
            >
              <option value="All">All Vehicles</option>
              <option value="Auto">Auto</option>
              <option value="Bike">Bike</option>
              <option value="Cab Sedan">Cab Sedan</option>
              <option value="Cab SUV">Cab SUV</option>
              <option value="EV Auto">EV Auto</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-2.5 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Table Data */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <th className="py-3.5 px-4 md:px-6">Driver Info</th>
              <th className="py-3.5 px-4">Vehicle</th>
              <th className="py-3.5 px-4 text-right">Outstanding (₹)</th>
              <th className="py-3.5 px-4 text-right">Limit (₹)</th>
              <th className="py-3.5 px-4 text-right">Remaining (₹)</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4">Last Payment</th>
              <th className="py-3.5 px-4 md:px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {isLoading ? (
              // Skeleton rows
              Array.from({ length: 5 }).map((_, idx) => (
                <tr key={idx} className="animate-pulse">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-slate-200 rounded-full" />
                      <div className="space-y-1">
                        <div className="h-4 w-32 bg-slate-200 rounded" />
                        <div className="h-3 w-20 bg-slate-100 rounded" />
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="h-4 w-24 bg-slate-200 rounded" />
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="h-4 w-16 bg-slate-200 rounded ml-auto" />
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="h-4 w-16 bg-slate-200 rounded ml-auto" />
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="h-4 w-16 bg-slate-200 rounded ml-auto" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="h-6 w-20 bg-slate-200 rounded-full" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="h-4 w-28 bg-slate-200 rounded" />
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="h-8 w-24 bg-slate-200 rounded-xl ml-auto" />
                  </td>
                </tr>
              ))
            ) : filteredDrivers.length === 0 ? (
              // Empty State
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-500">
                  <div className="max-w-xs mx-auto space-y-3">
                    <div className="h-12 w-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                      <Search className="h-6 w-6" />
                    </div>
                    <h3 className="font-bold text-slate-800 text-base">No drivers match your criteria</h3>
                    <p className="text-xs text-slate-400">
                      Try adjusting your search query, vehicle filter, or status filter.
                    </p>
                    <button
                      onClick={() => {
                        setSearchTerm('')
                        setStatus('All')
                        setVehicleFilter('All')
                      }}
                      className="px-4 py-2 rounded-xl bg-blue-50 text-blue-600 text-xs font-semibold hover:bg-blue-100 transition-colors cursor-pointer"
                    >
                      Reset All Filters
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              filteredDrivers.map((driver) => {
                const percent = Math.min(
                  100,
                  Math.round((driver.outstandingCommission / driver.commissionLimit) * 100)
                )

                return (
                  <tr
                    key={driver.driverId}
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    {/* Driver info */}
                    <td className="py-4 px-4 md:px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={driver.avatar}
                          alt={driver.driverName}
                          className="h-10 w-10 rounded-full object-cover border border-slate-200 shrink-0"
                        />
                        <div className="min-w-0">
                          <h4 className="font-semibold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                            {driver.driverName}
                          </h4>
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <span className="font-mono text-slate-400">{driver.driverId}</span>
                            <span>&bull;</span>
                            <span className="flex items-center gap-1">
                              <Phone className="h-3 w-3 text-slate-400" />
                              {driver.phone}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Vehicle */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="text-xs">
                        <span className="font-semibold text-slate-800 block">
                          {driver.vehicleType}
                        </span>
                        <span className="font-mono text-slate-500">{driver.vehicleNumber}</span>
                      </div>
                    </td>

                    {/* Outstanding */}
                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <span className="font-extrabold text-slate-900 text-base">
                        ₹{driver.outstandingCommission.toLocaleString('en-IN')}
                      </span>
                      {/* Mini visual indicator */}
                      <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden ml-auto mt-1">
                        <div
                          style={{ width: `${percent}%` }}
                          className={`h-full ${
                            percent >= 100
                              ? 'bg-rose-500'
                              : percent >= 80
                              ? 'bg-amber-500'
                              : 'bg-emerald-500'
                          }`}
                        />
                      </div>
                    </td>

                    {/* Limit */}
                    <td className="py-4 px-4 text-right whitespace-nowrap font-medium text-slate-600 text-sm">
                      ₹{driver.commissionLimit.toLocaleString('en-IN')}
                    </td>

                    {/* Remaining */}
                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <span
                        className={`font-bold text-sm ${
                          driver.remainingAmount === 0
                            ? 'text-rose-600'
                            : driver.remainingAmount <= 200
                            ? 'text-amber-600'
                            : 'text-emerald-600'
                        }`}
                      >
                        ₹{driver.remainingAmount.toLocaleString('en-IN')}
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                          driver.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : driver.status === 'Warning'
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            driver.status === 'Active'
                              ? 'bg-emerald-500'
                              : driver.status === 'Warning'
                              ? 'bg-amber-500 animate-pulse'
                              : 'bg-rose-500'
                          }`}
                        />
                        {driver.status}
                      </span>
                    </td>

                    {/* Last Payment */}
                    <td className="py-4 px-4 whitespace-nowrap text-xs text-slate-500">
                      <span className="font-semibold text-slate-800 block">
                        ₹{driver.lastPaymentAmount}
                      </span>
                      <span>{driver.lastPaymentDate}</span>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 md:px-6 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onViewDriver(driver)}
                          title="View Details"
                          className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold text-xs transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="h-4 w-4 text-slate-500" />
                          <span className="hidden sm:inline">View</span>
                        </button>

                        <button
                          onClick={() => onReceivePayment(driver)}
                          title="Receive Payment"
                          className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                        >
                          <PlusCircle className="h-4 w-4" />
                          <span>Receive</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span>
          Showing <strong>{filteredDrivers.length}</strong> of <strong>{drivers.length}</strong> drivers
        </span>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
          <span>Commission Limit Policy Active (Warning at ₹1.2k, Block at ₹1.5k)</span>
        </div>
      </div>
    </div>
  )
}
