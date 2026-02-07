"use client"

import { Sidebar } from "@/components/dashboard/sidebar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Search, UserPlus, MoreVertical, MessageSquare, Loader2, AlertCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { useContacts } from "@/hooks/use-data"
import { useState } from "react"

export default function ContactsPage() {
  const { contacts, isLoading, error } = useContacts()
  const [searchQuery, setSearchQuery] = useState("")

  const filteredContacts = contacts.filter((contact: any) =>
    contact.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.phone_number?.includes(searchQuery) ||
    contact.email?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">جهات الاتصال</h1>
            <p className="text-sm text-muted-foreground mt-1">إدارة جميع جهات الاتصال المرتبطة بواتساب.</p>
          </div>
          <Button className="gap-2">
            <UserPlus className="h-4 w-4" /> إضافة جهة اتصال
          </Button>
        </div>

        {error && (
          <Card className="mb-6 border-destructive">
            <CardContent className="p-4 flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              <span>حدث خطأ في تحميل جهات الاتصال</span>
            </CardContent>
          </Card>
        )}

        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              className="pr-10"
              placeholder="البحث في جهات الاتصال..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="border rounded-lg bg-card">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">الاسم</TableHead>
                  <TableHead className="text-right">الهاتف</TableHead>
                  <TableHead className="text-right">البريد الإلكتروني</TableHead>
                  <TableHead className="text-right">الحالة</TableHead>
                  <TableHead className="text-left">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredContacts.length > 0 ? (
                  filteredContacts.map((contact: any) => (
                    <TableRow key={contact.id}>
                      <TableCell className="font-medium">{contact.name}</TableCell>
                      <TableCell dir="ltr" className="text-right font-mono text-sm">
                        {contact.phone_number}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{contact.email || "—"}</TableCell>
                      <TableCell>
                        <span className="text-[10px] px-2 py-0.5 rounded font-medium bg-emerald-500/10 text-emerald-500">
                          نشطة
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MessageSquare className="h-4 w-4 text-primary" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-sm text-muted-foreground py-6">
                      {searchQuery ? 'لا توجد نتائج بحث' : 'لا توجد جهات اتصال حالياً'}
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

