'use client'

import { useState } from 'react'
import {
  TrendingUp,
  BarChart3,
  PieChart,
  Users,
  Award,
  IndianRupee,
  Calendar,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react'
import { mockAnalyticsData } from './mockData'

export default function PaymentAnalyticsCharts() {
  const [hoveredBar, setHoveredBar] = useState<number | null>(null)
  const [hoveredTrend, setHoveredTrend] = useState<number | null>(null)

  const { monthlyCollection, outstandingTrend, topPayingDrivers, methodDistribution } =
    mockAnalyticsData

  const maxMonthly = Math.max(...monthlyCollection.map((m) => m.amount))
  const maxTrend = Math.max(...outstandingTrend.map((t) => t.amount))

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">
            <TrendingUp className="h-4 w-4" />
            <span>Financial Performance & Revenue Metrics</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Payment Analytics & Trends</h2>
          <p className="text-sm text-slate-500 mt-1">
            Real-time visualization of monthly commission collections, outstanding risk curves, and channel breakdowns.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 self-start md:self-auto">
          <Sparkles className="h-4 w-4 text-blue-600" />
          <span>Live Static Analytics Dataset</span>
        </div>
      </div>

      {/* Row 1: Monthly Bar Chart & Outstanding Trend Line */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Monthly Commission Collection */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
                <BarChart3 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Monthly Commission Collected</h3>
                <p className="text-xs text-slate-500">Gross platform commission collection vs target</p>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
              +18.5% YoY Growth
            </span>
          </div>

          {/* Bar Visual */}
          <div className="pt-6 pb-2">
            <div className="h-56 flex items-end justify-between gap-2 md:gap-4 px-2 border-b border-slate-200 relative">
              {/* Background Grid Lines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
                <div className="border-b border-slate-300 w-full" />
                <div className="border-b border-slate-300 w-full" />
                <div className="border-b border-slate-300 w-full" />
              </div>

              {monthlyCollection.map((item, idx) => {
                const heightPercent = Math.round((item.amount / maxMonthly) * 100)
                const isHovered = hoveredBar === idx

                return (
                  <div
                    key={item.month}
                    className="flex-1 flex flex-col items-center group relative cursor-pointer"
                    onMouseEnter={() => setHoveredBar(idx)}
                    onMouseLeave={() => setHoveredBar(null)}
                  >
                    {/* Tooltip */}
                    {isHovered && (
                      <div className="absolute -top-12 z-10 bg-slate-900 text-white text-[11px] font-semibold py-1.5 px-3 rounded-xl shadow-lg whitespace-nowrap animate-fade-in pointer-events-none">
                        ₹{item.amount.toLocaleString('en-IN')} (Target: ₹{item.target.toLocaleString('en-IN')})
                      </div>
                    )}

                    {/* Bar */}
                    <div className="w-full max-w-[42px] bg-slate-100 rounded-t-xl overflow-hidden h-full flex items-end">
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className={`w-full rounded-t-xl transition-all duration-300 ${
                          idx === monthlyCollection.length - 1
                            ? 'bg-gradient-to-t from-blue-600 to-indigo-500'
                            : isHovered
                            ? 'bg-blue-600'
                            : 'bg-blue-500/80'
                        }`}
                      />
                    </div>
                  </div>
                )
              })}
            </div>

            {/* X Axis Labels */}
            <div className="flex justify-between px-2 pt-3 text-xs font-semibold text-slate-500">
              {monthlyCollection.map((item) => (
                <span key={item.month}>{item.month}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Chart 2: Outstanding Commission Trend */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Weekly Outstanding Risk Curve</h3>
                <p className="text-xs text-slate-500">Pending driver commission balances over 7 days</p>
              </div>
            </div>
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full">
              Avg ₹14.2k Peak
            </span>
          </div>

          {/* SVG Area Curve */}
          <div className="pt-4">
            <div className="h-56 relative w-full flex items-end">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 500 200">
                <defs>
                  <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Fill Path */}
                <path
                  d="M 0,160 L 71,130 L 142,170 L 213,110 L 284,150 L 355,190 L 426,120 L 500,160 L 500,200 L 0,200 Z"
                  fill="url(#areaGradient)"
                />

                {/* Stroke Path */}
                <path
                  d="M 0,160 L 71,130 L 142,170 L 213,110 L 284,150 L 355,190 L 426,120 L 500,160"
                  fill="none"
                  stroke="#F59E0B"
                  strokeWidth="3"
                  strokeLinecap="round"
                />

                {/* Data Points */}
                {[
                  { x: 0, y: 160, val: '₹14.2k' },
                  { x: 71, y: 130, val: '₹12.8k' },
                  { x: 142, y: 170, val: '₹16.4k' },
                  { x: 213, y: 110, val: '₹11.9k' },
                  { x: 284, y: 150, val: '₹15.1k' },
                  { x: 355, y: 190, val: '₹18.6k' },
                  { x: 426, y: 120, val: '₹11.5k' },
                ].map((pt, i) => (
                  <g key={i} className="group cursor-pointer">
                    <circle cx={pt.x} cy={pt.y} r="5" fill="#FFFFFF" stroke="#F59E0B" strokeWidth="3" />
                  </g>
                ))}
              </svg>
            </div>

            {/* X Axis */}
            <div className="flex justify-between pt-2 text-xs font-semibold text-slate-500">
              {outstandingTrend.map((t) => (
                <span key={t.date}>{t.date}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Top Paying Drivers & Payment Methods Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leaderboard: Top Paying Drivers */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600">
                <Award className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Top Paying Drivers Leaderboard</h3>
                <p className="text-xs text-slate-500">Highest commission contributors on platform</p>
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            {topPayingDrivers.map((driver, index) => {
              const maxPaid = topPayingDrivers[0].totalPaid
              const barWidth = Math.round((driver.totalPaid / maxPaid) * 100)

              return (
                <div
                  key={driver.name}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 hover:bg-slate-100/80 transition-colors"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span
                        className={`h-7 w-7 rounded-xl flex items-center justify-center font-bold text-xs ${
                          index === 0
                            ? 'bg-amber-400 text-slate-900 shadow-xs'
                            : index === 1
                            ? 'bg-slate-300 text-slate-800'
                            : index === 2
                            ? 'bg-amber-700 text-white'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        #{index + 1}
                      </span>
                      <img
                        src={driver.avatar}
                        alt={driver.name}
                        className="h-9 w-9 rounded-full object-cover border border-slate-300"
                      />
                      <div>
                        <h4 className="font-bold text-slate-900 text-xs">{driver.name}</h4>
                        <span className="text-[11px] text-slate-500">{driver.vehicle} &bull; {driver.rides} rides</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-extrabold text-slate-900 text-sm">
                        ₹{driver.totalPaid.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] text-slate-400 block">Total Paid</span>
                    </div>
                  </div>

                  {/* Progress Line */}
                  <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${barWidth}%` }}
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Donut Chart: Payment Methods Distribution */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
              <PieChart className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Payment Method Mix</h3>
              <p className="text-xs text-slate-500">Distribution by collection channel</p>
            </div>
          </div>

          {/* Donut SVG */}
          <div className="flex flex-col items-center justify-center py-4">
            <div className="relative h-44 w-44">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                {/* UPI - 55% */}
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="transparent"
                  stroke="#1A73E8"
                  strokeWidth="5"
                  strokeDasharray="55 100"
                  strokeDashoffset="0"
                />
                {/* Cash - 25% */}
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="transparent"
                  stroke="#10B981"
                  strokeWidth="5"
                  strokeDasharray="25 100"
                  strokeDashoffset="-55"
                />
                {/* Razorpay - 15% */}
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="transparent"
                  stroke="#8B5CF6"
                  strokeWidth="5"
                  strokeDasharray="15 100"
                  strokeDashoffset="-80"
                />
                {/* Bank - 5% */}
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="transparent"
                  stroke="#F59E0B"
                  strokeWidth="5"
                  strokeDasharray="5 100"
                  strokeDashoffset="-95"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-xs text-slate-400 font-medium">Dominant</span>
                <span className="text-xl font-extrabold text-blue-600">UPI 55%</span>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
            {methodDistribution.map((m) => (
              <div key={m.method} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: m.color }}
                  />
                  <span className="font-semibold text-slate-800">{m.method}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">{m.percentage}%</span>
                  <span className="text-slate-400 text-[11px]">(₹{m.amount.toLocaleString('en-IN')})</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
