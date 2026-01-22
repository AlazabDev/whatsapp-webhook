import Link from "next/link"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageSquare, MessageCircle, Image, Users, PhoneCall, Megaphone } from "lucide-react"

const dataSections = [
  {
    title: "المحادثات",
    description: "سجل المحادثات والحوارات بين فريقك والعملاء.",
    href: "/data/chats",
    icon: MessageSquare,
  },
  {
    title: "الرسائل",
    description: "تفاصيل الرسائل النصية الواردة والصادرة مع الحالات.",
    href: "/data/messages",
    icon: MessageCircle,
  },
  {
    title: "الإعلام",
    description: "ملفات الوسائط المرسلة والمستلمة بما فيها الصور والمستندات.",
    href: "/data/media",
    icon: Image,
  },
  {
    title: "جهات الاتصال",
    description: "قائمة العملاء وجهات الاتصال المرتبطة بحساب واتساب.",
    href: "/data/contacts",
    icon: Users,
  },
  {
    title: "النداءات",
    description: "سجل المكالمات الصوتية وحالاتها داخل النظام.",
    href: "/data/calls",
    icon: PhoneCall,
  },
  {
    title: "إعلانات (CTWA)",
    description: "حملات Click to WhatsApp وتتبع أدائها.",
    href: "/data/ads",
    icon: Megaphone,
  },
]

export default function DataOverviewPage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">البيانات</h1>
          <p className="text-sm text-muted-foreground mt-1">استعرض بيانات واتساب التفصيلية من مكان واحد.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {dataSections.map((section) => (
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
                  <Link href={section.href}>فتح القسم</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
