  import adminApi from '@/api/axiosinstance'
  import type { LiveMapStats } from '@/types/index'


  export const fetchOnlineDriversApi = async (): Promise<LiveMapStats> => {
    const res = await adminApi.get('/admin/drivers/online')
    console.log('API response:', res.data)
    return res.data
  }