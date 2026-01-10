"use client"

import { useState } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Brain, Save, Bot, Sparkles } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function AISettingsPage() {
  const { toast } = useToast()
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = () => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      toast({
        title: "تم الحفظ",
        description: "تم تحديث إعدادات الذكاء الاصطناعي بنجاح.",
      })
    }, 1000)
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">إعدادات الذكاء الاصطناعي</h1>
            <p className="text-muted-foreground mt-2">تخصيص سلوك الشات بوت ونماذج الذكاء الاصطناعي للمشروع الحالي.</p>
          </div>

          <div className="grid gap-6">
            <Card className="border-emerald-100 shadow-sm">
              <CardHeader className="border-b bg-emerald-50/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bot className="h-5 w-5 text-emerald-600" />
                    <CardTitle>حالة المساعد الذكي</CardTitle>
                  </div>
                  <Switch id="ai-status" defaultChecked />
                </div>
                <CardDescription className="mt-1">
                  تفعيل أو تعطيل الرد التلقائي عبر الذكاء الاصطناعي لهذا المشروع.
                </CardDescription>
              </CardHeader>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-blue-600" />
                    <CardTitle>نموذج الذكاء الاصطناعي</CardTitle>
                  </div>
                  <CardDescription>اختر المزود والنموذج الذي تفضله.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>مزود الخدمة</Label>
                    <Select defaultValue="openai">
                      <SelectTrigger>
                        <SelectValue placeholder="اختر المزود" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="openai">OpenAI (الافتراضي)</SelectItem>
                        <SelectItem value="anthropic">Anthropic (Claude)</SelectItem>
                        <SelectItem value="google">Google (Gemini)</SelectItem>
                        <SelectItem value="xai">xAI (Grok)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>النموذج (Model)</Label>
                    <Select defaultValue="gpt-4o">
                      <SelectTrigger>
                        <SelectValue placeholder="اختر النموذج" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gpt-4o">GPT-4o (الأكثر ذكاءً)</SelectItem>
                        <SelectItem value="gpt-4o-mini">GPT-4o Mini (الأسرع)</SelectItem>
                        <SelectItem value="claude-3-sonnet">Claude 3.5 Sonnet</SelectItem>
                        <SelectItem value="grok-beta">Grok Beta</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-amber-500" />
                    <CardTitle>معايير الاستجابة</CardTitle>
                  </div>
                  <CardDescription>ضبط المعايير التقنية للمخرجات.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>درجة الإبداع (Temperature)</Label>
                      <span className="text-xs text-muted-foreground">0.7</span>
                    </div>
                    <Input type="range" min="0" max="1" step="0.1" defaultValue="0.7" className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <Label>أقصى عدد للكلمات</Label>
                    <Input type="number" defaultValue="500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>التعليمات البرمجية (System Prompt)</CardTitle>
                <CardDescription>أهم جزء في الإعداد. حدد هوية وطريقة رد الشات بوت.</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="مثال: أنت مساعد ذكي لنظام العزب، رد بلباقة واعرض خدماتنا..."
                  className="min-h-[200px] leading-relaxed"
                  defaultValue={`أنت مساعد ذكي لخدمة العملاء في منصة "العزب هاب". 
مهمتك هي الرد على استفسارات العملاء بلباقة وباللغة العربية الفصحى أو العامية المصرية المهذبة حسب سياق المحادثة.
- قدم معلومات دقيقة عن خدماتنا.
- كن ودوداً ومساعداً دائماً.
- إذا لم تعرف الإجابة، اطلب من العميل انتظار رد موظف بشري.`}
                />
              </CardContent>
              <CardFooter className="border-t bg-muted/50 justify-end py-4">
                <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={handleSave} disabled={isSaving}>
                  <Save className="ml-2 h-4 w-4" />
                  {isSaving ? "جاري الحفظ..." : "حفظ الإعدادات"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
