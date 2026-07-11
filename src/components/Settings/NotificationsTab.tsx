'use client'

import { Bell, Clock } from 'lucide-react'
import type { Settings } from './types'

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

export function NotificationsTab({ settings, update }: {
  settings: Settings
  update: (key: keyof Settings) => (val: any) => void
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card title="Channels" icon={Bell}>
        <ToggleRow label="Email & Push Notifications"
                   desc="Notify admin on new rides and activity"
                   value={settings.emailPushNotif} onChange={update('emailPushNotif')} />
        <ToggleRow label="SMS Notifications"
                   desc="Send SMS alerts to drivers and passengers"
                   value={settings.smsNotif} onChange={update('smsNotif')} />
        
      </Card>
      <Card title="Events" icon={Clock}>
        <ToggleRow label="Notify on Driver Signup"
                   desc="Get notified when a new driver registers"
                   value={settings.notifyOnSignup} onChange={update('notifyOnSignup')} />
        <ToggleRow label="Notify on Ride Complaint"
                   desc="Instant alert when a complaint is filed"
                   value={settings.notifyOnComplaint} onChange={update('notifyOnComplaint')} />
      </Card>
    </div>
  )
}