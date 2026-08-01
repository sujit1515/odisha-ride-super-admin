 'use client';
 
import { useState, useEffect } from 'react'
import AdminShell from '@/components/Common/AdminShell'
import { User, Mail, Phone, Shield, Camera, Edit3,Key, Save, X, Check, Globe, Lock,Activity, Clock, LogOut, Eye, EyeOff, AlertCircle, } from 'lucide-react'
import { getAdminProfile, updateAdminProfile, changeAdminPassword, adminLogout } from '@/api/auth'
import { useRouter } from 'next/navigation' 
import type { Tab,FormState,PasswordState,ProfileMeta, } from '@/api/types/types'


export default function ProfilePage() {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('profile')

  // ── Profile state
  const [form, setForm] = useState<FormState>({ name: '', email: '', phone: '', city: '' })
  const [meta, setMeta] = useState<ProfileMeta>({ role: 'Super Admin', avatar: '', joinedAt: '', lastLogin: '' })
  const [editing, setEditing] = useState(false)
  const [saved, setSaved] = useState(false)
  const [profileLoading, setProfileLoading] = useState(true)
  const [profileError, setProfileError] = useState<string | null>(null)
  const [saveLoading, setSaveLoading] = useState(false)

  // ── Password state
  const [passwords, setPasswords] = useState<PasswordState>({ old: '', new: '', confirm: '' })
  const [showOld, setShowOld] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [pwLoading, setPwLoading] = useState(false)
  const [pwError, setPwError] = useState<string | null>(null)
  const [pwSuccess, setPwSuccess] = useState(false)

  // ── Keep original form values for cancel
  const [originalForm, setOriginalForm] = useState<FormState>({ name: '', email: '', phone: '', city: '' })

  // ── Fetch profile on mount
  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      setProfileLoading(true)
      setProfileError(null)
      const res = await getAdminProfile()
      const a = res.admin
      const formData: FormState = {
        name: a.fullName || '',
        email: a.email || '',
        phone: a.phone || '',
        city: a.city || '',
      }
      setForm(formData)
      setOriginalForm(formData)
      setMeta({
        role: a.role === 'super_admin' ? 'Super Admin' : 'Admin',
        avatar: (a.fullName || 'A')
          .split(' ')
          .map((n: string) => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2),
        joinedAt: a.createdAt
          ? new Date(a.createdAt).toLocaleDateString('en-IN', {
              day: '2-digit', month: 'short', year: 'numeric',
            })
          : '',
        lastLogin: 'Today',
      })
    } catch (err) {
      console.error('Failed to load profile', err)
      setProfileError('Failed to load profile. Please refresh.')
    } finally {
      setProfileLoading(false)
    }
  }

  // ── Save profile
  const handleSave = async () => {
    setSaveLoading(true)
    setProfileError(null)
    try {
      await updateAdminProfile({
        fullName: form.name,
        phone: form.phone,
        city: form.city,
      })
      setOriginalForm(form)
      setSaved(true)
      setEditing(false)
      setTimeout(() => setSaved(false), 2500)
    } catch (err: any) {
      setProfileError(
        err?.response?.data?.message || 'Failed to save. Please try again.'
      )
    } finally {
      setSaveLoading(false)
    }
  }

  const handleCancel = () => {
    setForm(originalForm)
    setEditing(false)
    setProfileError(null)
  }

  // ── Change password
  const handlePasswordChange = async () => {
    setPwError(null)
    setPwSuccess(false)

    if (!passwords.old || !passwords.new || !passwords.confirm) {
      setPwError('All fields are required.')
      return
    }
    if (passwords.new !== passwords.confirm) {
      setPwError('New password and confirm password do not match.')
      return
    }
    if (passwords.new.length < 8) {
      setPwError('New password must be at least 8 characters.')
      return
    }

    setPwLoading(true)
    try {
      await changeAdminPassword({
        currentPassword: passwords.old,
        newPassword: passwords.new,
      })
      setPwSuccess(true)
      setPasswords({ old: '', new: '', confirm: '' })
      // Backend invalidates token on password change — auto logout
      setTimeout(async () => {
        await adminLogout()
        router.push('/login')
      }, 2000)
    } catch (err: any) {
      setPwError(
        err?.response?.data?.message || 'Failed to change password. Please try again.'
      )
    } finally {
      setPwLoading(false)
    }
  }

  // ── Logout all devices
  const handleLogout = async () => {
    try {
      await adminLogout()
    } finally {
      router.push('/login')
    }
  }

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: 'profile', label: 'Profile', icon: <User className="h-4 w-4" /> },
    { key: 'security', label: 'Security', icon: <Lock className="h-4 w-4" /> },
  ]

  // ── Loading skeleton
  if (profileLoading) {
    return (
      <AdminShell title="My Profile">
        <div className="max-w-4xl mx-auto animate-pulse">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm mb-5 overflow-hidden">
            <div className="h-24 bg-slate-200" />
            <div className="px-6 pb-5 pt-3">
              <div className="w-20 h-20 rounded-2xl bg-slate-200 -mt-10 mb-4" />
              <div className="h-5 w-40 bg-slate-200 rounded mb-2" />
              <div className="h-3 w-56 bg-slate-100 rounded" />
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <div className="grid grid-cols-2 gap-5">
              {[1, 2, 3, 4].map(i => (
                <div key={i}>
                  <div className="h-3 w-20 bg-slate-100 rounded mb-2" />
                  <div className="h-10 bg-slate-100 rounded-lg" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </AdminShell>
    )
  }

  return (
    <AdminShell title="My Profile">
      <div className="max-w-4xl mx-auto">

        {/* ── Profile Header Card */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm mb-5 overflow-hidden">
          {/* Cover strip */}
          <div className="h-24 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 relative">
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)',
                backgroundSize: '30px 30px',
              }}
            />
          </div>

          <div className="px-6 pb-5">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-10 mb-4">
              {/* Avatar */}
              <div className="relative w-fit">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-2xl font-bold ring-4 ring-white shadow-lg">
                  {meta.avatar}
                </div>
                <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full border border-slate-200 shadow flex items-center justify-center hover:bg-slate-50 transition-colors">
                  <Camera className="h-3 w-3 text-slate-500" />
                </button>
              </div>

              {/* Role badge + saved indicator */}
              <div className="flex items-center gap-3 sm:mb-1">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
                  <Shield className="h-3 w-3" /> {meta.role}
                </span>
                {saved && (
                  <span className="inline-flex items-center gap-1 text-blue-600 text-xs font-medium">
                    <Check className="h-3.5 w-3.5" /> Saved
                  </span>
                )}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-800">{form.name || '—'}</h2>
              <p className="text-sm text-slate-500 mt-0.5">{form.email}</p>
            </div>

            {/* Meta row */}
            <div className="flex flex-wrap gap-4 mt-4 text-xs text-slate-400">
              {meta.joinedAt && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" /> Joined {meta.joinedAt}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Activity className="h-3.5 w-3.5" /> Last login: {meta.lastLogin}
              </span>
              {form.city && (
                <span className="flex items-center gap-1">
                  <Globe className="h-3.5 w-3.5" /> {form.city}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ── Tabs */}
        <div className="flex gap-1 bg-slate-100 rounded-xl p-1 mb-5">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                tab === t.key
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* ── Profile Tab */}
        {tab === 'profile' && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-semibold text-slate-800">Personal Information</h3>
              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  <Edit3 className="h-3.5 w-3.5" /> Edit
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleCancel}
                    disabled={saveLoading}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                  >
                    <X className="h-3.5 w-3.5" /> Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saveLoading}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-medium hover:bg-blue-700 disabled:opacity-50"
                  >
                    {saveLoading
                      ? <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-white" />
                      : <Save className="h-3.5 w-3.5" />
                    }
                    Save changes
                  </button>
                </div>
              )}
            </div>

            {/* Profile error banner */}
            {profileError && (
              <div className="flex items-center gap-2 p-3 mb-4 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                {profileError}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {[
                { label: 'Full name',      key: 'name',  icon: <User  className="h-4 w-4 text-slate-400" />, type: 'text',  editable: true  },
                { label: 'Email address',  key: 'email', icon: <Mail  className="h-4 w-4 text-slate-400" />, type: 'email', editable: false },
                { label: 'Phone number',   key: 'phone', icon: <Phone className="h-4 w-4 text-slate-400" />, type: 'tel',   editable: true  },
                { label: 'City',           key: 'city',  icon: <Globe className="h-4 w-4 text-slate-400" />, type: 'text',  editable: true  },
              ].map(field => (
                <div key={field.key}>
                  <label className="block text-xs text-slate-400 mb-1.5">{field.label}</label>
                  {editing && field.editable ? (
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2">{field.icon}</span>
                      <input
                        type={field.type}
                        value={form[field.key as keyof FormState]}
                        onChange={e => setForm(prev => ({ ...prev, [field.key]: e.target.value }))}
                        className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-2.5 px-3 py-2.5 bg-slate-50 rounded-lg">
                      {field.icon}
                      <span className="text-sm text-slate-700 font-medium">
                        {form[field.key as keyof FormState] || '—'}
                      </span>
                      {editing && !field.editable && (
                        <span className="ml-auto text-xs text-slate-400">Read only</span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Read-only fields */}
            <div className="mt-5 pt-5 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Role</label>
                <div className="flex items-center gap-2.5 px-3 py-2.5 bg-slate-50 rounded-lg">
                  <Shield className="h-4 w-4 text-blue-500" />
                  <span className="text-sm text-slate-700 font-medium">{meta.role}</span>
                  <span className="ml-auto text-xs text-slate-400">Read only</span>
                </div>
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Account created</label>
                <div className="flex items-center gap-2.5 px-3 py-2.5 bg-slate-50 rounded-lg">
                  <Clock className="h-4 w-4 text-slate-400" />
                  <span className="text-sm text-slate-700 font-medium">{meta.joinedAt || '—'}</span>
                  <span className="ml-auto text-xs text-slate-400">Read only</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Security Tab */}
        {tab === 'security' && (
          <div className="flex flex-col gap-5">

            {/* Change password */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-5">
                <Key className="h-4 w-4 text-slate-400" />
                <h3 className="text-sm font-semibold text-slate-800">Change Password</h3>
              </div>

              {/* Error */}
              {pwError && (
                <div className="flex items-center gap-2 p-3 mb-4 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  {pwError}
                </div>
              )}

              {/* Success */}
              {pwSuccess && (
                <div className="flex items-center gap-2 p-3 mb-4 bg-blue-50 border border-blue-100 rounded-lg text-blue-700 text-sm">
                  <Check className="h-4 w-4 flex-shrink-0" />
                  Password changed successfully. Redirecting to login...
                </div>
              )}

              <div className="flex flex-col gap-4 max-w-md">
                {[
                  { label: 'Current password',      key: 'old',     show: showOld,     toggle: () => setShowOld(p => !p)     },
                  { label: 'New password',           key: 'new',     show: showNew,     toggle: () => setShowNew(p => !p)     },
                  { label: 'Confirm new password',   key: 'confirm', show: showConfirm, toggle: () => setShowConfirm(p => !p) },
                ].map(field => (
                  <div key={field.key}>
                    <label className="block text-xs text-slate-400 mb-1.5">{field.label}</label>
                    <div className="relative">
                      <input
                        type={field.show ? 'text' : 'password'}
                        value={passwords[field.key as keyof PasswordState]}
                        onChange={e => {
                          setPasswords(prev => ({ ...prev, [field.key]: e.target.value }))
                          setPwError(null)
                        }}
                        placeholder="••••••••"
                        disabled={pwLoading || pwSuccess}
                        className="w-full px-3 pr-10 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 disabled:opacity-50 disabled:bg-slate-50"
                      />
                      <button
                        onClick={field.toggle}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {field.show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                ))}

                <button
                  onClick={handlePasswordChange}
                  disabled={pwLoading || pwSuccess}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors mt-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {pwLoading
                    ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    : <Key className="h-4 w-4" />
                  }
                  {pwLoading ? 'Updating...' : 'Update password'}
                </button>
              </div>
            </div>

            {/* Session info */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="h-4 w-4 text-slate-400" />
                <h3 className="text-sm font-semibold text-slate-800">Active Session</h3>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-100 rounded-xl">
                <div>
                  <p className="text-sm font-medium text-slate-700">
                    Chrome · Windows · {form.city || 'Unknown'}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Current session · {meta.lastLogin}
                  </p>
                </div>
                <span className="flex items-center gap-1 text-xs text-blue-600 font-medium">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
                  Active
                </span>
              </div>

              <button
                onClick={handleLogout}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-red-200 bg-red-50 text-red-600 text-sm font-medium hover:bg-red-100 transition-colors"
              >
                <LogOut className="h-4 w-4" /> Sign out of all devices
              </button>
            </div>

          </div>
        )}

      </div>
    </AdminShell>
  )
}