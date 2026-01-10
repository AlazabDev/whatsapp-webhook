"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TemplateForm } from "@/components/templates/template-form"
import { TemplateList } from "@/components/templates/template-list"
import { useSearchParams } from "next/navigation"

interface PageProps {
  params: Promise<{ projectSlug: string }>
}

export default function TemplatesPageContent({ params }: PageProps) {
  const searchParams = useSearchParams()
  const whatsappNumberId = searchParams.get("whatsappNumberId")

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">قوالب الرسائل</h1>
          <p className="text-slate-600">إنشاء وإدارة قوالب رسائل WhatsApp</p>
        </div>

        {!whatsappNumberId ? (
          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="pt-6">
              <p className="text-amber-800">يرجى اختيار حساب WhatsApp أولاً</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">إنشاء قالب جديد</CardTitle>
                </CardHeader>
                <CardContent>
                  <TemplateForm projectId={""} whatsappNumberId={whatsappNumberId} />
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2">
              <TemplateList whatsappNumberId={whatsappNumberId} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
