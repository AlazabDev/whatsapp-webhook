"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"

interface TemplateFormProps {
  projectId: string
  whatsappNumberId: string
  onSuccess?: () => void
  initialData?: any
}

export function TemplateForm({ projectId, whatsappNumberId, onSuccess, initialData }: TemplateFormProps) {
  const [name, setName] = useState(initialData?.name || "")
  const [category, setCategory] = useState(initialData?.category || "MARKETING")
  const [language, setLanguage] = useState(initialData?.language || "ar")
  const [body, setBody] = useState(initialData?.content?.body || "")
  const [header, setHeader] = useState(initialData?.content?.header || "")
  const [footer, setFooter] = useState(initialData?.content?.footer || "")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const endpoint = initialData ? "/api/templates/update" : "/api/templates/create"
      const method = initialData ? "PUT" : "POST"

      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...(initialData && { templateId: initialData.id }),
          projectId,
          whatsappNumberId,
          name,
          category,
          language,
          content: {
            body,
            ...(header && { header }),
            ...(footer && { footer }),
          },
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "حدث خطأ")
      }

      if (onSuccess) onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ غير متوقع")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-2">
        <Label htmlFor="name">اسم القالب</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="مثال: تأكيد الطلب"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="category">الفئة</Label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="MARKETING">تسويق</option>
            <option value="TRANSACTIONAL">معاملات</option>
            <option value="OTP">رمز التحقق</option>
            <option value="UTILITY">خدمة</option>
          </select>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="language">اللغة</Label>
          <select
            id="language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ar">العربية</option>
            <option value="en">الإنجليزية</option>
          </select>
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="header">الرأس (اختياري)</Label>
        <Input id="header" value={header} onChange={(e) => setHeader(e.target.value)} placeholder="عنوان الرسالة" />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="body">نص الرسالة</Label>
        <Textarea
          id="body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="اكتب نص الرسالة..."
          rows={6}
          required
        />
        <p className="text-xs text-slate-500">يمكنك استخدام {{}} للمتغيرات</p>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="footer">الذيل (اختياري)</Label>
        <Input id="footer" value={footer} onChange={(e) => setFooter(e.target.value)} placeholder="تذييل الرسالة" />
      </div>

      {error && <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded">{error}</div>}

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? "جاري الحفظ..." : initialData ? "تحديث القالب" : "إنشاء القالب"}
      </Button>
    </form>
  )
}
