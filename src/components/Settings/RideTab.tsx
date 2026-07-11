'use client'

import { useState } from 'react'
import { Car, MapPin, Gauge, Scale, Save, CheckCircle, AlertCircle } from 'lucide-react'
import { saveRideSettings } from '@/api/settings'
import type { Settings } from './types'

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-sm font-medium text-slate-700">{label}</label>
      {hint && <p className="text-xs text-slate-400 mb-1">{hint}</p>}
      <div className="mt-1">{children}</div>
    </div>
  )
}

function TextInput({ value, onChange, placeholder, type = 'text', suffix }: {
  value: string | number
  onChange: (v: any) => void
  placeholder?: string
  type?: string
  suffix?: string
}) {
  return (
    <div className="relative">
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={e => onChange(type === 'number' ? Number(e.target.value) : e.target.value)}
        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm
                   focus:outline-none focus:ring-2 focus:ring-blue-500
                   focus:border-transparent transition"
      />
      {suffix && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
          {suffix}
        </span>
      )}
    </div>
  )
}

function Card({ title, icon: Icon, children }: {
  title: string
  icon: any
  children: React.ReactNode
}) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
      <div className="flex items-center gap-2 mb-5">
        <Icon size={18} className="text-blue-600" />
        <h3 className="text-base font-semibold text-slate-800">{title}</h3>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  )
}

function Toggle({ value, onChange, disabled }: {
  value: boolean
  onChange: (v: boolean) => void
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      disabled={disabled}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                  ${value ? 'bg-blue-600' : 'bg-slate-300'}
                  ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow
                        transition-transform ${value ? 'translate-x-5' : 'translate-x-0.5'}`} />
    </button>
  )
}

function ToggleRow({ label, desc, value, onChange, badge, disabled }: {
  label: string
  desc?: string
  value: boolean
  onChange: (v: boolean) => void
  badge?: string
  disabled?: boolean
}) {
  return (
    <div className="flex items-start justify-between gap-4 p-3 rounded-xl
                    border border-slate-100 hover:bg-slate-50 transition">
      <div className="flex-1">
        <p className="text-sm font-medium text-slate-700">{label}</p>
        {desc && <p className="text-xs text-slate-400 mt-0.5">{desc}</p>}
        {badge && (
          <span className="mt-1 inline-block text-[10px] bg-amber-100
                           text-amber-700 px-2 py-0.5 rounded-full">{badge}</span>
        )}
      </div>
      <Toggle value={value} onChange={onChange} disabled={disabled} />
    </div>
  )
}

// ── Search radius escalation — 4 steps, matching DriverMatchingService exactly ──
function SearchRadiusEscalation({ value, onChange }: {
  value: number[]
  onChange: (v: number[]) => void
}) {
  const steps = value.length === 4 ? value : [3, 5, 8, 10]

  const updateStep = (index: number, newVal: number) => {
    const next = [...steps]
    next[index] = newVal
    onChange(next)
  }

  const isAscending = steps.every((v, i) => i === 0 || v >= steps[i - 1])

  return (
    <div>
      <label className="text-sm font-medium text-slate-700">Search Radius Escalation (km)</label>
      <p className="text-xs text-slate-400 mb-2">
        We search in expanding circles — if no driver is found at Step 1, we try Step 2, then Step 3, then Step 4.
      </p>
      <div className="grid grid-cols-4 gap-2">
        {steps.map((radius, i) => (
          <div key={i}>
            <span className="text-[11px] text-slate-400 block mb-1">Step {i + 1}</span>
            <TextInput
              type="number"
              value={radius}
              suffix="km"
              onChange={(v) => updateStep(i, v)}
            />
          </div>
        ))}
      </div>
      {!isAscending && (
        <p className="text-xs text-amber-600 mt-2">
          Steps should increase in order, or later steps may never be reached.
        </p>
      )}
    </div>
  )
}

export function RideTab({ settings, update }: {
  settings: Settings
  update: (key: keyof Settings) => (val: any) => void
}) {
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null)

  const handleSave = async () => {
    setSaving(true)
    setToast(null)
    try {
      const payload = {
        searchRadiiKm: settings.searchRadiiKm,
        avgSpeedKmh: settings.avgSpeedKmh,
        etaTieThresholdMin: settings.etaTieThresholdMin,
        maxWaitingTime: settings.maxWaitingTime,
      }
      const res = await saveRideSettings(payload)
      setToast({ type: 'success', msg: res.message ?? 'Ride settings saved.' })
    } catch (err: any) {
      setToast({ type: 'error', msg: err.response?.data?.message || 'Failed to save. Please try again.' })
    } finally {
      setSaving(false)
      setTimeout(() => setToast(null), 3500)
    }
  }

  return (
    <>
      {/* ── Toast ── */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-2 px-4 py-3
                         rounded-xl shadow-lg text-sm font-semibold text-white
                         ${toast.type === 'success' ? 'bg-[#1A73E8]' : 'bg-red-500'}`}>
          {toast.type === 'success' ? <CheckCircle size={16}/> : <AlertCircle size={16}/>}
          {toast.msg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Ride Rules" icon={Car}>
          <SearchRadiusEscalation
            value={settings.searchRadiiKm}
            onChange={update('searchRadiiKm')}
          />

          <Field label="Max Waiting Time Per Driver (minutes)"
                 hint="How long to wait for a driver to respond before offering the ride to the next one">
            <TextInput type="number" value={settings.maxWaitingTime}
                       onChange={update('maxWaitingTime')} suffix="min" />
          </Field>
        </Card>

        <div className="space-y-6">
          <Card title="Matching & ETA" icon={Gauge}>
            <Field label="Average City Speed (km/h)"
                   hint="Used to estimate driver arrival time (ETA) for ranking and dispatch">
              <TextInput type="number" value={settings.avgSpeedKmh}
                         onChange={update('avgSpeedKmh')} suffix="km/h" />
            </Field>

            <Field label="ETA Tie Threshold (minutes)"
                   hint="If two or more drivers' ETAs are within this many minutes of each other, the ride is offered to all of them at once instead of one at a time">
              <TextInput type="number" value={settings.etaTieThresholdMin}
                         onChange={update('etaTieThresholdMin')} suffix="min" />
            </Field>
          </Card>
        </div>
      </div>

      {/* ── Save Button ── */}
      <div className="mt-8 flex justify-end">
        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#1A73E8] text-white
                     text-sm font-semibold hover:bg-blue-700 disabled:opacity-40
                     disabled:cursor-not-allowed transition">
          {saving
            ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
            : <Save size={15} />}
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </>
  )
}