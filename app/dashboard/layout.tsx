"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkUser = async () => {
      try {
        const response = await fetch("/api/auth/me")
        const data = await response.json()
        if (!response.ok) {
          router.push("/auth/trusted-login")
          return
        }
        setUser(data.user)
      } catch (error) {
        console.error("[v0] Error checking user:", error)
        router.push("/auth/trusted-login")
      } finally {
        setLoading(false)
      }
    }

    checkUser()
  }, [router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-slate-600">جاري التحميل...</p>
        </div>
      </div>
    )
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/trusted-logout", { method: "POST" })
      router.push("/auth/trusted-login")
    } catch (error) {
      console.error("[v0] Logout error:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-slate-200">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            WhatsApp Platform
          </Link>
          <div className="flex items-center gap-6">
            <span className="text-slate-700 font-medium">{user?.full_name}</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
            >
              تسجيل الخروج
            </button>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  )
}
