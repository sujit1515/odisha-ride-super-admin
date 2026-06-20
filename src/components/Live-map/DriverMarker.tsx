'use client';
import { AdvancedMarker, InfoWindow } from '@vis.gl/react-google-maps'
import type { OnlineDriver } from '@/types/index'

interface Props {
  driver:     OnlineDriver
  isSelected: boolean
  onSelect:   (driver: OnlineDriver) => void
  onClose:    () => void
}

export function DriverMarker({ driver, isSelected, onSelect, onClose }: Props) {
  return (
    <AdvancedMarker
      position={{ lat: driver.latitude, lng: driver.longitude }}
      onClick={() => onSelect(driver)}
    >
      {/* Pulsing marker */}
      <div className="relative w-10 h-10">
        <div
          className="absolute inset-0 rounded-full bg-blue-500/25"
          style={{ animation: 'driverPulse 1.8s ease-out infinite' }}
        />
        <div
          className="absolute inset-[6px] rounded-full bg-blue-500/35"
          style={{ animation: 'driverPulse 1.8s ease-out infinite 0.3s' }}
        />
        <div className="absolute inset-[10px] rounded-full bg-blue-600
                        border-2 border-white shadow-lg shadow-blue-500/50
                        flex items-center justify-center">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="white">
            <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42
                     1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0
                     .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83
                     0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16
                     6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67
                     1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
          </svg>
        </div>
      </div>

      {/* Info window when marker is clicked */}
      {isSelected && (
        <InfoWindow
          position={{ lat: driver.latitude, lng: driver.longitude }}
          onCloseClick={onClose}
        >
          <div className="p-1 min-w-[140px]">
            <p className="font-bold text-slate-800 text-sm">{driver.fullName}</p>
            <p className="text-xs text-slate-500 mt-0.5">{driver.driverId}</p>
            <p className="text-xs text-slate-400 mt-1">
              Updated: {new Date(driver.updatedAt).toLocaleTimeString()}
            </p>
            <div className="mt-2 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-xs text-emerald-600 font-medium">Online</span>
            </div>
          </div>
        </InfoWindow>
      )}
    </AdvancedMarker>
  )
}