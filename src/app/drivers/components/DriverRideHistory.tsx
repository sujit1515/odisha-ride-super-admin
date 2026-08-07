'use client'

import { Clock, Car, CheckCircle2, XCircle } from 'lucide-react'
import { RecentRide } from '../[id]/types'

interface DriverRideHistoryProps {
  rides: RecentRide[]
}

export function DriverRideHistory({ rides }: DriverRideHistoryProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
        <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
          <Clock className="h-4 w-4 text-blue-500" />
          Recent Ride History ({rides.length} rides)
        </h3>
      </div>
      {rides.length === 0 ? (
        <div className="text-center py-12">
          <Car className="h-12 w-12 text-slate-300 mx-auto mb-3" />
          <p className="text-sm text-slate-500">No ride history found for this driver</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr className="border-b border-slate-200">
                {['Ride ID', 'Customer', 'Pickup', 'Drop', 'Distance', 'Fare', 'Date', 'Status'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">
                    {h}
                  </th>
                ))}
               </tr>
            </thead>
            <tbody>
              {rides.map((ride, idx) => (
                <tr key={ride._id} className={`border-b border-slate-100 hover:bg-slate-50/50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}`}>
                  <td className="px-4 py-3 text-xs font-mono font-medium text-blue-600">
                    {ride.rideId}
                   </td>
                  <td className="px-4 py-3 text-sm text-slate-700">{ride.customerName || '—'}</td>
                  <td className="px-4 py-3 text-sm text-slate-600 max-w-[150px] truncate" title={ride.pickup}>{ride.pickup}</td>
                  <td className="px-4 py-3 text-sm text-slate-600 max-w-[150px] truncate" title={ride.drop}>{ride.drop}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{ride.distance ? `${ride.distance} km` : '—'}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-slate-800">₹{ride.fare}</td>
                  <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">
                    {new Date(ride.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                   </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                      ride.status === 'completed'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : ride.status === 'cancelled'
                        ? 'bg-red-50 text-red-600 border border-red-200'
                        : 'bg-orange-50 text-orange-600 border border-orange-200'
                    }`}>
                      {ride.status === 'completed' && <CheckCircle2 className="h-3 w-3" />}
                      {ride.status === 'cancelled' && <XCircle className="h-3 w-3" />}
                      {ride.status === 'ongoing' && <Clock className="h-3 w-3" />}
                      {ride.status.charAt(0).toUpperCase() + ride.status.slice(1)}
                    </span>
                   </td>
                 </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}