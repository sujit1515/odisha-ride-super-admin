'use client'

import { TrendingUp, IndianRupee, Award, XCircle, CheckCircle2, AlertCircle } from 'lucide-react'
import { Driver } from '../[id]/types'

interface DriverOverviewProps {
  driver: Driver
}

export function DriverOverview({ driver }: DriverOverviewProps) {
  const cancellationRate = driver.totalRides
    ? Math.round((driver.cancellations / driver.totalRides) * 100)
    : 0

  return (
    <div className="space-y-5">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-blue-600" />
            <p className="text-xs text-blue-700 font-semibold uppercase tracking-wide">Total Rides</p>
          </div>
          <p className="text-2xl font-bold text-blue-800">{driver.totalRides}</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-4 border border-emerald-200 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <IndianRupee className="h-4 w-4 text-emerald-600" />
            <p className="text-xs text-emerald-700 font-semibold uppercase tracking-wide">Earnings</p>
          </div>
          <p className="text-2xl font-bold text-emerald-800">₹{driver.totalEarnings.toLocaleString()}</p>
        </div>
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-4 border border-amber-200 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Award className="h-4 w-4 text-amber-600" />
            <p className="text-xs text-amber-700 font-semibold uppercase tracking-wide">Rating</p>
          </div>
          <p className="text-2xl font-bold text-amber-800">{driver.rating} / 5</p>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4 border border-red-200 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <XCircle className="h-4 w-4 text-red-500" />
            <p className="text-xs text-red-600 font-semibold uppercase tracking-wide">Cancellation Rate</p>
          </div>
          <p className="text-2xl font-bold text-red-700">{cancellationRate}%</p>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-blue-500" />
          Performance Insights
        </h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-600">Completion Rate</span>
              <span className="font-semibold text-slate-800">{100 - cancellationRate}%</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${100 - cancellationRate}%` }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-600">Average Rating</span>
              <span className="font-semibold text-slate-800">{driver.rating} / 5</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500 rounded-full transition-all duration-500" style={{ width: `${(driver.rating / 5) * 100}%` }} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="text-center p-3 bg-slate-50 rounded-lg">
              <p className="text-xs text-slate-500 mb-1">Avg. Daily Rides</p>
              <p className="text-lg font-bold text-slate-800">
                {Math.round(driver.totalRides / 30)} rides
              </p>
            </div>
            <div className="text-center p-3 bg-slate-50 rounded-lg">
              <p className="text-xs text-slate-500 mb-1">Avg. Earnings/Ride</p>
              <p className="text-lg font-bold text-slate-800">
                ₹{Math.round(driver.totalEarnings / driver.totalRides)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}