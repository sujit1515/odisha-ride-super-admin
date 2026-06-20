'use client'

import { TrendingUp, IndianRupee, Award, Star, Calendar, MapPin } from 'lucide-react'
import { Passenger } from '../types'

interface PassengerOverviewProps {
  passenger: Passenger
}

export function PassengerOverview({ passenger }: PassengerOverviewProps) {
  const averageSpendPerRide = passenger.totalRides && passenger.totalSpent
    ? Math.round(passenger.totalSpent / passenger.totalRides)
    : 0

  return (
    <div className="space-y-5">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-blue-600" />
            <p className="text-xs text-blue-700 font-semibold uppercase tracking-wide">Total Rides</p>
          </div>
          <p className="text-2xl font-bold text-blue-800">{passenger.totalRides || 0}</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-4 border border-emerald-200 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <IndianRupee className="h-4 w-4 text-emerald-600" />
            <p className="text-xs text-emerald-700 font-semibold uppercase tracking-wide">Total Spent</p>
          </div>
          <p className="text-2xl font-bold text-emerald-800">₹{passenger.totalSpent?.toLocaleString() || 0}</p>
        </div>
        {passenger.rating && (
          <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-4 border border-amber-200 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Star className="h-4 w-4 text-amber-600" />
              <p className="text-xs text-amber-700 font-semibold uppercase tracking-wide">Rating</p>
            </div>
            <p className="text-2xl font-bold text-amber-800">{passenger.rating} / 5</p>
          </div>
        )}
      </div>

      {/* Travel Insights */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <Award className="h-4 w-4 text-blue-500" />
          Travel Insights
        </h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-600">Total Distance Travelled</span>
              <span className="font-semibold text-slate-800">~{Math.round((passenger.totalRides || 0) * 7.5)} km</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.min(100, ((passenger.totalRides || 0) / 100) * 100)}%` }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-600">Average Spend per Ride</span>
              <span className="font-semibold text-slate-800">₹{averageSpendPerRide}</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${Math.min(100, (averageSpendPerRide / 500) * 100)}%` }} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="text-center p-3 bg-slate-50 rounded-lg">
              <p className="text-xs text-slate-500 mb-1">Most Frequent City</p>
              <p className="text-sm font-semibold text-slate-800">{passenger.city || '—'}</p>
            </div>
            <div className="text-center p-3 bg-slate-50 rounded-lg">
              <p className="text-xs text-slate-500 mb-1">Member Since</p>
              <p className="text-sm font-semibold text-slate-800">
                {new Date(passenger.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}