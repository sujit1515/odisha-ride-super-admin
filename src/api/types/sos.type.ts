export interface SosAlert {
  _id: string
  triggeredBy: 'USER' | 'DRIVER'
  name: string
  phoneNumber: string | null
  publicId?: string
  latitude: number
  longitude: number
  rideId: string | null
  createdAt: string
}

export interface ResolvedSosAlert extends SosAlert {
  status: 'RESOLVED' | 'SELF_RESOLVED'
  resolvedAt: string | null
  resolutionNote: string | null
  resolvedByLabel: string
}

export interface ResolvedAlertsResponse {
  data: ResolvedSosAlert[]
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface SosStats {
  active: number
  total: number
}