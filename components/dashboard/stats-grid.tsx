import { Card, CardContent } from "@/components/ui/card"

interface StatsGridProps {
  stats: {
    totalMessages: number
    totalContacts: number
    successRate: number
    activeConversations: number
  }
}

export function StatsGrid({ stats }: StatsGridProps) {
  const statItems = [
    {
      label: "إجمالي الرسائل",
      value: stats.totalMessages.toLocaleString("ar-EG"),
      icon: "💬",
      color: "bg-blue-50",
    },
    {
      label: "جهات الاتصال",
      value: stats.totalContacts.toLocaleString("ar-EG"),
      icon: "👥",
      color: "bg-green-50",
    },
    {
      label: "معدل النجاح",
      value: `${stats.successRate}%`,
      icon: "✓",
      color: "bg-amber-50",
    },
    {
      label: "المحادثات النشطة",
      value: stats.activeConversations.toLocaleString("ar-EG"),
      icon: "💭",
      color: "bg-purple-50",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statItems.map((item) => (
        <Card key={item.label} className={item.color}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">{item.label}</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{item.value}</p>
              </div>
              <span className="text-3xl">{item.icon}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
