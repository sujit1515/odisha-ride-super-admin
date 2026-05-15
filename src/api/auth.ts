import adminApi from "./axiosinstance";

// ── Admin Login
// Backend expects: email + password + dateOfBirth (DD/MM/YYYY)
// Backend returns: { message, token, admin }
export const adminLogin = async (data: {
  email: string;
  password: string;
  dateOfBirth: string;   // ✅ required by backend DTO
}) => {
  const res = await adminApi.post("/admin/auth/login", data);
  return res.data;  // { message, token, admin }
};

// ── Admin Logout
export const adminLogout = async () => {
  const res = await adminApi.post("/superadmin/auth/logout");
  localStorage.removeItem("adminToken");
  return res.data;
};

// ── Get Admin Profile
export const getAdminProfile = async () => {
  const res = await adminApi.get("/superadmin/profile");
  return res.data;
};

// ── Update Admin Profile
export const updateAdminProfile = async (data: {
  fullName?: string;
  phoneNumber?: string;
}) => {
  const res = await adminApi.put("/superadmin/profile", data);
  return res.data;
};

// ── Change Admin Password
export const changeAdminPassword = async (data: {
  currentPassword: string;
  newPassword: string;
}) => {
  const res = await adminApi.put("/superadmin/change-password", data);
  return res.data;
};