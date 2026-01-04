import { Sidebar } from "@/components/dashboard/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Code2, Shield, Zap, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Suspense } from "react"

export default function DocsPage() {
  return (
    <div className="flex h-screen bg-background" dir="rtl">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">
        <Suspense fallback={null}>
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight">الوثائق والتعليمات</h1>
              <p className="text-muted-foreground mt-2">دليلك الشامل لاستخدام جميع ميزات "العزب هاب".</p>
            </div>

            <div className="relative mb-8">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="ابحث في الوثائق..." className="pr-10 h-12 text-lg" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {[
                { title: "أساسيات المنصة", icon: BookOpen, desc: "تعرف على كيفية البدء وإدارة مشاريعك." },
                { title: "ربط API", icon: Code2, desc: "دليل المطورين لدمج النظام مع تطبيقاتك." },
                { title: "الأمان والخصوصية", icon: Shield, desc: "كيف نقوم بتأمين بياناتك ومحادثاتك." },
                { title: "الأتمتة والذكاء الاصطناعي", icon: Zap, desc: "تفعيل الشات بوت وسير العمل التلقائي." },
              ].map((item, i) => (
                <Card key={i} className="group hover:border-emerald-500 cursor-pointer transition-all">
                  <CardHeader>
                    <div className="h-10 w-10 bg-emerald-500/10 rounded flex items-center justify-center text-emerald-600 mb-2">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="prose prose-emerald max-w-none text-right">
              <h2 className="text-xl font-bold mb-4">البدء السريع</h2>
              <p className="text-muted-foreground leading-relaxed">
                للبدء في استخدام العزب هاب، يجب عليك أولاً ربط رقم واتساب نشط. يمكنك القيام بذلك عبر التوجه إلى قسم
                "أرقام الهواتف" ثم اختيار "ربط رقم جديد". بعد الربط، ستتمكن من استقبال الرسائل في "صندوق الوارد" وتفعيل
                الرد التلقائي عبر الذكاء الاصطناعي.
              </p>
            </div>
          </div>
        </Suspense>
      </main>
    </div>
  )
}
