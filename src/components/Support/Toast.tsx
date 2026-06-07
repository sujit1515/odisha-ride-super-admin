
export default function Toast({
  message,
  success,
}: {
  message: string
  success: boolean
}) {
  return (
    <div className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-xl
                     text-white text-sm font-medium shadow-lg
                     ${success ? 'bg-emerald-500' : 'bg-red-500'}`}>
      {message}
    </div>
  )
}