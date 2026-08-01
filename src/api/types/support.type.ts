export type DocStatus = 'uploaded' | 'missing' | 'rejected'
export type KYCStatus = 'Pending' | 'Approved' | 'Rejected'
export type KYCDriverStatus = 'active' | 'blocked' | 'pending' | 'approved' | 'rejected'

export interface Document {
  key: string
  label: string
  filename: string
  status: DocStatus
  uploadedAt: string
  imageUrl: string | null
}
export interface DriverKYC {
  id: string
  name: string
  phone: string
  email: string
  city: string
  vehicleType: string
  vehicleNumber: string
  aadhaarNumber: string
  licenseNumber: string
  rcNumber: string
  submittedAt: string
  status: KYCStatus
  driverStatus?: KYCDriverStatus
  documents: Document[]
}
export interface KYCEntry {
  id: string
  driverId: string
  driver: string
  email: string
  phone: string
  submitted: string
  docs: string
  aadhaarNumber: string
  vehicleNumber: string
  licenseNumber: string
  profilePhoto: string
  aadhaarDoc: string
  licenseDoc: string
  status: KYCStatus
}
// ── Driver types
export interface BlockedDriver {
  id: string
  driverId: string
  name: string
  email: string
  phone: string
  blockedAt: string
  blockedReason: string
  blockedBy: string
}

// Drivers Types

export type DriverStatus = | 'Online' | 'On Ride' | 'Offline' | 'Blocked' | 'Pending' | 'Approved' | 'Rejected'
export interface Driver {
  _id: string
  driverId: string
  fullName: string
  phone: string
  email: string
  status: string
  isBlocked: boolean
  isApproved: boolean
  isOnline: boolean
  rating?: number
  totalTrips?: number
  totalEarnings?: number
  vehicleType?: string
  vehicleModel?: string
  vehiclePlate?: string
  vehicleColor?: string
  avatarUrl?: string
  createdAt: string
  lastActive?: string
  blockReason?: string
  rejectionReason?: string
}
export interface ToastState {
  msg: string
  ok: boolean
}
export interface ActionModalState {
  type: 'approve' | 'reject' | 'block' | 'unblock'
  driver: Driver
}

// ── Live map types
export interface OnlineDriver {
  _id: string
  fullName: string
  driverId: string
  latitude: number
  longitude: number
  updatedAt: string
}
export interface LiveMapStats {
  totalOnline: number
  drivers: OnlineDriver[]
}

// ── Profile Page Types
export type Tab = 'profile' | 'security'
export interface FormState {
  name: string
  email: string
  phone: string
  city: string
}
export interface PasswordState {
  old: string
  new: string
  confirm: string
}
export interface ProfileMeta {
  role: string
  avatar: string
  joinedAt: string
  lastLogin: string
}

// ── Deactivated Users Types
export interface DeactivatedUser {
  id: string
  passengerId: string
  name: string
  email: string
  phone: string
  createdAt: string
}

// ─────────────────────────────────────────────────────────────────────────────
// FILE: types/support.ts
// ─────────────────────────────────────────────────────────────────────────────

export type TicketPriority = 'High' | 'Medium' | 'Low'
export type TicketStatus = 'Open' | 'In Progress' | 'Resolved' | 'Closed'
export type UserType = 'passenger' | 'driver'
export type SenderType = 'admin' | 'user'

export type TicketCategory =
  | 'Payment Issues'
  | 'Ride Issues'
  | 'Driver Complaints'
  | 'Passenger Complaints'
  | 'Technical Issues'
  | 'Account Issues'
  | 'Lost & Found'
  | 'Refund Requests'
  | 'Promotions & Coupons'
  | 'Other'

export interface SupportTicket {
  _id: string
  ticketId: string
  userId: string
  userType: UserType
  name: string
  email: string
  phone: string
  category: TicketCategory
  subject: string
  description: string
  priority: TicketPriority
  status: TicketStatus
  assignedTo?: string
  assignedAt?: string
  assignedBy?: string
  attachments?: string[]
  rideId?: string
  rideInfo?: {
    rideId: string
    pickupLocation: string
    dropLocation: string
    driverName?: string
    driverPhone?: string
  }
  createdAt: string
  updatedAt: string
}

export interface TicketMessage {
  _id: string
  ticketId: string
  senderId: string
  senderType: SenderType
  senderName: string
  message: string
  attachments?: string[]
  createdAt: string
}

export interface TicketStats {
  total: number
  open: number
  inProgress: number
  resolvedToday: number
  closed: number
  highPriority: number
  driverComplaints: number
  passengerComplaints: number
  avgResponseTime: string
}

export interface TicketsResponse {
  tickets: SupportTicket[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface TicketFilters {
  search?: string
  status?: TicketStatus | 'All'
  priority?: TicketPriority | 'All'
  userType?: UserType | 'All'
  category?: TicketCategory | 'All'
  dateFrom?: string
  dateTo?: string
  page?: number
  limit?: number
}

// ── Settings Interface  
export interface Settings {
  // General
  platformName: string
  commission: number
  supportEmail: string
  supportPhone: string
  platformFee: number
  taxPercentage: number
  driverCommissionPercentage: number

  // Fare
  baseFare: number
  perKmRate: number
  minFare: number
  perMinuteRate: number
  cancellationFee: number
  maxSurgeMultiplier: number
  freeCancellationWindow: number
  surgeMultiplier: number
  nightChargeMultiplier: number
  bikeRatePerKm: number
  autoRatePerKm: number
  carRatePerKm: number
  tollChargeEnabled: boolean
  tollGstPercentage: number
  tollRounding: string

  // Ride
  maxSearchRadius: number
  maxWaitingTime: number
  autoAssignDriver: boolean
  maxRidesPerDay: number

  // Driver
  autoApproveDrivers: boolean
  kycMandatory: boolean
  minDriverRating: number
  backgroundCheck: boolean

  // Payout
  payoutFrequency: string
  minPayoutAmount: number

  // Notifications
  emailPushNotif: boolean
  smsNotif: boolean
  sosAlerts: boolean
  notifyOnSignup: boolean
  notifyOnComplaint: boolean

  // Admin
  adminName: string
  adminEmail: string
  twoFactorAuth: boolean
}

// ── Default Values 
export const DEFAULTS: Settings = {
  platformName: 'Odisha Ride',
  commission: 15,
  supportEmail: 'support@odisharide.com',
  supportPhone: '+91 9999999999',
  platformFee: 10,
  taxPercentage: 5,
  driverCommissionPercentage: 15,
  baseFare: 50,
  perKmRate: 12,
  minFare: 30,
  perMinuteRate: 1.5,
  cancellationFee: 25,
  maxSurgeMultiplier: 2,
  freeCancellationWindow: 3,
  surgeMultiplier: 2,
  nightChargeMultiplier: 1.25,
  bikeRatePerKm: 8,
  autoRatePerKm: 12,
  carRatePerKm: 18,
  tollChargeEnabled: false,
  tollGstPercentage: 0,
  tollRounding: 'none',
  maxSearchRadius: 10,
  maxWaitingTime: 5,
  autoAssignDriver: true,
  maxRidesPerDay: 20,
  autoApproveDrivers: false,
  kycMandatory: true,
  minDriverRating: 3.5,
  backgroundCheck: true,
  payoutFrequency: 'weekly',
  minPayoutAmount: 500,
  emailPushNotif: true,
  smsNotif: true,
  sosAlerts: true,
  notifyOnSignup: true,
  notifyOnComplaint: true,
  adminName: 'Super Admin',
  adminEmail: 'admin@odisharide.com',
  twoFactorAuth: false,
}