import { createAdminClient } from "@/lib/supabase/server-admin"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    console.log("[v0] WhatsApp webhook received:", JSON.stringify(body, null, 2))

    // Check if this is a status update or a message
    if (body.entry?.[0]?.changes?.[0]?.value?.statuses) {
      // Handle message status updates (delivered, read, failed)
      return handleStatusUpdate(body)
    }

    if (body.entry?.[0]?.changes?.[0]?.value?.messages) {
      // Handle incoming messages
      return handleIncomingMessage(body)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Webhook error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const mode = request.nextUrl.searchParams.get("hub.mode")
  const token = request.nextUrl.searchParams.get("hub.verify_token")
  const challenge = request.nextUrl.searchParams.get("hub.challenge")

  const verifyToken = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN

  if (mode && token) {
    if (mode === "subscribe" && token === verifyToken) {
      console.log("[v0] Webhook verified successfully")
      return new NextResponse(challenge, { status: 200 })
    }
  }

  return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
}

async function handleIncomingMessage(body: any) {
  const supabase = createAdminClient()
  const messages = body.entry?.[0]?.changes?.[0]?.value?.messages || []
  const contacts = body.entry?.[0]?.changes?.[0]?.value?.contacts || []
  const phoneNumberId = body.entry?.[0]?.changes?.[0]?.value?.metadata?.phone_number_id

  try {
    // Get the WhatsApp number from database
    const { data: waNumber } = await supabase
      .from("whatsapp_numbers")
      .select("*")
      .eq("phone_number_id", phoneNumberId)
      .single()

    if (!waNumber) {
      console.log("[v0] WhatsApp number not found:", phoneNumberId)
      return NextResponse.json({ success: true })
    }

    // Process each message
    for (const message of messages) {
      const contact = contacts.find((c: any) => c.wa_id === message.from)

      // Insert or update contact
      const { data: existingContact } = await supabase
        .from("contacts")
        .select("id")
        .eq("wa_id", message.from)
        .eq("whatsapp_number_id", waNumber.id)
        .single()

      if (!existingContact) {
        await supabase.from("contacts").insert({
          wa_id: message.from,
          name: contact?.profile?.name || `Contact ${message.from}`,
          whatsapp_number_id: waNumber.id,
          project_id: waNumber.project_id,
          status: "active",
        })
      }

      // Insert message
      let messageBody = ""
      const messageType = message.type

      if (message.type === "text") {
        messageBody = message.text.body
      } else if (message.type === "image") {
        messageBody = `[Image: ${message.image.id}]`
      } else if (message.type === "document") {
        messageBody = `[Document: ${message.document.filename}]`
      } else if (message.type === "audio") {
        messageBody = "[Audio message]"
      } else if (message.type === "video") {
        messageBody = "[Video message]"
      }

      await supabase.from("messages").insert({
        whatsapp_message_id: message.id,
        whatsapp_number_id: waNumber.id,
        contact_id: existingContact?.id || message.from,
        type: messageType,
        body: messageBody,
        direction: "incoming",
        status: "received",
        from_phone_id: message.from,
        to_phone_id: waNumber.phone_number_id,
        timestamp: new Date(Number.parseInt(message.timestamp) * 1000),
        metadata: {
          raw: message,
        },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error processing incoming message:", error)
    return NextResponse.json({ success: true }) // Return 200 to avoid retry
  }
}

async function handleStatusUpdate(body: any) {
  const supabase = createAdminClient()
  const statuses = body.entry?.[0]?.changes?.[0]?.value?.statuses || []

  try {
    for (const status of statuses) {
      await supabase
        .from("messages")
        .update({
          status: status.status,
          ...(status.status === "read" && { read_at: new Date() }),
        })
        .eq("whatsapp_message_id", status.id)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error processing status update:", error)
    return NextResponse.json({ success: true })
  }
}
