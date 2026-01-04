import { Sidebar } from "@/components/dashboard/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Smartphone, ShieldCheck, Globe, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function AddNumberPage() {
  return (
    <div className="flex h-screen bg-background" dir="rtl">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Link
              href="/"
              className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
            >
              <ArrowLeft className="ml-2 h-4 w-4" />
              العودة للوحة المعلومات
            </Link>
            <h1 className="text-3xl font-bold tracking-tight">إضافة رقم جديد</h1>
            <p className="text-muted-foreground mt-2">اختر الطريقة الأنسب لربط رقم واتساب بـ "العزب هاب".</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="relative overflow-hidden group hover:border-emerald-500 transition-all">
              <div className="absolute top-0 right-0 p-3">
                <span className="bg-emerald-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                  موصى به
                </span>
              </div>
              <CardHeader>
                <div className="h-12 w-12 bg-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-600 mb-2">
                  <Globe className="h-6 w-6" />
                </div>
                <CardTitle>رقم رقمي (Digital Number)</CardTitle>
                <CardDescription>إعداد فوري بدون الحاجة لشريحة SIM. مثالي للأعمال.</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-500" /> تفعيل خلال ثوانٍ
                  </li>
                  <li className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-500" /> رقم أمريكي/دولي مخصص
                  </li>
                </ul>
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700">شراء رقم جديد</Button>
              </CardContent>
            </Card>

            <Card className="group hover:border-primary transition-all">
              <CardHeader>
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-2">
                  <Smartphone className="h-6 w-6" />
                </div>
                <CardTitle>ربط رقمك الحالي</CardTitle>
                <CardDescription>استخدم هاتفك الشخصي أو رقم العمل الحالي.</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-primary" /> يتطلب مسح QR Code
                  </li>
                  <li className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-primary" /> يدعم واتساب بيزنس
                  </li>
                </ul>
                <Button
                  variant="outline"
                  className="w-full bg-transparent border-primary text-primary hover:bg-primary/5"
                >
                  ابدأ عملية الربط
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
