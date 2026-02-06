"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, AlertCircle, BarChart3 } from "lucide-react"
import { getChecklist, getChecklistSummary, printChecklistReport } from "@/lib/quality-checklist"

export function QualityChecklistPage() {
  const checklist = getChecklist()
  const summary = getChecklistSummary()

  const categories = [...new Set(checklist.map(item => item.category))]
  const categoryStats = categories.map(category => {
    const items = checklist.filter(item => item.category === category)
    const passed = items.filter(item => item.passed).length
    return { category, total: items.length, passed }
  })

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">جودة الاختبار</h1>
        <p className="text-muted-foreground mt-2">
          فحص شامل لجميع المكونات والوظائف
        </p>
      </div>

      {/* Summary Card */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-6 w-6" />
            ملخص الاختبار
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">إجمالي الفحوصات</p>
              <p className="text-2xl font-bold">{summary.total}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">نجح</p>
              <p className="text-2xl font-bold text-green-600">{summary.passed}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">فشل</p>
              <p className="text-2xl font-bold text-red-600">{summary.failed}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">نسبة النجاح</p>
              <p className="text-2xl font-bold text-blue-600">{summary.percentage}%</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Stats */}
      <Card>
        <CardHeader>
          <CardTitle>إحصائيات الفئات</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {categoryStats.map(stat => (
              <div key={stat.category} className="p-4 border rounded-lg">
                <p className="font-medium text-sm">{stat.category}</p>
                <p className="text-lg font-bold mt-2">
                  {stat.passed}/{stat.total}
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className={`h-2 rounded-full ${
                      stat.passed === stat.total ? "bg-green-500" : "bg-yellow-500"
                    }`}
                    style={{ width: `${(stat.passed / stat.total) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Checklist */}
      <Card>
        <CardHeader>
          <CardTitle>قائمة الفحص التفصيلية</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categories.map(category => (
              <div key={category}>
                <h3 className="font-semibold text-sm mb-3 text-blue-600">
                  {category}
                </h3>
                <div className="space-y-2 ml-4">
                  {checklist
                    .filter(item => item.category === category)
                    .map(item => (
                      <div
                        key={item.id}
                        className="flex items-start gap-3 p-3 rounded-lg border border-transparent hover:border-gray-200 hover:bg-gray-50"
                      >
                        {item.passed ? (
                          <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm">{item.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {item.details}
                          </p>
                        </div>
                        <span
                          className={`text-xs font-semibold px-2 py-1 rounded flex-shrink-0 ${
                            item.passed
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {item.passed ? "نجح" : "فشل"}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Status */}
      <Card>
        <CardHeader>
          <CardTitle>الحالة النهائية</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            {summary.percentage === 100 ? (
              <>
                <CheckCircle2 className="h-12 w-12 text-green-600" />
                <div>
                  <p className="font-bold text-lg">جميع الفحوصات نجحت</p>
                  <p className="text-sm text-muted-foreground">
                    المشروع جاهز للنشر
                  </p>
                </div>
              </>
            ) : (
              <>
                <AlertCircle className="h-12 w-12 text-yellow-600" />
                <div>
                  <p className="font-bold text-lg">يوجد مشاكل تحتاج إلى اهتمام</p>
                  <p className="text-sm text-muted-foreground">
                    يرجى حل المشاكل المتبقية قبل النشر
                  </p>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
