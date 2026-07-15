import adminApi from './axiosinstance'

// ── Types ─────────────────────────────────────────────────────────────────────
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

// ── GET all rides ─────────────────────────────────────────────────────────────
export const getAllRides = async (params: {
    status?: string
    search?: string
    date?: string
    page?: number
    limit?: number
}): Promise<RidesResponse> => {
    const query = new URLSearchParams()
    if (params.status && params.status !== 'all') query.append('status', params.status)
    if (params.search) query.append('search', params.search)
    if (params.date) query.append('date', params.date)
    if (params.page) query.append('page', String(params.page))
    if (params.limit) query.append('limit', String(params.limit))

    const res = await adminApi.get(`/admin/rides?${query.toString()}`)
    return res.data
}

// ── GET recent rides (for dashboard widget) ───────────────────────────────────
export const getRecentRides = async (limit = 5): Promise<RidesResponse> => {
    return getAllRides({ page: 1, limit })
}

// ── GET completed rides (with filters + pagination) ───────────────────────────
export const getCompletedRides = async (params: {
    search?: string
    date?: string
    page?: number
    limit?: number
}): Promise<RidesResponse> => {
    return getAllRides({ ...params, status: 'completed' })
}

// ── GET cancelled rides (with filters + pagination) ────────────────────────────
export const getCancelledRides = async (params: {
    search?: string
    date?: string
    page?: number
    limit?: number
}): Promise<RidesResponse> => {
    return getAllRides({ ...params, status: 'cancelled' })
}

// ── GET ride stats ────────────────────────────────────────────────────────────
export const getRideStats = async (): Promise<RideStats> => {
    const res = await adminApi.get('/admin/rides/stats')
    return res.data
}

// ── GET single ride by ID ─────────────────────────────────────────────────────
export const getRideById = async (id: string): Promise<{ ride: Ride }> => {
    const res = await adminApi.get(`/admin/rides/${id}`)
    return res.data
}

// ── GET ongoing rides (requested/accepted/arrived/started) ───────────────────
export const getOngoingRides = async (): Promise<{ rides: Ride[]; total: number }> => {
    const res = await adminApi.get('/admin/rides/ongoing')
    return res.data
}

// Download invoice for a ride  ─────────────────────────────────────────────────────
export const downloadInvoice = async (id: string): Promise<void> => {
    const res = await adminApi.get(`/admin/rides/${id}/invoice`, {
        responseType: 'blob',
    })
    const url = window.URL.createObjectURL(new Blob([res.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `invoice-${id.slice(-6)}.pdf`)
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
}

// ── DELETE ride ───────────────────────────────────────────────────────────────
export const deleteRide = async (id: string): Promise<{ message: string }> => {
    const res = await adminApi.delete(`/admin/rides/${id}`)
    return res.data
}