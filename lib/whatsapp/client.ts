/**
 * WhatsApp client for sending messages and managing conversations
 */

export async function sendMessage(
  whatsappNumberId: string,
  recipientPhone: string,
  message: string,
  messageType: "text" | "template" = "text",
  templateParams?: string[],
) {
  try {
    const response = await fetch("/api/whatsapp/send-message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        whatsappNumberId,
        recipientPhone,
        message,
        messageType,
        templateParams,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Failed to send message")
    }

    return await response.json()
  } catch (error) {
    console.error("[v0] Send message error:", error)
    throw error
  }
}

export async function getContacts(whatsappNumberId: string) {
  try {
    const response = await fetch(`/api/whatsapp/get-contacts?whatsappNumberId=${whatsappNumberId}`)

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Failed to get contacts")
    }

    return await response.json()
  } catch (error) {
    console.error("[v0] Get contacts error:", error)
    throw error
  }
}

export async function getMessages(contactId: string, limit = 50) {
  try {
    const response = await fetch(`/api/whatsapp/get-messages?contactId=${contactId}&limit=${limit}`)

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Failed to get messages")
    }

    return await response.json()
  } catch (error) {
    console.error("[v0] Get messages error:", error)
    throw error
  }
}

export function formatPhoneNumber(phone: string): string {
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, "")
  // Add +20 if it's Egyptian number
  if (cleaned.startsWith("0") && cleaned.length === 11) {
    return "2" + cleaned.substring(1)
  }
  return cleaned
}
