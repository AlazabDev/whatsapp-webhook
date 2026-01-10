"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function LogoutPage() {
  const router = useRouter()

  useEffect(() => {
    const logout = async () => {
      try {
        await fetch("/api/auth/trusted-logout", { method: "POST" })
        router.push("/auth/trusted-login")
      } catch (error) {
        console.error("[v0] Logout error:", error)
      }
    }

    logout()
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="text-center">
        <p className="text-slate-600">جاري تسجيل الخروج...</p>
      </div>
    </div>
  )
}
