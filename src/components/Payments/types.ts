export type DriverStatus = 'Active' | 'Warning' | 'Blocked'

export type VehicleType = 'Auto' | 'Bike' | 'Cab Sedan' | 'Cab SUV' | 'EV Auto'

export type PaymentMethod = 'Cash' | 'UPI' | 'Razorpay' | 'Bank Transfer'

export type PaymentStatus = 'Success' | 'Pending' | 'Failed'

export type CommissionStatus = 'Charged' | 'Pending' | 'Waived' | 'Refunded'

export interface DriverCommission {
  id: string
  driverId: string
  driverName: string
  avatar: string
  phone: string
  vehicleType: VehicleType
  vehicleNumber: string
  outstandingCommission: number
  commissionLimit: number
  remainingAmount: number
  status: DriverStatus
  lastPaymentDate: string
  lastPaymentAmount: number
  totalCommissionEarned: number
  joiningDate: string
  rating: number
  totalRides: number
  upiId?: string
}

export interface PaymentHistoryItem {
  id: string
  receiptNo: string
  date: string
  driverId: string
  driverName: string
  driverPhone: string
  vehicleType: VehicleType
  amount: number
  paymentMethod: PaymentMethod
  referenceNumber: string
  status: PaymentStatus
  collectedBy: string
  notes?: string
}

export interface CommissionTransaction {
  id: string
  rideId: string
  driverId: string
  driverName: string
  vehicleType: VehicleType
  vehicleNumber: string
  rideFare: number
  commissionPercent: number
  commissionAmount: number
  createdDate: string
  status: CommissionStatus
}

export interface PaymentSettings {
  platformCommission: number
  defaultCommissionLimit: number
  warningThreshold: number
  blockThreshold: number
  allowPartialPayments: boolean
  autoUnblockAfterPayment: boolean
  defaultPaymentGateway: string
  razorpayKey: string
  razorpaySecret: string
}

export interface PaymentAnalyticsSummary {
  monthlyCollection: { month: string; amount: number; target: number }[]
  outstandingTrend: { date: string; amount: number; blockedCount: number }[]
  topPayingDrivers: { name: string; vehicle: string; totalPaid: number; rides: number; avatar: string }[]
  methodDistribution: { method: PaymentMethod; amount: number; percentage: number; color: string }[]
}
