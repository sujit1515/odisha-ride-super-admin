import adminApi from '../../../../api/axiosinstance'
import { SearchingPassenger,WaitingPassengersResponse,MatchedPassenger } from '../../../../api/types/types'
 

export const getWaitingPassengers = async (): Promise<WaitingPassengersResponse> => {
  const res = await adminApi.get('/admin/rides/waiting')
  return res.data
}

 
export const adminCancelRide = async (
  id: string,
  reason = 'Cancelled by admin',
): Promise<{ message: string; rideId: string }> => {
  const res = await adminApi.patch(`/admin/rides/${id}/cancel`, { reason })
  return res.data
}
