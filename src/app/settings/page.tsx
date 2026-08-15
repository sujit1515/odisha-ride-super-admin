'use client'

import { useState, useEffect } from 'react'
import AdminShell from '@/components/Common/AdminShell'
import { getSettings, updateAutoApprove } from '@/app/settings/api/settings'
import {
  Building2, DollarSign, Car, UserCheck, Wallet, Bell, ShieldCheck,
  CheckCircle, AlertCircle, Loader2,
} from 'lucide-react'

import { Settings, DEFAULTS } from '@/components/Settings/types'
import { GeneralTab }       from '@/components/Settings/GeneralTab'
import { FareTab }          from '@/components/Settings/FareTab'
import { RideTab }          from '@/components/Settings/RideTab'
import { DriverTab }        from '@/components/Settings/DriverTab'
import { PayoutTab }        from '@/components/Settings/PayoutTab'
import { NotificationsTab } from '@/components/Settings/NotificationsTab'
 
const tabs = [
  { id: 'general',       label: 'General',        Icon: Building2   },
  { id: 'fare',          label: 'Fare & Pricing', Icon: DollarSign  },
  { id: 'ride',          label: 'Ride',           Icon: Car         },
  { id: 'driver',        label: 'Driver',         Icon: UserCheck   },
  { id: 'payout',        label: 'Payout',         Icon: Wallet      },
  { id: 'notifications', label: 'Notifications',  Icon: Bell        },
 ]

export default function SettingsPage() {
  const [settings,        setSettings       ] = useState<Settings>(DEFAULTS)
  const [loading,         setLoading        ] = useState(true)
  const [savingToggleKey, setSavingToggleKey] = useState<string | null>(null)
  const [toast,           setToast          ] = useState<{ msg: string; ok: boolean } | null>(null)
  const [activeTab,       setActiveTab      ] = useState('general')

  const update = (key: keyof Settings) => (val: any) =>
    setSettings(prev => ({ ...prev, [key]: val }))

  const showToast = (msg: string, ok: boolean) => {
    setToast({ msg, ok })
    setTimeout(() => setToast(null), 3000)
  }

  // ── Load settings on mount ────────────────────────────────
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const data = await getSettings()
        if (data) setSettings(prev => ({ ...prev, ...data }))
      } catch {
        showToast('Failed to load settings.', false)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // ── Auto approve toggle (DriverTab only — instant save) ───
  const handleAutoApproveToggle = async () => {
    const newVal = !settings.autoApproveDrivers
    setSettings(prev => ({ ...prev, autoApproveDrivers: newVal }))
    setSavingToggleKey('autoApprove')
    try {
      await updateAutoApprove(newVal)
      showToast(`Auto approve ${newVal ? 'enabled' : 'disabled'}.`, true)
    } catch {
      setSettings(prev => ({ ...prev, autoApproveDrivers: !newVal }))
      showToast('Failed to update auto approve.', false)
    } finally {
      setSavingToggleKey(null)
    }
  }

  // ── Loading screen ────────────────────────────────────────
  if (loading) {
    return (
      <AdminShell title="Settings">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <Loader2 className="animate-spin h-12 w-12 text-blue-600 mx-auto" />
            <p className="mt-4 text-slate-500 text-sm">Loading settings...</p>
          </div>
        </div>
      </AdminShell>
    )
  }

  return (
    <AdminShell title="Settings">

      {/* ── Toast ── */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-2 px-4 py-3
                         rounded-xl shadow-lg text-sm font-medium text-white
                         ${toast.ok ? 'bg-green-600' : 'bg-red-500'}`}>
          {toast.ok ? <CheckCircle className="h-4 w-4 shrink-0" /> : <AlertCircle className="h-4 w-4 shrink-0" />}
          {toast.msg}
        </div>
      )}

      {/* ── Tab bar ── */}
      <div className="flex gap-1 flex-wrap mb-6 bg-white border border-slate-100
                      rounded-xl p-1.5 shadow-sm">
        {tabs.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm
                        font-medium transition-colors
                        ${activeTab === id
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'text-slate-600 hover:bg-slate-100'}`}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      {/* ── Tab content — each tab owns its own Save button ── */}
      <div className="space-y-6">
        {activeTab === 'general'       && <GeneralTab settings={settings} update={update} />}
        {activeTab === 'fare'          && <FareTab    settings={settings} update={update} />}
        {activeTab === 'ride'          && <RideTab    settings={settings} update={update} />}
        {activeTab === 'driver'        && (
          <DriverTab
            settings={settings}
            update={update}
            handleAutoApproveToggle={handleAutoApproveToggle}
            savingToggleKey={savingToggleKey}
          />
        )}
        {activeTab === 'payout'        && <PayoutTab        settings={settings} update={update} />}
        {activeTab === 'notifications' && <NotificationsTab settings={settings} update={update} />}
       </div>

    </AdminShell>
  )
}