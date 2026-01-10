import { Sidebar } from "@/components/dashboard/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Settings, Save, Trash2, Globe, Shield } from "lucide-react"

export default function ProjectSettingsPage() {
  return (
    <div className="flex h-screen bg-background" dir="rtl">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Settings className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">إعدادات المشروع</h1>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>الهوية والمعلومات</CardTitle>
                <CardDescription>تحكم في اسم المشروع ومعلومات النطاق الأساسي.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">اسم المشروع</Label>
                  <Input id="name" defaultValue="نظام العزب" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="domain">النطاق (Domain)</Label>
                  <div className="flex items-center gap-2">
                    <Input id="domain" defaultValue="whatsapp.alazab.com" readOnly className="bg-muted" />
                    <Button variant="outline" size="sm" className="bg-transparent shrink-0">
                      تغيير
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>تكامل الخدمات</CardTitle>
                <CardDescription>إعدادات الربط مع الأنظمة الخارجية وميتا.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">حساب ميتا بيزنس</p>
                      <p className="text-xs text-emerald-600 font-bold">متصل (ALAZAB_BIZ_01)</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="bg-transparent">
                    تحديث الصلاحيات
                  </Button>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">مفاتيح التشفير</p>
                      <p className="text-xs text-muted-foreground">مفعّلة (تشفير طرف لطرف)</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="bg-transparent">
                    إدارة المفاتيح
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="flex items-center justify-between pt-4">
              <Button className="bg-emerald-600 hover:bg-emerald-700 gap-2 px-8">
                <Save className="h-4 w-4" /> حفظ التغييرات
              </Button>
              <Button variant="ghost" className="text-destructive hover:bg-destructive/10 gap-2">
                <Trash2 className="h-4 w-4" /> حذف هذا المشروع
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
