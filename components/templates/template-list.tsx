"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState, useEffect } from "react"

interface Template {
  id: string
  name: string
  category: string
  status: string
  is_active: boolean
  created_at: string
}

interface TemplateListProps {
  whatsappNumberId: string
  onEdit?: (template: Template) => void
  onDelete?: (template: Template) => void
  onSend?: (template: Template) => void
}

export function TemplateList({ whatsappNumberId, onEdit, onDelete, onSend }: TemplateListProps) {
  const [templates, setTemplates] = useState<Template[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchTemplates()
  }, [whatsappNumberId])

  const fetchTemplates = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch(`/api/templates/list?whatsappNumberId=${whatsappNumberId}`)

      if (!response.ok) {
        throw new Error("فشل في تحميل القوالب")
      }

      const data = await response.json()
      setTemplates(data.data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ")
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <div className="text-center py-8 text-slate-500">جاري التحميل...</div>
  }

  if (error) {
    return <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded">{error}</div>
  }

  if (templates.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500 mb-4">لا توجد قوالب</p>
        <Button onClick={() => window.location.reload()}>إعادة محاولة</Button>
      </div>
    )
  }

  return (
    <div className="grid gap-4">
      {templates.map((template) => (
        <Card key={template.id}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg">{template.name}</CardTitle>
            <span
              className={`px-2 py-1 rounded text-xs font-semibold ${
                template.status === "approved"
                  ? "bg-green-100 text-green-800"
                  : template.status === "rejected"
                    ? "bg-red-100 text-red-800"
                    : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {template.status === "approved" ? "معتمد" : template.status === "rejected" ? "مرفوض" : "في الانتظار"}
            </span>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="flex gap-2 flex-wrap">
                <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">{template.category}</span>
                {!template.is_active && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">معطل</span>
                )}
              </div>
              <div className="flex gap-2">
                {onEdit && (
                  <Button size="sm" variant="outline" onClick={() => onEdit(template)}>
                    تعديل
                  </Button>
                )}
                {onSend && (
                  <Button size="sm" onClick={() => onSend(template)}>
                    إرسال
                  </Button>
                )}
                {onDelete && (
                  <Button size="sm" variant="destructive" onClick={() => onDelete(template)}>
                    حذف
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
