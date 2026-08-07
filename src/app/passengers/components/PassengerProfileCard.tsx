'use client'

import { Phone, Mail, MapPin, Calendar, Star, Award } from 'lucide-react'
import { Passenger } from '../[id]/types'

interface PassengerProfileCardProps {
  passenger: Passenger
}

export function PassengerProfileCard({ passenger }: PassengerProfileCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <div className="flex flex-col items-center text-center">
        <div className="relative mb-4">
          <div className="h-24 w-24 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
            {passenger.fullName.charAt(0)}
          </div>
          <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white
            ${passenger.isActive ? 'bg-emerald-500' : 'bg-gray-400'}`} />
        </div>
        <h2 className="text-xl font-bold text-slate-800">{passenger.fullName}</h2>
        <p className="text-sm text-slate-500 mt-0.5 font-mono">{passenger.passengerId}</p>
        <div className="mt-3">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
            passenger.isActive 
              ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
              : 'bg-gray-100 text-gray-800 border-gray-200'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${passenger.isActive ? 'bg-emerald-500' : 'bg-gray-500'}`} />
            {passenger.isActive ? 'Active' : 'Inactive'}
          </span>
          {passenger.isVerified && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border bg-blue-50 text-blue-800 border-blue-200 ml-2">
              <Award className="h-3 w-3" />
              Verified
            </span>
          )}
        </div>
        {passenger.rating && (
          <div className="flex items-center gap-1 mt-3">
            <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
            <span className="text-sm font-semibold text-slate-700">{passenger.rating}</span>
            <span className="text-xs text-slate-400">({passenger.totalRides} rides)</span>
          </div>
        )}
      </div>

      <div className="border-t border-slate-100 mt-5 pt-5 space-y-3">
        <div className="flex items-center gap-3 text-sm">
          <Mail className="h-4 w-4 text-slate-400" />
          <span className="text-slate-600 break-all">{passenger.email}</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <Phone className="h-4 w-4 text-slate-400" />
          <span className="text-slate-600">{passenger.phoneNumber}</span>
        </div>
        {passenger.city && (
          <div className="flex items-center gap-3 text-sm">
            <MapPin className="h-4 w-4 text-slate-400" />
            <span className="text-slate-600">{passenger.city}</span>
          </div>
        )}
        <div className="flex items-center gap-3 text-sm">
          <Calendar className="h-4 w-4 text-slate-400" />
          <span className="text-slate-600">Joined {new Date(passenger.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
        </div>
      </div>
    </div>
  )
}