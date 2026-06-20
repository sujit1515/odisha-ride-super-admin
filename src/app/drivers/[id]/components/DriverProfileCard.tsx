'use client'

import { Phone, Mail, MapPin, Calendar, Star } from 'lucide-react'
import { Driver } from '../types'

interface DriverProfileCardProps {
  driver: Driver
}

export function DriverProfileCard({ driver }: DriverProfileCardProps) {
  const getStatusColor = () => {
    if (driver.isBlocked) return 'bg-red-100 text-red-800 border-red-200'
    if (driver.status === 'pending') return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    if (driver.status === 'rejected') return 'bg-rose-100 text-rose-800 border-rose-200'
    if (driver.isOnline) return 'bg-emerald-100 text-emerald-800 border-emerald-200'
    return 'bg-gray-100 text-gray-800 border-gray-200'
  }

  const getStatusText = () => {
    if (driver.isBlocked) return 'Blocked'
    if (driver.status === 'pending') return 'Pending Approval'
    if (driver.status === 'rejected') return 'Rejected'
    if (driver.isOnline) return 'Online'
    return 'Offline'
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <div className="flex flex-col items-center text-center">
        <div className="relative mb-4">
          <div className="h-24 w-24 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
            {driver.fullName.charAt(0)}
          </div>
          <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white
            ${driver.isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'}`} />
        </div>
        <h2 className="text-xl font-bold text-slate-800">{driver.fullName}</h2>
        <p className="text-sm text-slate-500 mt-0.5 font-mono">{driver.driverId}</p>
        <div className="mt-3">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor()}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${
              driver.isOnline ? 'bg-emerald-500' : 
              driver.isBlocked ? 'bg-red-500' : 
              driver.status === 'pending' ? 'bg-yellow-500' : 'bg-gray-500'
            }`} />
            {getStatusText()}
          </span>
        </div>
        <div className="flex items-center gap-1 mt-3">
          <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
          <span className="text-sm font-semibold text-slate-700">{driver.rating}</span>
          <span className="text-xs text-slate-400">({driver.totalRides} rides)</span>
        </div>
      </div>

      <div className="border-t border-slate-100 mt-5 pt-5 space-y-3">
        <div className="flex items-center gap-3 text-sm">
          <Phone className="h-4 w-4 text-slate-400" />
          <span className="text-slate-600">{driver.phone}</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <Mail className="h-4 w-4 text-slate-400" />
          <span className="text-slate-600 break-all">{driver.email}</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <MapPin className="h-4 w-4 text-slate-400" />
          <span className="text-slate-600">{driver.city}</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <Calendar className="h-4 w-4 text-slate-400" />
          <span className="text-slate-600">Joined {new Date(driver.joinedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
        </div>
      </div>
    </div>
  )
}