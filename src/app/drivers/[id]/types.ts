export type DriverStatus = 'active' | 'blocked' | 'pending' | 'rejected'
export type VehicleType = 'auto' | 'bike' | 'car'

export interface Driver {
  _id: string
  driverId: string
  fullName: string
  phone: string
  email: string
  city: string
  vehicleType: VehicleType
  vehicleNumber: string
  vehicleModel: string
  vehicleColor: string
  vehicleYear: string
  licenseNumber: string
  rating: number
  totalRides: number
  totalEarnings: number
  cancellations: number
  status: DriverStatus
  isBlocked: boolean
  isOnline: boolean
  isApproved: boolean
  joinedAt: string
  createdAt: string
  avatarUrl?: string
  blockReason?: string
  rejectionReason?: string
  aadharNumber?: string
  panNumber?: string
  bankAccount?: {
    accountNumber: string
    ifscCode: string
    bankName: string
  }
}

export interface RecentRide {
  _id: string
  rideId: string
  pickup: string
  drop: string
  fare: number
  date: string
  status: 'completed' | 'cancelled' | 'ongoing'
  distance?: number
  duration?: number
  customerName?: string
}

export interface Document {
  name: string
  url: string
  status: 'verified' | 'pending' | 'rejected'
  uploadedAt: string
}

export interface ToastState {
  message: string
  type: 'success' | 'error'
}