import adminApi from './axiosinstance';
import { Passenger,PassengersResponse,PassengerStats,} from './types/types';
export type { Passenger, PassengersResponse, PassengerStats };

// GET all passengers
export const getPassengers = async (
  page = 1,
  limit = 10,
  search = '',
): Promise<PassengersResponse> => {
  const res = await adminApi.get('/admin/users', {
    params: { page, limit, search },
  });

  return res.data;
};

// GET stats
export const getPassengerStats = async (): Promise<PassengerStats> => {
  const res = await adminApi.get('/admin/users/stats');
  return res.data;
};

// GET single passenger
export const getPassengerById = async (
  id: string,
): Promise<Passenger> => {
  const res = await adminApi.get(`/admin/users/${id}`);
  return res.data;
};

// ACTIVATE passenger
export const activatePassenger = async (id: string) => {
  const res = await adminApi.put(`/admin/users/${id}/activate`);
  return res.data;
};

// DEACTIVATE passenger
export const deactivatePassenger = async (id: string, reason: string) => {
  const res = await adminApi.put(`/admin/users/${id}/deactivate`, { reason });
  return res.data;
};

// DELETE passenger
export const deletePassenger = async (id: string) => {
  const res = await adminApi.delete(`/admin/users/${id}`);
  return res.data;
};