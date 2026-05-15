'use client'
import { useEffect, useState } from 'react'
import AdminShell from '@/components/Common/AdminShell'

interface CarPin {
  id: number
  name: string
  t: string
  l: string
}

const cars: CarPin[] = [
  { id: 1, name: 'Rakesh S.', t: '20%', l: '30%' },
  { id: 2, name: 'Manoj K.', t: '45%', l: '55%' },
  { id: 3, name: 'Amit P.', t: '60%', l: '20%' },
  { id: 4, name: 'Sanjay M.', t: '70%', l: '70%' },
  { id: 5, name: 'Deepak R.', t: '30%', l: '80%' },
]

export default function LiveMapPage() {
  const [tick, setTick] = useState<number>(0)
  useEffect(() => {
    const i = setInterval(() => setTick(t => t + 1), 2000)
    return () => clearInterval(i)
  }, [])
  return (
    <AdminShell title="Live Map">
      <div className="flex items-center gap-2 mb-4">
        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-sm font-medium text-slate-600">Live tracking · 310 drivers online · updated {tick}s ago</span>
      </div>
      <div className="bg-white rounded-2xl p-2 border border-slate-100 shadow-sm overflow-hidden">
        <div className="relative w-full h-[70vh] rounded-xl overflow-hidden bg-slate-100">
          <iframe
            title="map"
            src="https://maps.google.com/maps?q=Bhubaneswar&t=&z=12&ie=UTF8&iwloc=&output=embed"
            className="absolute inset-0 w-full h-full"
          />
          {cars.map(c => (
            <div key={c.id} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ top: c.t, left: c.l }}>
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-blue-500/30 animate-ping" />
                <div className="relative h-4 w-4 rounded-full bg-blue-600 ring-2 ring-white shadow" />
              </div>
              <div className="mt-1 px-2 py-0.5 rounded bg-white text-xs shadow text-slate-700">{c.name}</div>
            </div>
          ))}
        </div>
      </div>
    </AdminShell>
  )
}
