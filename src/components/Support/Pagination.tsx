// ─────────────────────────────────────────────────────────────────────────────
// FILE: components/Support/Pagination.tsx
// ─────────────────────────────────────────────────────────────────────────────

interface PaginationProps {
  page:         number
  totalPages:   number
  total:        number
  limit:        number
  onPageChange: (p: number) => void
}

export function Pagination({ page, totalPages, total, limit, onPageChange }: PaginationProps) {
  return (
    <div className="flex items-center justify-between px-5 py-4 border-t border-slate-100">
      <span className="text-xs text-slate-500">
        Showing {((page - 1) * limit) + 1}–{Math.min(page * limit, total)} of {total}
      </span>
      <div className="flex gap-1.5 flex-wrap">
        <button
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1}
          className="px-3 py-1.5 text-xs rounded-lg border border-slate-200
                     hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed
                     font-medium transition-colors"
        >
          ← Prev
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter(p => p === 1 || p === totalPages || (p >= page - 1 && p <= page + 1))
          .map((p, idx, arr) => (
            <>
              {idx > 0 && arr[idx - 1] !== p - 1 && (
                <span key={`dot-${p}`} className="px-2 py-1.5 text-xs text-slate-400">...</span>
              )}
              <button
                key={p}
                onClick={() => onPageChange(p)}
                className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-colors
                  ${page === p
                    ? 'bg-slate-900 text-white'
                    : 'border border-slate-200 hover:bg-slate-50'}`}
              >
                {p}
              </button>
            </>
          ))
        }

        <button
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          className="px-3 py-1.5 text-xs rounded-lg border border-slate-200
                     hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed
                     font-medium transition-colors"
        >
          Next →
        </button>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// FILE: components/Support/Toast.tsx
// ─────────────────────────────────────────────────────────────────────────────

interface ToastProps {
  message: string
  success: boolean
}

export function Toast({ message, success }: ToastProps) {
  return (
    <div className={`fixed top-4 right-4 z-[60] px-5 py-3 rounded-xl text-white
                     text-sm font-medium shadow-lg transition-all
                     ${success ? 'bg-emerald-500' : 'bg-red-500'}`}>
      {message}
    </div>
  )
}

export default Pagination