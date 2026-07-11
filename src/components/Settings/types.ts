// // ── Vehicle Settings (used for each vehicle type) ──────
// export interface VehicleSettings {
//   baseFare: number
//   minFare: number
//   perKmRate: number
//   baseDistance: number
//   waitTimeFee: number
//   freeWaitMinutes: number
//   maxPassengers: number
// }

// // ── Main Settings Interface (matches backend schema) ──────
// export interface Settings {
//   // ── General ────────────────────────────────────────────
//   platformName: string
//   commission: number
//   supportEmail: string
//   supportPhone: string
//   autoApproveDrivers: boolean
//   kycMandatory: boolean

//   // ── Fare & Pricing ────────────────────────────────────
//   baseFare: number
//   minFare: number
//   cancellationFee: number
//   perKmRate: number
//   perMinuteRate: number
//   surgeMultiplier: number
//   nightChargeMultiplier: number
//   bikeRatePerKm: number
//   autoRatePerKm: number
//   carRatePerKm: number

//   // ── Platform & Tax ────────────────────────────────────
//   platformFee: number
//   taxPercentage: number

//   // ── Ride Configuration (Driver Matching & ETA) ────────
//   searchRadiiKm: number[]
//   avgSpeedKmh: number
//   etaTieThresholdMin: number
//   maxWaitingTime: number

//   // ── Vehicle-Specific Pricing ──────────────────────────
//   bikeSettings?: VehicleSettings
//   autoSettings?: VehicleSettings
//   nonacSettings?: VehicleSettings
//   acSettings?: VehicleSettings
//   xlSettings?: VehicleSettings
// }

// export const DEFAULTS: Settings = {
//   // ── General ────────────────────────────────────────────
//   platformName: 'Odisha Ride',
//   commission: 15,
//   supportEmail: 'support@odisharide.com',
//   supportPhone: '+91 9999999999',
//   autoApproveDrivers: false,
//   kycMandatory: true,

//   // ── Fare & Pricing ────────────────────────────────────
//   baseFare: 50,
//   minFare: 30,
//   cancellationFee: 25,
//   perKmRate: 12,
//   perMinuteRate: 1.5,
//   surgeMultiplier: 1.5,
//   nightChargeMultiplier: 1.25,
//   bikeRatePerKm: 8,
//   autoRatePerKm: 12,
//   carRatePerKm: 18,

//   // ── Platform & Tax ────────────────────────────────────
//   platformFee: 0,
//   taxPercentage: 5,

//   // ── Ride Configuration ────────────────────────────────
//   searchRadiiKm: [3, 5, 8, 10],
//   avgSpeedKmh: 25,
//   etaTieThresholdMin: 1,
//   maxWaitingTime: 12,

//   // ── Vehicle Settings ──────────────────────────────────
//   bikeSettings: {
//     baseFare: 20,
//     minFare: 20,
//     perKmRate: 8,
//     baseDistance: 1,
//     waitTimeFee: 1,
//     freeWaitMinutes: 3,
//     maxPassengers: 1,
//   },
//   autoSettings: {
//     baseFare: 30,
//     minFare: 25,
//     perKmRate: 12,
//     baseDistance: 1.5,
//     waitTimeFee: 1,
//     freeWaitMinutes: 3,
//     maxPassengers: 3,
//   },
//   nonacSettings: {
//     baseFare: 50,
//     minFare: 35,
//     perKmRate: 15,
//     baseDistance: 2,
//     waitTimeFee: 2,
//     freeWaitMinutes: 3,
//     maxPassengers: 4,
//   },
//   acSettings: {
//     baseFare: 60,
//     minFare: 50,
//     perKmRate: 22,
//     baseDistance: 2,
//     waitTimeFee: 2,
//     freeWaitMinutes: 3,
//     maxPassengers: 4,
//   },
//   xlSettings: {
//     baseFare: 80,
//     minFare: 70,
//     perKmRate: 28,
//     baseDistance: 2,
//     waitTimeFee: 3,
//     freeWaitMinutes: 3,
//     maxPassengers: 6,
//   },
// }


// ── Vehicle Settings ───────────────────────────────────────────────────────
export interface VehicleSettings {
  baseFare:        number
  minFare:         number
  perKmRate:       number
  baseDistance:    number
  waitTimeFee:     number
  freeWaitMinutes: number
  maxPassengers:   number
}

// ── Main Settings Interface ────────────────────────────────────────────────
export interface Settings {

  // ── General ──────────────────────────────────────────
  platformName:       string
  commission:         number
  supportEmail:       string
  supportPhone:       string
  autoApproveDrivers: boolean
  kycMandatory:       boolean

  // ── Global Fare ───────────────────────────────────────
  perMinuteRate:          number
  cancellationFee:        number
  maxSurgeMultiplier:     number   // cap: no combined surge can exceed this
  freeCancellationWindow: number   // minutes rider can cancel free

  // ── Platform, Tax & Commission ────────────────────────
  platformFee:                number
  taxPercentage:              number
  driverCommissionPercentage: number

  // ── Peak Hour Surge (Auto) ────────────────────────────
  surgeEnabled:     boolean
  surgeMultiplier:  number
  surgeStartTime:   string   // "08:00"
  surgeEndTime:     string   // "10:00"

  // ── Night Charge (Auto) ───────────────────────────────
  nightChargeEnabled:      boolean
  nightChargeMultiplier:   number
  nightChargeStartTime:    string  // "23:00"
  nightChargeEndTime:      string  // "05:00"

  // ── Rain Surge (Manual) ───────────────────────────────
  rainSurgeEnabled:    boolean
  rainSurgeMultiplier: number

  // ── Toll Charges (Auto via Maps API) ─────────────────
  tollChargeEnabled: boolean
  tollGstPercentage: number
  tollRounding:      string  // "none" | "1" | "5" | "10"

  // ── Ride Configuration ────────────────────────────────
  searchRadiiKm:       number[]
  avgSpeedKmh:         number
  etaTieThresholdMin:  number
  maxWaitingTime:      number

  // ── Notifications ─────────────────────────────────────
  emailPushNotif:    boolean
  smsNotif:          boolean
  notifyOnSignup:    boolean
  notifyOnComplaint: boolean

  // ── Admin ─────────────────────────────────────────────
  adminName:     string
  adminEmail:    string
  twoFactorAuth: boolean

  // ── Driver Settings ───────────────────────────────────
  backgroundCheck: boolean
  minDriverRating: number

  // ── Payout Settings ───────────────────────────────────
  payoutFrequency: string   // 'daily' | 'weekly' | 'monthly'
  minPayoutAmount: number

  // ── Vehicle-Specific Pricing ──────────────────────────
  bikeSettings?:  VehicleSettings
  autoSettings?:  VehicleSettings
  nonacSettings?: VehicleSettings
  acSettings?:    VehicleSettings
  xlSettings?:    VehicleSettings

  // ── Dynamic Vehicles list ─────────────────────────────
  vehicles?: Vehicle[]
}

export interface Vehicle {
  id: string
  label: string
  desc: string
  accent: string
  maxPassengers: number
  baseFare: number
  minFare: number
  perKmRate: number
  baseDistance: number
  waitTimeFee: number
  freeWaitMinutes: number
}

// ── Default Values ─────────────────────────────────────────────────────────
export const DEFAULTS: Settings = {

  // ── General ──────────────────────────────────────────
  platformName:       'Odisha Ride',
  commission:         15,
  supportEmail:       'support@odisharide.com',
  supportPhone:       '+91 9999999999',
  autoApproveDrivers: false,
  kycMandatory:       true,

  // ── Global Fare ───────────────────────────────────────
  perMinuteRate:          1.5,
  cancellationFee:        25,
  maxSurgeMultiplier:     3,
  freeCancellationWindow: 5,

  // ── Platform, Tax & Commission ────────────────────────
  platformFee:                5,
  taxPercentage:              5,
  driverCommissionPercentage: 20,

  // ── Peak Hour Surge ───────────────────────────────────
  surgeEnabled:    false,
  surgeMultiplier: 1.5,
  surgeStartTime:  '08:00',
  surgeEndTime:    '10:00',

  // ── Night Charge ──────────────────────────────────────
  nightChargeEnabled:    true,
  nightChargeMultiplier: 1.25,
  nightChargeStartTime:  '23:00',
  nightChargeEndTime:    '05:00',

  // ── Rain Surge ────────────────────────────────────────
  rainSurgeEnabled:    false,
  rainSurgeMultiplier: 1.5,

  // ── Toll Charges ──────────────────────────────────────
  tollChargeEnabled: false,
  tollGstPercentage: 0,
  tollRounding:      'none',

  // ── Ride Configuration ────────────────────────────────
  searchRadiiKm:      [3, 5, 8, 10],
  avgSpeedKmh:        25,
  etaTieThresholdMin: 1,
  maxWaitingTime:     12,

  // ── Notifications ─────────────────────────────────────
  emailPushNotif:    true,
  smsNotif:          true,
  notifyOnSignup:    true,
  notifyOnComplaint: true,

  // ── Admin ─────────────────────────────────────────────
  adminName:     'Super Admin',
  adminEmail:    'admin@odisharide.com',
  twoFactorAuth: false,

  // ── Driver Settings ───────────────────────────────────
  backgroundCheck: false,
  minDriverRating: 3.5,

  // ── Payout Settings ───────────────────────────────────
  payoutFrequency: 'weekly',
  minPayoutAmount: 100,

  // ── Vehicle Settings ──────────────────────────────────
  bikeSettings: {
    baseFare:        20,
    minFare:         20,
    perKmRate:       8,
    baseDistance:    1,
    waitTimeFee:     1,
    freeWaitMinutes: 3,
    maxPassengers:   1,
  },
  autoSettings: {
    baseFare:        30,
    minFare:         25,
    perKmRate:       12,
    baseDistance:    1.5,
    waitTimeFee:     1,
    freeWaitMinutes: 3,
    maxPassengers:   3,
  },
  nonacSettings: {
    baseFare:        50,
    minFare:         35,
    perKmRate:       15,
    baseDistance:    2,
    waitTimeFee:     2,
    freeWaitMinutes: 3,
    maxPassengers:   4,
  },
  acSettings: {
    baseFare:        60,
    minFare:         50,
    perKmRate:       22,
    baseDistance:    2,
    waitTimeFee:     2,
    freeWaitMinutes: 3,
    maxPassengers:   4,
  },
  xlSettings: {
    baseFare:        80,
    minFare:         70,
    perKmRate:       28,
    baseDistance:    2,
    waitTimeFee:     3,
    freeWaitMinutes: 3,
    maxPassengers:   6,
  },
}