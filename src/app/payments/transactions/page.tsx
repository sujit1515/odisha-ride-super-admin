'use client'

import AdminShell from '@/components/Common/AdminShell'
import PaymentNavHeader from '@/components/Payments/PaymentNavHeader'
import CommissionTransactionsTable from '@/components/Payments/CommissionTransactionsTable'
import { mockCommissionTransactions } from '@/components/Payments/mockData'

export default function CommissionTransactionsPage() {
  return (
    <AdminShell title="Ride Commission Transactions">
      <div className="min-h-screen space-y-6 pb-12">
        <PaymentNavHeader />
        <CommissionTransactionsTable transactions={mockCommissionTransactions} />
      </div>
    </AdminShell>
  )
}
