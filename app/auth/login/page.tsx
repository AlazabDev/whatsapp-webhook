"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleRequestMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const response = await fetch("/api/auth/magic-link/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.toLowerCase() }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "حدث خطأ في إرسال الرابط")
        return
      }

      setSuccess(true)
      setEmail("")
    } catch (error) {
      console.error("[v0] Magic link request error:", error)
      setError("حدث خطأ أثناء إرسال الرابط")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">تسجيل الدخول</CardTitle>
            <CardDescription>أدخل بريدك الإلكتروني وسنرسل لك رابط دخول آمن</CardDescription>
          </CardHeader>
          <CardContent>
            {!success ? (
              <form onSubmit={handleRequestMagicLink}>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="email">البريد الإلكتروني</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="example@alazab.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  {error && <p className="text-sm text-red-500">{error}</p>}
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "جاري الإرسال..." : "إرسال رابط الدخول"}
                  </Button>
                </div>
              </form>
            ) : (
              <div className="flex flex-col gap-4 py-4">
                <div className="bg-green-50 border border-green-200 rounded-md p-4">
                  <p className="text-green-700 text-sm font-medium">تم إرسال رابط الدخول!</p>
                  <p className="text-green-600 text-xs mt-2">
                    تحقق من بريدك الإلكتروني للحصول على رابط الدخول الآمن. الرابط صالح لمدة 24 ساعة.
                  </p>
                </div>
                <Button
                  onClick={() => {
                    setSuccess(false)
                    setEmail("")
                  }}
                  variant="outline"
                  className="w-full"
                >
                  إرسال رابط آخر
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
