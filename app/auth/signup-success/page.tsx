import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function SignupSuccessPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">تم إنشاء الحساب بنجاح!</CardTitle>
            <CardDescription>يرجى التحقق من بريدك الإلكتروني</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-4">
                  تم إرسال رابط تفعيل إلى بريدك الإلكتروني. يرجى التحقق من بريدك وتأكيد حسابك.
                </p>
                <p className="text-xs text-slate-500 mb-6">
                  قد تستغرق الرسالة بعض الوقت حتى تصل. تحقق من مجلد البريد العشوائي إذا لم تجدها.
                </p>
              </div>
              <Link
                href="/auth/login"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                العودة إلى تسجيل الدخول
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
