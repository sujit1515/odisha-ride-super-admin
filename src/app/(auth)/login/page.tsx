'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { useRouter } from 'next/navigation'
import {
  Mail, Lock, Calendar, Eye, EyeOff,
  AlertCircle, Shield, ChevronLeft, ChevronRight, X,
} from 'lucide-react'
import { adminLogin } from "@/app/(auth)/api/auth"

// ── Constants ──────────────────────────────────────────────────────────────────

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]
const DAYS_SHORT = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

// ── DatePicker ─────────────────────────────────────────────────────────────────

function DatePicker({
  value,
  anchorRef,
  onChange,
  onClose,
}: {
  value: string
  anchorRef: React.RefObject<HTMLDivElement | null>
  onChange: (date: string) => void
  onClose: () => void
}) {
  const pickerRef = useRef<HTMLDivElement>(null)
  const today = new Date()

  // ── Parse DD/MM/YYYY → Date ──────────────────────────────────────────────
  const parseValue = (): Date | null => {
    if (value && /^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
      const [d, m, y] = value.split('/')
      return new Date(parseInt(y), parseInt(m) - 1, parseInt(d))
    }
    return null
  }
  const selected = parseValue()

  const [view, setView] = useState<'day' | 'month' | 'year'>('day')
  const [month, setMonth] = useState(selected?.getMonth() ?? today.getMonth())
  const [year, setYear] = useState(selected?.getFullYear() ?? today.getFullYear())
  const [pos, setPos] = useState({ top: 0, left: 0 })

  // ── Position relative to anchor ──────────────────────────────────────────
  useEffect(() => {
    const update = () => {
      if (!anchorRef.current) return
      const r = anchorRef.current.getBoundingClientRect()
      const pickerH = pickerRef.current?.offsetHeight ?? 380
      const pickerW = 288

      const spaceBelow = window.innerHeight - r.bottom
      const top = spaceBelow >= pickerH + 8
        ? r.bottom + window.scrollY + 6
        : r.top + window.scrollY - pickerH - 6

      const rawLeft = r.left + window.scrollX
      const left = Math.min(rawLeft, window.innerWidth + window.scrollX - pickerW - 8)

      setPos({ top, left: Math.max(left, 8) })
    }
    update()
    window.addEventListener('resize', update)
    window.addEventListener('scroll', update, true)
    return () => {
      window.removeEventListener('resize', update)
      window.removeEventListener('scroll', update, true)
    }
  }, [anchorRef])

  // ── Close on outside click ───────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        pickerRef.current && !pickerRef.current.contains(e.target as Node) &&
        anchorRef.current && !anchorRef.current.contains(e.target as Node)
      ) onClose()
    }
    const id = setTimeout(() => document.addEventListener('mousedown', handler), 0)
    return () => {
      clearTimeout(id)
      document.removeEventListener('mousedown', handler)
    }
  }, [anchorRef, onClose])

  // ── Calendar helpers ─────────────────────────────────────────────────────
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells = Array.from({ length: firstDay + daysInMonth }, (_, i) =>
    i < firstDay ? null : i - firstDay + 1,
  )
  while (cells.length % 7 !== 0) cells.push(null)

  const isSelected = (day: number) =>
    selected?.getDate() === day &&
    selected?.getMonth() === month &&
    selected?.getFullYear() === year

  const isToday = (day: number) =>
    today.getDate() === day &&
    today.getMonth() === month &&
    today.getFullYear() === year

  const isFuture = (day: number) => new Date(year, month, day) > today

  const selectDay = (day: number) => {
    onChange(
      `${String(day).padStart(2, '0')}/${String(month + 1).padStart(2, '0')}/${year}`,
    )
    onClose()
  }

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1) }
    else setMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1) }
    else setMonth(m => m + 1)
  }

  const maxYear = today.getFullYear()
  const minYear = 1920
  const yearBase = Math.floor(year / 12) * 12
  const years = Array.from({ length: 12 }, (_, i) => yearBase + i)

  // ── Portal render ────────────────────────────────────────────────────────
  return createPortal(
    <div
      ref={pickerRef}
      style={{
        position: 'absolute',
        top: pos.top,
        left: pos.left,
        zIndex: 9999,
        minWidth: 288,
      }}
      className="bg-white rounded-2xl shadow-2xl border border-slate-100 p-4 select-none"
    >
      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          onClick={() => {
            if (view === 'day') prevMonth()
            if (view === 'year') setYear(y => y - 12)
          }}
          className="p-1.5 rounded-lg hover:bg-slate-100 transition text-slate-500"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-1">
          {view === 'day' && (
            <>
              <button
                type="button"
                onClick={() => setView('month')}
                className="text-sm font-semibold text-slate-800 hover:text-blue-600 transition px-1 rounded"
              >
                {MONTHS[month]}
              </button>
              <button
                type="button"
                onClick={() => setView('year')}
                className="text-sm font-semibold text-slate-800 hover:text-blue-600 transition px-1 rounded"
              >
                {year}
              </button>
            </>
          )}
          {view === 'month' && (
            <>
              <button
                type="button"
                onClick={() => setView('year')}
                className="text-sm font-semibold text-slate-800 hover:text-blue-600 transition px-1 rounded"
              >
                {year}
              </button>
              <button
                type="button"
                onClick={() => setView('day')}
                className="ml-1 p-1 rounded hover:bg-slate-100 transition"
              >
                <X className="h-3 w-3 text-slate-400" />
              </button>
            </>
          )}
          {view === 'year' && (
            <span className="text-sm font-semibold text-slate-800">
              {yearBase} – {yearBase + 11}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={() => {
            if (view === 'day') nextMonth()
            if (view === 'year') setYear(y => y + 12)
          }}
          className="p-1.5 rounded-lg hover:bg-slate-100 transition text-slate-500"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* ── Day grid ── */}
      {view === 'day' && (
        <>
          <div className="grid grid-cols-7 mb-1">
            {DAYS_SHORT.map(d => (
              <div key={d} className="text-center text-[11px] font-medium text-slate-400 py-1">
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-y-0.5">
            {cells.map((day, i) => (
              <div key={i} className="flex items-center justify-center">
                {day ? (
                  <button
                    type="button"
                    disabled={isFuture(day)}
                    onClick={() => selectDay(day)}
                    className={`
                      w-8 h-8 rounded-full text-sm font-medium transition
                      ${isSelected(day)
                        ? 'bg-blue-600 text-white shadow shadow-blue-200'
                        : isToday(day)
                          ? 'border-2 border-blue-400 text-blue-600'
                          : isFuture(day)
                            ? 'text-slate-200 cursor-not-allowed'
                            : 'text-slate-700 hover:bg-blue-50 hover:text-blue-600'}
                    `}
                  >
                    {day}
                  </button>
                ) : null}
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── Month grid ── */}
      {view === 'month' && (
        <div className="grid grid-cols-3 gap-2 mt-1">
          {MONTHS.map((m, i) => (
            <button
              key={m}
              type="button"
              onClick={() => { setMonth(i); setView('day') }}
              className={`
                py-2 rounded-xl text-sm font-medium transition
                ${i === month
                  ? 'bg-blue-600 text-white shadow shadow-blue-200'
                  : 'text-slate-700 hover:bg-blue-50 hover:text-blue-600'}
              `}
            >
              {m.slice(0, 3)}
            </button>
          ))}
        </div>
      )}

      {/* ── Year grid ── */}
      {view === 'year' && (
        <div className="grid grid-cols-3 gap-2 mt-1">
          {years.map(y => (
            <button
              key={y}
              type="button"
              disabled={y > maxYear || y < minYear}
              onClick={() => { setYear(y); setView('month') }}
              className={`
                py-2 rounded-xl text-sm font-medium transition
                ${y === year
                  ? 'bg-blue-600 text-white shadow shadow-blue-200'
                  : y > maxYear || y < minYear
                    ? 'text-slate-200 cursor-not-allowed'
                    : 'text-slate-700 hover:bg-blue-50 hover:text-blue-600'}
              `}
            >
              {y}
            </button>
          ))}
        </div>
      )}

      {/* ── Footer ── */}
      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
        <button
          type="button"
          onClick={() => {
            setMonth(today.getMonth())
            setYear(today.getFullYear())
            setView('day')
          }}
          className="text-xs text-blue-600 hover:text-blue-700 font-medium transition"
        >
          Today
        </button>
        <button
          type="button"
          onClick={onClose}
          className="text-xs text-slate-400 hover:text-slate-600 transition"
        >
          Cancel
        </button>
      </div>
    </div>,
    document.body,
  )
}

// ── Login Page ─────────────────────────────────────────────────────────────────

export default function LoginPage() {
  const router = useRouter()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    dateOfBirth: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showCalendar, setShowCalendar] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isRedirecting, setIsRedirecting] = useState(false)
  const [error, setError] = useState('')

  // SSR safety — portal needs document.body
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  // Ref for date picker anchor
  const dobAnchorRef = useRef<HTMLDivElement | null>(null)

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validation
    if (!formData.email || !formData.password || !formData.dateOfBirth) {
      setError('Please fill in all fields.')
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address.')
      return
    }

    // Date format validation
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(formData.dateOfBirth)) {
      setError('Date of birth must be in DD/MM/YYYY format.')
      return
    }

    // Date validity check
    const [day, month, year] = formData.dateOfBirth.split('/')
    const dateObj = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
    if (
      dateObj.getDate() !== parseInt(day) ||
      dateObj.getMonth() !== parseInt(month) - 1 ||
      dateObj.getFullYear() !== parseInt(year)
    ) {
      setError('Please enter a valid date.')
      return
    }

    setIsLoading(true)
    try {
      const res = await adminLogin({
        email: formData.email,
        password: formData.password,
        dateOfBirth: formData.dateOfBirth,
      })

      // Store token and user data
      localStorage.setItem('adminToken', res.token)
      if (res.user) {
        localStorage.setItem('adminUser', JSON.stringify(res.user))
      }

      // Set redirecting state for better UX
      setIsRedirecting(true)

      // Small delay to show redirecting state (optional)
      setTimeout(() => {
        // Use replace to prevent going back to login page
        router.replace('/dashboard')
      }, 500)

    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        err.message ||
        'Login failed. Please check your credentials.',
      )
      setIsLoading(false)
    }
  }

  // ── Field handlers ─────────────────────────────────────────────────────────
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  // Auto-format as user types: 17031990 → 17/03/1990
  const handleDobType = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, '')
    if (raw.length > 8) raw = raw.slice(0, 8)

    let formatted = raw
    if (raw.length >= 3 && raw.length < 5) {
      formatted = raw.slice(0, 2) + '/' + raw.slice(2)
    } else if (raw.length >= 5) {
      formatted = raw.slice(0, 2) + '/' + raw.slice(2, 4) + '/' + raw.slice(4)
    }
    setFormData(f => ({ ...f, dateOfBirth: formatted }))
  }

  const handleDateSelect = useCallback((date: string) => {
    setFormData(f => ({ ...f, dateOfBirth: date }))
    setShowCalendar(false)
  }, [])

  const handleCalendarClose = useCallback(() => setShowCalendar(false), [])

  // Clear error when user starts typing
  const handleInputFocus = () => {
    if (error) setError('')
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
          <div className="p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Welcome Back</h2>
              <p className="text-sm text-slate-500">Sign in to access your dashboard</p>
            </div>

            {/* Error banner */}
            {error && (
              <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2 animate-shake">
                <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 shrink-0" />
                <span className="text-sm text-red-700">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email Address
                </label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={handleInputFocus}
                    placeholder="admin@example.com"
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition outline-none text-sm"
                    disabled={isLoading || isRedirecting}
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={handleInputFocus}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition outline-none text-sm"
                    disabled={isLoading || isRedirecting}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                    tabIndex={-1}
                  >
                    {showPassword
                      ? <EyeOff className="h-4 w-4" />
                      : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Date of Birth
                  <span className="ml-1 text-xs text-slate-400 font-normal">(verification)</span>
                </label>

                <div ref={dobAnchorRef} className="relative">
                  <button
                    type="button"
                    onClick={() => !isLoading && !isRedirecting && setShowCalendar(v => !v)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-500 transition z-10"
                    tabIndex={-1}
                    aria-label="Open date picker"
                  >
                    <Calendar className="h-4 w-4" />
                  </button>

                  <input
                    type="text"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleDobType}
                    onFocus={() => !isLoading && !isRedirecting && setShowCalendar(true)}
                    placeholder="DD/MM/YYYY"
                    maxLength={10}
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition outline-none text-sm tracking-widest"
                    disabled={isLoading || isRedirecting}
                    autoComplete="off"
                  />

                  {formData.dateOfBirth && (
                    <button
                      type="button"
                      onClick={() => {
                        setFormData(f => ({ ...f, dateOfBirth: '' }))
                        setShowCalendar(false)
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition"
                      tabIndex={-1}
                      aria-label="Clear date"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}

                  {mounted && showCalendar && !isRedirecting && (
                    <DatePicker
                      value={formData.dateOfBirth}
                      anchorRef={dobAnchorRef}
                      onChange={handleDateSelect}
                      onClose={handleCalendarClose}
                    />
                  )}
                </div>

                <p className="text-xs text-slate-400 mt-1.5">
                  Type manually (DD/MM/YYYY) or click the calendar icon
                </p>
              </div>

              {/* Forgot password */}
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => router.push('/forgot-password')}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium transition"
                  disabled={isLoading || isRedirecting}
                >
                  Forgot Password?
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || isRedirecting}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {isRedirecting ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Redirecting to Dashboard...
                  </div>
                ) : isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Signing in...
                  </div>
                ) : (
                  'Sign In to Dashboard'
                )}
              </button>
            </form>
            <div className="mt-6 pt-5 border-t border-slate-100">
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}