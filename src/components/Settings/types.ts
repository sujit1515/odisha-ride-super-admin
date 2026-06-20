export interface Settings {
  // General
  platformName: string
  commission: number
  supportEmail: string
  supportPhone: string

  // Fare
  baseFare: number
  perKmRate: number
  minFare: number
  perMinuteRate: number
  cancellationFee: number
  surgeMultiplier: number
  nightChargeMultiplier: number
  bikeRatePerKm: number
  autoRatePerKm: number
  carRatePerKm: number

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

export const DEFAULTS: Settings = {
  platformName: 'Odisha Ride',
  commission: 15,
  supportEmail: 'support@odisharide.com',
  supportPhone: '+91 9999999999',
  baseFare: 50,
  perKmRate: 12,
  minFare: 30,
  perMinuteRate: 1.5,
  cancellationFee: 25,
  surgeMultiplier: 2,
  nightChargeMultiplier: 1.25,
  bikeRatePerKm: 8,
  autoRatePerKm: 12,
  carRatePerKm: 18,
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