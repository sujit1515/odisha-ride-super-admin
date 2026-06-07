'use client'

import { useEffect, useState, useCallback } from 'react'
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow } from '@vis.gl/react-google-maps'
import AdminShell from '@/components/Common/AdminShell'
import adminApi from '@/api/axiosinstance'
import type { OnlineDriver,LiveMapStats,} from '@/types/index'


export default function LiveMapPage() {
  const [stats,         setStats        ] = useState<LiveMapStats>({
    totalOnline: 0,
    drivers: [],
  })
  const [lastUpdated,   setLastUpdated  ] = useState('')
  const [isLoading,     setIsLoading    ] = useState(true)
  const [selectedDriver, setSelectedDriver] = useState<OnlineDriver | null>(null)

  const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? ''

  // ── Fetch online drivers ────────────────────────────────────
  const fetchOnlineDrivers = useCallback(async () => {
    try {
      const res = await adminApi.get('/admin/drivers/online')
      setStats(res.data)
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
                <AdvancedMarker
                  key={driver._id}
                  position={{ lat: driver.latitude, lng: driver.longitude }}
                  onClick={() => setSelectedDriver(driver)}
                >
                  <Pin
                    background="#2563eb"
                    borderColor="#1d4ed8"
                    glyphColor="#ffffff"
                  />
                </AdvancedMarker>
              ))}

              {/* ── Info window on marker click ── */}
              {selectedDriver && (
                <InfoWindow
                  position={{
                    lat: selectedDriver.latitude,
                    lng: selectedDriver.longitude,
                  }}
                  onCloseClick={() => setSelectedDriver(null)}
                >
                  <div className="p-1 min-w-[140px]">
                    <p className="font-bold text-slate-800 text-sm">
                      {selectedDriver.fullName}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {selectedDriver.driverId}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      Updated: {new Date(selectedDriver.updatedAt)
                        .toLocaleTimeString()}
                    </p>
                    <div className="mt-2 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="text-xs text-emerald-600 font-medium">
                        Online
                      </span>
                    </div>
                  </div>
                </InfoWindow>
              )}

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
      {!isLoading && stats.totalOnline === 0 && (
        <div className="mt-4 bg-white rounded-2xl p-8 border border-slate-100
                        shadow-sm text-center">
          <div className="text-slate-400 text-sm">
            No drivers are currently online.
          </div>
        </div>
      )}

    </AdminShell>
  )
}