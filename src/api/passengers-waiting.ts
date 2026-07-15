import adminApi from './axiosinstance'

// ── Types ─────────────────────────────────────────────────────────────────────

/** A passenger who requested a ride but no driver has accepted yet */
export interface SearchingPassenger {
  _id: string
  passenger: { name: string; phone: string }
  pickup: string
  drop: string
  estimatedFare: number
  vehicleType: string
  paymentMethod: string
  waitSeconds: number   // seconds since ride was created
  createdAt: string
}

/** A passenger whose ride was accepted — driver is en route */
export interface MatchedPassenger extends SearchingPassenger {
  driver: { name: string; phone: string; vehicle: string }
  eta: string    // e.g. "3 min"
  status: string // ACCEPTED | ARRIVED
}

export interface WaitingPassengersResponse {
  searching: SearchingPassenger[]
  matched: MatchedPassenger[]
}

// ── API functions ──────────────────────────────────────────────────────────────

/**
 * GET /admin/rides/waiting
 * Returns passengers currently waiting — split into two buckets:
 *   - searching: REQUESTED status, no driver assigned
 *   - matched:   ACCEPTED or ARRIVED status, driver en route
 */
export const getWaitingPassengers = async (): Promise<WaitingPassengersResponse> => {
  const res = await adminApi.get('/admin/rides/waiting')
  return res.data
}

/**
 * PATCH /admin/rides/:id/cancel
 * Admin force-cancels an active ride with an optional reason.
 */
export const adminCancelRide = async (
  id: string,
  reason = 'Cancelled by admin',
): Promise<{ message: string; rideId: string }> => {
  const res = await adminApi.patch(`/admin/rides/${id}/cancel`, { reason })
  return res.data
}
