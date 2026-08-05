'use client'

import AdminShell from '@/components/Common/AdminShell'
import PaymentNavHeader from '@/components/Payments/PaymentNavHeader'
import PaymentSettingsForm from '@/components/Payments/PaymentSettingsForm'

export default function PaymentSettingsPage() {
  return (
    <AdminShell title="Payment Settings">
      <div className="min-h-screen space-y-6 pb-12">
        <PaymentNavHeader />
        <PaymentSettingsForm />
      </div>
    </AdminShell>
  )
}
