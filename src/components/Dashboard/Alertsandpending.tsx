'use client'
import { useRouter } from 'next/navigation'
import { AlertTriangle, CreditCard, Shield } from 'lucide-react'

interface AlertsAndPendingProps {
  disputedCount?: number
  failedPaymentsCount?: number
  pendingKycCount?: number
}

export default function AlertsAndPending({
  disputedCount = 4,
  failedPaymentsCount = 12,
  pendingKycCount = 24,
}: AlertsAndPendingProps) {
  const router = useRouter()

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
      <h3 className="text-lg font-semibold text-blue-700">Alerts &amp; Pending</h3>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* Disputed Rides */}
        <div
          onClick={() => router.push('/rides/disputed')}
          className="bg-blue-50 rounded-xl p-4 flex gap-3 cursor-pointer hover:bg-blue-100 transition-colors"
        >
          <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <div className="font-semibold text-slate-800">
              {String(disputedCount).padStart(2, '0')} Disputed Rides
            </div>
            <div className="text-xs text-slate-500 mt-1">Action required immediately</div>
          </div>
        </div>

        {/* Failed Payments */}
        <div
          onClick={() => router.push('/payments/failed')}
          className="bg-blue-50 rounded-xl p-4 flex gap-3 cursor-pointer hover:bg-blue-100 transition-colors"
        >
          <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
            <CreditCard className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <div className="font-semibold text-slate-800">
              {failedPaymentsCount} Failed Payments
            </div>
            <div className="text-xs text-slate-500 mt-1">Server-side timeout errors</div>
          </div>
        </div>

        {/* Pending KYC */}
        <div
          onClick={() => router.push('/kyc-review')}
          className="bg-blue-50 rounded-xl p-4 flex gap-3 cursor-pointer hover:bg-blue-100 transition-colors"
        >
          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
            <Shield className="h-5 w-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-800">Pending KYC</span>
              <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {pendingKycCount}
              </span>
            </div>
            <div className="text-xs text-slate-500 mt-1">Drivers awaiting verification</div>
          </div>
        </div>

      </div>
      <div className="mt-5 flex justify-end">
        <div
          onClick={() => router.push('/support')}
          className="px-5 py-2 rounded-lg border border-slate-200 text-sm font-medium hover:bg-slate-50 cursor-pointer inline-block"
        >
          View All Alerts
        </div>
      </div>
    </div>
  )
}