import adminApi from "@/api/axiosinstance";

// ── Admin Login
export const adminLogin = async (data: {
  email: string;
  password: string;
  dateOfBirth: string;
}) => {
  const res = await adminApi.post("/admin/auth/login", data);
  return res.data;
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

// ── Update Admin Profile — fixed: phoneNumber → phone, added city
export const updateAdminProfile = async (data: {
  fullName?: string;
  phone?: string;   // was phoneNumber, backend expects phone
  city?: string;    // added
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