import api from '@/api/axiosinstance'
import { SosAlert,ResolvedAlertsResponse,SosStats } from '@/api/types/types';


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