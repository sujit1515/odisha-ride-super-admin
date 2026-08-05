'use client'

import AdminShell from '@/components/Common/AdminShell'
import PaymentNavHeader from '@/components/Payments/PaymentNavHeader'
import PaymentAnalyticsCharts from '@/components/Payments/PaymentAnalyticsCharts'

export default function PaymentAnalyticsPage() {
  return (
    <AdminShell title="Payment Analytics">
      <div className="min-h-screen space-y-6 pb-12">
        <PaymentNavHeader />
        <PaymentAnalyticsCharts />
      </div>
    </AdminShell>
  )
}
