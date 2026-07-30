import adminApi from './axiosinstance'

export type OverallSystemStatus = 'healthy' | 'degraded' | 'critical'
export type ServiceConnectionStatus = 'connected' | 'disconnected'
export type SystemHealthServiceName = 'MongoDB' | 'Redis' | 'Socket.IO'

export interface SystemHealthServiceItem {
  name: SystemHealthServiceName
  status: ServiceConnectionStatus
  message: string
  checkedAt: string
}

export interface SystemHealthData {
  overallStatus: OverallSystemStatus
  lastCheckedAt: string
  services: SystemHealthServiceItem[]
}

export interface SystemHealthResponse {
  success: boolean
  message: string
  data: SystemHealthData
}

export async function getSystemHealth(): Promise<SystemHealthData> {
  const response = await adminApi.get<SystemHealthResponse>('/admin/dashboard/system-health')
  return response.data.data
}
