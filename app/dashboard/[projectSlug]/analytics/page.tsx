import { createClient } from "@/lib/supabase/server"
import { StatsGrid } from "@/components/dashboard/stats-grid"
import { MessageStatsChart } from "@/components/charts/message-stats-chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface PageProps {
  params: Promise<{ projectSlug: string }>
}

export default async function AnalyticsPage({ params }: PageProps) {
  const { projectSlug } = await params
  const supabase = await createClient()

  const { data: project } = await supabase.from("projects").select("id").eq("slug", projectSlug).single()

  if (!project) {
    return <div className="p-6">المشروع غير موجود</div>
  }

  // Fetch analytics data
  const { data: analytics } = await supabase
    .from("message_analytics")
    .select("*")
    .eq("project_id", project.id)
    .order("date", { ascending: false })
    .limit(30)

  // Fetch messages and contacts count
  const { count: totalMessages } = await supabase
    .from("messages")
    .select("*", { count: "exact" })
    .eq("project_id", project.id)

  const { count: totalContacts } = await supabase
    .from("contacts")
    .select("*", { count: "exact" })
    .eq("project_id", project.id)

  // Calculate success rate
  const successfulMessages = analytics?.reduce((sum, a) => sum + a.successful_deliveries, 0) || 0
  const failedMessages = analytics?.reduce((sum, a) => sum + a.failed_deliveries, 0) || 0
  const successRate =
    successfulMessages + failedMessages > 0
      ? Math.round((successfulMessages / (successfulMessages + failedMessages)) * 100)
      : 0

  // Format chart data
  const chartData = analytics?.map((a) => ({
    date: new Date(a.date).toLocaleDateString("ar-EG"),
    sent: a.total_messages_sent,
    received: a.total_messages_received,
    delivered: a.successful_deliveries,
    read: a.read_messages,
  }))

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">الإحصائيات والتحليلات</h1>
          <p className="text-slate-600">عرض أداء رسائلك وإحصائيات المحادثات</p>
        </div>

        <StatsGrid
          stats={{
            totalMessages: totalMessages || 0,
            totalContacts: totalContacts || 0,
            successRate,
            activeConversations: totalContacts || 0,
          }}
        />

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>الرسائل على مدار الوقت</CardTitle>
          </CardHeader>
          <CardContent>
            {chartData && chartData.length > 0 ? (
              <MessageStatsChart data={chartData} />
            ) : (
              <div className="text-center py-12 text-slate-500">لا توجد بيانات متاحة حتى الآن</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
