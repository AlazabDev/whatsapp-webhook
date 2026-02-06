"use client"

import { Sidebar } from "@/components/dashboard/sidebar"
import { AddContactForm } from "@/components/forms/add-contact-form"
import { useContacts } from "@/hooks/use-data"
import { useState } from "react"

export default function AddContactPage() {
  const { mutate } = useContacts()
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
            <h1 className="text-3xl font-bold mb-2">إضافة جهة اتصال</h1>
            <p className="text-muted-foreground">أضف جهة اتصال جديدة إلى نظامك</p>
          </div>

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
              تمت إضافة جهة الاتصال بنجاح
            </div>
          )}

          <AddContactForm onSuccess={handleSuccess} />
        </div>
      </main>
    </div>
  )
}
