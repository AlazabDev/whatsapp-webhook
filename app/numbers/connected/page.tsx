"use client"

import { Sidebar } from "@/components/dashboard/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronRight, Smartphone, PhoneIncoming, ArrowRight, Loader2 } from "lucide-react"
import { useNumbers } from "@/hooks/use-data"

export default function ConnectNumberPage() {
  const { numbers, isLoading } = useNumbers()

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h1 className="text-3xl font-bold mb-2">الأرقام المتصلة</h1>
              <p className="text-muted-foreground">إدارة وإضافة أرقام واتساب جديدة</p>
            </div>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              إضافة رقم جديد
            </Button>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : numbers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {numbers.map((num: any) => (
                <Card key={num.id} className="hover:border-primary transition-colors cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Smartphone className="h-6 w-6 text-primary" />
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        num.status === 'active' ? 'bg-green-100 text-green-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {num.status === 'active' ? 'نشطة' : 'قيد الانتظار'}
                      </span>
                    </div>
                    <h3 className="font-bold mb-1">{num.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{num.phone_number}</p>
                    <div className="flex items-center text-primary text-xs gap-1">
                      إدارة <ChevronRight className="h-3 w-3" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Smartphone className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">لا توجد أرقام متصلة حالياً</p>
            </div>
          )}

          <div className="mt-12 space-y-4">
            <h2 className="text-xl font-bold">إضافة رقم جديد</h2>
            <div className="space-y-4">
              <div className="group relative bg-card border rounded-xl p-6 hover:border-primary transition-colors cursor-pointer">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-muted rounded-lg flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                      <Smartphone className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold">إعداد فوري باستخدام رقم رقمي أمريكي</h3>
                        <span className="bg-emerald-500/10 text-emerald-500 text-[10px] px-2 py-0.5 rounded font-medium">
                          موصى به
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">لا حاجة لشريحة SIM أو رمز تحقق</p>
                    </div>
                  </div>
                  <div className="text-primary text-xs flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    تعرف على المزيد <ChevronRight className="h-3 w-3" />
                  </div>
                </div>
              </div>

              <div className="group relative bg-card border rounded-xl p-6 hover:border-primary transition-colors cursor-pointer">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-muted rounded-lg flex items-center justify-center">
                      <div className="relative">
                        <Smartphone className="h-6 w-6" />
                        <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-card border rounded-sm flex items-center justify-center">
                          <div className="h-1.5 w-1.5 bg-foreground rounded-full" />
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold">وصل شريحة SIM الخاصة بي</h3>
                      <p className="text-xs text-muted-foreground mt-1">استخدم رقمك وتحقق من ذلك برمز نصي</p>
                    </div>
                  </div>
                  <div className="text-primary text-xs flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    تعرف على المزيد <ChevronRight className="h-3 w-3" />
                  </div>
                </div>
              </div>

              <div className="group relative bg-card border rounded-xl p-6 hover:border-primary transition-colors cursor-pointer">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-muted rounded-lg flex items-center justify-center">
                      <PhoneIncoming className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-muted-foreground">تطبيق Connect WhatsApp Business</h3>
                        <span className="bg-muted text-muted-foreground text-[10px] px-2 py-0.5 rounded font-medium">
                          غير مستقر
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">استخدم رقم هاتفك الحالي لتطبيق واتساب بيزنس.</p>
                    </div>
                  </div>
                  <div className="text-primary text-xs flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    تعرف على المزيد <ChevronRight className="h-3 w-3" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

import { Plus } from "lucide-react"

