'use client'

import { useState } from 'react'
import {
  Settings,
  ShieldAlert,
  Percent,
  IndianRupee,
  Lock,
  Eye,
  EyeOff,
  Save,
  CheckCircle2,
  Sliders,
  CreditCard,
  Building,
  Key,
} from 'lucide-react'
import { PaymentSettings } from './types'
import { mockPaymentSettings } from './mockData'

export default function PaymentSettingsForm() {
  const [formData, setFormData] = useState<PaymentSettings>(mockPaymentSettings)
  const [showSecret, setShowSecret] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(false)

  const handleToggle = (key: keyof PaymentSettings) => {
    setFormData((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const handleChange = (key: keyof PaymentSettings, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      setSavedSuccess(true)
      setTimeout(() => setSavedSuccess(false), 3000)
    }, 600)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl">
      {/* Header Info Banner */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">
            <Settings className="h-4 w-4" />
            <span>Platform Financial Configuration</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Payment & Commission Settings</h2>
          <p className="text-sm text-slate-500 mt-1">
            Configure global commission rates, driver credit limits, automated enforcement rules, and payment gateways.
          </p>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-all shadow-md hover:shadow-blue-600/20 disabled:opacity-50 cursor-pointer self-start md:self-auto shrink-0"
        >
          {isSaving ? (
            <>
              <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              <span>Saving...</span>
            </>
          ) : savedSuccess ? (
            <>
              <CheckCircle2 className="h-4 w-4 text-emerald-300 animate-bounce" />
              <span>Settings Saved!</span>
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              <span>Save Configuration</span>
            </>
          )}
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold flex items-center gap-2 animate-fade-in shadow-xs">
          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          <span>Payment settings updated successfully across the Super Admin portal.</span>
        </div>
      )}

      {/* Grid Settings Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Commission Rates & Default Limits */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 space-y-5">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
              <Percent className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Commission & Limits</h3>
              <p className="text-xs text-slate-500">Base ride fee percentage & standard driver caps</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Platform Commission Rate */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Platform Commission (%) *
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="50"
                  step="0.5"
                  required
                  value={formData.platformCommission}
                  onChange={(e) => handleChange('platformCommission', parseFloat(e.target.value))}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="absolute right-4 top-2.5 font-bold text-slate-400">%</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Deducted automatically from driver earnings per completed trip.
              </p>
            </div>

            {/* Default Commission Limit */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Default Commission Limit (₹) *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-slate-400 font-bold">₹</span>
                <input
                  type="number"
                  min="100"
                  max="10000"
                  step="100"
                  required
                  value={formData.defaultCommissionLimit}
                  onChange={(e) => handleChange('defaultCommissionLimit', parseFloat(e.target.value))}
                  className="w-full pl-8 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Assigned automatically to newly onboarded drivers.
              </p>
            </div>
          </div>
        </div>

        {/* Card 2: Warning & Blocking Thresholds */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 space-y-5">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Enforcement Thresholds</h3>
              <p className="text-xs text-slate-500">Automated warning SMS & dispatch lock limits</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Warning Threshold */}
            <div>
              <label className="block text-xs font-bold text-amber-800 uppercase tracking-wider mb-1.5">
                Warning Threshold (₹)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-amber-600 font-bold">₹</span>
                <input
                  type="number"
                  step="50"
                  value={formData.warningThreshold}
                  onChange={(e) => handleChange('warningThreshold', parseFloat(e.target.value))}
                  className="w-full pl-8 pr-4 py-2.5 bg-amber-50/50 border border-amber-200 rounded-xl text-sm font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Drivers reaching this level get SMS alerts and yellow status badges.
              </p>
            </div>

            {/* Block Threshold */}
            <div>
              <label className="block text-xs font-bold text-rose-800 uppercase tracking-wider mb-1.5">
                Block Threshold (₹)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-rose-600 font-bold">₹</span>
                <input
                  type="number"
                  step="50"
                  value={formData.blockThreshold}
                  onChange={(e) => handleChange('blockThreshold', parseFloat(e.target.value))}
                  className="w-full pl-8 pr-4 py-2.5 bg-rose-50/50 border border-rose-200 rounded-xl text-sm font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Exceeding this amount automatically blocks driver ride assignment.
              </p>
            </div>
          </div>
        </div>

        {/* Card 3: Payment Rules & Automation Toggles */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 space-y-5">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600">
              <Sliders className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Automation & Rules</h3>
              <p className="text-xs text-slate-500">Toggle partial collection & auto-unblock behaviors</p>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            {/* Allow Partial Payments Toggle */}
            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="space-y-0.5">
                <span className="font-bold text-slate-900 block text-sm">
                  Allow Partial Payments
                </span>
                <span className="text-slate-500">
                  Drivers can pay a fraction of outstanding balance to reduce limit pressure.
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleToggle('allowPartialPayments')}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-200 cursor-pointer ${
                  formData.allowPartialPayments ? 'bg-blue-600 justify-end' : 'bg-slate-300 justify-start'
                }`}
              >
                <span className="h-4 w-4 rounded-full bg-white shadow-md transform transition-transform" />
              </button>
            </div>

            {/* Auto Unblock After Payment Toggle */}
            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="space-y-0.5">
                <span className="font-bold text-slate-900 block text-sm">
                  Auto Unblock After Payment
                </span>
                <span className="text-slate-500">
                  Automatically lift dispatch block when outstanding drops below threshold.
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleToggle('autoUnblockAfterPayment')}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-200 cursor-pointer ${
                  formData.autoUnblockAfterPayment ? 'bg-blue-600 justify-end' : 'bg-slate-300 justify-start'
                }`}
              >
                <span className="h-4 w-4 rounded-full bg-white shadow-md transform transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Card 4: Gateway Configuration & API Credentials */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 space-y-5">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
              <CreditCard className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Payment Gateway Setup</h3>
              <p className="text-xs text-slate-500">Razorpay API credentials & gateway integration</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Default Gateway Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Primary Online Gateway
              </label>
              <select
                value={formData.defaultPaymentGateway}
                onChange={(e) => handleChange('defaultPaymentGateway', e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="Razorpay">Razorpay (Recommended)</option>
                <option value="PhonePe">PhonePe Business PG</option>
                <option value="Paytm">Paytm Merchant PG</option>
                <option value="Cashfree">Cashfree Payments</option>
              </select>
            </div>

            {/* Razorpay Key */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Razorpay Key ID Placeholder
              </label>
              <div className="relative">
                <Key className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={formData.razorpayKey}
                  onChange={(e) => handleChange('razorpayKey', e.target.value)}
                  placeholder="rzp_live_..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Razorpay Secret */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Razorpay Key Secret Placeholder
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type={showSecret ? 'text' : 'password'}
                  value={formData.razorpaySecret}
                  onChange={(e) => handleChange('razorpaySecret', e.target.value)}
                  placeholder="Secret key..."
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowSecret(!showSecret)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}
