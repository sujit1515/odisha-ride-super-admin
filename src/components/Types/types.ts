// Dashboard
export type RideStatus = 'Completed' | 'Ongoing' | 'Cancelled' | 'Pending'

export interface MappedRide {
  id: string
  displayId: string
  passenger: string
  driver: string
  fare: number
  status: RideStatus
  time: string
}

