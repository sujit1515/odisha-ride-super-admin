interface MiniStatProps {
  label: string
  value: string
  valueClass?: string
}

export default function MiniStat({
  label,
  value,
  valueClass = 'text-slate-900',
}: MiniStatProps) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
      <div className="text-xs text-slate-500 leading-snug">{label}</div>
      <div className={`mt-3 text-2xl font-bold ${valueClass}`}>{value}</div>
    </div>
  )
}