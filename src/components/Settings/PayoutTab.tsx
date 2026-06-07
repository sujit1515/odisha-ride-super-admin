'use client'

import { Wallet, Info } from 'lucide-react'
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
                 focus:border-transparent transition"
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

export function PayoutTab({ settings, update }: {
  settings: Settings
  update: (key: keyof Settings) => (val: any) => void
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card title="Payout Rules" icon={Wallet}>
        <Field label="Payout Frequency"
               hint="How often drivers receive their earnings">
          <select
            value={settings.payoutFrequency}
            onChange={e => update('payoutFrequency')(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm
                       focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </Field>
        <Field label="Minimum Payout Amount (₹)"
               hint="Driver must earn at least this to receive payout">
          <TextInput type="number" value={settings.minPayoutAmount}
                     onChange={update('minPayoutAmount')} />
        </Field>
      </Card>
      <Card title="Info" icon={Info}>
        <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl
                        text-sm text-slate-600 space-y-1">
          <p className="font-medium text-blue-800 mb-1">Current Setup</p>
          <p>Frequency: <strong className="capitalize">{settings.payoutFrequency}</strong></p>
          <p>Min payout: <strong>₹{settings.minPayoutAmount}</strong></p>
          <p>Commission: <strong>{settings.commission}%</strong> per ride</p>
        </div>
      </Card>
    </div>
  )
}