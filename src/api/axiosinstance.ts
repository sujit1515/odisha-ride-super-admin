import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

// ── Dev-time warning so missing env is caught immediately ──────────────────
if (!BASE_URL) {
  console.error(
    "[AdminApi] ⚠️  NEXT_PUBLIC_BASE_URL is not set!\n" +
    "  Add it to .env.local:\n" +
    "  NEXT_PUBLIC_BASE_URL=http://localhost:8000/api/v1"
  );
}

const adminApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ── Request: attach admin token ────────────────────────────────────────────
adminApi.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("adminToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    // Log outgoing request URL in development for easy debugging
    if (process.env.NODE_ENV === "development") {
      console.log(`[AdminApi] → ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response: surface errors to console clearly ───────────────────────────
adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url ?? "(unknown)";
    const status = error.response?.status ?? "network error";
    const msg = error.response?.data?.message ?? error.message;
    console.error(`[AdminApi] ✗ ${status} ${url} — ${msg}`);
    return Promise.reject(error);
  }
);

export default adminApi;