export interface Ride {
    _id: string
    userId: { fullName: string; phoneNumber: string; email: string; avatarUrl?: string }
    driverId: { fullName: string; phone: string; vehicleNumber: string; vehicleType: string; driverId: string; profileImage?: string; rating?: number } | null
    pickup: { address: string; latitude: number; longitude: number }
    destination: { address: string; latitude: number; longitude: number }
    vehicleType: string
    paymentMethod: string
    status: string
    estimatedFare: number | null
    finalFare: number | null
    distance: string | null
    duration: string | null
    acceptedAt: string | null
    startedAt: string | null
    completedAt: string | null
    cancelledAt: string | null
    cancellationReason: string | null
    cancelledBy: string | null
    cancellationFee: number
    otp: string | null
    createdAt: string
    updatedAt: string
}

export interface RidesResponse {
    rides: Ride[]
    total: number
    page: number
    limit: number
    totalPages: number
}

export interface RideStats {
    total: number
    completed: number
    cancelled: number
    ongoing: number
    waiting: number
    todayTotal: number
    todayRevenue: number
}