'use client'
import { useRouter, useParams } from 'next/navigation'
import AdminShell from '@/components/Common/AdminShell'
import { ArrowLeft, Check, X, Download, User, FileText, Eye, Ban, Unlock, AlertTriangle } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { getDriverById, approveDriver, rejectDriver, blockDriver, unblockDriver } from '../../../api/kyc'
import type { DocStatus, KYCStatus,  KYCDriverStatus, Document, DriverKYC } from '@/api/types/types'

// ── Helper: safely format a date string ──────────────────────────────────────
function formatDate(raw: string | null | undefined): string {
  if (!raw) return 'N/A'
  const d = new Date(raw)
  if (isNaN(d.getTime())) return 'N/A'
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

// ── Sub-components ────────────────────────────────────────────────────────────
const StatusBadge = ({ status }: { status: KYCStatus }) => {
  const styles: Record<KYCStatus, string> = {
    Pending:  'bg-amber-100 text-amber-700',
    Approved: 'bg-emerald-100 text-emerald-700',
    Rejected: 'bg-red-100 text-red-700',
  }
  return (
    <span className={`inline-block px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
      {status}
    </span>
  )
}

const DriverStatusBadge = ({ status }: { status?: KYCDriverStatus }) => {
  if (!status || status === 'active') {
    return (
      <span className="inline-block px-2 sm:px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
        Active
      </span>
    )
  }
  if (status === 'blocked') {
    return (
      <span className="inline-block px-2 sm:px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
        Blocked
      </span>
    )
  }
  return null
}

const DocBadge = ({ status }: { status: DocStatus }) => {
  if (status === 'uploaded') return <span className="text-xs text-emerald-600 font-medium">✓ Uploaded</span>
  if (status === 'missing')  return <span className="text-xs text-amber-600 font-medium">⚠ Missing</span>
  return <span className="text-xs text-red-600 font-medium">✕ Rejected</span>
}

const docBg = (s: DocStatus) => {
  if (s === 'uploaded') return 'bg-emerald-50 border-emerald-100'
  if (s === 'missing')  return 'bg-amber-50 border-amber-100'
  return 'bg-red-50 border-red-100'
}

// ── Block Confirm Modal ───────────────────────────────────────────────────────
const BlockConfirmModal = ({
  driverName,
  blockReason,
  onConfirm,
  onCancel,
  loading,
}: {
  driverName: string
  blockReason: string
  onConfirm: () => void
  onCancel: () => void
  loading: boolean
}) => (
  <div
    className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
    onClick={onCancel}
  >
    <div
      className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl"
      onClick={e => e.stopPropagation()}
    >
      {/* Icon */}
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-orange-100 mx-auto mb-4">
        <AlertTriangle className="h-6 w-6 text-orange-600" />
      </div>

      {/* Title */}
      <h3 className="text-base font-semibold text-slate-800 text-center mb-1">
        Block this driver?
      </h3>
      <p className="text-sm text-slate-500 text-center mb-4">
        <span className="font-medium text-slate-700">{driverName}</span> will lose access to the platform immediately.
      </p>

      {/* Reason preview */}
      <div className="bg-orange-50 border border-orange-100 rounded-xl p-3 mb-5">
        <p className="text-xs text-orange-600 font-medium mb-1">Reason</p>
        <p className="text-sm text-slate-700 break-words">{blockReason}</p>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          disabled={loading}
          className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-600 font-medium hover:bg-slate-50 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={loading}
          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-orange-600 text-white text-sm font-medium hover:bg-orange-700 disabled:opacity-50"
        >
          {loading
            ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
            : <Ban className="h-4 w-4" />}
          Yes, block
        </button>
      </div>
    </div>
  </div>
)

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function KYCDetailPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [driver, setDriver]                   = useState<DriverKYC | null>(null)
  const [loading, setLoading]                 = useState(true)
  const [error, setError]                     = useState<string | null>(null)
  const [rejectReason, setRejectReason]       = useState('')
  const [showRejectBox, setShowRejectBox]     = useState(false)
  const [showBlockBox, setShowBlockBox]       = useState(false)
  const [blockReason, setBlockReason]         = useState('')
  const [showBlockConfirm, setShowBlockConfirm] = useState(false)
  const [previewDoc, setPreviewDoc]           = useState<Document | null>(null)
  const [status, setStatus]                   = useState<KYCStatus>('Pending')
  const [driverStatus, setDriverStatus]       = useState<KYCDriverStatus>('active')
  const [actionLoading, setActionLoading]     = useState(false)

  const rejectBoxRef = useRef<HTMLDivElement>(null)
  const blockBoxRef  = useRef<HTMLDivElement>(null)

  useEffect(() => { fetchDriverDetails() }, [id])

  useEffect(() => {
    if (showRejectBox && rejectBoxRef.current) {
      rejectBoxRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [showRejectBox])

  useEffect(() => {
    if (showBlockBox && blockBoxRef.current) {
      blockBoxRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [showBlockBox])

  const fetchDriverDetails = async () => {
    try {
      setLoading(true)
      const response   = await getDriverById(id)
      const driverData = transformDriverData(response.driver || response)
      setDriver(driverData)
      setStatus(driverData.status)
      setDriverStatus(driverData.driverStatus || 'active')
      setError(null)
    } catch (err) {
      console.error('Error fetching driver details:', err)
      setError('Failed to load driver details. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const transformDriverData = (apiData: any): DriverKYC => {
    const registrationDate = formatDate(apiData.createdAt)
    const documents: Document[] = []

    if (apiData.profileImage) {
      documents.push({
        key:        'profile_photo',
        label:      'Profile photo',
        filename:   apiData.profileImage.split('/').pop() || 'profile.jpg',
        status:     'uploaded',
        uploadedAt: formatDate(apiData.profileImageUploadedAt ?? apiData.createdAt),
        imageUrl:   apiData.profileImage,
      })
    }

    if (apiData.aadhaarImage) {
      documents.push({
        key:        'aadhaar',
        label:      'Aadhaar card',
        filename:   apiData.aadhaarImage.split('/').pop() || 'aadhaar.jpg',
        status:     'uploaded',
        uploadedAt: formatDate(apiData.aadhaarImageUploadedAt ?? apiData.createdAt),
        imageUrl:   apiData.aadhaarImage,
      })
    }

    if (apiData.licenseImage) {
      documents.push({
        key:        'driving_licence',
        label:      'Driving licence',
        filename:   apiData.licenseImage.split('/').pop() || 'license.jpg',
        status:     'uploaded',
        uploadedAt: formatDate(apiData.licenseImageUploadedAt ?? apiData.createdAt),
        imageUrl:   apiData.licenseImage,
      })
    }

    if (apiData.rcImage) {
      documents.push({
        key:        'rc_document',
        label:      'RC document',
        filename:   apiData.rcImage.split('/').pop() || 'rc.jpg',
        status:     'uploaded',
        uploadedAt: formatDate(apiData.rcImageUploadedAt ?? apiData.createdAt),
        imageUrl:   apiData.rcImage,
      })
    }

    return {
      id:            apiData._id,
      name:          apiData.fullName,
      phone:         apiData.phone,
      email:         apiData.email,
      city:          apiData.city          || 'Not specified',
      vehicleType:   apiData.vehicleType   || 'Not specified',
      vehicleNumber: apiData.vehicleNumber,
      aadhaarNumber: apiData.aadhaarNumber,
      licenseNumber: apiData.licenseNumber,
      rcNumber:      apiData.rcNumber      || 'Not specified',
      submittedAt:   registrationDate,
      status:
        apiData.status === 'approved' ? 'Approved'
        : apiData.status === 'rejected' ? 'Rejected'
        : 'Pending',
      driverStatus: apiData.isBlocked ? 'blocked' : 'active',
      documents,
    }
  }

  // ── Action handlers ───────────────────────────────────────────────────────
  const handleApprove = async () => {
    setActionLoading(true)
    try {
      await approveDriver(id, { note: 'Approved by admin' })
      setStatus('Approved')
      await fetchDriverDetails()
    } catch {
      alert('Failed to approve driver. Please try again.')
    } finally {
      setActionLoading(false)
    }
  }

  const handleReject = async () => {
    if (!rejectReason.trim()) { alert('Please provide a rejection reason'); return }
    setActionLoading(true)
    try {
      await rejectDriver(id, { reason: rejectReason })
      setStatus('Rejected')
      setShowRejectBox(false)
      setRejectReason('')
      await fetchDriverDetails()
    } catch {
      alert('Failed to reject driver. Please try again.')
    } finally {
      setActionLoading(false)
    }
  }

  // Opens the confirm modal (only if reason is filled)
  const handleBlockSubmit = () => {
    if (!blockReason.trim()) { alert('Please provide a reason for blocking'); return }
    setShowBlockConfirm(true)
  }

  // Actually calls the API after confirmation
  const handleBlockConfirmed = async () => {
    setActionLoading(true)
    try {
      await blockDriver(id, { reason: blockReason })
      setDriverStatus('blocked')
      setShowBlockConfirm(false)
      setShowBlockBox(false)
      setBlockReason('')
      await fetchDriverDetails()
    } catch {
      alert('Failed to block driver. Please try again.')
    } finally {
      setActionLoading(false)
    }
  }

  const handleUnblock = async () => {
    setActionLoading(true)
    try {
      await unblockDriver(id)
      setDriverStatus('active')
      await fetchDriverDetails()
    } catch {
      alert('Failed to unblock driver. Please try again.')
    } finally {
      setActionLoading(false)
    }
  }

  const handleDownload = (doc: Document) => {
    if (doc.imageUrl) window.open(doc.imageUrl, '_blank')
  }

  // ── Loading / error states ────────────────────────────────────────────────
  if (loading) {
    return (
      <AdminShell title="KYC Review">
        <div className="flex justify-center items-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto" />
            <p className="mt-4 text-slate-600">Loading driver details...</p>
          </div>
        </div>
      </AdminShell>
    )
  }

  if (error || !driver) {
    return (
      <AdminShell title="KYC Review">
        <div className="bg-white rounded-2xl p-4 sm:p-8 shadow-sm border border-slate-100">
          <div className="text-center text-red-600">
            <p>{error || 'Driver not found'}</p>
            <button
              onClick={() => router.back()}
              className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
            >
              Go Back
            </button>
          </div>
        </div>
      </AdminShell>
    )
  }

  const isApproved = status === 'Approved'
  const isBlocked  = driverStatus === 'blocked'

  return (
    <AdminShell title="KYC Review">
      {/* ── Top bar ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back to KYC list</span>
            <span className="sm:hidden">Back</span>
          </button>
          <span className="text-slate-300">/</span>
          <span className="text-sm text-slate-500 truncate max-w-[150px] sm:max-w-none">{id}</span>
          <StatusBadge status={status} />
          {isApproved && <DriverStatusBadge status={driverStatus} />}
        </div>

        <div className="flex gap-3 w-full sm:w-auto">
          {status === 'Pending' && (
            <>
              <button
                onClick={() => setShowRejectBox(!showRejectBox)}
                disabled={actionLoading}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-red-200 bg-red-50 text-red-700 text-sm font-medium hover:bg-red-100 disabled:opacity-50"
              >
                <X className="h-4 w-4" /> Reject
              </button>
              <button
                onClick={handleApprove}
                disabled={actionLoading}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 disabled:opacity-50"
              >
                {actionLoading
                  ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  : <Check className="h-4 w-4" />}
                Approve
              </button>
            </>
          )}

          {isApproved && (
            !isBlocked ? (
              <button
                onClick={() => { setShowBlockBox(true); setShowRejectBox(false) }}
                disabled={actionLoading}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-orange-200 bg-orange-50 text-orange-700 text-sm font-medium hover:bg-orange-100 disabled:opacity-50"
              >
                <Ban className="h-4 w-4" /> Block
              </button>
            ) : (
              <button
                onClick={handleUnblock}
                disabled={actionLoading}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-green-200 bg-green-50 text-green-700 text-sm font-medium hover:bg-green-100 disabled:opacity-50"
              >
                {actionLoading
                  ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600" />
                  : <Unlock className="h-4 w-4" />}
                Unblock
              </button>
            )
          )}
        </div>
      </div>

      {/* ── Two-column grid ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        {/* Personal details */}
        <div className="bg-white rounded-2xl border border-slate-100 p-4 sm:p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <User className="h-4 w-4 text-slate-400" /> Personal details
          </h3>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold text-sm sm:text-base flex-shrink-0">
              {driver.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <p className="font-semibold text-slate-800 text-sm sm:text-base">{driver.name}</p>
              <p className="text-xs text-slate-500">Applied {driver.submittedAt}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            {[
              { label: 'Phone',          value: driver.phone         },
              { label: 'Email',          value: driver.email         },
              { label: 'City',           value: driver.city          },
              { label: 'Vehicle type',   value: driver.vehicleType   },
              { label: 'Vehicle number', value: driver.vehicleNumber },
              { label: 'Aadhaar number', value: driver.aadhaarNumber },
              { label: 'License number', value: driver.licenseNumber },
              { label: 'RC number',      value: driver.rcNumber      },
            ].map(item => (
              <div key={item.label}>
                <p className="text-xs text-slate-400">{item.label}</p>
                <p className="text-slate-700 font-medium mt-0.5 break-words">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Document checklist */}
        <div className="bg-white rounded-2xl border border-slate-100 p-4 sm:p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <FileText className="h-4 w-4 text-slate-400" /> Document checklist
          </h3>
          <div className="flex flex-col gap-3">
            {driver.documents.map(doc => (
              <div
                key={doc.key}
                className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-3 rounded-xl border ${docBg(doc.status)}`}
              >
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-slate-400 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-slate-700">{doc.label}</p>
                    <p className="text-xs text-slate-400">
                      {doc.status === 'uploaded' ? `Uploaded ${doc.uploadedAt}` : 'Not uploaded yet'}
                    </p>
                  </div>
                </div>
                <DocBadge status={doc.status} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Document images grid ─────────────────────────────────────────────── */}
      {driver.documents.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 p-4 sm:p-5 shadow-sm mb-5">
          <h3 className="text-sm font-semibold text-slate-800 mb-4">
            Uploaded documents
            <span className="text-xs text-slate-400 font-normal ml-2">Click to view full size</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {driver.documents.map(doc => (
              <div key={doc.key} className="border border-slate-100 rounded-xl overflow-hidden">
                <div
                  className="h-48 sm:h-36 bg-slate-50 flex items-center justify-center flex-col gap-2 cursor-pointer hover:bg-slate-100 transition-colors"
                  onClick={() => setPreviewDoc(doc)}
                >
                  {doc.imageUrl ? (
                    <div className="relative w-full h-full">
                      <Image src={doc.imageUrl} alt={doc.label} fill className="object-cover" />
                    </div>
                  ) : (
                    <>
                      <FileText className="h-8 w-8 text-slate-300" />
                      <span className="text-xs text-slate-400">{doc.label}</span>
                    </>
                  )}
                </div>
                <div className="p-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 bg-white">
                  <span className="text-xs text-slate-500 truncate max-w-full sm:max-w-[100px]">
                    {doc.label}
                  </span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setPreviewDoc(doc)}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs text-slate-600 hover:bg-slate-100"
                    >
                      <Eye className="h-3 w-3" /> View
                    </button>
                    <button
                      onClick={() => handleDownload(doc)}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs text-slate-600 hover:bg-slate-100"
                    >
                      <Download className="h-3 w-3" /> Save
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Reject reason box ────────────────────────────────────────────────── */}
      {showRejectBox && (
        <div ref={rejectBoxRef} className="bg-white rounded-2xl border border-red-100 p-4 sm:p-5 shadow-sm mb-5">
          <h3 className="text-sm font-semibold text-red-700 mb-3">
            Rejection reason <span className="text-xs font-normal text-slate-400">(required)</span>
          </h3>
          <textarea
            value={rejectReason}
            onChange={e => setRejectReason(e.target.value)}
            placeholder="e.g. Aadhaar image is blurry, please re-upload a clear photo..."
            rows={3}
            autoFocus
            className="w-full text-sm border border-slate-200 rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-300"
          />
          <div className="flex flex-col sm:flex-row gap-3 mt-3">
            <button
              onClick={handleReject}
              disabled={!rejectReason.trim() || actionLoading}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {actionLoading
                ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                : <X className="h-4 w-4" />}
              Confirm rejection
            </button>
            <button
              onClick={() => { setShowRejectBox(false); setRejectReason('') }}
              className="px-4 py-2 rounded-lg border border-slate-200 text-sm text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ── Block reason box ─────────────────────────────────────────────────── */}
      {showBlockBox && (
        <div ref={blockBoxRef} className="bg-white rounded-2xl border border-orange-100 p-4 sm:p-5 shadow-sm mb-5">
          <h3 className="text-sm font-semibold text-orange-700 mb-3">
            Block reason <span className="text-xs font-normal text-slate-400">(required)</span>
          </h3>
          <textarea
            value={blockReason}
            onChange={e => setBlockReason(e.target.value)}
            placeholder="e.g. Violation of terms and conditions, fraudulent activity, etc..."
            rows={3}
            autoFocus
            className="w-full text-sm border border-slate-200 rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300"
          />
          <div className="flex flex-col sm:flex-row gap-3 mt-3">
            <button
              onClick={handleBlockSubmit}
              disabled={!blockReason.trim() || actionLoading}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-orange-600 text-white text-sm font-medium hover:bg-orange-700 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Ban className="h-4 w-4" />
              Block driver
            </button>
            <button
              onClick={() => { setShowBlockBox(false); setBlockReason('') }}
              className="px-4 py-2 rounded-lg border border-slate-200 text-sm text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ── Block confirmation modal ─────────────────────────────────────────── */}
      {showBlockConfirm && (
        <BlockConfirmModal
          driverName={driver.name}
          blockReason={blockReason}
          onConfirm={handleBlockConfirmed}
          onCancel={() => setShowBlockConfirm(false)}
          loading={actionLoading}
        />
      )}

      {/* ── Document preview modal ───────────────────────────────────────────── */}
      {previewDoc && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 sm:p-6"
          onClick={() => setPreviewDoc(null)}
        >
          <div
            className="bg-white rounded-2xl p-4 sm:p-5 max-w-[95%] sm:max-w-lg w-full max-h-[90vh] shadow-xl overflow-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-800 text-sm sm:text-base">{previewDoc.label}</h3>
              <button
                onClick={() => setPreviewDoc(null)}
                className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-slate-400 hover:text-slate-600" />
              </button>
            </div>
            <div className="bg-slate-100 rounded-xl h-64 sm:h-72 flex items-center justify-center relative">
              {previewDoc.imageUrl ? (
                <div className="relative w-full h-full">
                  <Image
                    src={previewDoc.imageUrl}
                    alt={previewDoc.label}
                    fill
                    className="object-contain rounded-xl"
                  />
                </div>
              ) : (
                <div className="text-center p-4">
                  <FileText className="h-12 w-12 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm text-slate-400">No preview available</p>
                  <p className="text-xs text-slate-300 mt-1 break-words">{previewDoc.filename}</p>
                </div>
              )}
            </div>
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => handleDownload(previewDoc)}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-slate-100 text-slate-700 text-sm hover:bg-slate-200"
              >
                <Download className="h-4 w-4" /> Download
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @media (max-width: 640px) {
          input, select, textarea, button { font-size: 16px !important; }
        }
      `}</style>
    </AdminShell>
  )
}