'use client'

import { User, ShieldCheck, Key, ChevronRight, CheckCircle2, AlertTriangle } from 'lucide-react'
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

export function AdminTab({ settings, update }: {
  settings: Settings
  update: (key: keyof Settings) => (val: any) => void
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card title="Profile" icon={User}>
        <Field label="Admin Name">
          <TextInput value={settings.adminName} onChange={update('adminName')} />
        </Field>
        <Field label="Admin Email">
          <TextInput value={settings.adminEmail} onChange={update('adminEmail')} />
        </Field>
        <button className="w-full mt-2 px-4 py-2.5 rounded-xl border border-slate-200
                           text-sm font-medium text-slate-700 hover:bg-slate-50
                           transition-colors flex items-center gap-2">
          <Key size={15} className="text-slate-500" />
          Change Password
          <ChevronRight size={15} className="ml-auto text-slate-400" />
        </button>
      </Card>
      <Card title="Security" icon={ShieldCheck}>
        <ToggleRow
          label="Two-Factor Authentication (2FA)"
          desc="Require OTP on every admin login"
          value={settings.twoFactorAuth}
          onChange={update('twoFactorAuth')}
        />
        <div className={`p-3 rounded-xl text-xs border flex items-center gap-2
          ${settings.twoFactorAuth
            ? 'bg-emerald-50 border-emerald-100 text-emerald-700'
            : 'bg-amber-50 border-amber-100 text-amber-700'
          }`}>
          {settings.twoFactorAuth
            ? <CheckCircle2 size={14} />
            : <AlertTriangle size={14} />
          }
          {settings.twoFactorAuth
            ? '2FA is active. Your account is protected.'
            : 'Enable 2FA to secure your admin account.'
          }
        </div>
      </Card>
    </div>
  )
}