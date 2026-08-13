import { UserCheck } from 'lucide-react'
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

export function DriverTab({ settings, update, handleAutoApproveToggle, savingToggleKey }: {
  settings: Settings
  update: (key: keyof Settings) => (val: any) => void
  handleAutoApproveToggle: () => Promise<void>
  savingToggleKey: string | null
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card title="Approval" icon={UserCheck}>
        <ToggleRow
          label="Auto Approve Drivers"
          desc={settings.autoApproveDrivers
            ? 'Drivers approved automatically after registration'
            : 'Super admin manually reviews KYC before approval'}
          value={settings.autoApproveDrivers}
          onChange={handleAutoApproveToggle}
          badge={!settings.autoApproveDrivers ? 'Recommended for security' : undefined}
          disabled={savingToggleKey === 'autoApprove'}
        />
        <ToggleRow
          label="KYC Mandatory"
          desc="Drivers must upload Aadhaar, License, RC & Insurance"
          value={settings.kycMandatory}
          onChange={update('kycMandatory')}
        />
        {settings.kycMandatory && (
          <div className="flex flex-wrap gap-1.5 px-1">
            {['Aadhaar/ID', 'Driving License', 'Vehicle RC', 'Insurance'].map(doc => (
              <span key={doc}
                    className="text-[11px] bg-blue-50 text-blue-700
                               px-2.5 py-1 rounded-full border border-blue-100">
                {doc}
              </span>
            ))}
          </div>
        )}
        <ToggleRow
          label="Background Check Required"
          desc="Drivers must pass a background verification"
          value={settings.backgroundCheck}
          onChange={update('backgroundCheck')}
        />
      </Card>
    </div>
  )
}