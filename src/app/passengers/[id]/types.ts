export interface Passenger {
  _id: string
  passengerId: string
  fullName: string
  email: string
  phoneNumber: string
  city?: string
  isActive: boolean
  isVerified: boolean
  createdAt: string
  updatedAt: string
  avatarUrl?: string
  totalRides?: number
  totalSpent?: number
  rating?: number
  deactivationReason?: string
  aadharNumber?: string
  panNumber?: string
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
  driverName?: string
  driverId?: string
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