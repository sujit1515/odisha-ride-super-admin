import api from './axiosinstance'

export interface RegistrationStats {
  today: number
  total: number
}

// GET /api/v1/admin/users/registrations/stats
export async function getRegistrationStats(): Promise<RegistrationStats> {
  const res = await api.get<RegistrationStats>('/admin/users/registrations/stats')
  return res.data
}