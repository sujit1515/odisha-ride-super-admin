// import api from './axiosinstance'

// export interface SosAlert {
//   _id: string
//   triggeredBy: 'USER' | 'DRIVER'
//   name: string
//   phoneNumber: string | null
//   publicId?: string
//   latitude: number
//   longitude: number
//   rideId: string | null
//   createdAt: string
// }

// export interface SosStats {
//   active: number
//   total: number
// }

// export interface ResolvedSosAlert extends SosAlert {
//   status: 'ACTIVE' | 'RESOLVED'
//   resolvedBy: string
//   resolvedAt: string
//   resolutionNote: string | null
// }

// export async function getSosStats(): Promise<SosStats> {
//   const res = await api.get<SosStats>('/admin/sos/stats')
//   return res.data
// }

// export async function getActiveSosAlerts(): Promise<SosAlert[]> {
//   const res = await api.get<SosAlert[]>('/admin/sos/active')
//   return res.data
// }

// export async function resolveSosAlert(id: string, note?: string): Promise<ResolvedSosAlert> {
//   const res = await api.patch<ResolvedSosAlert>(`/admin/sos/${id}/resolve`, { note })
//   return res.data
// }


import api from './axiosinstance'

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

export async function getSosStats(): Promise<SosStats> {
  const res = await api.get<SosStats>('/admin/sos/stats')
  return res.data
}

export async function getActiveSosAlerts(): Promise<SosAlert[]> {
  const res = await api.get<SosAlert[]>('/admin/sos/active')
  return res.data
}

export async function getResolvedSosAlerts(
  page = 1,
  limit = 20,
): Promise<ResolvedAlertsResponse> {
  const res = await api.get<ResolvedAlertsResponse>('/admin/sos/all/resolved', {
    params: { page, limit },
  })
  return res.data
}

export async function resolveSosAlert(id: string, note?: string): Promise<void> {
  await api.patch(`/admin/sos/${id}/resolve`, { note })
}

export async function clearResolvedSosAlerts(): Promise<{ deletedCount: number }> {
  const res = await api.delete<{ deletedCount: number }>('/admin/sos/clear/resolved')
  return res.data
}