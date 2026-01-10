import { createAdminClient } from "@/lib/supabase/server-admin"
import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

interface SendMessageRequest {
  whatsappNumberId: string
  recipientPhone: string
  message: string
  messageType?: "text" | "template"
  templateParams?: string[]
}

export async function POST(request: NextRequest) {
  try {
    // Verify user is authenticated
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = (await request.json()) as SendMessageRequest
    const { whatsappNumberId, recipientPhone, message, messageType = "text", templateParams } = body

    // Verify user has access to this WhatsApp number
    const { data: waNumber, error: waNumberError } = await supabase
      .from("whatsapp_numbers")
      .select("*")
      .eq("id", whatsappNumberId)
      .single()

    if (waNumberError || !waNumber) {
      return NextResponse.json({ error: "WhatsApp number not found" }, { status: 404 })
    }

    const response = await fetch(`https://graph.instagram.com/${process.env.WHATSAPP_API_VERSION}/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${waNumber.access_token || process.env.WHATSAPP_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: recipientPhone,
        type: messageType,
        ...(messageType === "text"
          ? {
              text: { body: message },
            }
          : {
              template: {
                name: message,
                language: { code: "en_US" },
                ...(templateParams && {
                  components: [
                    {
                      type: "body",
                      parameters: templateParams.map((param) => ({
                        type: "text",
                        text: param,
                      })),
                    },
                  ],
                }),
              },
            }),
      }),
    })

    const responseData = await response.json()

    if (!response.ok) {
      console.error("[v0] WhatsApp API error:", responseData)
      return NextResponse.json({ error: "Failed to send message", details: responseData }, { status: response.status })
    }

    // Store message in database
    const adminSupabase = createAdminClient()
    await adminSupabase.from("messages").insert({
      whatsapp_message_id: responseData.messages?.[0]?.id,
      whatsapp_number_id: whatsappNumberId,
      type: messageType,
      body: messageType === "text" ? message : `Template: ${message}`,
      direction: "outgoing",
      status: "sent",
      to_phone_id: recipientPhone,
      from_phone_id: waNumber.display_phone_number,
      timestamp: new Date(),
      metadata: {
        response: responseData,
        request: { messageType, templateParams },
      },
    })

    return NextResponse.json({
      success: true,
      messageId: responseData.messages?.[0]?.id,
    })
  } catch (error) {
    console.error("[v0] Send message error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
