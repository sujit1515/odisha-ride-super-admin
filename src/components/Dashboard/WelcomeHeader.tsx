'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RefreshCw, ShieldCheck, ChevronUp, ChevronDown } from 'lucide-react'
import { getSystemHealth, type OverallSystemStatus } from '@/api/dashboard'

const STORAGE_KEY = 'welcome-header-collapsed'

const panelTransition = {
  height: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const },
  opacity: { duration: 0.28, ease: 'easeOut' as const },
}

function getGreeting(hour: number): string {
  if (hour < 12) return 'Good Morning'
  if (hour < 17) return 'Good Afternoon'
  return 'Good Evening'
}

function formatLastUpdated(value: string | null): string {
  if (!value) return '--'

  const parsedDate = new Date(value)
  if (Number.isNaN(parsedDate.getTime())) return '--'

  return parsedDate.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  })
}

function getStatusBadgeClasses(status: OverallSystemStatus): string {
  switch (status) {
    case 'healthy':
      return 'border-emerald-200 bg-emerald-50 text-emerald-700'
    case 'degraded':
      return 'border-amber-200 bg-amber-50 text-amber-700'
    case 'critical':
      return 'border-red-200 bg-red-50 text-red-700'
    default:
      return 'border-slate-200 bg-slate-50 text-slate-700'
  }
}

function getStatusDotClasses(status: OverallSystemStatus): string {
  switch (status) {
    case 'healthy':
      return 'bg-emerald-500'
    case 'degraded':
      return 'bg-amber-500'
    case 'critical':
      return 'bg-red-500'
    default:
      return 'bg-slate-400'
  }
}

function formatOverallStatus(status: OverallSystemStatus): string {
  switch (status) {
    case 'healthy':
      return 'Healthy'
    case 'degraded':
      return 'Degraded'
    case 'critical':
      return 'Critical'
    default:
      return 'Unknown'
  }
}

export default function WelcomeHeader() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [ready, setReady] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)
  const [systemStatus, setSystemStatus] = useState<OverallSystemStatus>('healthy')

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'true') setIsCollapsed(true)
    setReady(true)
  }, [])

  useEffect(() => {
    let active = true

    const loadSystemHealth = async () => {
      try {
        const systemHealth = await getSystemHealth()
        if (!active) return

        setLastUpdated(systemHealth.lastCheckedAt)
        setSystemStatus(systemHealth.overallStatus)
      } catch (error) {
        console.error('Failed to fetch system health', error)
        if (!active) return

        setSystemStatus('critical')
      }
    }

    loadSystemHealth()
    const interval = window.setInterval(loadSystemHealth, 30_000)

    return () => {
      active = false
      window.clearInterval(interval)
    }
  }, [])

  const toggle = () => {
    setIsCollapsed((prev) => {
      const next = !prev
      localStorage.setItem(STORAGE_KEY, String(next))
      return next
    })
  }

  const now = new Date()
  const greeting = getGreeting(now.getHours())
  const weekday = now.toLocaleDateString('en-GB', { weekday: 'long' })
  const fullDate = now.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  if (!ready) return null

  return (
    <div className="mb-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
      <AnimatePresence initial={false}>
        {!isCollapsed && (
          <motion.div
            key="welcome-expanded"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={panelTransition}
            className="overflow-hidden"
          >
            <div className="px-5 py-3.5 md:px-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4">
                {/* Left */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <h1 className="text-base md:text-lg font-semibold tracking-tight text-slate-900">
                      <span className="mr-1" aria-hidden></span>
                      {greeting}, Super Admin
                    </h1>
                    <button
                      type="button"
                      onClick={toggle}
                      aria-label="Hide welcome header"
                      className="shrink-0 p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors duration-200 cursor-pointer md:hidden"
                    >
                      <ChevronUp className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="mt-0.5 text-xs text-slate-500">
                    <span className="font-medium text-slate-600">{weekday}</span>
                    <span className="mx-1 text-slate-300">·</span>
                    <span>{fullDate}</span>
                  </p>
                  <p className="mt-1 text-xs text-slate-500 max-w-lg">
                    Monitor your drivers, passengers and live ride operations from one place.
                  </p>
                </div>

                {/* Right */}
                <div className="flex items-center gap-3 sm:gap-5 shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full text-slate-500">
                      <RefreshCw className="h-3.5 w-3.5" strokeWidth={2} />
                    </div>
                    <div className="leading-tight">
                      <p className="text-[11px] text-slate-400 font-medium">Last updated</p>
                      <p className="mt-0.5 text-sm font-semibold tabular-nums tracking-tight text-slate-900">
                        {formatLastUpdated(lastUpdated)}
                      </p>
                    </div>
                  </div>

                  <div className="h-8 w-px bg-slate-200/80 hidden sm:block" aria-hidden />

                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full text-emerald-600">
                      <ShieldCheck className="h-3.5 w-3.5" strokeWidth={2} />
                    </div>
                    <div className="leading-tight">
                      <p className="text-[11px] text-slate-400 font-medium">System status</p>
                      <span
                        className={`mt-0.5 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${getStatusBadgeClasses(systemStatus)}`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${getStatusDotClasses(systemStatus)}`} aria-hidden />
                        {formatOverallStatus(systemStatus)}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={toggle}
                    aria-label="Hide welcome header"
                    className="hidden md:inline-flex shrink-0 p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors duration-200 cursor-pointer"
                  >
                    <ChevronUp className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence initial={false}>
        {isCollapsed && (
          <motion.div
            key="welcome-collapsed"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={panelTransition}
            className="overflow-hidden"
          >
            <button
              type="button"
              onClick={toggle}
              aria-label="Show welcome header"
              className="w-full flex items-center justify-between gap-3 px-5 py-2.5 text-left hover:bg-slate-50/80 transition-colors duration-200 cursor-pointer"
            >
              <span className="text-xs font-medium text-slate-500">
                Welcome header hidden
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-400">
                Show
                <ChevronDown className="h-4 w-4" />
              </span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
