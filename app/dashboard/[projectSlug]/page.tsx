import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

interface PageProps {
  params: Promise<{ projectSlug: string }>
}

export default async function DashboardPage({ params }: PageProps) {
  const { projectSlug } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: project } = await supabase.from("projects").select("*").eq("slug", projectSlug).single()

  if (!project) {
    redirect("/")
  }

  // Get WhatsApp numbers
  const { data: whatsappNumbers } = await supabase.from("whatsapp_numbers").select("*").eq("project_id", project.id)

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">{project.name}</h1>
          {project.description && <p className="text-slate-600">{project.description}</p>}
        </div>

        {/* Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Link href={`/dashboard/${projectSlug}/messages`}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl mb-2">💬</div>
                  <h3 className="font-semibold text-slate-900">الرسائل</h3>
                  <p className="text-sm text-slate-500 mt-1">إرسال واستقبال الرسائل</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href={`/dashboard/${projectSlug}/templates`}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl mb-2">📋</div>
                  <h3 className="font-semibold text-slate-900">القوالب</h3>
                  <p className="text-sm text-slate-500 mt-1">إدارة قوالب الرسائل</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href={`/dashboard/${projectSlug}/analytics`}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl mb-2">📊</div>
                  <h3 className="font-semibold text-slate-900">الإحصائيات</h3>
                  <p className="text-sm text-slate-500 mt-1">عرض التحليلات</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href={`/dashboard/${projectSlug}/team`}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl mb-2">👥</div>
                  <h3 className="font-semibold text-slate-900">الفريق</h3>
                  <p className="text-sm text-slate-500 mt-1">إدارة الأعضاء</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* WhatsApp Numbers */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>حسابات WhatsApp</CardTitle>
            <Button size="sm">إضافة حساب</Button>
          </CardHeader>
          <CardContent>
            {whatsappNumbers && whatsappNumbers.length > 0 ? (
              <div className="grid gap-4">
                {whatsappNumbers.map((wa) => (
                  <div key={wa.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                    <div>
                      <p className="font-semibold text-slate-900">{wa.display_phone_number}</p>
                      <p className="text-sm text-slate-500">
                        {wa.verified_name || "غير موثق"} -{" "}
                        <span className={`${wa.status === "active" ? "text-green-600" : "text-red-600"}`}>
                          {wa.status === "active" ? "نشط" : "معطل"}
                        </span>
                      </p>
                    </div>
                    <Link
                      href={`/dashboard/${projectSlug}/messages?whatsappNumberId=${wa.id}`}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      إدارة
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500">
                <p>لم تقم بإضافة أي حسابات WhatsApp حتى الآن</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
