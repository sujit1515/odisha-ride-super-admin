import Link from 'next/link'

interface LiveCardProps {
  label: string
  value: string
  dotClass?: string
  href?: string
}

export default function LiveCard({    
  label,
  value,
  dotClass = 'bg-emerald-500',
  href = '/passengers/waiting',
}: LiveCardProps) {
  return (
    <Link
      href={href}
     className="block bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"

    >
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <span className={`h-2 w-2 rounded-full ${dotClass} animate-pulse`} />
        Live Now
      </div>
      <div className="mt-3 text-sm text-slate-600">{label}</div>
      <div className="mt-2 text-4xl font-bold text-slate-900">{value}</div>
    </Link>
  )
}