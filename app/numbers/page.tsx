import Link from "next/link"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Smartphone, PlusCircle, Cable, Globe } from "lucide-react"

const numberSections = [
  {
    title: "الأرقام المتصلة",
    description: "إدارة أرقام واتساب المرتبطة بحساب العمل ومراجعة حالتها.",
    href: "/numbers/connected",
    icon: Cable,
  },
  {
    title: "الأرقام الرقمية",
    description: "متابعة الأرقام الرقمية وربطها بالمشاريع الحالية.",
    href: "/numbers/digital",
    icon: Globe,
  },
  {
    title: "اختبار صندوق الرمل",
    description: "تحقق من الأرقام التجريبية قبل الإطلاق الرسمي.",
    href: "/numbers/sandbox",
    icon: Smartphone,
  },
]

export default function NumbersOverviewPage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold">أرقام الهواتف</h1>
            <p className="text-sm text-muted-foreground mt-1">نظرة عامة لإدارة جميع أرقام واتساب الخاصة بك.</p>
          </div>
          <Button className="gap-2 bg-primary">
            <PlusCircle className="h-4 w-4" />
            إضافة رقم جديد
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {numberSections.map((section) => (
            <Card key={section.title} className="h-full">
              <CardHeader className="flex flex-row items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                  <section.icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <CardTitle className="text-base">{section.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground leading-relaxed">{section.description}</p>
                <Button asChild variant="outline" className="w-full bg-transparent">
                  <Link href={section.href}>عرض التفاصيل</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
