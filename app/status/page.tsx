import { Sidebar } from "@/components/dashboard/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Clock, Server, Wifi } from "lucide-react"

export default function StatusPage() {
  const services = [
    { name: "خادم API واتساب", status: "يعمل", uptime: "99.99%", icon: Server },
    { name: "محرك الذكاء الاصطناعي", status: "يعمل", uptime: "99.95%", icon: Wifi },
    { name: "قاعدة البيانات", status: "يعمل", uptime: "100%", icon: CheckCircle2 },
    { name: "نظام الويبهوك", status: "يعمل", uptime: "99.98%", icon: Clock },
  ]

  return (
    <div className="flex h-screen bg-background" dir="rtl">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">حالة النظام</h1>
              <p className="text-muted-foreground mt-2">مراقبة حية لجميع خدمات منصة العزب هاب.</p>
            </div>
            <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-600 px-4 py-2 rounded-full font-bold">
              <CheckCircle2 className="h-5 w-5" />
              جميع الأنظمة تعمل بشكل طبيعي
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {services.map((service, i) => (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{service.name}</CardTitle>
                  <service.icon className="h-4 w-4 text-emerald-500" />
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">{service.status}</span>
                    <span className="text-xs font-mono bg-muted px-2 py-0.5 rounded border">
                      Uptime: {service.uptime}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>سجل الأحداث (Incident History)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { date: "4 يناير 2026", event: "تحديث مجدول لنظام الويبهوك", status: "مكتمل" },
                  { date: "2 يناير 2026", event: "صيانة دورية لقاعدة البيانات", status: "مكتمل" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold">{item.event}</span>
                      <span className="text-[10px] text-muted-foreground">{item.date}</span>
                    </div>
                    <span className="text-[10px] bg-emerald-500 text-white px-2 py-0.5 rounded-full">
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
