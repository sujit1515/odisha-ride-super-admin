interface MiniStatProps {
  label: string
  value: string
  valueClass?: string
  live?: boolean
}

export default function MiniStat({
  label,
  value,
  valueClass = 'text-slate-900',
  live = false,
}: MiniStatProps) {
  return (
    <div className="relative bg-white rounded-xl p-4 shadow-sm border border-slate-100">
      {live && (
        <span className="absolute top-3 right-3 flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
      )}
      <div className="text-xs text-slate-500 leading-snug">{label}</div>
      <div className={`mt-3 text-2xl font-bold ${valueClass}`}>{value}</div>
    </div>
  )
}