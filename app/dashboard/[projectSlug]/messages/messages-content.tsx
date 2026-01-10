"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { sendMessage, getContacts, getMessages } from "@/lib/whatsapp/client"
import { useSearchParams } from "next/navigation"

export default function MessagesPageContent() {
  const searchParams = useSearchParams()
  const whatsappNumberId = searchParams.get("whatsappNumberId")

  const [contacts, setContacts] = useState<any[]>([])
  const [selectedContact, setSelectedContact] = useState<string | null>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [messageText, setMessageText] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadContacts = async (waNumberId: string) => {
    try {
      const data = await getContacts(waNumberId)
      setContacts(data.data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "فشل تحميل جهات الاتصال")
    }
  }

  const loadMessages = async (contactId: string) => {
    try {
      const data = await getMessages(contactId)
      setMessages(data.data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "فشل تحميل الرسائل")
    }
  }

  useEffect(() => {
    if (whatsappNumberId) {
      loadContacts(whatsappNumberId)
    }
  }, [whatsappNumberId])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedContact || !messageText.trim() || !whatsappNumberId) return

    setIsLoading(true)
    setError(null)

    try {
      await sendMessage(whatsappNumberId, selectedContact, messageText)
      setMessageText("")
      await loadMessages(selectedContact)
    } catch (err) {
      setError(err instanceof Error ? err.message : "فشل إرسال الرسالة")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">الرسائل</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">جهات الاتصال</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {contacts.length === 0 ? (
                  <p className="text-sm text-slate-500 text-center py-4">لا توجد جهات اتصال</p>
                ) : (
                  contacts.map((contact) => (
                    <button
                      key={contact.id}
                      onClick={() => {
                        setSelectedContact(contact.id)
                        loadMessages(contact.id)
                      }}
                      className={`w-full text-right p-3 rounded-lg border transition ${
                        selectedContact === contact.id
                          ? "bg-blue-50 border-blue-300"
                          : "border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      <p className="font-semibold text-sm">{contact.name}</p>
                      <p className="text-xs text-slate-500">{contact.wa_id}</p>
                    </button>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <div className="lg:col-span-3 space-y-6">
            {selectedContact ? (
              <>
                <Card className="h-96 overflow-y-auto">
                  <CardContent className="pt-6 space-y-4">
                    {messages.length === 0 ? (
                      <p className="text-center text-slate-500">لا توجد رسائل بعد</p>
                    ) : (
                      messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${msg.direction === "outgoing" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-xs px-4 py-2 rounded-lg ${
                              msg.direction === "outgoing" ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-900"
                            }`}
                          >
                            <p className="text-sm">{msg.body}</p>
                            <p className="text-xs opacity-70 mt-1">
                              {new Date(msg.created_at).toLocaleTimeString("ar-EG")}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <form onSubmit={handleSendMessage} className="space-y-4">
                      <Textarea
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        placeholder="اكتب الرسالة..."
                        rows={3}
                      />
                      {error && <p className="text-sm text-red-600">{error}</p>}
                      <Button type="submit" disabled={isLoading} className="w-full">
                        {isLoading ? "جاري الإرسال..." : "إرسال الرسالة"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card>
                <CardContent className="pt-6 text-center text-slate-500 py-12">اختر جهة اتصال لبدء محادثة</CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
