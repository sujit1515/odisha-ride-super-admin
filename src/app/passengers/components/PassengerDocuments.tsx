'use client'

import { FileText, CheckCircle2, Clock, XCircle } from 'lucide-react'
import { Document } from '../[id]/types'

interface PassengerDocumentsProps {
  documents: Document[]
}

export function PassengerDocuments({ documents }: PassengerDocumentsProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-800 mb-4 flex items-center gap-2">
        <FileText className="h-4 w-4 text-blue-500" />
        KYC Documents
      </h3>
      {documents.length === 0 ? (
        <div className="text-center py-8">
          <FileText className="h-12 w-12 text-slate-300 mx-auto mb-2" />
          <p className="text-sm text-slate-500">No documents uploaded yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {documents.map((doc, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  doc.status === 'verified' ? 'bg-emerald-100' : 
                  doc.status === 'pending' ? 'bg-yellow-100' : 'bg-red-100'
                }`}>
                  <FileText className={`h-5 w-5 ${
                    doc.status === 'verified' ? 'text-emerald-600' : 
                    doc.status === 'pending' ? 'text-yellow-600' : 'text-red-600'
                  }`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700">{doc.name}</p>
                  <p className="text-xs text-slate-400">Uploaded on {doc.uploadedAt}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  doc.status === 'verified' 
                    ? 'bg-emerald-50 text-emerald-700' 
                    : doc.status === 'pending'
                    ? 'bg-yellow-50 text-yellow-700'
                    : 'bg-red-50 text-red-700'
                }`}>
                  {doc.status === 'verified' && <CheckCircle2 className="h-3 w-3 inline mr-1" />}
                  {doc.status === 'pending' && <Clock className="h-3 w-3 inline mr-1" />}
                  {doc.status === 'rejected' && <XCircle className="h-3 w-3 inline mr-1" />}
                  {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                </span>
                <button className="px-3 py-1.5 text-xs text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium">
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}