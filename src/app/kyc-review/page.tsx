'use client'
import { useRouter } from 'next/navigation'
import AdminShell from '@/components/Common/AdminShell'
import { MoreVertical, RotateCcw } from 'lucide-react'
import { useEffect, useState, useRef } from 'react'
import { getAllDrivers, getResubmittedDrivers } from '../../api/kyc'
import type { KYCStatus, KYCEntry } from '@/api/types/types'

// ── Helper 
const pill = (s: KYCStatus): string => {
  if (s === 'Approved') return 'bg-emerald-100 text-emerald-700'
  if (s === 'Rejected') return 'bg-red-100 text-red-700'
  return 'bg-amber-100 text-amber-700'
}

 export default function KYCPage() {
  const router = useRouter()
  const [drivers, setDrivers] = useState<KYCEntry[]>([])
  const [resubmittedCount, setResubmittedCount] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const menuRef = useRef<HTMLTableCellElement>(null)

  useEffect(() => {
    fetchDrivers()
    fetchResubmittedCount()
    window.addEventListener('focus', fetchResubmittedCount)
    return () => window.removeEventListener('focus', fetchResubmittedCount)
  }, [])

  const fetchResubmittedCount = async () => {
    try {
      const data = await getResubmittedDrivers()
      setResubmittedCount(data.total || 0)
    } catch (err) {
      console.error('Error fetching resubmitted count:', err)
    }
  }

  useEffect(() => {
  const handleClickOutside = (e: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
      setOpenMenu(null)
    }
  }
  document.addEventListener('mousedown', handleClickOutside)
  return () => document.removeEventListener('mousedown', handleClickOutside)
}, [])

  const fetchDrivers = async () => {
    try {
      setLoading(true)
      const response = await getAllDrivers()
      console.log('API Response:', response)
      setDrivers(transformDriverData(response.drivers || []))
      setError(null)
    } catch (err) {
      console.error('Error fetching drivers:', err)
      setError('Failed to load drivers. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const transformDriverData = (apiData: any[]): KYCEntry[] => {
    return apiData.map((driver: any) => ({
      id: driver._id,
      driverId: driver.driverId,
      driver: driver.fullName,
      email: driver.email,
      phone: driver.phone,
      submitted: new Date(driver.createdAt).toLocaleDateString(),
      docs: 'Aadhaar, DL',
      aadhaarNumber: driver.aadhaarNumber,
      vehicleNumber: driver.vehicleNumber,
      licenseNumber: driver.licenseNumber,
      profilePhoto: driver.profileImage || '',
      aadhaarDoc: driver.aadhaarImage || '',
      licenseDoc: driver.licenseImage || '',
      status:
        driver.status === 'approved' ? 'Approved'
          : driver.status === 'rejected' ? 'Rejected'
            : 'Pending',
    }))
  }

   
  const handleRowClick = (driverId: string) => {
    router.push(`/kyc-review/${driverId}`)
  }

  if (loading) {
    return (
      <AdminShell title="KYC Review">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto" />
              <p className="mt-4 text-slate-600">Loading drivers...</p>
            </div>
          </div>
        </div>
      </AdminShell>
    )
  }

   if (error) {
    return (
      <AdminShell title="KYC Review">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
          <div className="text-center text-red-600">
            <p>{error}</p>
            <button
              onClick={fetchDrivers}
              className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
            >
              Retry
            </button>
          </div>
        </div>
      </AdminShell>
    )
  }

  
   return (
    <AdminShell title="KYC Review">
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 overflow-x-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-slate-800">Driver KYC Applications</h3>
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/drivers/resubmitted')}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold hover:bg-amber-100 transition-colors shadow-2xs"
            >
              <RotateCcw className="h-3.5 w-3.5 text-amber-600" />
              Resubmitted
              <span className="inline-flex items-center justify-center px-2 py-0.5 text-[11px] font-bold bg-amber-500 text-white rounded-full">
                {resubmittedCount}
              </span>
            </button>
            <span className="text-sm text-slate-500">
              {drivers.filter(k => k.status === 'Pending').length} pending
            </span>
          </div>
        </div>

        {drivers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-500">No driver applications found</p>
          </div>
        ) : (
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 text-xs">
              <tr>
                <th className="text-left font-medium px-3 py-3">Driver ID</th>
                <th className="text-left font-medium px-3 py-3">Driver Name</th>
                <th className="text-left font-medium px-3 py-3">Email</th>
                <th className="text-left font-medium px-3 py-3">Phone</th>
                <th className="text-left font-medium px-3 py-3">Submitted</th>
                <th className="text-left font-medium px-3 py-3">Status</th>
                <th className="text-left font-medium px-3 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {drivers.map((k: KYCEntry) => (
                <tr
                  key={k.id}
                  onClick={() => handleRowClick(k.driverId)}
                  className="hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  <td className="px-3 py-3 font-medium text-blue-600">{k.driverId}</td>
                  <td className="px-3 py-3 font-medium">{k.driver}</td>
                  <td className="px-3 py-3 text-slate-600">{k.email}</td>
                  <td className="px-3 py-3 text-slate-600">{k.phone}</td>
                  <td className="px-3 py-3 text-slate-500">{k.submitted}</td>
                  <td className="px-3 py-3">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${pill(k.status)}`}>
                      {k.status}
                    </span>
                  </td>
                  <td className="px-3 py-3 relative" ref={openMenu === k.driverId ? menuRef : null} onClick={e => e.stopPropagation()}>
                    <button
                      onClick={() => setOpenMenu(openMenu === k.driverId ? null : k.driverId)}
                      className="p-1.5 rounded-md hover:bg-slate-100"
                    >
                      <MoreVertical className="h-4 w-4 text-slate-500" />
                    </button>

                    {openMenu === k.driverId && (
                      <div className="absolute right-3 top-10 z-10 bg-white border border-slate-100 rounded-lg shadow-md py-1 w-40">
                        <button
                          onClick={() => { setOpenMenu(null); router.push(`/kyc-review/${k.driverId}`) }}
                          className="w-full text-left px-3 py-2 text-xs text-blue-600 hover:bg-blue-50"
                        >
                          View driver detail
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminShell>
  )
}