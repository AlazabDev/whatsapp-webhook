export default function LoginLoading() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-lg shadow-lg p-8 space-y-4">
          <div className="h-8 bg-slate-200 rounded animate-pulse" />
          <div className="h-4 bg-slate-200 rounded animate-pulse" />
          <div className="h-10 bg-slate-200 rounded animate-pulse" />
        </div>
      </div>
    </div>
  )
}
