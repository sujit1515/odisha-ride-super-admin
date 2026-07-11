'use client'

import { useState } from 'react'
import { Building2, Phone, Save, CheckCircle, AlertCircle } from 'lucide-react'
import { saveGeneralSettings } from '@/api/settings'
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

export function GeneralTab({ settings, update }: {
  settings: Settings
  update: (key: keyof Settings) => (val: any) => void
}) {
  const [saving, setSaving] = useState(false)
  const [toast,  setToast ] = useState<{ type: 'success' | 'error'; msg: string } | null>(null)

  const handleSave = async () => {
    setSaving(true)
    setToast(null)
    try {
      const res = await saveGeneralSettings({
        platformName: settings.platformName,
        supportEmail: settings.supportEmail,
        supportPhone: settings.supportPhone,
        platformFee: settings.platformFee,
        taxPercentage: settings.taxPercentage,
      })
      setToast({ type: 'success', msg: res.message ?? 'Settings saved successfully.' })
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
        <Card title="Platform" icon={Building2}>
          <Field label="Platform Name">
            <TextInput value={settings.platformName} onChange={update('platformName')} />
          </Field>
        </Card>
        <Card title="Support Contact" icon={Phone}>
          <Field label="Support Email">
            <TextInput value={settings.supportEmail} onChange={update('supportEmail')}
                       placeholder="support@odisharide.com" />
          </Field>
          <Field label="Support Phone">
            <TextInput value={settings.supportPhone} onChange={update('supportPhone')}
                       placeholder="+91 9999999999" />
          </Field>
        </Card>
        <Card title="Fare Adjustments" icon={Building2}>
          <Field label="Platform Fee (₹)" hint="Fixed fee added to every ride">
            <TextInput type="number" value={settings.platformFee ?? 0} onChange={update('platformFee')}
                       placeholder="0" />
          </Field>
          <Field label="Tax Percentage (%)" hint="Applied to fare + platform fee">
            <TextInput type="number" value={settings.taxPercentage ?? 5} onChange={update('taxPercentage')}
                       placeholder="5" />
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