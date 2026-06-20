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

export async function resolveSosAlert(id: string, note?: string): Promise<void> {
  await api.patch(`/admin/sos/${id}/resolve`, { note })
}