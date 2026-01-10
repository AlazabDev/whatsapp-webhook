import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getCurrentUser } from "@/lib/auth/trusted-auth"

export const metadata = {
  title: "WhatsApp Platform",
  description: "منصة إدارة رسائل WhatsApp للعمليات التجارية",
}

export default async function HomePage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/auth/login")
  }

  const supabase = await createClient()
  const { data: projects } = await supabase.from("projects").select("*").order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">مرحباً بك، {user.full_name}</h1>
          <p className="text-xl text-slate-600">إدارة رسائلك التجارية وجهات اتصالك بسهولة</p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects && projects.length > 0 ? (
            projects.map((project) => (
              <a
                key={project.id}
                href={`/dashboard/${project.slug}`}
                className="group relative overflow-hidden rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">{project.name}</h3>
                      {project.description && <p className="text-sm text-slate-600 mt-1">{project.description}</p>}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm text-slate-500">
                    <span>إنشاء في {new Date(project.created_at).toLocaleDateString("ar-EG")}</span>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-blue-500/0 group-hover:from-blue-500/5 group-hover:to-blue-500/10 transition-all" />
              </a>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="text-slate-400 mb-4">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-700 mb-2">لا توجد مشاريع</h3>
              <p className="text-slate-600 mb-4">ابدأ بإنشاء مشروع جديد لإدارة حسابات WhatsApp الخاصة بك</p>
              <a
                href="/projects/new"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                إنشاء مشروع جديد
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
