import adminApi from "@/api/axiosinstance";

// GET /api/v1/admin/settings
export const getSettings = async () => {
  const res = await adminApi.get("/admin/settings");
  return res.data;
};

// PUT /api/v1/admin/settings/auto-approve
export const updateAutoApprove = async (autoApproveDrivers: boolean) => {
  const res = await adminApi.put("/admin/settings/auto-approve", { autoApproveDrivers });
  return res.data;
};

// PATCH /api/v1/admin/settings/general
export const saveGeneralSettings = async (data: {
  platformName?: string | null
  commission?: number
  supportEmail?: string | null
  supportPhone?: string | null
  platformFee?: number
  taxPercentage?: number
}) => {                   
  // Filter out null/undefined values
  const cleanData: Record<string, string | number> = {}; 

  if (data.platformName !== null && data.platformName !== undefined) {
    cleanData.platformName = data.platformName;
  }
  if (data.commission !== null && data.commission !== undefined) {
    cleanData.commission = data.commission;
  }
  if (data.supportEmail !== null && data.supportEmail !== undefined) {
    cleanData.supportEmail = data.supportEmail;
  }
  if (data.supportPhone !== null && data.supportPhone !== undefined) {
    cleanData.supportPhone = data.supportPhone;
  }
  if (data.platformFee !== null && data.platformFee !== undefined) {
    cleanData.platformFee = data.platformFee;
  }
  if (data.taxPercentage !== null && data.taxPercentage !== undefined) {
    cleanData.taxPercentage = data.taxPercentage;
  }

  const res = await adminApi.patch("/admin/settings/general", cleanData);
  return res.data; // { message: string, settings: Settings }
};

// PATCH /api/v1/admin/settings/fare
export const saveFareSettings = async (data: any) => {
  const res = await adminApi.patch("/admin/settings/fare", data);
  return res.data; // { message: string, settings: Settings }
};

// PATCH /api/v1/admin/settings/ride
// Save Ride Configuration (Driver Matching & ETA settings)
export const saveRideSettings = async (data: {
  searchRadiiKm?: number[];
  etaTieThresholdMin?: number;
  maxWaitingTime?: number;
}) => {
  const res = await adminApi.patch("/admin/settings/ride", data);
  return res.data; // { message: string, settings: Settings }
};