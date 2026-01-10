"use client"

import { Suspense } from "react"
import VerifyContent from "./verify-content"

export default function VerifyPage() {
  return (
    <Suspense fallback={<VerifyLoading />}>
      <VerifyContent />
    </Suspense>
  )
}

function VerifyLoading() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="flex flex-col items-center justify-center gap-4 py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            <p className="text-center text-gray-600">جاري التحقق من رابطك...</p>
          </div>
        </div>
      </div>
    </div>
  )
}
