'use client'
import { useEffect, useState, useCallback } from 'react'
import { APIProvider, Map } from '@vis.gl/react-google-maps'
import AdminShell from '@/components/Common/AdminShell'
import type { OnlineDriver, LiveMapStats, } from '@/types/index'
import { DriverMarker } from '@/components/Live-map/DriverMarker'
import { fetchOnlineDriversApi } from '@/api/driver-location'



export default function LiveMapPage() {
  const [stats, setStats] = useState<LiveMapStats>({
    totalOnline: 0,
    drivers: [],
  })
  const [lastUpdated, setLastUpdated] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [selectedDriver, setSelectedDriver] = useState<OnlineDriver | null>(null)

  const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? ''

  
  // inside the component:
  const fetchOnlineDrivers = useCallback(async () => {
    try {
      const data = await fetchOnlineDriversApi()
      setStats(data)
      setLastUpdated(new Date().toLocaleTimeString())
    } catch (err) {
      console.error('Failed to fetch online drivers:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // ── Poll every 10 seconds ────────────────────────────────────
  useEffect(() => {
    fetchOnlineDrivers()
    const interval = setInterval(fetchOnlineDrivers, 10000)
    return () => clearInterval(interval)
  }, [fetchOnlineDrivers])

  return (
    <AdminShell title="Live Map">

      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-sm font-medium text-slate-600">
            Live tracking ·{' '}
            <span className="text-emerald-600 font-bold">
              {isLoading ? '...' : stats.totalOnline}
            </span>{' '}
            drivers online
            {lastUpdated && ` · updated at ${lastUpdated}`}
          </span>
        </div>
        <button
          onClick={fetchOnlineDrivers}
          className="text-xs px-3 py-1.5 rounded-lg border border-slate-200
                     hover:bg-slate-50 font-medium text-slate-600 transition-colors"
        >
          ↻ Refresh
        </button>
      </div>

      {/* ── Stats bar ── */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-white rounded-xl p-3 border text-center">
          <div className="text-xs text-slate-500">Online Now</div>
          <div className="text-xl font-bold text-emerald-600 mt-0.5">
            {isLoading ? '...' : stats.totalOnline}
          </div>
        </div>
        <div className="bg-white rounded-xl p-3 border text-center">
          <div className="text-xs text-slate-500">On Ride</div>
          <div className="text-xl font-bold text-blue-600 mt-0.5">—</div>
        </div>
        <div className="bg-white rounded-xl p-3 border text-center">
          <div className="text-xs text-slate-500">Available</div>
          <div className="text-xl font-bold text-slate-700 mt-0.5">
            {isLoading ? '...' : stats.totalOnline}
          </div>
        </div>
      </div>

      {/* ── Google Map ── */}
      <div className="bg-white rounded-2xl p-2 border border-slate-100
                      shadow-sm overflow-hidden">
        <div className="relative w-full h-[65vh] rounded-xl overflow-hidden">

          {/* Loading overlay */}
          {isLoading && (
            <div className="absolute inset-0 z-10 flex items-center
                            justify-center bg-white/80 rounded-xl">
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 border-4 border-slate-200
                                border-t-slate-800 rounded-full animate-spin" />
                <span className="text-xs text-slate-500">Loading map...</span>
              </div>
            </div>
          )}

          <APIProvider apiKey={API_KEY}>
            <Map
              mapId="odisha-ride-live-map"
              defaultCenter={{ lat: 20.2961, lng: 85.8245 }}
              defaultZoom={12}
              gestureHandling="greedy"
              disableDefaultUI={false}
              style={{ width: '100%', height: '100%' }}
            >
              {/* ── Driver markers ── */}
              {stats.drivers.map(driver => (
                <DriverMarker
                  key={driver._id}
                  driver={driver}
                  isSelected={selectedDriver?._id === driver._id}
                  onSelect={setSelectedDriver}
                  onClose={() => setSelectedDriver(null)}
                />
              ))}
            </Map>
          </APIProvider>
        </div>
      </div>

      {/* ── Online driver list ── */}
      {stats.drivers.length > 0 && (
        <div className="mt-4 bg-white rounded-2xl p-4 border
                        border-slate-100 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">
            Online Drivers ({stats.totalOnline})
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {stats.drivers.map(d => (
              <div
                key={d._id}
                onClick={() => setSelectedDriver(d)}
                className="flex items-center gap-2 p-2 rounded-lg bg-slate-50
                           border cursor-pointer hover:bg-blue-50
                           hover:border-blue-200 transition-colors"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-slate-700 truncate">
                    {d.fullName}
                  </div>
                  <div className="text-xs text-slate-400">{d.driverId}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Empty state ── */}
      {/* ── Empty state ── */}
      {!isLoading && stats.totalOnline === 0 && (
        <div className="mt-4 bg-white rounded-2xl p-10 border border-slate-100
                  shadow-sm text-center">
          {/* Icon */}
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center
                    justify-center mx-auto mb-4">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
              stroke="#94a3b8" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3
             0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25
             4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621
             0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193
             2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177
             v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0
             00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677
             m0 4.5v-4.5m0 0h-12" />
            </svg>
          </div>

          {/* Message */}
          <p className="text-slate-700 font-semibold text-base mb-1">
            No drivers online
          </p>
          <p className="text-slate-400 text-sm mb-1">
            All drivers are currently offline or unavailable.
          </p>
          <p className="text-slate-300 text-xs mb-5">
            Last checked: {lastUpdated || 'just now'}
          </p>

          {/* Refresh button */}
          <button
            onClick={fetchOnlineDrivers}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg
                 bg-slate-900 text-white text-sm font-medium
                 hover:bg-slate-700 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0
             0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7
             M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991
             v4.99" />
            </svg>
            Refresh now
          </button>
        </div>
      )}

    </AdminShell>
  )
}