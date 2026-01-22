import Link from "next/link"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

export default function LogoutPage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-xl mx-auto">
          <Card>
            <CardHeader className="flex flex-row items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                <LogOut className="h-5 w-5 text-muted-foreground" />
              </div>
              <CardTitle className="text-base">تم تسجيل الخروج</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                إذا كنت ترغب في العودة إلى لوحة التحكم، يمكنك تسجيل الدخول مرة أخرى أو العودة للصفحة الرئيسية.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild className="bg-primary">
                  <Link href="/">العودة للوحة التحكم</Link>
                </Button>
                <Button asChild variant="outline" className="bg-transparent">
                  <Link href="/support">التواصل مع الدعم</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
