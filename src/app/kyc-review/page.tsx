'use client'
import { useRouter } from 'next/navigation'
import AdminShell from '@/components/Common/AdminShell'
import { Check, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { getAllDrivers, approveDriver, rejectDriver } from '../../api/kyc' 

// Types
type KYCStatus = 'Pending' | 'Approved' | 'Rejected'

interface KYCEntry {
  id: string
  driverId: string
  driver: string
  email: string
  phone: string
  submitted: string
  docs: string
  aadhaarNumber: string
  vehicleNumber: string
  licenseNumber: string
  profilePhoto: string
  aadhaarDoc: string
  licenseDoc: string
  status: KYCStatus
}

const pill = (s: KYCStatus): string => {
  if (s === 'Approved') return 'bg-emerald-100 text-emerald-700'
  if (s === 'Rejected') return 'bg-red-100 text-red-700'
  return 'bg-amber-100 text-amber-700'
}

export default function KYCPage() {
  const router = useRouter()
  const [drivers, setDrivers] = useState<KYCEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  // Fetch drivers on component mount
  useEffect(() => {
    fetchDrivers()
  }, [])

  const fetchDrivers = async () => {
  try {
    setLoading(true)

    const response = await getAllDrivers()

    console.log("API Response:", response)

    const formattedDrivers = transformDriverData(
      response.drivers || []
    )

    setDrivers(formattedDrivers)
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
      driver.status === 'approved'
        ? 'Approved'
        : driver.status === 'rejected'
        ? 'Rejected'
        : 'Pending'
  }))
}

  const handleApprove = async (e: React.MouseEvent, driverId: string) => {
    e.stopPropagation()
    setActionLoading(driverId)
    
    try {
      // Get admin info from localStorage or context
      const adminData = JSON.parse(localStorage.getItem('admin') || '{}')
     await approveDriver(driverId, { note: 'Approved by admin' })
      
      // Update local state
      setDrivers(prev => prev.map(driver => 
        driver.driverId === driverId 
          ? { ...driver, status: 'Approved' }
          : driver
      ))
      
      // Optional: Show success toast/notification
      console.log('Driver approved successfully')
    } catch (error) {
      console.error('Error approving driver:', error)
      // Show error notification
    } finally {
      setActionLoading(null)
    }
  }

  const handleReject = async (e: React.MouseEvent, driverId: string) => {
    e.stopPropagation()
    
    // You might want to show a modal for rejection reason
    const reason = prompt('Please enter rejection reason:')
    if (!reason) return
    
    setActionLoading(driverId)
    
    try {
      await rejectDriver(driverId, { reason })
      
      // Update local state
      setDrivers(prev => prev.map(driver => 
        driver.driverId === driverId 
          ? { ...driver, status: 'Rejected' }
          : driver
      ))
      
      console.log('Driver rejected successfully')
    } catch (error) {
      console.error('Error rejecting driver:', error)
    } finally {
      setActionLoading(null)
    }
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
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
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
          <span className="text-sm text-slate-500">
            {drivers.filter(k => k.status === 'Pending').length} pending
          </span>
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
                  <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
                    {k.status === 'Pending' ? (
                      <div className="flex gap-2">
                        <button 
                          onClick={(e) => handleApprove(e, k.driverId)}
                          disabled={actionLoading === k.driverId}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-md bg-emerald-600 text-white text-xs font-medium hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {actionLoading === k.driverId ? (
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                          ) : (
                            <Check className="h-3.5 w-3.5" />
                          )}
                          Approve
                        </button>
                        <button 
                          onClick={(e) => handleReject(e, k.driverId)}
                          disabled={actionLoading === k.driverId}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-md bg-red-600 text-white text-xs font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <X className="h-3.5 w-3.5" /> Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400">—</span>
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