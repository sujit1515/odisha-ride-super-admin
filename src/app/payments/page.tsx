'use client'

import { useState } from 'react'
import AdminShell from '@/components/Common/AdminShell'
import PaymentNavHeader from '@/components/Payments/PaymentNavHeader'
import PaymentSummaryCards from '@/components/Payments/PaymentSummaryCards'
import DriverCommissionTable from '@/components/Payments/DriverCommissionTable'
import DriverDetailsDrawer from '@/components/Payments/DriverDetailsDrawer'
import ReceivePaymentModal from '@/components/Payments/ReceivePaymentModal'
import IncreaseLimitModal from '@/components/Payments/IncreaseLimitModal'
import { mockDriverCommissions } from '@/components/Payments/mockData'
import { DriverCommission, PaymentMethod } from '@/components/Payments/types'

export default function PaymentsPage() {
  const [drivers, setDrivers] = useState<DriverCommission[]>(mockDriverCommissions)

  const [selectedDriver, setSelectedDriver] = useState<DriverCommission | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [isLimitModalOpen, setIsLimitModalOpen] = useState(false)
  const [paymentDriver, setPaymentDriver] = useState<DriverCommission | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>('All')

  // Open Driver Drawer
  const handleViewDriver = (driver: DriverCommission) => {
    setSelectedDriver(driver)
    setIsDrawerOpen(true)
  }

  // Open Receive Payment Modal
  const handleOpenReceivePayment = (driver?: DriverCommission | null) => {
    setPaymentDriver(driver || selectedDriver || drivers[0])
    setIsPaymentModalOpen(true)
  }

  // Open Increase Limit Modal
  const handleOpenIncreaseLimit = (driver: DriverCommission) => {
    setSelectedDriver(driver)
    setIsLimitModalOpen(true)
  }

  // Toggle Block / Unblock
  const handleToggleBlock = (driverId: string, block: boolean) => {
    setDrivers((prev) =>
      prev.map((d) => {
        if (d.driverId === driverId) {
          const nextStatus = block
            ? 'Blocked'
            : d.outstandingCommission >= 1200
            ? 'Warning'
            : 'Active'
          return {
            ...d,
            status: nextStatus,
            remainingAmount: block ? 0 : d.commissionLimit - d.outstandingCommission,
          }
        }
        return d
      })
    )

    if (selectedDriver && selectedDriver.driverId === driverId) {
      setSelectedDriver((prev) =>
        prev
          ? {
              ...prev,
              status: block
                ? 'Blocked'
                : prev.outstandingCommission >= 1200
                ? 'Warning'
                : 'Active',
              remainingAmount: block ? 0 : prev.commissionLimit - prev.outstandingCommission,
            }
          : null
      )
    }
  }

  // Handle Payment Completion
  const handleSuccessPayment = (
    driverId: string,
    amount: number,
    method: PaymentMethod,
    ref: string
  ) => {
    setDrivers((prev) =>
      prev.map((d) => {
        if (d.driverId === driverId) {
          const newOutstanding = Math.max(0, d.outstandingCommission - amount)
          const newRemaining = d.commissionLimit - newOutstanding
          const newStatus =
            newOutstanding >= 1500
              ? 'Blocked'
              : newOutstanding >= 1200
              ? 'Warning'
              : 'Active'

          return {
            ...d,
            outstandingCommission: newOutstanding,
            remainingAmount: newRemaining,
            status: newStatus,
            lastPaymentAmount: amount,
            lastPaymentDate: 'Just Now',
          }
        }
        return d
      })
    )

    if (selectedDriver && selectedDriver.driverId === driverId) {
      const newOutstanding = Math.max(0, selectedDriver.outstandingCommission - amount)
      setSelectedDriver({
        ...selectedDriver,
        outstandingCommission: newOutstanding,
        remainingAmount: selectedDriver.commissionLimit - newOutstanding,
        status:
          newOutstanding >= 1500
            ? 'Blocked'
            : newOutstanding >= 1200
            ? 'Warning'
            : 'Active',
        lastPaymentAmount: amount,
        lastPaymentDate: 'Just Now',
      })
    }
  }

  // Update Limit
  const handleUpdateLimit = (driverId: string, newLimit: number) => {
    setDrivers((prev) =>
      prev.map((d) => {
        if (d.driverId === driverId) {
          const newRemaining = Math.max(0, newLimit - d.outstandingCommission)
          const newStatus =
            d.outstandingCommission >= newLimit
              ? 'Blocked'
              : d.outstandingCommission >= newLimit * 0.8
              ? 'Warning'
              : 'Active'
          return {
            ...d,
            commissionLimit: newLimit,
            remainingAmount: newRemaining,
            status: newStatus,
          }
        }
        return d
      })
    )

    if (selectedDriver && selectedDriver.driverId === driverId) {
      setSelectedDriver({
        ...selectedDriver,
        commissionLimit: newLimit,
        remainingAmount: Math.max(0, newLimit - selectedDriver.outstandingCommission),
      })
    }
  }

  return (
    <AdminShell title="Payments & Commission Hub">
    <div className="min-h-screen space-y-6 pb-12">
      {/* Navigation Header */}
      <PaymentNavHeader
        onQuickCollect={() => handleOpenReceivePayment(null)}
        onExportCsv={() => {
          const csv = [
            'Driver ID,Name,Phone,Vehicle,Outstanding,Limit,Remaining,Status,Last Payment Date',
            ...drivers.map(
              (d) =>
                `"${d.driverId}","${d.driverName}","${d.phone}","${d.vehicleType} (${d.vehicleNumber})",${d.outstandingCommission},${d.commissionLimit},${d.remainingAmount},"${d.status}","${d.lastPaymentDate}"`
            ),
          ].join('\n')
          const blob = new Blob([csv], { type: 'text/csv' })
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = `Driver_Commission_Dashboard_${new Date().toISOString().slice(0, 10)}.csv`
          a.click()
        }}
      />

      {/* Summary Stat Cards */}
      <PaymentSummaryCards
        drivers={drivers}
        onFilterStatus={(st) => setStatusFilter(st)}
      />

      {/* Driver Commission Table */}
      <DriverCommissionTable
        drivers={drivers}
        selectedStatus={statusFilter}
        onStatusChange={(st) => setStatusFilter(st)}
        onViewDriver={handleViewDriver}
        onReceivePayment={(d) => handleOpenReceivePayment(d)}
        onToggleBlock={handleToggleBlock}
      />

      {/* Driver Details Drawer */}
      <DriverDetailsDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        driver={selectedDriver}
        onOpenReceivePayment={(d) => handleOpenReceivePayment(d)}
        onOpenIncreaseLimit={(d) => handleOpenIncreaseLimit(d)}
        onToggleBlock={handleToggleBlock}
      />

      {/* Receive Payment Modal */}
      <ReceivePaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        driver={paymentDriver}
        allDrivers={drivers}
        onSuccessPayment={handleSuccessPayment}
      />

      {/* Increase Limit Modal */}
      <IncreaseLimitModal
        isOpen={isLimitModalOpen}
        onClose={() => setIsLimitModalOpen(false)}
        driver={selectedDriver}
        onUpdateLimit={handleUpdateLimit}
      />
    </div>
    </AdminShell>
  )
}
