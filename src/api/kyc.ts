 import adminApi from "@/api/axiosinstance";

// unchanged
export const getPendingDrivers = async () => {
    const res = await adminApi.get("/admin/drivers/pending");
    return res.data;
};

// unchanged
export const getAllDrivers = async (status?: string) => {
    const res = await adminApi.get("/admin/drivers", {
        params: status ? { status } : {},
    });
    return res.data;
};

// changed: /admin/drivers/by-driver-id/ODR-DRV-000003
export const getDriverById = async (driverId: string) => {
    const res = await adminApi.get(`/admin/drivers/by-driver-id/${driverId}`);
    return res.data;
};

// changed: /admin/drivers/approve/by-driver-id/ODR-DRV-000003
export const approveDriver = async (driverId: string, data: { note?: string }) => {
    const res = await adminApi.put(`/admin/drivers/approve/by-driver-id/${driverId}`, data);
    return res.data;
};

// changed: /admin/drivers/reject/by-driver-id/ODR-DRV-000003
export const rejectDriver = async (driverId: string, data: { reason: string }) => {
    const res = await adminApi.put(`/admin/drivers/reject/by-driver-id/${driverId}`, data);
    return res.data;
};

// changed: /admin/drivers/block/by-driver-id/ODR-DRV-000003
export const blockDriver = async (driverId: string, data: { reason: string }) => {
    const res = await adminApi.put(`/admin/drivers/block/by-driver-id/${driverId}`, data);
    return res.data;
};

//GEt all blocked drivers
export const getBlockedDrivers = async () => {
    const res = await adminApi.get("/admin/drivers/blocked");
    return res.data;
};

// changed: /admin/drivers/unblock/by-driver-id/ODR-DRV-000003
export const unblockDriver = async (driverId: string) => {
    const res = await adminApi.put(`/admin/drivers/unblock/by-driver-id/${driverId}`);
    return res.data;
};