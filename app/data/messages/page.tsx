"use client"

import { Sidebar } from "@/components/dashboard/sidebar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Search, Download, Filter, Loader2, AlertCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { useMessages } from "@/hooks/use-data"
import { useState } from "react"

export default function MessagesPage() {
  const { messages, isLoading, error } = useMessages()
  const [searchQuery, setSearchQuery] = useState("")

  const filteredMessages = messages.filter((msg: any) =>
    msg.body?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    msg.to?.includes(searchQuery)
  )

  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">الرسائل</h1>
            <p className="text-sm text-muted-foreground mt-1">سجل كامل بجميع الرسائل المرسلة والمستقبلة.</p>
          </div>
          <Button variant="outline" className="gap-2 bg-transparent">
            <Download className="h-4 w-4" /> تصدير السجل
          </Button>
        </div>

        {error && (
          <Card className="mb-6 border-destructive">
            <CardContent className="p-4 flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              <span>حدث خطأ في تحميل الرسائل</span>
            </CardContent>
          </Card>
        )}

        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              className="pr-10"
              placeholder="البحث في الرسائل..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" className="gap-2 bg-transparent">
            <Filter className="h-4 w-4" /> تصفية
          </Button>
        </div>

        <div className="border rounded-lg bg-card overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">إلى</TableHead>
                  <TableHead className="text-right">المحتوى</TableHead>
                  <TableHead className="text-right">الحالة</TableHead>
                  <TableHead className="text-right">الوقت</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMessages.length > 0 ? (
                  filteredMessages.map((msg: any) => (
                    <TableRow key={msg.id}>
                      <TableCell className="font-mono text-sm">{msg.to}</TableCell>
                      <TableCell className="text-sm max-w-xs truncate">{msg.body || "—"}</TableCell>
                      <TableCell>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                          msg.status === 'sent' ? 'bg-green-100 text-green-800' :
                          msg.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {msg.status === 'sent' ? 'مرسلة' : msg.status === 'pending' ? 'قيد الانتظار' : 'فشل'}
                        </span>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {new Date(msg.created_at).toLocaleString('ar-EG')}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-sm text-muted-foreground py-6">
                      {searchQuery ? 'لا توجد نتائج بحث' : 'لا توجد رسائل بعد'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </main>
    </div>
  )
}

