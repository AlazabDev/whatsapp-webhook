"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { getSafeRedirect } from "@/lib/auth-redirect"
import { getSupabaseBrowserClient } from "@/lib/supabase-browser"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const checkSession = async () => {
      const supabase = getSupabaseBrowserClient()
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (session) {
        const redirect = getSafeRedirect(searchParams.get("redirect"))
        router.replace(redirect)
      }
    }

    checkSession()
  }, [router, searchParams])

  const handleGoogleLogin = async () => {
    setLoading(true)
    const supabase = getSupabaseBrowserClient()
    const redirect = getSafeRedirect(searchParams.get("redirect"))
    const redirectUrl = new URL("/auth/callback", window.location.origin)
    redirectUrl.searchParams.set("redirect", redirect)
    const redirectTo = redirectUrl.toString()
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
      },
    })
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-lg border bg-card p-8 shadow-sm">
        <div className="text-center space-y-2 mb-6">
          <h1 className="text-2xl font-bold">تسجيل الدخول</h1>
          <p className="text-sm text-muted-foreground">سجّل الدخول باستخدام حساب جوجل للوصول إلى لوحة التحكم.</p>
        </div>
        <Button className="w-full" onClick={handleGoogleLogin} disabled={loading} variant="default">
          {loading ? "جاري تحويلك..." : "تسجيل الدخول بحساب جوجل"}
        </Button>
      </div>
    </div>
  )
}
