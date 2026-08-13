'use client'

import { useState, useEffect } from 'react'
import {
  Save, CheckCircle, AlertCircle, Bike, Car, Zap, Moon, CloudRain,
  Clock, IndianRupee, TrendingUp, Slash,
  Plus, Trash2, Settings2, Pencil, Users,
  Percent, Timer, Wallet, Receipt,
} from 'lucide-react'
import { saveFareSettings } from '@/api/settings'
import type { Settings } from './types'


type TabId = 'global' | string

interface Vehicle {
  id: string
  label: string
  desc: string
  accent: string
  maxPassengers: number
  baseFare: number
  minFare: number
  perKmRate: number
  perMinuteRate: number
  baseDistance: number
  waitTimeFee: number
  freeWaitMinutes: number
}


// ── Helper: pick icon per vehicle id ─────────────────────
function VehicleIcon({ id, size = 16, className = '' }: { id: string; size?: number; className?: string }) {
  if (id === 'bike') return <Bike size={size} className={className} />
  if (id === 'auto') return <Zap size={size} className={className} />
  return <Car size={size} className={className} />
}

// ── Primitives ───────────────────────────────────────────

function NumInput({ value, onChange, disabled, min, step }: {
  value: number; onChange?: (v: number) => void; disabled?: boolean; min?: number; step?: number
}) {
  return (
    <input
      type="number" value={value} step={step ?? 'any'} disabled={disabled} min={min}
      onChange={e => onChange?.(Number(e.target.value))}
      className={`w-full px-3 py-2.5 rounded-lg border text-sm text-slate-800
                 focus:outline-none focus:ring-2 focus:ring-[#1A73E8] focus:border-transparent
                 transition [appearance:textfield]
                 [&::-webkit-outer-spin-button]:appearance-none
                 [&::-webkit-inner-spin-button]:appearance-none
                 ${disabled
          ? 'bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed'
          : 'border-slate-200 bg-white'}`}
    />
  )
}

function TimeInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <input type="time" value={value} onChange={e => onChange(e.target.value)}
      className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-800
                 focus:outline-none focus:ring-2 focus:ring-[#1A73E8] focus:border-transparent
                 transition bg-white
                 [&::-webkit-calendar-picker-indicator]:opacity-50
                 [&::-webkit-calendar-picker-indicator]:cursor-pointer" />
  )
}

function TextInput({ value, onChange, placeholder }: {
  value: string; onChange: (v: string) => void; placeholder?: string
}) {
  return (
    <input type="text" value={value} placeholder={placeholder}
      onChange={e => onChange(e.target.value)}
      className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-800
                 focus:outline-none focus:ring-2 focus:ring-[#1A73E8] focus:border-transparent
                 transition bg-white" />
  )
}

function Field({ label, hint, children }: {
  label: string; hint?: string; children: React.ReactNode
}) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
        {label}
      </label>
      {hint && <p className="text-[11px] text-slate-400 mb-1">{hint}</p>}
      {children}
    </div>
  )
}

// Toggle — green ON / red OFF
function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" onClick={() => onChange(!value)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors shrink-0
                  ${value ? 'bg-green-600' : 'bg-red-600'}`}>
      <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm
                        transition-transform ${value ? 'translate-x-5' : 'translate-x-0.5'}`} />
    </button>
  )
}

function TabBtn({ active, onClick, icon: Icon, label }: {
  active: boolean; onClick: () => void; icon: any; label: string
}) {
  return (
    <button onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
                  transition-all whitespace-nowrap
                  ${active
          ? 'bg-[#1A73E8] text-white shadow-sm'
          : 'text-slate-500 hover:text-[#1E293B] hover:bg-slate-100'}`}>
      <Icon size={14} />
      {label}
    </button>
  )
}

function ChargeBlock({ icon: Icon, iconColor, title, badge, enabled, onToggle, children }: {
  icon: any; iconColor: string; title: string; badge?: string
  enabled: boolean; onToggle: (v: boolean) => void; children?: React.ReactNode
}) {
  return (
    <div className="rounded-xl border border-slate-100 bg-white transition-all">
      <div className="flex items-center justify-between gap-3 px-5 py-4">
        <div className="flex items-center gap-3">
          <Icon size={18} className={iconColor} />
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-[#1E293B]">{title}</p>
              {badge && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium
                                  ${badge === 'Auto'
                    ? 'bg-blue-100 text-[#1A73E8]'
                    : 'bg-amber-100 text-amber-700'}`}>
                  {badge}
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">{enabled ? 'Active' : 'Disabled'}</p>
          </div>
        </div>
        <Toggle value={enabled} onChange={onToggle} />
      </div>
      {enabled && children && (
        <div className="px-5 pb-5 pt-0 border-t border-slate-100">
          <div className="grid grid-cols-4 gap-4 mt-4">{children}</div>
        </div>
      )}
    </div>
  )
}

function SurchargeRow({ icon: Icon, color, label, active, value, time }: {
  icon: any; color: string; label: string; active: boolean; value: string; time?: string
}) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
      <div className="flex items-center gap-2 flex-wrap">
        <Icon size={14} className={active ? color : 'text-slate-300'} />
        <span className={`text-sm ${active ? 'text-[#1E293B]' : 'text-slate-300'}`}>{label}</span>
        {time && active && (
          <span className="text-[11px] text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full">
            {time}
          </span>
        )}
      </div>
      {active
        ? <span className="text-sm font-bold text-[#1A73E8]">{value}</span>
        : <div className="flex items-center gap-1 text-slate-300"><Slash size={12} /><span className="text-xs">Off</span></div>
      }
    </div>
  )
}

// ── Add Vehicle Modal ─────────────────────────────────────
function AddVehicleModal({ onAdd, onClose }: {
  onAdd: (v: Vehicle) => void; onClose: () => void
}) {
  const [label, setLabel] = useState('')
  const [desc, setDesc] = useState('')
  const [maxPassengers, setMaxPassengers] = useState(4)

  const handleAdd = () => {
    if (!label.trim()) return
    onAdd({
      id: label.toLowerCase().replace(/\s+/g, '_') + '_' + Date.now(),
      label, desc, maxPassengers,
      accent: 'bg-slate-50 border-slate-200',
      baseFare: 0, minFare: 0, perKmRate: 0, perMinuteRate: 0,
      baseDistance: 1.5, waitTimeFee: 2, freeWaitMinutes: 3,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4">
        <h3 className="text-base font-bold text-[#1E293B] mb-4">Add Vehicle Type</h3>
        <div className="space-y-3">
          <Field label="Vehicle Name">
            <TextInput value={label} onChange={setLabel} placeholder="e.g. Premium Cab" />
          </Field>
          <Field label="Description">
            <TextInput value={desc} onChange={setDesc} placeholder="e.g. Luxury rides" />
          </Field>
          <Field label="Max Passengers" hint="How many passengers can sit at once">
            <NumInput value={maxPassengers} onChange={setMaxPassengers} min={1} />
          </Field>
        </div>
        <div className="flex gap-3 mt-5">
          <button onClick={onClose}
            className="flex-1 py-2 rounded-lg border border-slate-200 text-sm
                       text-slate-500 hover:bg-slate-50 transition">
            Cancel
          </button>
          <button onClick={handleAdd}
            className="flex-1 py-2 rounded-lg bg-[#1A73E8] text-white text-sm
                       font-semibold hover:bg-blue-700 transition">
            Add Vehicle
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Edit Vehicle Modal ────────────────────────────────────
function EditVehicleModal({ vehicle, onSave, onClose }: {
  vehicle: Vehicle; onSave: (v: Vehicle) => void; onClose: () => void
}) {
  const [label, setLabel] = useState(vehicle.label)
  const [desc, setDesc] = useState(vehicle.desc)
  const [maxPassengers, setMaxPassengers] = useState(vehicle.maxPassengers)

  const handleSave = () => {
    if (!label.trim()) return
    onSave({ ...vehicle, label, desc, maxPassengers })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4">

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100
                          flex items-center justify-center">
            <VehicleIcon id={vehicle.id} size={20} className="text-[#1A73E8]" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#1E293B]">Edit Vehicle</h3>
            <p className="text-xs text-slate-400">Update details for {vehicle.label}</p>
          </div>
        </div>

        <div className="space-y-3">
          <Field label="Vehicle Name">
            <TextInput value={label} onChange={setLabel} />
          </Field>
          <Field label="Description">
            <TextInput value={desc} onChange={setDesc} />
          </Field>
          <Field
            label="Max Passengers"
            hint="Admin-controlled — update anytime if vehicle capacity changes"
          >
            {/* passenger pill preview */}
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              {Array.from({ length: Math.min(maxPassengers, 10) }).map((_, i) => (
                <div key={i}
                  className="w-7 h-7 rounded-full bg-blue-50 border border-blue-100
                             flex items-center justify-center">
                  <Users size={12} className="text-[#1A73E8]" />
                </div>
              ))}
              {maxPassengers > 10 && (
                <span className="text-xs text-slate-400">+{maxPassengers - 10} more</span>
              )}
            </div>
            <NumInput value={maxPassengers} onChange={setMaxPassengers} min={1} />
          </Field>
        </div>

        <div className="flex gap-3 mt-5">
          <button onClick={onClose}
            className="flex-1 py-2 rounded-lg border border-slate-200 text-sm
                       text-slate-500 hover:bg-slate-50 transition">
            Cancel
          </button>
          <button onClick={handleSave}
            className="flex-1 py-2 rounded-lg bg-[#1A73E8] text-white text-sm
                       font-semibold hover:bg-blue-700 transition">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Delete Confirm Modal ──────────────────────────────────
function DeleteConfirmModal({ label, isLast, onConfirm, onCancel }: {
  label: string
  isLast: boolean
  onConfirm: () => void
  onCancel: () => void
}) {
  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4">
        <div className="flex items-center justify-center w-12 h-12 rounded-full
                        bg-red-100 mx-auto mb-4">
          <Trash2 size={20} className="text-red-500" />
        </div>
        <h3 className="text-base font-bold text-[#1E293B] text-center mb-2">
          Remove Vehicle
        </h3>
        <p className="text-sm text-slate-500 text-center mb-3">
          Are you sure you want to remove{' '}
          <span className="font-semibold text-[#1E293B]">&quot;{label}&quot;</span>?{' '}
          This cannot be undone.
        </p>

        {/* Warning: affects existing drivers */}
        <div className="mb-5 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 flex items-start gap-2">
          <AlertCircle size={14} className="text-amber-500 mt-0.5 shrink-0" />
          <p className="text-xs text-amber-700 leading-relaxed">
            Drivers registered under <span className="font-semibold">{label}</span> will
            no longer appear in ride matching after this vehicle is removed and saved.
            Make sure no active drivers use this vehicle type.
          </p>
        </div>

        <div className="flex gap-3">
          <button onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm
                       font-medium text-slate-500 hover:bg-slate-50 transition">
            Cancel
          </button>
          <button onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm
                       font-semibold hover:bg-red-600 transition">
            Yes, Remove
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main FareTab ──────────────────────────────────────────
export function FareTab({ settings, update }: {
  settings: Settings
  update: (key: keyof Settings) => (val: any) => void
}) {
  const [activeTab, setActiveTab] = useState<TabId>('global')
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [editTarget, setEditTarget] = useState<Vehicle | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; label: string } | null>(null)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null)


  // The backend always provides settings.vehicles — no frontend defaults needed.
  useEffect(() => {
    setVehicles(settings.vehicles ?? [])
  }, [settings.vehicles])


  // ── Vehicle helpers ──────────────────────────────────
  const updateVehicle = (id: string, key: keyof Vehicle, val: any) =>
    setVehicles(vs => vs.map(v => v.id === id ? { ...v, [key]: val } : v))

  const editVehicle = (updated: Vehicle) =>
    setVehicles(vs => vs.map(v => v.id === updated.id ? updated : v))

  const addVehicle = (v: Vehicle) => {
    setVehicles(vs => [...vs, v])
    setActiveTab(v.id)
  }

  const confirmDelete = () => {
    if (!deleteConfirm) return
    const updated = vehicles.filter(v => v.id !== deleteConfirm.id)
    setVehicles(updated)
    if (activeTab === deleteConfirm.id) setActiveTab('global')
    setDeleteConfirm(null)
    setTimeout(() => handleSave(updated), 50)
  }

  // ── helper ───────────────────────────────────────────
  const pickVehicle = (id: string) => {
    const v = vehicles.find(v => v.id === id)
    if (!v) return undefined
    return {
      baseFare: v.baseFare,
      minFare: v.minFare,
      perKmRate: v.perKmRate,
      perMinuteRate: v.perMinuteRate,
      baseDistance: v.baseDistance,
      waitTimeFee: v.waitTimeFee,
      freeWaitMinutes: v.freeWaitMinutes,
      maxPassengers: v.maxPassengers,
    }
  }



  // ── Save ─────────────────────────────────────────────
  const handleSave = async (overrideVehicles?: Vehicle[]) => {
    const vehiclesToSave = overrideVehicles ?? vehicles
    setSaving(true)
    setToast(null)
    try {
      // PATCH /admin/settings/fare
      const farePayload = {
        cancellationFee: settings.cancellationFee,
        maxSurgeMultiplier: settings.maxSurgeMultiplier,
        freeCancellationWindow: settings.freeCancellationWindow,
        surgeEnabled: settings.surgeEnabled,
        surgeMultiplier: settings.surgeMultiplier,
        surgeStartTime: settings.surgeStartTime,
        surgeEndTime: settings.surgeEndTime,
        nightChargeEnabled: settings.nightChargeEnabled,
        nightChargeMultiplier: settings.nightChargeMultiplier,
        nightChargeStartTime: settings.nightChargeStartTime,
        nightChargeEndTime: settings.nightChargeEndTime,
        rainSurgeEnabled: settings.rainSurgeEnabled,
        rainSurgeMultiplier: settings.rainSurgeMultiplier,
        tollChargeEnabled: settings.tollChargeEnabled,
        tollGstPercentage: settings.tollGstPercentage,
        tollRounding: settings.tollRounding,
        bikeSettings: pickVehicle('bike'),
        autoSettings: pickVehicle('auto'),
        vehicles: vehiclesToSave,
      }

      await saveFareSettings(farePayload)

      setToast({ type: 'success', msg: 'Fare settings saved.' })
    } catch (err: any) {
      setToast({
        type: 'error',
        msg: err.response?.data?.message || 'Failed to save. Please try again.',
      })
    } finally {
      setSaving(false)
      setTimeout(() => setToast(null), 3500)
    }
  }

  const activeVehicle = vehicles.find(v => v.id === activeTab)

  return (
    <>
      {/* ── Toast ── */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-2 px-4 py-3
                         rounded-xl shadow-lg text-sm font-medium text-white
                         ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-500'}`}>
          {toast.type === 'success' ? <CheckCircle className="h-4 w-4 shrink-0" /> : <AlertCircle className="h-4 w-4 shrink-0" />}
          {toast.msg}
        </div>
      )}

      {/* ── Modals ── */}
      {showAddModal && (
        <AddVehicleModal onAdd={addVehicle} onClose={() => setShowAddModal(false)} />
      )}
      {editTarget && (
        <EditVehicleModal
          vehicle={editTarget}
          onSave={v => { editVehicle(v); setEditTarget(null) }}
          onClose={() => setEditTarget(null)}
        />
      )}
      {deleteConfirm && (
        <DeleteConfirmModal
          label={deleteConfirm.label}
          isLast={vehicles.length <= 1}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteConfirm(null)}
        />
      )}

      {/* ── Tab bar ── */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl mb-6 flex-wrap">
        <TabBtn
          active={activeTab === 'global'}
          onClick={() => setActiveTab('global')}
          icon={TrendingUp} label="Global"
        />
        {vehicles.map(v => (
          <TabBtn
            key={v.id}
            active={activeTab === v.id}
            onClick={() => setActiveTab(v.id)}
            icon={v.id === 'bike' ? Bike : v.id === 'auto' ? Zap : Car}
            label={v.label}
          />
        ))}
        <button onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium
                     text-[#1A73E8] hover:bg-blue-50 transition whitespace-nowrap ml-1">
          <Plus size={14} /> Add Vehicle
        </button>
      </div>

      {/* ── Empty state: no vehicles from API yet ── */}
      {vehicles.length === 0 && activeTab !== 'global' && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
            <Car size={24} className="text-slate-400" />
          </div>
          <p className="text-sm font-semibold text-[#1E293B] mb-1">No vehicles yet</p>
          <p className="text-xs text-slate-400 mb-4 max-w-xs">
            The backend hasn&apos;t returned any vehicle types yet. Click &quot;Add Vehicle&quot; above to create the first one.
          </p>
          <button onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1A73E8] text-white
                       text-sm font-semibold hover:bg-blue-700 transition">
            <Plus size={14} /> Add First Vehicle
          </button>
        </div>
      )}

      {/* ══════════════ GLOBAL TAB ══════════════ */}
      {activeTab === 'global' && (
        <div className="space-y-4 w-full">

          {/* Base global charges */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-5">
              <IndianRupee size={16} className="text-[#1A73E8]" />
              <h3 className="text-sm font-bold text-[#1E293B]">Base Global Charges</h3>
              <p className="text-xs text-slate-400 ml-1">— applied to all vehicle types</p>
            </div>
            <div className="grid grid-cols-3 gap-6">
              <Field label="Cancellation Fee (₹)" hint="Charged after driver is assigned">
                <NumInput value={settings.cancellationFee} onChange={update('cancellationFee')} />
              </Field>
              <Field label="Max Surge Multiplier (×)" hint="Combined night + rain + peak surge will never exceed this limit">
                <NumInput value={settings.maxSurgeMultiplier} onChange={update('maxSurgeMultiplier')} />
              </Field>
              <Field label="Free Cancellation Window (min)" hint="Rider can cancel free within this many minutes after booking">
                <NumInput value={settings.freeCancellationWindow} onChange={update('freeCancellationWindow')} />
              </Field>
            </div>
          </div>

          {/* ── NEW: Taxes, Fees & Commissions ── */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-5">
              <Wallet size={16} className="text-[#1A73E8]" />
              <h3 className="text-sm font-bold text-[#1E293B]">Taxes, Fees & Commissions</h3>
              <p className="text-xs text-slate-400 ml-1">— deducted / added on every ride</p>
            </div>
            <div className="grid grid-cols-4 gap-6">
              <Field label="Platform Fee (₹)" hint="Flat fee charged to rider for app maintenance">
                <NumInput
                  value={settings.platformFee}
                  onChange={update('platformFee')}
                  min={0}
                />
              </Field>
              <Field label="Platform Commission (%)" hint="% of each ride fare taken by platform">
                <div className="relative">
                  <NumInput
                    value={settings.commission}
                    onChange={update('commission')}
                    min={0}
                  />
                  <Percent size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </Field>
              <Field label="Tax / GST (%)" hint="Tax applied to the final fare">
                <div className="relative">
                  <NumInput
                    value={settings.taxPercentage}
                    onChange={update('taxPercentage')}
                    min={0}
                  />
                  <Percent size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </Field>
              <Field label="Driver Commission (%)" hint="Platform's cut from the driver's earnings">
                <div className="relative">
                  <NumInput
                    value={settings.driverCommissionPercentage}
                    onChange={update('driverCommissionPercentage')}
                    min={0}
                  />
                  <Percent size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </Field>
            </div>

            {/* Breakdown info note */}
            <div className="mt-5 rounded-xl bg-slate-50 border border-slate-100 px-4 py-3 space-y-1.5">
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">How it's calculated per ride</p>
              <div className="grid grid-cols-3 gap-3 mt-2">
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#1A73E8] mt-1.5 shrink-0" />
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    <span className="font-semibold text-[#1E293B]">Rider pays:</span>{' '}
                    Fare + Platform Fee + GST
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 shrink-0" />
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    <span className="font-semibold text-[#1E293B]">Driver earns:</span>{' '}
                    Fare − Commission %
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    <span className="font-semibold text-[#1E293B]">Platform earns:</span>{' '}
                    Commission % + Platform Fee
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Peak Hour Surge */}
          <ChargeBlock icon={TrendingUp} iconColor="text-orange-500"
            title="Peak Hour Surge" badge="Auto"
            enabled={settings.surgeEnabled} onToggle={update('surgeEnabled')}>
            <Field label="Multiplier" hint="e.g. 1.5 = 1.5× fare">
              <NumInput value={settings.surgeMultiplier} onChange={update('surgeMultiplier')} />
            </Field>
            <Field label="Start Time">
              <TimeInput value={settings.surgeStartTime} onChange={update('surgeStartTime')} />
            </Field>
            <Field label="End Time">
              <TimeInput value={settings.surgeEndTime} onChange={update('surgeEndTime')} />
            </Field>
            <div />
          </ChargeBlock>

          {/* Night Charge */}
          <ChargeBlock icon={Moon} iconColor="text-indigo-500"
            title="Night Charge" badge="Auto"
            enabled={settings.nightChargeEnabled} onToggle={update('nightChargeEnabled')}>
            <Field label="Multiplier" hint="e.g. 1.25 = 1.25× fare">
              <NumInput value={settings.nightChargeMultiplier} onChange={update('nightChargeMultiplier')} />
            </Field>
            <Field label="Start Time" hint="e.g. 11:00 PM">
              <TimeInput value={settings.nightChargeStartTime} onChange={update('nightChargeStartTime')} />
            </Field>
            <Field label="End Time" hint="e.g. 05:00 AM">
              <TimeInput value={settings.nightChargeEndTime} onChange={update('nightChargeEndTime')} />
            </Field>
            <div />
          </ChargeBlock>

          {/* Rain Surge */}
          <ChargeBlock icon={CloudRain} iconColor="text-sky-500"
            title="Rain Surge" badge="Manual"
            enabled={settings.rainSurgeEnabled} onToggle={update('rainSurgeEnabled')}>
            <Field label="Multiplier" hint="e.g. 1.5 = 1.5× fare during rain">
              <NumInput value={settings.rainSurgeMultiplier} onChange={update('rainSurgeMultiplier')} />
            </Field>
            <div /><div /><div />
          </ChargeBlock>

          {/* Toll Charges */}
          <ChargeBlock icon={Receipt} iconColor="text-amber-500"
            title="Toll Charges" badge="Auto"
            enabled={settings.tollChargeEnabled} onToggle={update('tollChargeEnabled')}>
            <Field label="Toll GST (%)" hint="GST applied on toll amount if applicable">
              <NumInput value={settings.tollGstPercentage} onChange={update('tollGstPercentage')} min={0} />
            </Field>
            <Field label="Toll Rounding" hint="Round toll to nearest value">
              <select
                value={settings.tollRounding}
                onChange={e => update('tollRounding')(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#1A73E8] focus:border-transparent"
              >
                <option value="none">No rounding</option>
                <option value="1">Nearest ₹1</option>
                <option value="5">Nearest ₹5</option>
                <option value="10">Nearest ₹10</option>
              </select>
            </Field>
            <div className="col-span-2 flex items-start gap-2 bg-blue-50 border border-blue-100 rounded-xl p-4">
              <Receipt size={16} className="text-[#1A73E8] mt-0.5 shrink-0" />
              <p className="text-xs text-[#1A73E8] leading-relaxed">
                Toll amount is detected automatically from Google Maps API when the route passes through a toll plaza. Rider pays toll as part of total fare. No manual input needed.
              </p>
            </div>
          </ChargeBlock>

          {/* Info note */}
          <div className="flex items-start gap-2 bg-blue-50 border border-blue-100
                          rounded-xl px-4 py-3">
            <Clock size={14} className="text-[#1A73E8] mt-0.5 shrink-0" />
            <p className="text-xs text-slate-500 leading-relaxed">
              <span className="font-semibold text-[#1E293B]">Auto charges</span> apply
              automatically based on the time window — no manual action needed.{' '}
              <span className="font-semibold text-[#1E293B]">Rain Surge</span> must be
              toggled manually by the admin when it rains.
            </p>
          </div>
        </div>
      )}

      {/* ══════════════ VEHICLE TAB ══════════════ */}
      {activeVehicle && (
        <div className="w-full space-y-4">

          {/* Vehicle header card */}
          <div className={`rounded-2xl border p-5 ${activeVehicle.accent}`}>
            <div className="flex items-start justify-between gap-4">

              {/* Left — info */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white border border-slate-200
                                flex items-center justify-center shadow-sm">
                  <VehicleIcon id={activeVehicle.id} size={24} className="text-[#1A73E8]" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#1E293B]">
                    {activeVehicle.label}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">{activeVehicle.desc}</p>

                  {/* Passenger capacity badge */}
                  <div className="flex items-center gap-1.5 mt-2">
                    <div className="flex items-center gap-1 bg-white border border-slate-200
                                    rounded-full px-2.5 py-1">
                      <Users size={12} className="text-[#1A73E8]" />
                      <span className="text-xs font-semibold text-[#1E293B]">
                        {activeVehicle.maxPassengers}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {activeVehicle.maxPassengers === 1 ? 'passenger' : 'passengers'}
                      </span>
                    </div>
                    {/* passenger icon pills */}
                    <div className="flex gap-0.5">
                      {Array.from({ length: Math.min(activeVehicle.maxPassengers, 8) }).map((_, i) => (
                        <div key={i}
                          className="w-5 h-5 rounded-full bg-white border border-slate-200
                                     flex items-center justify-center">
                          <Users size={9} className="text-slate-400" />
                        </div>
                      ))}
                      {activeVehicle.maxPassengers > 8 && (
                        <div className="w-5 h-5 rounded-full bg-slate-100 border border-slate-200
                                        flex items-center justify-center">
                          <span className="text-[9px] font-bold text-slate-400">
                            +{activeVehicle.maxPassengers - 8}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right — action buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setEditTarget(activeVehicle)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border
                             border-[#1A73E8]/30 text-[#1A73E8] text-xs font-medium
                             hover:bg-[#1A73E8]/10 transition">
                  <Pencil size={12} /> Edit
                </button>
                <button
                  disabled={vehicles.length <= 1}
                  title={vehicles.length <= 1 ? 'At least one vehicle is required' : 'Remove this vehicle'}
                  onClick={() => setDeleteConfirm({
                    id: activeVehicle.id,
                    label: activeVehicle.label,
                  })}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border
                             border-red-200 text-red-500 text-xs font-medium
                             hover:bg-red-50 transition
                             disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent">
                  <Trash2 size={12} /> Remove
                </button>
              </div>
            </div>
          </div>

          {/* ── Fare Configuration (updated with baseDistance + waitTimeFee) ── */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-5">
              <Settings2 size={15} className="text-[#1A73E8]" />
              <h3 className="text-sm font-bold text-[#1E293B]">Fare Configuration</h3>
            </div>

            {/* Row 1 — core fare fields */}
            <div className="grid grid-cols-4 gap-6">
              <Field label="Base Fare (₹)" hint="Fixed charge when ride starts">
                <NumInput value={activeVehicle.baseFare}
                  onChange={v => updateVehicle(activeVehicle.id, 'baseFare', v)} />
              </Field>
              <Field label="Minimum Fare (₹)" hint="No ride below this amount">
                <NumInput value={activeVehicle.minFare}
                  onChange={v => updateVehicle(activeVehicle.id, 'minFare', v)} />
              </Field>
              <Field label="Per KM Rate (₹)" hint="Charged per kilometre after base distance">
                <NumInput value={activeVehicle.perKmRate}
                  onChange={v => updateVehicle(activeVehicle.id, 'perKmRate', v)} />
              </Field>
              <Field label="Per Minute Rate (₹)" hint="Charged per minute of ride time — differs per vehicle">
                <NumInput value={activeVehicle.perMinuteRate}
                  onChange={v => updateVehicle(activeVehicle.id, 'perMinuteRate', v)} />
              </Field>
            </div>

            {/* Divider */}
            <div className="border-t border-slate-100 my-5" />

            {/* Row 2 — distance & wait time */}
            <div className="grid grid-cols-4 gap-6">
              <Field
                label="Base Distance (km)"
                hint="Distance included under the Base Fare — per KM rate kicks in after this"
              >
                <NumInput
                  value={activeVehicle.baseDistance}
                  onChange={v => updateVehicle(activeVehicle.id, 'baseDistance', v)}
                  min={0}
                  step={0.1}
                />
              </Field>

              <Field
                label="Free Wait Window (min)"
                hint="Driver waits this long at no charge before the fee starts"
              >
                <NumInput
                  value={activeVehicle.freeWaitMinutes}
                  onChange={v => updateVehicle(activeVehicle.id, 'freeWaitMinutes', Math.max(0, v))}
                  min={0}
                  step={1}
                />
              </Field>

              <Field
                label="Wait Time Fee (₹/min)"
                hint={`Charged per minute after the ${activeVehicle.freeWaitMinutes}-min free window`}
              >
                <NumInput
                  value={activeVehicle.waitTimeFee}
                  onChange={v => updateVehicle(activeVehicle.id, 'waitTimeFee', v)}
                  min={0}
                />
              </Field>

              {/* Wait time info pill */}
              <div className="flex items-end pb-0.5">
                <div className="w-full rounded-xl bg-amber-50 border border-amber-100 px-3 py-2.5 flex items-start gap-2">
                  <Timer size={13} className="text-amber-500 mt-0.5 shrink-0" />
                  <p className="text-[11px] text-amber-700 leading-relaxed">
                    Free {activeVehicle.freeWaitMinutes} min → then{' '}
                    <span className="font-bold">₹{activeVehicle.waitTimeFee}/min</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Wait time explainer note */}
            <div className="mt-4 flex items-start gap-2 bg-slate-50 border border-slate-100
                            rounded-xl px-4 py-3">
              <Clock size={13} className="text-slate-400 mt-0.5 shrink-0" />
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Wait time fee starts <span className="font-semibold text-[#1E293B]">only after the driver arrives at the pickup</span>{' '}
                and the passenger hasn't boarded within the{' '}
                <span className="font-semibold text-[#1E293B]">{activeVehicle.freeWaitMinutes}-minute free window</span>.
                After that, <span className="font-semibold text-[#1E293B]">₹{activeVehicle.waitTimeFee}/min</span> is
                added to the final fare to compensate the driver for lost time.
              </p>
            </div>
          </div>

          {/* Max passengers — inline editable */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-1">
              <Users size={15} className="text-[#1A73E8]" />
              <h3 className="text-sm font-bold text-[#1E293B]">Passenger Capacity</h3>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Admin-controlled — update anytime if vehicle capacity changes in the future.
            </p>
            <div className="flex items-center gap-6">
              <div className="w-40">
                <NumInput
                  value={activeVehicle.maxPassengers}
                  onChange={v => updateVehicle(activeVehicle.id, 'maxPassengers', Math.max(1, v))}
                  min={1}
                />
              </div>
              {/* Live pill preview */}
              <div className="flex gap-1 flex-wrap">
                {Array.from({ length: Math.min(activeVehicle.maxPassengers, 10) }).map((_, i) => (
                  <div key={i}
                    className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100
                               flex items-center justify-center">
                    <Users size={13} className="text-[#1A73E8]" />
                  </div>
                ))}
                {activeVehicle.maxPassengers > 10 && (
                  <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200
                                  flex items-center justify-center">
                    <span className="text-[10px] font-bold text-slate-400">
                      +{activeVehicle.maxPassengers - 10}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Surcharges preview */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={15} className="text-[#1A73E8]" />
              <h3 className="text-sm font-bold text-[#1E293B]">Applied Surcharges</h3>
              <p className="text-xs text-slate-400 ml-1">— manage in Global tab</p>
            </div>
            <div>
              <SurchargeRow icon={TrendingUp} color="text-orange-500"
                label="Peak Hour Surge" active={settings.surgeEnabled}
                value={`${settings.surgeMultiplier}×`}
                time={`${settings.surgeStartTime} – ${settings.surgeEndTime}`} />
              <SurchargeRow icon={Moon} color="text-indigo-500"
                label="Night Charge" active={settings.nightChargeEnabled}
                value={`${settings.nightChargeMultiplier}×`}
                time={`${settings.nightChargeStartTime} – ${settings.nightChargeEndTime}`} />
              <SurchargeRow icon={CloudRain} color="text-sky-500"
                label="Rain Surge" active={settings.rainSurgeEnabled}
                value={`${settings.rainSurgeMultiplier}×`} />
            </div>
          </div>

        </div>
      )}

      {/* ── Save ── */}
      <div className="mt-8 flex justify-end">
        <button onClick={() => handleSave()} disabled={saving}
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