"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle, Loader2, CheckCircle2 } from "lucide-react"
import { useMessages } from "@/hooks/use-data"

export function SendMessageForm({ onSuccess }: { onSuccess?: () => void }) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const { mutate } = useMessages()
  
  const [formData, setFormData] = useState({
    to: "",
    body: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to send message")
      }

      await response.json()
      
      // Reset form and show success
      setFormData({ to: "", body: "" })
      setSuccess(true)
      
      // Revalidate messages list
      await mutate()
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000)
      
      onSuccess?.()
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "An error occurred"
      setError(errorMsg)
      console.error("[SendMessageForm]", errorMsg)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>إرسال رسالة جديدة</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-800">
              <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm">تم إرسال الرسالة بنجاح</span>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="to">الهاتف المستقبل *</Label>
            <Input
              id="to"
              type="tel"
              placeholder="201234567890"
              value={formData.to}
              onChange={(e) => setFormData({ ...formData, to: e.target.value })}
              required
              disabled={isLoading}
              pattern="[0-9+]+"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="body">محتوى الرسالة *</Label>
            <Textarea
              id="body"
              placeholder="أكتب رسالتك هنا..."
              value={formData.body}
              onChange={(e) => setFormData({ ...formData, body: e.target.value })}
              rows={4}
              required
              disabled={isLoading}
              minLength={1}
              maxLength={1000}
            />
            <p className="text-xs text-muted-foreground">{formData.body.length}/1000</p>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading || !formData.to || !formData.body}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin ml-2" />
                جاري الإرسال...
              </>
            ) : (
              "إرسال الرسالة"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
