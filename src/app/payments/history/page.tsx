'use client'

import { useState } from 'react'
import AdminShell from '@/components/Common/AdminShell'
import PaymentNavHeader from '@/components/Payments/PaymentNavHeader'
import PaymentHistoryTable from '@/components/Payments/PaymentHistoryTable'
import ReceivePaymentModal from '@/components/Payments/ReceivePaymentModal'
import { mockPaymentHistory, mockDriverCommissions } from '@/components/Payments/mockData'
import { PaymentHistoryItem } from '@/components/Payments/types'

export default function PaymentHistoryPage() {
  const [payments, setPayments] = useState<PaymentHistoryItem[]>(mockPaymentHistory)
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <AdminShell title="Payment History">
      <div className="min-h-screen space-y-6 pb-12">
        <PaymentNavHeader onQuickCollect={() => setIsModalOpen(true)} />

        <PaymentHistoryTable payments={payments} />

        <ReceivePaymentModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          allDrivers={mockDriverCommissions}
          onSuccessPayment={(driverId, amount, method, ref) => {
            const driver = mockDriverCommissions.find((d) => d.driverId === driverId)
            const newPayment: PaymentHistoryItem = {
              id: `PAY-${Math.floor(900 + Math.random() * 900)}`,
              receiptNo: `REC-2026-0805-${Math.floor(10 + Math.random() * 90)}`,
              date: 'Just Now',
              driverId,
              driverName: driver?.driverName || 'Driver',
              driverPhone: driver?.phone || '',
              vehicleType: driver?.vehicleType || 'Auto',
              amount,
              paymentMethod: method,
              referenceNumber: ref,
              status: 'Success',
              collectedBy: 'Super Admin Manual',
            }
            setPayments((prev) => [newPayment, ...prev])
          }}
        />
      </div>
    </AdminShell>
  )
}
