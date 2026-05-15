import adminApi from "@/api/axiosinstance";

export const getSettings = async () => {
  const res = await adminApi.get("/admin/settings");
  return res.data;
};

export const updateAutoApprove = async (
  autoApproveDrivers: boolean) => {
  const res = await adminApi.put("/admin/settings/auto-approve",{ autoApproveDrivers }
  );
  return res.data;
};