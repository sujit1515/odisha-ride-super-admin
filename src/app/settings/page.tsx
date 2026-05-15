// 'use client'
// import { useState, ChangeEvent } from 'react'
// import AdminShell from '@/components/Super-admin/AdminShell'

// interface ToggleRow {
//   label: string
//   v: boolean
//   on: (v: boolean) => void
//   description?: string
// }

// export default function SettingsPage() {
//   const [name, setName] = useState<string>('Odisha Ride')
//   const [fee, setFee] = useState<number>(15)
//   const [base, setBase] = useState<number>(50)
//   const [perKm, setPerKm] = useState<number>(12)
//   const [notif, setNotif] = useState<boolean>(true)
//   const [sos, setSos] = useState<boolean>(true)
  
//   // New settings
//   const [autoApprove, setAutoApprove] = useState<boolean>(false) // OFF by default for security
//   const [kycMandatory, setKycMandatory] = useState<boolean>(true) // ON by default

//   const rows: ToggleRow[] = [
//     { label: 'Email & Push notifications for new rides', v: notif, on: setNotif },
//     { label: 'SOS / emergency alerts dashboard', v: sos, on: setSos },
//   ]

//   const handleSave = () => {
//     // Save all settings to backend
//     const settings = {
//       platformName: name,
//       commission: fee,
//       baseFare: base,
//       perKmRate: perKm,
//       notifications: notif,
//       sosEnabled: sos,
//       autoApproveDrivers: autoApprove,
//       kycMandatory: kycMandatory
//     }
//     console.log('Saving settings:', settings)
//     // API call here
//     alert('Settings saved successfully!')
//   }

//   return (
//     <AdminShell title="Settings">
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
//           <h3 className="text-lg font-semibold text-slate-800 mb-4">General</h3>
//           <div className="space-y-4">
//             <div>
//               <label className="text-sm text-slate-600">Platform Name</label>
//               <input 
//                 value={name} 
//                 onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)} 
//                 className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-200 text-sm" 
//               />
//             </div>
//             <div>
//               <label className="text-sm text-slate-600">Platform Commission (%)</label>
//               <input 
//                 type="number" 
//                 value={fee} 
//                 onChange={(e: ChangeEvent<HTMLInputElement>) => setFee(Number(e.target.value))} 
//                 className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-200 text-sm" 
//               />
//             </div>
//           </div>
//         </div>

//         <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
//           <h3 className="text-lg font-semibold text-slate-800 mb-4">Fare Settings</h3>
//           <div className="space-y-4">
//             <div>
//               <label className="text-sm text-slate-600">Base Fare (₹)</label>
//               <input 
//                 type="number" 
//                 value={base} 
//                 onChange={(e: ChangeEvent<HTMLInputElement>) => setBase(Number(e.target.value))} 
//                 className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-200 text-sm" 
//               />
//             </div>
//             <div>
//               <label className="text-sm text-slate-600">Per KM Rate (₹)</label>
//               <input 
//                 type="number" 
//                 value={perKm} 
//                 onChange={(e: ChangeEvent<HTMLInputElement>) => setPerKm(Number(e.target.value))} 
//                 className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-200 text-sm" 
//               />
//             </div>
//           </div>
//         </div>

//         {/* Driver Verification Settings */}
//         <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
//           <h3 className="text-lg font-semibold text-slate-800 mb-4">Driver Verification</h3>
//           <div className="space-y-4">
//             {/* Auto Approve Drivers Toggle */}
//             <div className="p-3 rounded-lg border border-slate-100">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <label className="text-sm font-semibold text-slate-700">Auto Approve Drivers</label>
//                   <p className="text-xs text-slate-500 mt-1">
//                     {autoApprove 
//                       ? "Drivers get approved automatically after registration" 
//                       : "Super admin manually reviews KYC before approval"}
//                   </p>
//                 </div>
//                 <button 
//                   onClick={() => setAutoApprove(!autoApprove)} 
//                   type="button" 
//                   className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${autoApprove ? 'bg-blue-600' : 'bg-slate-300'}`}
//                 >
//                   <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${autoApprove ? 'translate-x-5' : 'translate-x-0.5'}`} />
//                 </button>
//               </div>
//               {!autoApprove && (
//                 <div className="mt-2 flex items-center gap-1">
//                   <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">Recommended for security</span>
//                 </div>
//               )}
//             </div>

//             {/* KYC Mandatory Toggle */}
//             <div className="p-3 rounded-lg border border-slate-100">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <label className="text-sm font-semibold text-slate-700">KYC Mandatory</label>
//                   <p className="text-xs text-slate-500 mt-1">
//                     {kycMandatory 
//                       ? "Drivers must upload ID, License, RC & Insurance" 
//                       : "KYC is optional for drivers"}
//                   </p>
//                 </div>
//                 <button 
//                   onClick={() => setKycMandatory(!kycMandatory)} 
//                   type="button" 
//                   className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${kycMandatory ? 'bg-blue-600' : 'bg-slate-300'}`}
//                 >
//                   <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${kycMandatory ? 'translate-x-5' : 'translate-x-0.5'}`} />
//                 </button>
//               </div>
//               {kycMandatory && (
//                 <div className="mt-2 flex flex-wrap gap-1">
//                   <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">Aadhaar/ID</span>
//                   <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">Driving License</span>
//                   <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">Vehicle RC</span>
//                   <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">Insurance</span>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
//           <h3 className="text-lg font-semibold text-slate-800 mb-4">Notifications &amp; Safety</h3>
//           <div className="space-y-3">
//             {rows.map((row, i) => (
//               <label key={i} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:bg-slate-50 cursor-pointer">
//                 <span className="text-sm text-slate-700">{row.label}</span>
//                 <button 
//                   onClick={() => row.on(!row.v)} 
//                   type="button" 
//                   className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${row.v ? 'bg-blue-600' : 'bg-slate-300'}`}
//                 >
//                   <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${row.v ? 'translate-x-5' : 'translate-x-0.5'}`} />
//                 </button>
//               </label>
//             ))}
//           </div>
//         </div>

//         <div className="lg:col-span-2 flex justify-end gap-3">
//           <button 
//             onClick={() => {
//               // Reset to defaults
//               setName('Odisha Ride')
//               setFee(15)
//               setBase(50)
//               setPerKm(12)
//               setNotif(true)
//               setSos(true)
//               setAutoApprove(false)
//               setKycMandatory(true)
//             }} 
//             className="px-6 py-2.5 rounded-lg border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-50"
//           >
//             Reset to Defaults
//           </button>
//           <button 
//             onClick={handleSave} 
//             className="px-6 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700"
//           >
//             Save Changes
//           </button>
//         </div>
//       </div>
//     </AdminShell>
//   )
// }


// 'use client'
// import { useState, ChangeEvent, useEffect } from 'react'
// import AdminShell from '@/components/Super-admin/AdminShell'
// import { getSettings, updateAutoApprove } from '@/api/settings'

// export default function SettingsPage() {
//   const [name, setName] = useState('Odisha Ride')
//   const [fee, setFee] = useState(15)
//   const [base, setBase] = useState(50)
//   const [perKm, setPerKm] = useState(12)

//   const [notif, setNotif] = useState(true)
//   const [sos, setSos] = useState(true)

//   const [autoApprove, setAutoApprove] = useState(false)
//   const [kycMandatory, setKycMandatory] = useState(true)

//   // loading states
//   const [pageLoading, setPageLoading] = useState(false)
//   const [savingAutoApprove, setSavingAutoApprove] = useState(false)

//   const rows = [
//     { label: 'Email & Push notifications for new rides', v: notif, on: setNotif },
//     { label: 'SOS / emergency alerts dashboard', v: sos, on: setSos },
//   ]

//   // ✅ fetch settings
//   useEffect(() => {
//     const fetch = async () => {
//       try {
//         setPageLoading(true)
//         const data = await getSettings()

//         setName(data.platformName ?? 'Odisha Ride')
//         setFee(data.commission ?? 15)
//         setBase(data.baseFare ?? 50)
//         setPerKm(data.perKmRate ?? 12)
//         setNotif(data.notifications ?? true)
//         setSos(data.sosEnabled ?? true)
//         setAutoApprove(data.autoApproveDrivers ?? false)
//         setKycMandatory(data.kycMandatory ?? true)
//       } catch (err) {
//         console.error(err)
//       } finally {
//         setPageLoading(false)
//       }
//     }

//     fetch()
//   }, [])

//   // ✅ AUTO APPROVE TOGGLE (IMPORTANT PART)
//   const handleAutoApproveToggle = async () => {
//     const nextValue = !autoApprove

//     // optimistic UI
//     setAutoApprove(nextValue)
//     setSavingAutoApprove(true)

//     try {
//       await updateAutoApprove(nextValue)
//     } catch (err) {
//       console.error(err)

//       // rollback
//       setAutoApprove(!nextValue)
//       alert('Failed to update auto approve')
//     } finally {
//       setSavingAutoApprove(false)
//     }
//   }

//   const handleSave = async () => {
//     const payload = {
//       platformName: name,
//       commission: fee,
//       baseFare: base,
//       perKmRate: perKm,
//       notifications: notif,
//       sosEnabled: sos,
//       autoApproveDrivers: autoApprove,
//       kycMandatory
//     }

//     try {
//       setPageLoading(true)
//       console.log('Saving settings:', payload)
//       alert('Settings saved successfully!')
//     } catch (err) {
//       console.error(err)
//       alert('Failed to save')
//     } finally {
//       setPageLoading(false)
//     }
//   }

//   if (pageLoading) {
//     return (
//       <AdminShell title="Settings">
//         <div className="flex justify-center items-center h-64">
//           <div className="animate-spin h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full" />
//         </div>
//       </AdminShell>
//     )
//   }

//   return (
//     <AdminShell title="Settings">
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

//         {/* GENERAL */}
//         <div className="bg-white p-6 rounded-2xl border">
//           <h3 className="font-semibold mb-4">General</h3>

//           <input
//             value={name}
//             onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
//             className="w-full border p-2 rounded mb-3"
//             placeholder="Platform name"
//           />

//           <input
//             type="number"
//             value={fee}
//             onChange={(e: ChangeEvent<HTMLInputElement>) => setFee(Number(e.target.value))}
//             className="w-full border p-2 rounded"
//             placeholder="Commission"
//           />
//         </div>

//         {/* AUTO APPROVE */}
//         <div className="bg-white p-6 rounded-2xl border">
//           <h3 className="font-semibold mb-4">Driver Verification</h3>

//           <div className="flex items-center justify-between p-3 border rounded-lg">
//             <div>
//               <p className="font-medium">Auto Approve Drivers</p>
//               <p className="text-xs text-gray-500">
//                 {autoApprove
//                   ? 'Drivers auto approved'
//                   : 'Manual approval required'}
//               </p>
//             </div>

//             <button
//               onClick={handleAutoApproveToggle}
//               disabled={savingAutoApprove}
//               className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
//                 autoApprove ? 'bg-blue-600' : 'bg-gray-300'
//               } ${savingAutoApprove ? 'opacity-50' : ''}`}
//             >
//               <span
//                 className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${
//                   autoApprove ? 'translate-x-5' : 'translate-x-1'
//                 }`}
//               />
//             </button>
//           </div>

//           {savingAutoApprove && (
//             <p className="text-xs text-blue-600 mt-2">Updating...</p>
//           )}
//         </div>

//         {/* KYC (UI only) */}
//         <div className="bg-white p-6 rounded-2xl border">
//           <h3 className="font-semibold mb-4">KYC Settings</h3>

//           <button
//             onClick={() => setKycMandatory(!kycMandatory)}
//             className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
//               kycMandatory ? 'bg-blue-600' : 'bg-gray-300'
//             }`}
//           >
//             <span
//               className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${
//                 kycMandatory ? 'translate-x-5' : 'translate-x-1'
//               }`}
//             />
//           </button>
//         </div>

//         {/* SAVE */}
//         <div className="lg:col-span-2 flex justify-end gap-3">
//           <button
//             onClick={handleSave}
//             disabled={pageLoading}
//             className="px-6 py-2 bg-blue-600 text-white rounded-lg"
//           >
//             {pageLoading ? 'Saving...' : 'Save Changes'}
//           </button>
//         </div>

//       </div>
//     </AdminShell>
//   )
// }



'use client'

import { useState, ChangeEvent, useEffect } from 'react'
import AdminShell from '@/components/Common/AdminShell'
import { getSettings, updateAutoApprove } from '@/api/settings'

interface ToggleRow {
  label: string
  v: boolean
  on: (v: boolean) => void
  description?: string
}

export default function SettingsPage() {
  const [name, setName] = useState<string>('Odisha Ride')
  const [fee, setFee] = useState<number>(15)
  const [base, setBase] = useState<number>(50)
  const [perKm, setPerKm] = useState<number>(12)
  const [notif, setNotif] = useState<boolean>(true)
  const [sos, setSos] = useState<boolean>(true)
  
  // Driver verification settings
  const [autoApprove, setAutoApprove] = useState<boolean>(false)
  const [kycMandatory, setKycMandatory] = useState<boolean>(true)
  
  // Loading states
  const [loading, setLoading] = useState<boolean>(false)
  const [savingAutoApprove, setSavingAutoApprove] = useState<boolean>(false)

  const rows: ToggleRow[] = [
    { label: 'Email & Push notifications for new rides', v: notif, on: setNotif },
    { label: 'SOS / emergency alerts dashboard', v: sos, on: setSos },
  ]

  // Fetch settings on component mount
  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      const data = await getSettings()
      console.log('Fetched settings:', data) // Debug log
      
      // Update state with fetched settings
      if (data) {
        setAutoApprove(data.autoApproveDrivers ?? false)
        setKycMandatory(data.kycMandatory ?? true)
        
        // If your backend returns these fields, uncomment:
        // setName(data.platformName || 'Odisha Ride')
        // setFee(data.commission || 15)
        // setBase(data.baseFare || 50)
        // setPerKm(data.perKmRate || 12)
        // setNotif(data.notifications ?? true)
        // setSos(data.sosEnabled ?? true)
      }
    } catch (error: any) {
      console.error('Error fetching settings:', error)
      const errorMessage = error?.response?.data?.message || 'Failed to load settings'
      alert(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Handle Auto Approve toggle with API call
  const handleAutoApproveToggle = async () => {
    const newValue = !autoApprove
    
    // Optimistic update - UI updates immediately
    setAutoApprove(newValue)
    setSavingAutoApprove(true)
    
    try {
      // Call your existing API endpoint
      await updateAutoApprove(newValue)
      console.log('Auto approve setting updated successfully to:', newValue)
      
      // Optional: Show success feedback
      if (newValue) {
        console.log('Auto approve enabled. New drivers will be automatically approved.')
      } else {
        console.log('Auto approve disabled. New drivers will require manual review.')
      }
    } catch (error: any) {
      // Revert on error
      setAutoApprove(!newValue)
      console.error('Error updating auto approve:', error)
      
      const errorMessage = error?.response?.data?.message || 'Failed to update auto approve setting'
      alert(errorMessage)
    } finally {
      setSavingAutoApprove(false)
    }
  }

  const handleSave = async () => {
    // Prepare settings object
    const settings = {
      platformName: name,
      commission: fee,
      baseFare: base,
      perKmRate: perKm,
      notifications: notif,
      sosEnabled: sos,
      autoApproveDrivers: autoApprove,
      kycMandatory: kycMandatory
    }
    
    try {
      setLoading(true)
      // You'll need to create this endpoint in your backend
      // For now, just console.log and show alert
      console.log('Saving settings:', settings)
      alert('Settings saved successfully! (API integration pending)')
      
      // Uncomment once you create the update all settings endpoint
      // await updateAllSettings(settings)
    } catch (error: any) {
      console.error('Error saving settings:', error)
      const errorMessage = error?.response?.data?.message || 'Failed to save settings'
      alert(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    // Reset to defaults
    setName('Odisha Ride')
    setFee(15)
    setBase(50)
    setPerKm(12)
    setNotif(true)
    setSos(true)
    setAutoApprove(false)
    setKycMandatory(true)
    alert('Reset to default values')
  }

  if (loading && !autoApprove) {
    return (
      <AdminShell title="Settings">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-slate-600">Loading settings...</p>
          </div>
        </div>
      </AdminShell>
    )
  }

  return (
    <AdminShell title="Settings">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">General</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-slate-600">Platform Name</label>
              <input 
                value={name} 
                onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)} 
                className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              />
            </div>
            <div>
              <label className="text-sm text-slate-600">Platform Commission (%)</label>
              <input 
                type="number" 
                value={fee} 
                onChange={(e: ChangeEvent<HTMLInputElement>) => setFee(Number(e.target.value))} 
                className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Fare Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-slate-600">Base Fare (₹)</label>
              <input 
                type="number" 
                value={base} 
                onChange={(e: ChangeEvent<HTMLInputElement>) => setBase(Number(e.target.value))} 
                className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              />
            </div>
            <div>
              <label className="text-sm text-slate-600">Per KM Rate (₹)</label>
              <input 
                type="number" 
                value={perKm} 
                onChange={(e: ChangeEvent<HTMLInputElement>) => setPerKm(Number(e.target.value))} 
                className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              />
            </div>
          </div>
        </div>

        {/* Driver Verification Settings */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Driver Verification</h3>
          <div className="space-y-4">
            {/* Auto Approve Drivers Toggle */}
            <div className="p-3 rounded-lg border border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-semibold text-slate-700">Auto Approve Drivers</label>
                  <p className="text-xs text-slate-500 mt-1">
                    {autoApprove 
                      ? "Drivers get approved automatically after registration" 
                      : "Super admin manually reviews KYC before approval"}
                  </p>
                </div>
                <button 
                  onClick={handleAutoApproveToggle}
                  disabled={savingAutoApprove}
                  type="button" 
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${autoApprove ? 'bg-blue-600' : 'bg-slate-300'} ${savingAutoApprove ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {savingAutoApprove ? (
                    <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mx-auto"></div>
                  ) : (
                    <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${autoApprove ? 'translate-x-5' : 'translate-x-0.5'}`} />
                  )}
                </button>
              </div>
              {!autoApprove && (
                <div className="mt-2 flex items-center gap-1">
                  <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">Recommended for security</span>
                </div>
              )}
              {savingAutoApprove && (
                <div className="mt-2">
                  <span className="text-[10px] text-blue-600">Updating...</span>
                </div>
              )}
            </div>

            {/* KYC Mandatory Toggle */}
            <div className="p-3 rounded-lg border border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-semibold text-slate-700">KYC Mandatory</label>
                  <p className="text-xs text-slate-500 mt-1">
                    {kycMandatory 
                      ? "Drivers must upload ID, License, RC & Insurance" 
                      : "KYC is optional for drivers"}
                  </p>
                </div>
                <button 
                  onClick={() => setKycMandatory(!kycMandatory)} 
                  type="button" 
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${kycMandatory ? 'bg-blue-600' : 'bg-slate-300'}`}
                >
                  <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${kycMandatory ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </button>
              </div>
              {kycMandatory && (
                <div className="mt-2 flex flex-wrap gap-1">
                  <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">Aadhaar/ID</span>
                  <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">Driving License</span>
                  <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">Vehicle RC</span>
                  <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">Insurance</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Notifications &amp; Safety</h3>
          <div className="space-y-3">
            {rows.map((row, i) => (
              <label key={i} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:bg-slate-50 cursor-pointer transition">
                <span className="text-sm text-slate-700">{row.label}</span>
                <button 
                  onClick={() => row.on(!row.v)} 
                  type="button" 
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${row.v ? 'bg-blue-600' : 'bg-slate-300'}`}
                >
                  <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${row.v ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </button>
              </label>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 flex justify-end gap-3">
          <button 
            onClick={handleReset} 
            className="px-6 py-2.5 rounded-lg border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition"
          >
            Reset to Defaults
          </button>
          <button 
            onClick={handleSave} 
            disabled={loading}
            className="px-6 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </AdminShell>
  )
}