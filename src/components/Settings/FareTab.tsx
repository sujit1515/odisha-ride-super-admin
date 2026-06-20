'use client'

import { useState } from 'react'
import { DollarSign, Ruler, Save, CheckCircle, AlertCircle, Car } from 'lucide-react'
import { saveFareSettings } from '@/api/settings'
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

function TextInput({ value, onChange, placeholder, type = 'text' }: {
  value: string | number
  onChange: (v: any) => void
  placeholder?: string
  type?: string
}) {
  return (
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={e => onChange(type === 'number' ? Number(e.target.value) : e.target.value)}
      className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm
                 focus:outline-none focus:ring-2 focus:ring-blue-500
                 focus:border-transparent transition [appearance:textfield]
                 [&::-webkit-outer-spin-button]:appearance-none
                 [&::-webkit-inner-spin-button]:appearance-none"
      step="any"
    />
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

export function FareTab({ settings, update }: {
  settings: Settings
  update: (key: keyof Settings) => (val: any) => void
}) {
  const [saving, setSaving] = useState(false)
  const [toast,  setToast ] = useState<{ type: 'success' | 'error'; msg: string } | null>(null)

  const handleSave = async () => {
    setSaving(true)
    setToast(null)
    try {
      const res = await saveFareSettings({
        baseFare:              settings.baseFare,
        minFare:               settings.minFare,
        cancellationFee:       settings.cancellationFee,
        perKmRate:             settings.perKmRate,
        perMinuteRate:         settings.perMinuteRate,
        surgeMultiplier:       settings.surgeMultiplier,
        nightChargeMultiplier: settings.nightChargeMultiplier,
        bikeRatePerKm:         settings.bikeRatePerKm,
        autoRatePerKm:         settings.autoRatePerKm,
        carRatePerKm:          settings.carRatePerKm,
      })
      setToast({ type: 'success', msg: res.message ?? 'Fare settings saved successfully.' })
    } catch {
      setToast({ type: 'error', msg: 'Failed to save. Please try again.' })
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
                         rounded-xl shadow-lg text-sm font-medium text-white
                         ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-500'}`}>
          {toast.type === 'success'
            ? <CheckCircle className="h-4 w-4 shrink-0" />
            : <AlertCircle className="h-4 w-4 shrink-0" />}
          {toast.msg}
        </div>
      )}

      {/* ── Fields ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Base Charges" icon={DollarSign}>
          <Field label="Base Fare (₹)" hint="Fixed charge at ride start">
            <TextInput type="number" value={settings.baseFare} onChange={update('baseFare')} />
          </Field>
          <Field label="Minimum Fare (₹)" hint="Minimum charge per ride">
            <TextInput type="number" value={settings.minFare} onChange={update('minFare')} />
          </Field>
          <Field label="Cancellation Fee (₹)"
                 hint="Charged if user cancels after driver assigned">
            <TextInput type="number" value={settings.cancellationFee}
                       onChange={update('cancellationFee')} />
          </Field>
        </Card>

        <Card title="Per Unit Rates" icon={Ruler}>
          <Field label="Per KM Rate (₹)">
            <TextInput type="number" value={settings.perKmRate} onChange={update('perKmRate')} />
          </Field>
          <Field label="Per Minute Rate (₹)" hint="Charged during waiting / traffic">
            <TextInput type="number" value={settings.perMinuteRate}
                       onChange={update('perMinuteRate')} />
          </Field>
          <Field label="Surge Multiplier (max)" hint="e.g. 2 = 2x fare during peak hours">
            <TextInput type="number" value={settings.surgeMultiplier}
                       onChange={update('surgeMultiplier')} />
          </Field>
          <Field label="Night Charge Multiplier" hint="Applied after 11 PM">
            <TextInput type="number" value={settings.nightChargeMultiplier}
                       onChange={update('nightChargeMultiplier')} />
          </Field>
        </Card>

        <Card title="Vehicle Specific Rates" icon={Car}>
          <Field label="Bike Rate Per KM (₹)" hint="Used for BIKE vehicle type estimations">
            <TextInput type="number" value={settings.bikeRatePerKm} onChange={update('bikeRatePerKm')} />
          </Field>
          <Field label="Auto Rate Per KM (₹)" hint="Used for AUTO vehicle type estimations">
            <TextInput type="number" value={settings.autoRatePerKm} onChange={update('autoRatePerKm')} />
          </Field>
          <Field label="Cab/Car Rate Per KM (₹)" hint="Used for CAR vehicle type estimations">
            <TextInput type="number" value={settings.carRatePerKm} onChange={update('carRatePerKm')} />
          </Field>
        </Card>
      </div>

      {/* ── Save Button ── */}
      <div className="mt-8 flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600
                     text-white text-sm font-medium hover:bg-blue-700
                     disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          {saving
            ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
            : <Save className="h-4 w-4" />}
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </>
  )
}