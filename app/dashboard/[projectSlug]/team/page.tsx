"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MembersList } from "@/components/team/members-list"
import { useParams } from "next/navigation"

export default function TeamPage() {
  const params = useParams()
  const projectSlug = params.projectSlug as string
  const [email, setEmail] = useState("")
  const [role, setRole] = useState("member")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/team/members/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: projectSlug,
          email,
          role,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "فشل الدعوة")
      }

      setEmail("")
      setRole("member")
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">إدارة الفريق</h1>
          <p className="text-slate-600">إضافة وإدارة أعضاء الفريق والصلاحيات</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">دعوة عضو جديد</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleInvite} className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">البريد الإلكتروني</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@mail.com"
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="role">الدور</Label>
                  <select
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-md"
                  >
                    <option value="viewer">عارض</option>
                    <option value="member">عضو</option>
                    <option value="admin">مسؤول</option>
                  </select>
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded text-sm">{error}</div>
                )}

                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? "جاري الدعوة..." : "إرسال دعوة"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="lg:col-span-2">
            <MembersList projectId={projectSlug} />
          </div>
        </div>
      </div>
    </div>
  )
}
