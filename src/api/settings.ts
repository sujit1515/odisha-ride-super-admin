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
  platformName:  string
  commission:    number
  supportEmail:  string
  supportPhone:  string
}) => {
  const res = await adminApi.patch("/admin/settings/general", data);
  return res.data; // { message: string, settings: Settings }
};

// PATCH /api/v1/admin/settings/fare
export const saveFareSettings = async (data: {
  baseFare:              number
  minFare:               number
  cancellationFee:       number
  perKmRate:             number
  perMinuteRate:         number
  surgeMultiplier:       number
  nightChargeMultiplier: number
}) => {
  const res = await adminApi.patch("/admin/settings/fare", data);
  return res.data; // { message: string, settings: Settings }
};