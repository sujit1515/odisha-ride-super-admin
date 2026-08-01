 export interface SearchingPassenger {
  _id: string
  passenger: { name: string; phone: string }
  pickup: string
  drop: string
  estimatedFare: number
  vehicleType: string
  paymentMethod: string
  waitSeconds: number   
  createdAt: string
}

 export interface MatchedPassenger extends SearchingPassenger {
  driver: { name: string; phone: string; vehicle: string }
  eta: string    // e.g. "3 min"
  status: string // ACCEPTED | ARRIVED
}

export interface WaitingPassengersResponse {
  searching: SearchingPassenger[]
  matched: MatchedPassenger[]
}