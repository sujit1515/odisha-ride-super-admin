'use client'

import { useState, useEffect } from 'react'
import AdminShell from '@/components/Common/AdminShell'
import { getResubmittedDrivers, approveDriver, rejectDriver } from '@/app/drivers/api/kyc'
import { RejectModal } from '../components/RejectModal'
import { Check, X, Eye, Phone, Mail, Car, RotateCcw, Sparkles } from 'lucide-react'

export default function ResubmittedDriversPage() {
  const [drivers, setDrivers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Reject modal state
  const [rejectingDriver, setRejectingDriver] = useState<any | null>(null)
  const [rejectReason, setRejectReason] = useState('')
  const [flaggedDocuments, setFlaggedDocuments] = useState<string[]>([])
  const [actionLoading, setActionLoading] = useState(false)

  // Document image modal preview state
  const [previewImage, setPreviewImage] = useState<{ url: string; title: string } | null>(null)

  useEffect(() => {
    fetchResubmitted()
  }, [])

  const fetchResubmitted = async () => {
    try {
      setLoading(true)
      const data = await getResubmittedDrivers()
      setDrivers(data.drivers || [])
      setError(null)
    } catch (err: any) {
      console.error('Error fetching resubmitted drivers:', err)
      setError('Failed to load resubmitted applications.')
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (driverId: string) => {
    setActionLoading(true)
    try {
      await approveDriver(driverId, { note: 'Approved resubmitted documents' })
      setDrivers(prev => prev.filter(d => d.driverId !== driverId))
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to approve application')
    } finally {
      setActionLoading(false)
    }
  }

  const handleRejectConfirm = async () => {
    if (!rejectingDriver) return
    if (flaggedDocuments.length === 0 || !rejectReason.trim()) return

    setActionLoading(true)
    try {
      await rejectDriver(rejectingDriver.driverId, {
        reason: rejectReason,
        flaggedDocuments,
      })
      setDrivers(prev => prev.filter(d => d.driverId !== rejectingDriver.driverId))
      setRejectingDriver(null)
      setRejectReason('')
      setFlaggedDocuments([])
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to reject application')
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) {
    return (
      <AdminShell title="Resubmitted Applications">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-600" />
        </div>
      </AdminShell>
    )
  }

  return (
    <AdminShell title="Resubmitted Applications">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <div>
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <RotateCcw className="h-6 w-6 text-amber-600" />
              Resubmitted Applications
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Drivers who have updated their flagged documents after initial rejection.
            </p>
          </div>
          <span className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 self-start sm:self-auto">
            {drivers.length} Pending Review
          </span>
        </div>

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-sm">
            {error}
          </div>
        )}

        {drivers.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-100 shadow-sm">
            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-emerald-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-1">All caught up!</h3>
            <p className="text-sm text-slate-500">There are currently no resubmitted driver applications pending review.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {drivers.map(driver => {
              const flaggedList: string[] = driver.lastFlaggedDocuments || driver.flaggedDocuments || []

              const docs = [
                { key: 'profileImage', label: 'Profile Image', url: driver.profileImage },
                { key: 'aadhaarImage', label: 'Aadhaar Image', url: driver.aadhaarImage },
                { key: 'licenseImage', label: 'License Image', url: driver.licenseImage },
                { key: 'rcImage', label: 'RC Document', url: driver.rcImage },
              ]

              return (
                <div
                  key={driver._id}
                  className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all overflow-hidden"
                >
                  {/* Header */}
                  <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      {driver.profileImage ? (
                        <img
                          src={driver.profileImage}
                          alt={driver.fullName}
                          className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold text-lg">
                          {driver.fullName?.[0]}
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="text-base font-bold text-slate-800">{driver.fullName}</h3>
                          <span className="text-xs font-mono font-medium px-2.5 py-0.5 rounded bg-slate-200/70 text-slate-700">
                            {driver.driverId}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-1">
                          <span className="flex items-center gap-1">
                            <Phone className="h-3.5 w-3.5" /> {driver.phone}
                          </span>
                          <span className="flex items-center gap-1">
                            <Mail className="h-3.5 w-3.5" /> {driver.email}
                          </span>
                          <span className="flex items-center gap-1 uppercase font-semibold text-slate-700">
                            <Car className="h-3.5 w-3.5" /> {driver.vehicleType} — {driver.vehicleNumber}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end md:self-auto">
                      <button
                        onClick={() => handleApprove(driver.driverId)}
                        disabled={actionLoading}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm disabled:opacity-50"
                      >
                        <Check className="h-4 w-4" /> Approve Application
                      </button>
                      <button
                        onClick={() => {
                          setRejectingDriver(driver)
                          setRejectReason('')
                          setFlaggedDocuments([])
                        }}
                        disabled={actionLoading}
                        className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm disabled:opacity-50"
                      >
                        <X className="h-4 w-4" /> Reject Again
                      </button>
                    </div>
                  </div>

                  {/* Documents Display */}
                  <div className="p-5">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                      Uploaded Documents (Re-uploaded items are highlighted)
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {docs.map(doc => {
                        const isReuploaded = flaggedList.includes(doc.key)

                        return (
                          <div
                            key={doc.key}
                            className={`relative rounded-xl border p-3 flex flex-col justify-between transition-all ${
                              isReuploaded
                                ? 'border-amber-400 bg-amber-50/40 ring-2 ring-amber-400/30'
                                : 'border-slate-200 bg-slate-50/30'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-medium text-slate-700">{doc.label}</span>
                              {isReuploaded && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-white shadow-xs">
                                  <Sparkles className="h-2.5 w-2.5" /> Re-uploaded
                                </span>
                              )}
                            </div>

                            {doc.url ? (
                              <div
                                onClick={() => setPreviewImage({ url: doc.url, title: `${driver.fullName} - ${doc.label}` })}
                                className="relative group cursor-pointer aspect-4/3 rounded-lg overflow-hidden border border-slate-200 bg-slate-900"
                              >
                                <img
                                  src={doc.url}
                                  alt={doc.label}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-medium transition-opacity">
                                  <Eye className="h-4 w-4 mr-1" /> View Full
                                </div>
                              </div>
                            ) : (
                              <div className="aspect-4/3 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-xs text-slate-400">
                                Not Provided
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Image Preview Modal */}
        {previewImage && (
          <div
            onClick={() => setPreviewImage(null)}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <div
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl"
            >
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <h4 className="text-sm font-semibold text-slate-800">{previewImage.title}</h4>
                <button
                  onClick={() => setPreviewImage(null)}
                  className="p-1 rounded-lg hover:bg-slate-100 text-slate-500"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="p-4 bg-slate-900 flex items-center justify-center max-h-[75vh]">
                <img
                  src={previewImage.url}
                  alt={previewImage.title}
                  className="max-h-[70vh] w-auto object-contain rounded-lg"
                />
              </div>
            </div>
          </div>
        )}

        {/* Reject Modal */}
        {rejectingDriver && (
          <RejectModal
            isOpen={!!rejectingDriver}
            driverName={rejectingDriver.fullName}
            reason={rejectReason}
            onReasonChange={setRejectReason}
            flaggedDocuments={flaggedDocuments}
            onFlaggedDocumentsChange={setFlaggedDocuments}
            onConfirm={handleRejectConfirm}
            onClose={() => {
              setRejectingDriver(null)
              setRejectReason('')
              setFlaggedDocuments([])
            }}
            isLoading={actionLoading}
          />
        )}
      </div>
    </AdminShell>
  )
}
