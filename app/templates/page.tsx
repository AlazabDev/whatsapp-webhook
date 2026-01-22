"use client"

import { Sidebar } from "@/components/dashboard/sidebar"
import { Button } from "@/components/ui/button"
import { Plus, RefreshCcw, MessageSquare, ExternalLink, CheckCircle, Clock, XCircle } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { syncTemplates, getTemplatesFromDB, createAndSubmitTemplate } from "@/app/actions/whatsapp"
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { TemplateForm } from "@/components/templates/template-form"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

const PHONE_NUMBER_ID = process.env.NEXT_PUBLIC_WHATSAPP_PHONE_NUMBER_ID || ""

export default function TemplatesPage() {
  const [isSyncing, setIsSyncing] = useState(false)
  const [isSubmittingId, setIsSubmittingId] = useState<string | null>(null)
  const [templates, setTemplates] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadTemplates()
  }, [])

  const loadTemplates = async () => {
    setIsLoading(true)
    try {
      const data = await getTemplatesFromDB(PHONE_NUMBER_ID)
      setTemplates(data)
    } catch (error) {
      console.error("[app] Error loading templates:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSync = async () => {
    setIsSyncing(true)
    try {
      const result = await syncTemplates(PHONE_NUMBER_ID)
      toast({
        title: "تمت المزامنة بنجاح",
        description: `تم تحديث ${result.count} قالب من واتساب ميتا.`,
      })
      await loadTemplates()
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "فشلت المزامنة",
        description: error.message || "تأكد من إعدادات WHATSAPP_ACCESS_TOKEN",
      })
    } finally {
      setIsSyncing(false)
    }
  }

  const handleSubmitToMeta = async (template: any) => {
    setIsSubmittingId(template.id)
    try {
      await createAndSubmitTemplate(PHONE_NUMBER_ID, {
        name: template.name,
        category: template.category,
        language: template.language,
        components: template.content,
      })
      toast({
        title: "تم الإرسال للموافقة",
        description: `تم إرسال قالب ${template.name} لميتا.`,
      })
      await loadTemplates()
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "فشل الإرسال",
        description: error.message || "حدث خطأ أثناء الإرسال",
      })
    } finally {
      setIsSubmittingId(null)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status?.toUpperCase()) {
      case "APPROVED":
        return (
          <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-emerald-500/20">
            <CheckCircle className="h-3 w-3 ml-1" />
            تمت الموافقة
          </Badge>
        )
      case "PENDING":
      case "IN_APPEAL":
        return (
          <Badge className="bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20 border-yellow-500/20">
            <Clock className="h-3 w-3 ml-1" />
            تحت الموافقة
          </Badge>
        )
      case "REJECTED":
        return (
          <Badge variant="destructive" className="bg-red-500/10 text-red-600 hover:bg-red-500/20 border-red-500/20">
            <XCircle className="h-3 w-3 ml-1" />
            مرفوض
          </Badge>
        )
      case "DRAFT":
        return (
          <Badge variant="outline" className="bg-muted text-muted-foreground border-muted-foreground/20">
            <Plus className="h-3 w-3 ml-1" />
            مسودة محلية
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="border-muted-foreground/30">
            {status || "غير معروف"}
          </Badge>
        )
    }
  }

  return (
    <div className="flex h-screen bg-background text-right" dir="rtl">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">قوالب واتساب</h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>إدارة قوالب الرسائل على واتساب</span>
            <div className="h-4 w-4 border rounded-sm" />
          </div>
        </div>

        <div className="flex items-center justify-between mb-8 bg-card p-4 rounded-lg border">
          <div className="flex-1 max-w-md">
            <p className="text-xs font-medium text-muted-foreground mb-2">تكوين واتساب</p>
            <Select defaultValue="alazab">
              <SelectTrigger>
                <SelectValue placeholder="اختر رقم الهاتف" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="alazab">العزب هاب +1 5557245001</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2 bg-transparent" onClick={handleSync} disabled={isSyncing}>
              <RefreshCcw className={`h-4 w-4 ${isSyncing ? "animate-spin" : ""}`} />
              {isSyncing ? "جاري المزامنة..." : "قوالب التزامن"}
            </Button>
            <Button className="gap-2 bg-primary" onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4" /> إنشاء قالب
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <RefreshCcw className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : templates.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 border rounded-lg bg-card">
            <div className="h-16 w-16 bg-muted rounded-xl flex items-center justify-center mb-4">
              <MessageSquare className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-lg font-bold mb-2">لم يتم العثور على قوالب</h2>
            <p className="text-sm text-muted-foreground mb-8">
              أنشئ قوالب مباشرة هنا أو قم بمزامنة القوالب الموجودة من Meta WhatsApp Manager.
            </p>

            <div className="flex gap-4">
              <Button className="bg-primary gap-2" onClick={() => setShowCreateDialog(true)}>
                <Plus className="h-4 w-4" /> إنشاء قالب
              </Button>
              <Button variant="outline" className="gap-2 bg-transparent" onClick={handleSync} disabled={isSyncing}>
                <RefreshCcw className={`h-4 w-4 ${isSyncing ? "animate-spin" : ""}`} />
                {isSyncing ? "جاري المزامنة..." : "المزامنة من واتساب"}
              </Button>
              <Button variant="outline" className="gap-2 bg-transparent">
                <ExternalLink className="h-4 w-4" /> الإدارة في مدير واتساب ميتا
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {templates.map((template) => (
              <Card key={template.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold">{template.name}</h3>
                      {getStatusBadge(template.status)}
                      <Badge variant="outline" className="text-xs">
                        {template.language?.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {template.category} {template.template_id ? `• ${template.template_id}` : ""}
                    </p>
                    {template.content && template.content[0] && (
                      <div className="bg-muted/30 p-3 rounded-md text-sm font-sans whitespace-pre-wrap">
                        {template.content[0].text}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    {template.status === "DRAFT" && (
                      <Button
                        size="sm"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white"
                        onClick={() => handleSubmitToMeta(template)}
                        disabled={isSubmittingId === template.id}
                      >
                        {isSubmittingId === template.id ? (
                          <RefreshCcw className="h-3 w-3 ml-1 animate-spin" />
                        ) : (
                          <ExternalLink className="h-3 w-3 ml-1" />
                        )}
                        إرسال لميتا
                      </Button>
                    )}
                    <Button variant="ghost" size="sm">
                      معاينة
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent className="max-w-2xl" dir="rtl">
            <DialogHeader>
              <DialogTitle>إنشاء قالب جديد</DialogTitle>
              <DialogDescription>قم بإنشاء قالب رسالة جديد وإرساله لميتا للموافقة عليه</DialogDescription>
            </DialogHeader>
            <TemplateForm
              onSuccess={() => {
                setShowCreateDialog(false)
                loadTemplates()
              }}
              onCancel={() => setShowCreateDialog(false)}
            />
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}
