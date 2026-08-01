'use client'
import { useState, useMemo, useEffect, useRef } from 'react'
import AdminShell from '@/components/Common/AdminShell'
import { TrendingUp, Wallet, Banknote, RotateCcw, LucideIcon, ChevronLeft, ChevronRight } from 'lucide-react'
import Chart from 'chart.js/auto'

// Types
interface DailyRevenue {
  day: number
  v: number
}

interface MonthData {
  totalRevenue: number
  driverPayouts: number
  platformFee: number
  refunds: number
  daily: DailyRevenue[]
}

interface SummaryCard {
  label: string
  value: number
  icon: LucideIcon
  color: string
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

// Deterministic mock daily data generator per month (replace with real API data)
function generateMonthData(monthIndex: number, year: number): MonthData {
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate()
  const daily: DailyRevenue[] = []
  let totalRevenue = 0

  for (let day = 1; day <= daysInMonth; day++) {
    const seed = (monthIndex + 1) * 31 + day
    const base = 8000 + ((seed * 37) % 9000)
    const weekendBoost = (day + monthIndex) % 7 === 0 ? 3000 : 0
    const v = base + weekendBoost
    daily.push({ day, v })
    totalRevenue += v
  }

  const driverPayouts = Math.round(totalRevenue * 0.7)
  const platformFee = Math.round(totalRevenue * 0.15)
  const refunds = Math.round(totalRevenue * 0.015)

  return { totalRevenue, driverPayouts, platformFee, refunds, daily }
}

export default function EarningsPage() {
  const today = new Date()
  const [monthIndex, setMonthIndex] = useState(today.getMonth())
  const [year, setYear] = useState(today.getFullYear())

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const chartRef = useRef<Chart | null>(null)

  const monthData = useMemo(() => generateMonthData(monthIndex, year), [monthIndex, year])
  const max = Math.max(...monthData.daily.map(d => d.v))

  const cards: SummaryCard[] = [
    { label: 'Total Revenue', value: monthData.totalRevenue, icon: TrendingUp, color: 'text-emerald-600 bg-emerald-50' },
    { label: 'Driver Payouts', value: monthData.driverPayouts, icon: Wallet, color: 'text-blue-600 bg-blue-50' },
    { label: 'Platform Fee', value: monthData.platformFee, icon: Banknote, color: 'text-purple-600 bg-purple-50' },
    { label: 'Refunds Issued', value: monthData.refunds, icon: RotateCcw, color: 'text-red-600 bg-red-50' },
  ]

  useEffect(() => {
    if (!canvasRef.current) return
    if (chartRef.current) chartRef.current.destroy()

    chartRef.current = new Chart(canvasRef.current, {
      type: 'line',
      data: {
        labels: monthData.daily.map(d => d.day),
        datasets: [{
          data: monthData.daily.map(d => d.v),
          borderColor: '#1baf7a',
          backgroundColor: 'rgba(27,175,122,0.08)',
          fill: true,
          tension: 0.35,
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: '#1baf7a',
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              title: (items) => `Day ${items[0].label}`,
              label: (item) => `₹${(item.parsed.y ?? 0).toLocaleString()}`,
            },
          },
        },
        scales: {
          x: { grid: { display: false }, ticks: { maxRotation: 0, autoSkip: true, maxTicksLimit: 10 } },
          y: { grid: { display: false }, ticks: { callback: (v) => `₹${Number(v) / 1000}k` } },
        },
      },
    })

    return () => chartRef.current?.destroy()
  }, [monthData])

  const goPrevMonth = () => {
    if (monthIndex === 0) {
      setMonthIndex(11)
      setYear(y => y - 1)
    } else {
      setMonthIndex(m => m - 1)
    }
  }

  const goNextMonth = () => {
    if (monthIndex === 11) {
      setMonthIndex(0)
      setYear(y => y + 1)
    } else {
      setMonthIndex(m => m + 1)
    }
  }

  return (
    <AdminShell title="Earnings">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
            <div className={`h-10 w-10 rounded-full flex items-center justify-center ${c.color}`}>
              <c.icon className="h-5 w-5" />
            </div>
            <div className="mt-4 text-sm text-slate-500">{c.label}</div>
            <div className="mt-1 text-2xl font-bold">₹{c.value.toLocaleString()}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-800">Daily Revenue</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={goPrevMonth}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600"
              aria-label="Previous month"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-sm font-medium text-slate-700 w-32 text-center">
              {MONTH_NAMES[monthIndex]} {year}
            </span>
            <button
              onClick={goNextMonth}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600"
              aria-label="Next month"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mt-6 relative" style={{ height: 280 }}>
          <canvas ref={canvasRef} />
        </div>
      </div>
    </AdminShell>
  )
}