"use client"

import { Sidebar } from "@/components/dashboard/sidebar"
import { SendMessageForm } from "@/components/forms/send-message-form"
import { useMessages } from "@/hooks/use-data"
import { useState } from "react"

export default function SendMessagePage() {
  const { mutate } = useMessages()
  const [success, setSuccess] = useState(false)

  const handleSuccess = () => {
    setSuccess(true)
    mutate()
    setTimeout(() => setSuccess(false), 3000)
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">إرسال رسالة</h1>
            <p className="text-muted-foreground">أرسل رسالة واتساب جديدة إلى أحد جهات الاتصال</p>
          </div>

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
              تم إرسال الرسالة بنجاح
            </div>
          )}

          <SendMessageForm onSuccess={handleSuccess} />
        </div>
      </main>
    </div>
  )
}
