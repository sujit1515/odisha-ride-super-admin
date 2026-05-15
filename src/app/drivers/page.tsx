'use client'

import { useState, useEffect, useRef } from "react";
import AdminShell from '@/components/Common/AdminShell';

// ─── Types ───────────────────────────────────────────────────────────────────

type DriverStatus = "Online" | "On Ride" | "Offline" | "Blocked" | "Pending";

interface Driver {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  language: string;
  avatar: string;
  vehicle: string;
  vehicleType: string;
  plate: string;
  color: string;
  rating: number;
  trips: number;
  earnings: number;
  status: DriverStatus;
  lastActive: string;
  joinedDate: string;
  licenseNumber: string;
  kycStatus: "Approved" | "Pending" | "Rejected";
  safetyScore: number;
  earningsTrend: number[];
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_DRIVERS: Driver[] = [
  {
    id: "DRV-8821",
    name: "Alex Murphy",
    phone: "+1 (555) 012-3456",
    email: "alex.m@swiftride.com",
    address: "782 Brooklyn St, NY",
    language: "English, Spanish",
    avatar: "AM",
    vehicle: "Toyota Camry 2022",
    vehicleType: "Sedan",
    plate: "NYC-4589",
    color: "Silver",
    rating: 4.92,
    trips: 1402,
    earnings: 28450,
    status: "Online",
    lastActive: "Just now",
    joinedDate: "Oct 12, 2021",
    licenseNumber: "DL-882120-NY",
    kycStatus: "Approved",
    safetyScore: 98,
    earningsTrend: [220, 280, 195, 310, 260, 340, 295],
  },
  {
    id: "DRV-7712",
    name: "Sarah Jenkins",
    phone: "+1 (555) 867-8542",
    email: "sarah.j@swiftride.com",
    address: "45 Maple Ave, TX",
    language: "English",
    avatar: "SJ",
    vehicle: "Honda CR-V 2021",
    vehicleType: "SUV",
    plate: "TX-8021",
    color: "White",
    rating: 4.85,
    trips: 892,
    earnings: 19200,
    status: "On Ride",
    lastActive: "Active now",
    joinedDate: "Mar 5, 2022",
    licenseNumber: "DL-771200-TX",
    kycStatus: "Approved",
    safetyScore: 94,
    earningsTrend: [150, 190, 220, 175, 240, 210, 255],
  },
  {
    id: "DRV-5540",
    name: "Marcus Thompson",
    phone: "+1 (555) 334-9021",
    email: "marcus.t@swiftride.com",
    address: "91 Oak Street, CA",
    language: "English, French",
    avatar: "MT",
    vehicle: "Ford Explorer 2020",
    vehicleType: "SUV",
    plate: "CA-5540",
    color: "Black",
    rating: 4.71,
    trips: 654,
    earnings: 14800,
    status: "Offline",
    lastActive: "2 hrs ago",
    joinedDate: "Jul 18, 2022",
    licenseNumber: "DL-554000-CA",
    kycStatus: "Approved",
    safetyScore: 89,
    earningsTrend: [110, 140, 120, 160, 130, 155, 140],
  },
  {
    id: "DRV-3391",
    name: "Priya Sharma",
    phone: "+1 (555) 220-7788",
    email: "priya.s@swiftride.com",
    address: "23 Elm Road, WA",
    language: "English, Hindi",
    avatar: "PS",
    vehicle: "Tesla Model 3 2023",
    vehicleType: "EV Sedan",
    plate: "WA-3391",
    color: "White",
    rating: 4.97,
    trips: 2104,
    earnings: 44200,
    status: "Online",
    lastActive: "Just now",
    joinedDate: "Jan 9, 2021",
    licenseNumber: "DL-339100-WA",
    kycStatus: "Approved",
    safetyScore: 99,
    earningsTrend: [310, 350, 290, 400, 360, 420, 390],
  },
  {
    id: "DRV-2205",
    name: "James Okafor",
    phone: "+1 (555) 441-6610",
    email: "james.o@swiftride.com",
    address: "156 Pine Blvd, IL",
    language: "English",
    avatar: "JO",
    vehicle: "Chevrolet Malibu 2021",
    vehicleType: "Sedan",
    plate: "IL-2205",
    color: "Gray",
    rating: 4.62,
    trips: 431,
    earnings: 9800,
    status: "Pending",
    lastActive: "1 day ago",
    joinedDate: "Dec 3, 2023",
    licenseNumber: "DL-220500-IL",
    kycStatus: "Pending",
    safetyScore: 82,
    earningsTrend: [60, 80, 55, 95, 70, 90, 75],
  },
  {
    id: "DRV-9901",
    name: "Lisa Chen",
    phone: "+1 (555) 772-0034",
    email: "lisa.c@swiftride.com",
    address: "78 Harbor View, FL",
    language: "English, Mandarin",
    avatar: "LC",
    vehicle: "Nissan Altima 2022",
    vehicleType: "Sedan",
    plate: "FL-9901",
    color: "Blue",
    rating: 4.88,
    trips: 1188,
    earnings: 26100,
    status: "On Ride",
    lastActive: "Active now",
    joinedDate: "Apr 14, 2022",
    licenseNumber: "DL-990100-FL",
    kycStatus: "Approved",
    safetyScore: 96,
    earningsTrend: [200, 240, 210, 280, 250, 300, 270],
  },
  {
    id: "DRV-1154",
    name: "David Reyes",
    phone: "+1 (555) 903-5521",
    email: "david.r@swiftride.com",
    address: "302 Cedar Lane, AZ",
    language: "English, Spanish",
    avatar: "DR",
    vehicle: "Hyundai Sonata 2020",
    vehicleType: "Sedan",
    plate: "AZ-1154",
    color: "Red",
    rating: 3.90,
    trips: 298,
    earnings: 6200,
    status: "Blocked",
    lastActive: "5 days ago",
    joinedDate: "Aug 22, 2023",
    licenseNumber: "DL-115400-AZ",
    kycStatus: "Rejected",
    safetyScore: 61,
    earningsTrend: [80, 60, 50, 40, 30, 20, 10],
  },
  {
    id: "DRV-6673",
    name: "Nina Patel",
    phone: "+1 (555) 119-8843",
    email: "nina.p@swiftride.com",
    address: "67 Willow St, NJ",
    language: "English, Gujarati",
    avatar: "NP",
    vehicle: "Kia Stinger 2022",
    vehicleType: "Sports",
    plate: "NJ-6673",
    color: "Black",
    rating: 4.79,
    trips: 877,
    earnings: 21500,
    status: "Online",
    lastActive: "12 min ago",
    joinedDate: "Feb 28, 2022",
    licenseNumber: "DL-667300-NJ",
    kycStatus: "Approved",
    safetyScore: 92,
    earningsTrend: [180, 200, 175, 230, 210, 260, 240],
  },
];

// ─── Subcomponents ────────────────────────────────────────────────────────────

const statusConfig: Record<DriverStatus, { bg: string; text: string; dot: string; label: string }> = {
  Online: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500", label: "Online" },
  "On Ride": { bg: "bg-orange-50", text: "text-orange-700", dot: "bg-orange-500", label: "On Ride" },
  Offline: { bg: "bg-gray-100", text: "text-gray-600", dot: "bg-gray-400", label: "Offline" },
  Blocked: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500", label: "Blocked" },
  Pending: { bg: "bg-yellow-50", text: "text-yellow-700", dot: "bg-yellow-500", label: "Pending" },
};

const avatarColors: Record<string, string> = {
  AM: "bg-blue-100 text-blue-700",
  SJ: "bg-purple-100 text-purple-700",
  MT: "bg-orange-100 text-orange-700",
  PS: "bg-teal-100 text-teal-700",
  JO: "bg-yellow-100 text-yellow-700",
  LC: "bg-pink-100 text-pink-700",
  DR: "bg-red-100 text-red-700",
  NP: "bg-indigo-100 text-indigo-700",
};

function StatusBadge({ status }: { status: DriverStatus }) {
  const cfg = statusConfig[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${cfg.bg} ${cfg.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} ${status === "Online" ? "animate-pulse" : ""}`} />
      {cfg.label}
    </span>
  );
}

function Avatar({ initials, size = "md" }: { initials: string; size?: "sm" | "md" | "lg" }) {
  const sizeClasses = { sm: "w-8 h-8 text-xs", md: "w-9 h-9 text-sm", lg: "w-16 h-16 text-xl" };
  const colorClass = avatarColors[initials] ?? "bg-gray-100 text-gray-600";
  return (
    <div className={`${sizeClasses[size]} ${colorClass} rounded-full flex items-center justify-center font-semibold flex-shrink-0`}>
      {initials}
    </div>
  );
}

function MiniTrendGraph({ data }: { data: number[] }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 56, h = 24;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 4) - 2;
    return `${x},${y}`;
  }).join(" ");
  const trend = data[data.length - 1] > data[0];
  const color = trend ? "#10b981" : "#ef4444";
  return (
    <svg width={w} height={h} className="overflow-visible">
      <polyline fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" points={points} />
    </svg>
  );
}

function SkeletonRow() {
  return (
    <tr className="border-b border-gray-100">
      {Array.from({ length: 9 }).map((_, i) => (
        <td key={i} className="px-4 py-3.5">
          <div className="h-4 bg-gray-100 rounded animate-pulse" style={{ width: `${60 + Math.random() * 40}%` }} />
        </td>
      ))}
    </tr>
  );
}

// ─── Driver Profile Drawer ────────────────────────────────────────────────────

function DriverDrawer({ driver, onClose }: { driver: Driver | null; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!driver) return null;

  const kycColors: Record<string, string> = {
    Approved: "text-emerald-600",
    Pending: "text-yellow-600",
    Rejected: "text-red-600",
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        ref={ref}
        className="fixed right-0 top-0 h-full w-full max-w-[420px] bg-white z-50 shadow-2xl flex flex-col overflow-hidden transition-transform"
        style={{ animation: "slideIn 0.25s ease-out" }}
      >
        <style>{`@keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }`}</style>

        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-900">Driver Profile</h2>
          <div className="flex items-center gap-2">
            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-red-400 transition-colors" title="Block driver">
              <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 transition-colors" title="Edit">
              <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </button>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
              <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          {/* Profile hero */}
          <div className="flex flex-col items-center pt-6 pb-5 px-5">
            <div className="relative mb-3">
              <Avatar initials={driver.avatar} size="lg" />
              <span className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${driver.status === "Online" ? "bg-emerald-500" : driver.status === "On Ride" ? "bg-orange-500" : "bg-gray-400"}`} />
            </div>
            <p className="text-base font-semibold text-gray-900">{driver.name}</p>
            <p className="text-xs text-gray-500 mt-0.5">Active since {driver.joinedDate}</p>
          </div>

          {/* Stats row */}
          <div className="mx-5 grid grid-cols-3 rounded-xl border border-gray-100 bg-gray-50 overflow-hidden mb-5">
            {[
              { label: "Rating", value: driver.rating.toFixed(2) },
              { label: "Trips", value: driver.trips >= 1000 ? `${(driver.trips / 1000).toFixed(1)}K` : driver.trips },
              { label: "Safety", value: `${driver.safetyScore}%` },
            ].map((stat, i) => (
              <div key={stat.label} className={`flex flex-col items-center py-3.5 ${i < 2 ? "border-r border-gray-100" : ""}`}>
                <p className="text-[11px] uppercase tracking-widest text-gray-400 font-medium mb-1">{stat.label}</p>
                <p className="text-lg font-semibold text-gray-900">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Personal info */}
          <div className="px-5 mb-5">
            <p className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold mb-3">Personal Information</p>
            <div className="space-y-3">
              {[
                { label: "Email Address", value: driver.email },
                { label: "Phone Number", value: driver.phone },
                { label: "Address", value: driver.address },
                { label: "Language", value: driver.language },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between gap-4">
                  <span className="text-xs text-gray-500">{label}</span>
                  <span className="text-xs text-gray-900 font-medium text-right">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mx-5 border-t border-gray-100 mb-5" />

          {/* Vehicle details */}
          <div className="px-5 mb-5">
            <p className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold mb-3">Vehicle Details</p>
            <div className="flex items-center gap-3 bg-blue-50 rounded-xl p-3.5">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#2563eb" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"/>
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900">{driver.vehicle}</p>
                <p className="text-xs text-gray-500">Plate: {driver.plate} · {driver.color}</p>
              </div>
              <span className="text-[10px] font-semibold text-blue-700 bg-blue-100 px-2 py-1 rounded-md">{driver.vehicleType}</span>
            </div>
          </div>

          <div className="mx-5 border-t border-gray-100 mb-5" />

          {/* KYC Documents */}
          <div className="px-5 mb-5">
            <p className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold mb-3">KYC Documents</p>
            <div className="space-y-2">
              {[
                { label: "Driver's License", approved: driver.kycStatus === "Approved" },
                { label: "Background Check", approved: driver.kycStatus === "Approved" },
                { label: "Vehicle Insurance", approved: driver.kycStatus === "Approved" },
              ].map(({ label, approved }) => (
                <div key={label} className="flex items-center justify-between px-3.5 py-3 rounded-lg border border-gray-100">
                  <div className="flex items-center gap-2.5">
                    <svg width="15" height="15" fill="none" stroke="#6b7280" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="2"/><line x1="7" y1="9" x2="17" y2="9"/><line x1="7" y1="13" x2="14" y2="13"/></svg>
                    <span className="text-sm text-gray-700">{label}</span>
                  </div>
                  {approved
                    ? <svg width="18" height="18" fill="none" stroke="#10b981" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="9 12 11 14 15 10"/></svg>
                    : <svg width="18" height="18" fill="none" stroke="#f59e0b" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  }
                </div>
              ))}
            </div>
          </div>

          {/* Earnings summary */}
          <div className="px-5 mb-5">
            <p className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold mb-3">Earnings Summary</p>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-end justify-between mb-3">
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Total Earnings</p>
                  <p className="text-2xl font-bold text-gray-900">${driver.earnings.toLocaleString()}</p>
                </div>
                <MiniTrendGraph data={driver.earningsTrend} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white rounded-lg p-3 border border-gray-100">
                  <p className="text-[10px] text-gray-400 mb-1">This Month</p>
                  <p className="text-sm font-semibold text-gray-900">${Math.round(driver.earnings * 0.08).toLocaleString()}</p>
                </div>
                <div className="bg-white rounded-lg p-3 border border-gray-100">
                  <p className="text-[10px] text-gray-400 mb-1">Avg / Trip</p>
                  <p className="text-sm font-semibold text-gray-900">${Math.round(driver.earnings / driver.trips)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Rides */}
          <div className="px-5 mb-6">
            <p className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold mb-3">Recent Rides</p>
            <div className="space-y-2">
              {[
                { from: "Brooklyn Bridge", to: "Times Square", fare: "$18.40", time: "2h ago" },
                { from: "JFK Airport", to: "Manhattan", fare: "$52.00", time: "5h ago" },
                { from: "Central Park", to: "Chelsea", fare: "$12.80", time: "Yesterday" },
              ].map((ride, i) => (
                <div key={i} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="text-xs font-medium text-gray-900">{ride.from} → {ride.to}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">{ride.time}</p>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{ride.fare}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sticky footer actions */}
        <div className="px-5 py-4 border-t border-gray-100 grid grid-cols-2 gap-3 bg-white">
          <button className="py-2.5 px-4 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            Reject KYC
          </button>
          <button className="py-2.5 px-4 rounded-xl bg-blue-600 text-sm font-semibold text-white hover:bg-blue-700 transition-colors">
            Approve KYC
          </button>
        </div>
      </div>
    </>
  );
}

// ─── Main Drivers Page Component ──────────────────────────────────────────────

export default function DriversPage() {
  const [drivers] = useState<Driver[]>(MOCK_DRIVERS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [vehicleFilter, setVehicleFilter] = useState("All");
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const driversPerPage = 6;

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(t);
  }, []);

  const filtered = drivers.filter((d) => {
    const matchesSearch =
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.id.toLowerCase().includes(search.toLowerCase()) ||
      d.phone.includes(search);
    const matchesStatus = statusFilter === "All" || d.status === statusFilter;
    const matchesVehicle = vehicleFilter === "All" || d.vehicleType === vehicleFilter;
    return matchesSearch && matchesStatus && matchesVehicle;
  });

  const totalPages = Math.ceil(filtered.length / driversPerPage);
  const paginated = filtered.slice((currentPage - 1) * driversPerPage, currentPage * driversPerPage);

  const stats = {
    total: drivers.length,
    online: drivers.filter((d) => d.status === "Online").length,
    onRide: drivers.filter((d) => d.status === "On Ride").length,
    offline: drivers.filter((d) => d.status === "Offline").length,
    pending: drivers.filter((d) => d.status === "Pending").length,
  };

  const statCards = [
    { label: "Total Drivers", value: stats.total, icon: "👤", color: "text-blue-600", bg: "bg-blue-50", trend: "+12%" },
    { label: "Online", value: stats.online, icon: "🟢", color: "text-emerald-600", bg: "bg-emerald-50", trend: "+4" },
    { label: "On Ride", value: stats.onRide, icon: "🚗", color: "text-orange-600", bg: "bg-orange-50", trend: "+2" },
    { label: "Offline", value: stats.offline, icon: "⭕", color: "text-gray-500", bg: "bg-gray-100", trend: "-1" },
    { label: "Pending KYC", value: stats.pending, icon: "⏳", color: "text-yellow-600", bg: "bg-yellow-50", trend: "+1" },
  ];

  return (
    <AdminShell title="Drivers Management">
      <div className="min-h-screen bg-gray-50/50 p-4 sm:p-6 lg:p-8">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Drivers</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage all registered drivers and their operational status.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
          {statCards.map((card) => (
            <div
              key={card.label}
              className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-default"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-9 h-9 rounded-lg ${card.bg} flex items-center justify-center text-base`}>
                  <span>{card.icon}</span>
                </div>
                <span className={`text-xs font-medium ${card.color} ${card.bg} px-2 py-0.5 rounded-full`}>
                  {card.trend}
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900 leading-none mb-1">{card.value.toLocaleString()}</p>
              <p className="text-xs text-gray-500 font-medium">{card.label}</p>
            </div>
          ))}
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-xl border border-gray-100 px-4 py-3 mb-4 flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="text"
              placeholder="Search by name, ID or phone..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all bg-white text-gray-700 min-w-[120px]"
          >
            {["All", "Online", "On Ride", "Offline", "Blocked", "Pending"].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>

          {/* Vehicle Filter */}
          <select
            value={vehicleFilter}
            onChange={(e) => { setVehicleFilter(e.target.value); setCurrentPage(1); }}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all bg-white text-gray-700 min-w-[120px]"
          >
            {["All", "Sedan", "SUV", "Sports", "EV Sedan"].map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>

          {/* Date Filter */}
          <input
            type="date"
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all bg-white text-gray-700"
          />

          <div className="flex items-center gap-2 ml-auto">
            {/* Export */}
            <button className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Export
            </button>

            {/* Add Driver */}
            <button className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Add Driver
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/70">
                  {["Driver ID", "Profile", "Vehicle", "Rating", "Trips", "Earnings", "Status", "Last Active", "Actions"].map((col) => (
                    <th
                      key={col}
                      className="px-4 py-3 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading
                  ? Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
                  : paginated.length === 0
                  ? (
                    <tr>
                      <td colSpan={9} className="px-4 py-20 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-2xl">🔍</div>
                          <p className="text-sm font-medium text-gray-900">No drivers found</p>
                          <p className="text-xs text-gray-500">Try adjusting your search or filters</p>
                        </div>
                      </td>
                    </tr>
                  )
                  : paginated.map((driver, idx) => (
                    <tr
                      key={driver.id}
                      className={`border-b border-gray-50 hover:bg-blue-50/30 transition-colors ${idx % 2 === 0 ? "" : "bg-gray-50/30"}`}
                    >
                      {/* Driver ID */}
                      <td className="px-4 py-3.5">
                        <span className="text-xs font-mono font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          #{driver.id}
                        </span>
                      </td>

                      {/* Profile */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <Avatar initials={driver.avatar} size="sm" />
                          <div>
                            <p className="text-sm font-semibold text-gray-900 whitespace-nowrap">{driver.name}</p>
                            <p className="text-xs text-gray-400">{driver.phone}</p>
                          </div>
                        </div>
                      </td>

                      {/* Vehicle */}
                      <td className="px-4 py-3.5">
                        <p className="text-sm text-gray-900 whitespace-nowrap">{driver.vehicle}</p>
                        <p className="text-xs text-gray-400">{driver.plate} · {driver.color}</p>
                      </td>

                      {/* Rating */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1">
                          <svg width="12" height="12" fill="#f59e0b" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                          <span className="text-sm font-semibold text-gray-900">{driver.rating.toFixed(2)}</span>
                        </div>
                      </td>

                      {/* Trips */}
                      <td className="px-4 py-3.5">
                        <span className="text-sm text-gray-900">{driver.trips.toLocaleString()}</span>
                      </td>

                      {/* Earnings */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-900">${driver.earnings.toLocaleString()}</span>
                          <MiniTrendGraph data={driver.earningsTrend} />
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5">
                        <StatusBadge status={driver.status} />
                      </td>

                      {/* Last Active */}
                      <td className="px-4 py-3.5">
                        <span className="text-xs text-gray-500">{driver.lastActive}</span>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5 relative">
                        <button
                          onClick={() => setOpenMenuId(openMenuId === driver.id ? null : driver.id)}
                          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors text-gray-500"
                        >
                          <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/></svg>
                        </button>

                        {openMenuId === driver.id && (
                          <div
                            className="absolute right-2 top-12 z-30 bg-white rounded-xl border border-gray-100 shadow-xl py-1.5 min-w-[160px]"
                            onMouseLeave={() => setOpenMenuId(null)}
                          >
                            {[
                              { label: "View Profile", action: () => { setSelectedDriver(driver); setOpenMenuId(null); } },
                              { label: "Approve", action: () => setOpenMenuId(null) },
                              { label: "Reject", action: () => setOpenMenuId(null) },
                              { label: "Block Driver", action: () => setOpenMenuId(null), danger: true },
                              { label: "Contact Driver", action: () => setOpenMenuId(null) },
                            ].map(({ label, action, danger }) => (
                              <button
                                key={label}
                                onClick={action}
                                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${danger ? "text-red-600" : "text-gray-700"}`}
                              >
                                {label}
                              </button>
                            ))}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!loading && filtered.length > 0 && (
            <div className="px-4 py-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-gray-500">
                Showing <span className="font-medium text-gray-900">{(currentPage - 1) * driversPerPage + 1}</span>–
                <span className="font-medium text-gray-900">{Math.min(currentPage * driversPerPage, filtered.length)}</span> of{" "}
                <span className="font-medium text-gray-900">{filtered.length}</span> drivers
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 text-xs font-medium border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-7 h-7 text-xs font-medium rounded-lg transition-colors ${
                      currentPage === i + 1
                        ? "bg-blue-600 text-white"
                        : "border border-gray-200 hover:bg-gray-50 text-gray-600"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 text-xs font-medium border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Driver Profile Drawer */}
        <DriverDrawer driver={selectedDriver} onClose={() => setSelectedDriver(null)} />
      </div>
    </AdminShell>
  );
}