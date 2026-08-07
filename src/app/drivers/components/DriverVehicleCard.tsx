'use client'

import { Car } from 'lucide-react'
import { Driver } from '../[id]/types'

interface DriverVehicleCardProps {
  driver: Driver
}

const VEHICLE_BADGE: Record<string, string> = {
  auto: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  bike: 'bg-green-50 text-green-700 border-green-200',
  car:  'bg-slate-100 text-slate-700 border-slate-200',
}

const VEHICLE_ICON: Record<string, string> = {
  auto: '🛺',
  bike: '🏍️',
  car: '🚗',
}

export function DriverVehicleCard({ driver }: DriverVehicleCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-800 mb-4 flex items-center gap-2">
        <Car className="h-4 w-4 text-blue-500" />
        Vehicle Information
      </h3>
      <div className="space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <span className="text-xs text-slate-500">Vehicle Type</span>
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium capitalize border ${VEHICLE_BADGE[driver.vehicleType]}`}>
            {VEHICLE_ICON[driver.vehicleType]} {driver.vehicleType}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">Model</span>
          <span className="font-medium text-slate-700">{driver.vehicleModel}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">Registration Number</span>
          <span className="font-mono text-sm font-medium text-slate-700">{driver.vehicleNumber}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">Color</span>
          <span className="font-medium text-slate-700">{driver.vehicleColor}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">Manufacturing Year</span>
          <span className="font-medium text-slate-700">{driver.vehicleYear}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">License Number</span>
          <span className="font-mono text-xs font-medium text-slate-700">{driver.licenseNumber}</span>
        </div>
      </div>
    </div>
  )
}