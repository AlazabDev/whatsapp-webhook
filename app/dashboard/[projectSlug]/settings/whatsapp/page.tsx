"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"

interface PageProps {
  params: Promise<{ projectSlug: string }>
}

export default function WhatsAppSettingsPage({ params }: PageProps) {
  const [whatsappNumbers, setWhatsappNumbers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)

  const [formData, setFormData] = useState({
    phoneNumberId: "",
    displayPhoneNumber: "",
    verifiedName: "",
    accessToken: "",
  })

  const handleAddNumber = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const { projectSlug } = await params

      // Get project
      const { data: project } = await supabase.from("projects").select("id").eq("slug", projectSlug).single()

      if (!project) throw new Error("Project not found")

      // Add WhatsApp number
      const { error: insertError } = await supabase.from("whatsapp_numbers").insert({
        project_id: project.id,
        phone_number_id: formData.phoneNumberId,
        display_phone_number: formData.displayPhoneNumber,
        verified_name: formData.verifiedName,
        access_token: formData.accessToken,
        status: "active",
      })

      if (insertError) throw insertError

      // Reset form and reload
      setFormData({
        phoneNumberId: "",
        displayPhoneNumber: "",
        verifiedName: "",
        accessToken: "",
      })
      setShowForm(false)

      // Reload numbers
      loadNumbers()
    } catch (err) {
      setError(err instanceof Error ? err.message : "فشل إضافة الحساب")
    } finally {
      setIsLoading(false)
    }
  }

  const loadNumbers = async () => {
    try {
      const supabase = createClient()
      const { projectSlug } = await params

      const { data: project } = await supabase.from("projects").select("id").eq("slug", projectSlug).single()

      if (!project) return

      const { data: numbers } = await supabase.from("whatsapp_numbers").select("*").eq("project_id", project.id)

      setWhatsappNumbers(numbers || [])
    } catch (err) {
      console.error("Error loading numbers:", err)
    }
  }

  useEffect(() => {
    loadNumbers()
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">إعدادات WhatsApp</h1>
          <p className="text-slate-600">إدارة حسابات WhatsApp Business الخاصة بك</p>
        </div>

        {/* Add New Number */}
        {showForm ? (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>إضافة حساب WhatsApp جديد</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddNumber} className="space-y-6">
                <div className="grid gap-2">
                  <Label htmlFor="phoneNumberId">معرف رقم الهاتف</Label>
                  <Input
                    id="phoneNumberId"
                    value={formData.phoneNumberId}
                    onChange={(e) => setFormData({ ...formData, phoneNumberId: e.target.value })}
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="displayPhoneNumber">رقم الهاتف</Label>
                  <Input
                    id="displayPhoneNumber"
                    value={formData.displayPhoneNumber}
                    onChange={(e) => setFormData({ ...formData, displayPhoneNumber: e.target.value })}
                    placeholder="201234567890"
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="verifiedName">الاسم الموثق</Label>
                  <Input
                    id="verifiedName"
                    value={formData.verifiedName}
                    onChange={(e) => setFormData({ ...formData, verifiedName: e.target.value })}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="accessToken">Access Token</Label>
                  <Input
                    id="accessToken"
                    type="password"
                    value={formData.accessToken}
                    onChange={(e) => setFormData({ ...formData, accessToken: e.target.value })}
                    required
                  />
                </div>

                {error && <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded">{error}</div>}

                <div className="flex gap-4">
                  <Button type="submit" disabled={isLoading} className="flex-1">
                    {isLoading ? "جاري الإضافة..." : "إضافة الحساب"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowForm(false)}
                    disabled={isLoading}
                    className="flex-1"
                  >
                    إلغاء
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        ) : (
          <Button onClick={() => setShowForm(true)} className="mb-8">
            إضافة حساب جديد
          </Button>
        )}

        {/* Numbers List */}
        <div className="space-y-4">
          {whatsappNumbers.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center text-slate-500 py-8">
                لم تقم بإضافة أي حسابات حتى الآن
              </CardContent>
            </Card>
          ) : (
            whatsappNumbers.map((number) => (
              <Card key={number.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-slate-900">{number.display_phone_number}</h3>
                      <p className="text-sm text-slate-500">
                        {number.verified_name || "غير موثق"} •{" "}
                        <span className={number.status === "active" ? "text-green-600" : "text-red-600"}>
                          {number.status === "active" ? "نشط" : "معطل"}
                        </span>
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        تعديل
                      </Button>
                      <Button size="sm" variant="destructive">
                        حذف
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
