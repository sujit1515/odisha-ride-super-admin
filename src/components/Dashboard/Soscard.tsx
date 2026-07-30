'use client'
import { useRouter } from 'next/navigation'

interface SosCardProps {
  count?: number
  activeCount?: number
}

export default function SosCard({ count = 3, activeCount = 3 }: SosCardProps) {
  const router = useRouter()

  return (
    <div
      onClick={() => router.push('/support/sos')}
      className="block bg-red-50 rounded-2xl p-5 border border-red-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"

    >
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-red-600 font-medium">
          <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
          Emergency
        </div>
        <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-full">
          {activeCount} ACTIVE
        </span>
      </div>
      <div className="mt-3 text-sm text-red-700">SOS alerts</div>
      <div className="mt-2 text-4xl font-bold text-red-700">
        {String(count).padStart(2, '0')}
      </div>
    </div>
  )
} 