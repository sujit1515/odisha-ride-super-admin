'use client';

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import AdminShell from '@/components/Common/AdminShell'
import { RefreshCw, AlertTriangle } from 'lucide-react'
import { DriverHeader } from '../components/DriverHeader'
import { DriverProfileCard } from '../components/DriverProfileCard'
import { DriverVehicleCard } from '../components/DriverVehicleCard'
import { DriverOverview } from '../components/DriverOverview'
import { DriverRideHistory } from '../components/DriverRideHistory'
import { DriverDocuments } from '../components/DriverDocuments'
import { DriverBanking } from '../components/DriverBanking'
import { BlockModal } from '../components/BlockModal'
import { RejectModal } from '../components/RejectModal'
import { getDriverProfile } from '@/api/driver';
import { blockDriver, unblockDriver, approveDriver, rejectDriver } from '@/api/kyc'
import { Driver, RecentRide, Document, ToastState } from './types'

export default function DriverDetailPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()

  const [driver,          setDriver         ] = useState<Driver | null>(null)
  const [recentRides,     setRecentRides    ] = useState<RecentRide[]>([])
  const [documents,       setDocuments      ] = useState<Document[]>([])
  const [isLoading,       setIsLoading      ] = useState(true)
  const [showBlockModal,  setShowBlockModal ] = useState(false)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [blockReason,     setBlockReason    ] = useState('')
  const [rejectReason,    setRejectReason   ] = useState('')
  const [flaggedDocuments, setFlaggedDocuments] = useState<string[]>([])
  const [activeTab,       setActiveTab      ] = useState<'overview' | 'rides' | 'documents' | 'banking'>('overview')
  const [toast,           setToast          ] = useState<ToastState | null>(null)

  // ── Toast ────────────────────────────────────────────────
  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  // ── Fetch driver profile ─────────────────────────────────
  useEffect(() => {
    const fetchDriver = async () => {
      setIsLoading(true)
      try {
        const data = await getDriverProfile(params.id)
        setDriver(data.driver)
        setRecentRides(data.recentRides ?? [])
        setDocuments(data.documents ?? [])
      } catch (err: any) {
        showToast(
          err?.response?.data?.message ?? 'Failed to load driver profile',
          'error'
        )
      } finally {
        setIsLoading(false)
      }
    }
    fetchDriver()
  }, [params.id])

  // ── Approve ──────────────────────────────────────────────
  const handleApprove = async () => {
    if (!driver) return
    setIsLoading(true)
    try {
      await approveDriver(driver.driverId, {})
      setDriver(prev => prev
        ? { ...prev, status: 'active', isApproved: true }
        : prev
      )
      showToast('Driver approved successfully!', 'success')
    } catch (err: any) {
      showToast(
        err?.response?.data?.message ?? 'Failed to approve driver',
        'error'
      )
    } finally {
      setIsLoading(false)
    }
  }

  // ── Reject ───────────────────────────────────────────────
  const handleReject = async () => {
    if (!driver) return
    if (flaggedDocuments.length === 0) {
      showToast('Please select at least one document that needs re-upload', 'error')
      return
    }
    if (!rejectReason.trim()) {
      showToast('Please provide a rejection reason', 'error')
      return
    }
    setIsLoading(true)
    try {
      await rejectDriver(driver.driverId, { reason: rejectReason, flaggedDocuments })
      setDriver(prev => prev
        ? { ...prev, status: 'rejected', isApproved: false, rejectionReason: rejectReason }
        : prev
      )
      setShowRejectModal(false)
      setRejectReason('')
      setFlaggedDocuments([])
      showToast('Driver rejected successfully!', 'success')
    } catch (err: any) {
      showToast(
        err?.response?.data?.message ?? 'Failed to reject driver',
        'error'
      )
    } finally {
      setIsLoading(false)
    }
  }

  // ── Block ────────────────────────────────────────────────
  const handleBlock = async () => {
    if (!driver) return
    if (!blockReason.trim()) {
      showToast('Please provide a block reason', 'error')
      return
    }
    setIsLoading(true)
    try {
      await blockDriver(driver.driverId, { reason: blockReason })
      setDriver(prev => prev
        ? { ...prev, status: 'blocked', isBlocked: true, blockReason }
        : prev
      )
      setShowBlockModal(false)
      setBlockReason('')
      showToast('Driver blocked successfully!', 'success')
    } catch (err: any) {
      showToast(
        err?.response?.data?.message ?? 'Failed to block driver',
        'error'
      )
    } finally {
      setIsLoading(false)
    }
  }

  // ── Unblock ──────────────────────────────────────────────
  const handleUnblock = async () => {
    if (!driver) return
    setIsLoading(true)
    try {
      await unblockDriver(driver.driverId)
      setDriver(prev => prev
        ? { ...prev, status: 'active', isBlocked: false, blockReason: undefined }
        : prev
      )
      showToast('Driver unblocked successfully!', 'success')
    } catch (err: any) {
      showToast(
        err?.response?.data?.message ?? 'Failed to unblock driver',
        'error'
      )
    } finally {
      setIsLoading(false)
    }
  }

  // ── Loading state ────────────────────────────────────────
  if (isLoading) {
    return (
      <AdminShell title="Driver Detail">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 text-blue-500 animate-spin mx-auto mb-4" />
            <p className="text-slate-500">Loading driver details...</p>
          </div>
        </div>
      </AdminShell>
    )
  }

  // ── Not found state ──────────────────────────────────────
  if (!driver) {
    return (
      <AdminShell title="Driver Detail">
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="h-10 w-10 text-red-500" />
          </div>
          <h2 className="text-xl font-semibold text-slate-800 mb-2">Driver not found</h2>
          <p className="text-slate-500 mb-6">
            The driver you are looking for does not exist or has been removed.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => router.push('/drivers')}
              className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              View All Drivers
            </button>
            <button
              onClick={() => router.back()}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </AdminShell>
    )
  }

  // ── Main render ──────────────────────────────────────────
  return (
    <AdminShell title="Driver Management">

      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg
                         text-sm font-medium ${
          toast.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {toast.message}
        </div>
      )}

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white pb-8">

        <DriverHeader
          driver={driver}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onApprove={handleApprove}
          onReject={() => setShowRejectModal(true)}
          onBlock={() => setShowBlockModal(true)}
          onUnblock={handleUnblock}
          isLoading={isLoading}
          onBack={() => router.back()}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left Column */}
          <div className="space-y-5">
            <DriverProfileCard driver={driver} />
            <DriverVehicleCard driver={driver} />

            {/* Block / Rejection reason card */}
            {(driver.isBlocked || driver.status === 'rejected') && (
              <div className={`rounded-2xl p-4 border ${
                driver.isBlocked
                  ? 'bg-red-50 border-red-200'
                  : 'bg-rose-50 border-rose-200'
              }`}>
                <div className="flex items-start gap-2">
                  <AlertTriangle className={`h-4 w-4 mt-0.5 ${
                    driver.isBlocked ? 'text-red-500' : 'text-rose-500'
                  }`} />
                  <div>
                    <p className={`text-xs font-semibold mb-1 ${
                      driver.isBlocked ? 'text-red-700' : 'text-rose-700'
                    }`}>
                      {driver.isBlocked ? 'Block Reason' : 'Rejection Reason'}
                    </p>
                    <p className="text-sm text-slate-700">
                      {driver.isBlocked ? driver.blockReason : driver.rejectionReason}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2">
            {activeTab === 'overview'  && <DriverOverview driver={driver} />}
            {activeTab === 'rides'     && <DriverRideHistory rides={recentRides} />}
            {activeTab === 'documents' && <DriverDocuments documents={documents} />}
            {activeTab === 'banking'   && <DriverBanking driver={driver} />}
          </div>
        </div>

        {/* Modals */}
        <BlockModal
          isOpen={showBlockModal}
          driverName={driver.fullName}
          reason={blockReason}
          onReasonChange={setBlockReason}
          onConfirm={handleBlock}
          onClose={() => { setShowBlockModal(false); setBlockReason('') }}
          isLoading={isLoading}
        />

        <RejectModal
          isOpen={showRejectModal}
          driverName={driver.fullName}
          reason={rejectReason}
          onReasonChange={setRejectReason}
          flaggedDocuments={flaggedDocuments}
          onFlaggedDocumentsChange={setFlaggedDocuments}
          onConfirm={handleReject}
          onClose={() => { setShowRejectModal(false); setRejectReason(''); setFlaggedDocuments([]) }}
          isLoading={isLoading}
        />
      </div>
    </AdminShell>
  )
}