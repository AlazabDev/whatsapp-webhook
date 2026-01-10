"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function VerifyContent() {
  const [isVerifying, setIsVerifying] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get("token")

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setError("الرابط غير صحيح")
        setIsVerifying(false)
        return
      }

      try {
        const response = await fetch("/api/auth/magic-link/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        })

        const data = await response.json()

        if (!response.ok) {
          setError(data.error || "حدث خطأ في التحقق")
          setIsVerifying(false)
          return
        }

        // Redirect to home
        router.push("/")
        router.refresh()
      } catch (error) {
        console.error("[v0] Verify error:", error)
        setError("حدث خطأ أثناء التحقق")
        setIsVerifying(false)
      }
    }

    verify()
  }, [token, router])

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">التحقق من الدخول</CardTitle>
            <CardDescription>جاري التحقق من رابط الدخول</CardDescription>
          </CardHeader>
          <CardContent>
            {isVerifying ? (
              <div className="flex flex-col items-center justify-center gap-4 py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                <p className="text-center text-gray-600">جاري التحقق من رابطك...</p>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-4">
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                )}
                <div className="flex flex-col gap-3">
                  <p className="text-center text-gray-600">
                    {error ? "حدث خطأ في التحقق من الرابط" : "تم التحقق بنجاح"}
                  </p>
                  <Link href="/auth/login">
                    <Button className="w-full">العودة لصفحة الدخول</Button>
                  </Link>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
