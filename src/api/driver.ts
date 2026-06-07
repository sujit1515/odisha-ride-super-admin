import api from './axiosinstance'

export interface DriverStatusSummary {
  online:  number
  onRide:  number
  offline: number
  total:   number
}

// GET /api/v1/admin/drivers/status-summary
export async function getDriverStatusSummary(): Promise<DriverStatusSummary> {
  const res = await api.get<DriverStatusSummary>('/admin/drivers/status-summary')
  return res.data
}