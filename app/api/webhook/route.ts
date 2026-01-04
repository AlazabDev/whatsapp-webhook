import { NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase"
import { AIService } from "@/lib/ai-service"
import { sendWhatsAppMessage } from "@/lib/whatsapp"

const VERIFY_TOKEN = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const mode = searchParams.get("hub.mode")
  const token = searchParams.get("hub.verify_token")
  const challenge = searchParams.get("hub.challenge")

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("[v0] Webhook Verified")
    return new Response(challenge, { status: 200 })
  }

  return new Response("Forbidden", { status: 403 })
}

export async function POST(request: Request) {
  const body = await request.json()
  const supabase = getSupabaseAdmin()

  // Handle incoming messages
  const entry = body.entry?.[0]
  const changes = entry?.changes?.[0]
  const value = changes?.value
  const messages = value?.messages

  if (messages?.[0]) {
    const msg = messages[0]
    const contact = value.contacts?.[0]

    const whatsappPhoneNumberId = value.metadata?.phone_number_id

    // 1. Upsert Contact
    const { data: contactData } = await supabase
      .from("contacts")
      .upsert({ wa_id: msg.from, name: contact?.profile?.name }, { onConflict: "wa_id" })
      .select()
      .single()

    // Fetch the WhatsApp number record to get the associated project
    const { data: waNumberRecord } = await supabase
      .from("whatsapp_numbers")
      .select("*, project:project_id(*)")
      .eq("phone_number_id", whatsappPhoneNumberId)
      .single()

    // 3. Save Incoming Message
    if (contactData) {
      await supabase.from("messages").insert({
        whatsapp_message_id: msg.id,
        contact_id: contactData.id,
        whatsapp_number_id: waNumberRecord?.id,
        type: msg.type,
        direction: "inbound",
        body: msg.text?.body || "",
        metadata: msg,
      })
    }

    // AI Auto-Reply Logic (Integrated with Projects and AI SDK)
    if (waNumberRecord?.project_id && msg.text?.body) {
      try {
        // Load AI Service configured for this specific project
        const aiService = await AIService.fromProjectId(waNumberRecord.project_id)

        if (aiService) {
          console.log(`[v0] AI Chatbot active for project: ${waNumberRecord.project_id}`)

          // Get recent conversation history (last 10 messages) for better context
          const { data: history } = await supabase
            .from("messages")
            .select("body, direction")
            .eq("contact_id", contactData.id)
            .order("created_at", { ascending: false })
            .limit(10)

          const conversation =
            history
              ?.reverse()
              .map((m) => ({
                role: m.direction === "inbound" ? ("user" as const) : ("assistant" as const),
                content: m.body || "",
              }))
              .filter((m) => m.content.trim() !== "") || []

          // Generate response using Vercel AI SDK
          const responseText = await aiService.generateResponse(conversation)

          if (responseText && whatsappPhoneNumberId) {
            // Send back to WhatsApp
            await sendWhatsAppMessage(whatsappPhoneNumberId, msg.from, responseText)

            // Log the AI response in our database
            await supabase.from("messages").insert({
              contact_id: contactData.id,
              whatsapp_number_id: waNumberRecord.id,
              type: "text",
              direction: "outbound",
              body: responseText,
              metadata: { ai_generated: true, model_used: "ai-sdk" },
            })
          }
        }
      } catch (error) {
        console.error("[v0] AI Auto-Reply failed:", error)
      }
    }
  }

  return NextResponse.json({ status: "ok" })
}
