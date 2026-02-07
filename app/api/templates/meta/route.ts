import { NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase/server"

// Submit template to Meta for review
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const supabase = await createSupabaseServerClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const {
      name,
      category,
      language,
      body: templateBody,
      header,
      footer,
      buttons,
      phoneNumberId
    } = body

    // Get WhatsApp access token
    const accessToken = process.env.WHATSAPP_ACCESS_TOKEN
    if (!accessToken) {
      return NextResponse.json({ error: "WhatsApp access token not configured" }, { status: 500 })
    }

    // Prepare Meta API request
    const metaPayload: any = {
      name,
      category,
      language,
      components: []
    }

    // Add header if exists
    if (header) {
      metaPayload.components.push({
        type: "HEADER",
        format: "TEXT",
        text: header
      })
    }

    // Add body
    metaPayload.components.push({
      type: "BODY",
      text: templateBody
    })

    // Add footer if exists
    if (footer) {
      metaPayload.components.push({
        type: "FOOTER",
        text: footer
      })
    }

    // Add buttons if exist
    if (buttons && buttons.length > 0) {
      metaPayload.components.push({
        type: "BUTTONS",
        buttons: buttons.map((btn: any) => {
          if (btn.type === "URL") {
            return {
              type: "URL",
              text: btn.text,
              url: btn.url
            }
          } else if (btn.type === "QUICK_REPLY") {
            return {
              type: "QUICK_REPLY",
              text: btn.text
            }
          }
          return btn
        })
      })
    }

    // Send to Meta API
    const metaResponse = await fetch(
      `https://graph.facebook.com/v21.0/${phoneNumberId}/message_templates`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(metaPayload)
      }
    )

    const metaData = await metaResponse.json()

    if (!metaResponse.ok) {
      return NextResponse.json({ 
        error: "Failed to submit template to Meta",
        details: metaData
      }, { status: metaResponse.status })
    }

    // Save to database
    const { data: template, error: dbError } = await supabase
      .from("message_templates")
      .insert({
        project_id: user.id,
        name,
        category,
        language,
        body: templateBody,
        header,
        footer,
        buttons,
        status: "pending",
        meta_template_id: metaData.id,
        channel: "whatsapp"
      })
      .select()
      .single()

    if (dbError) {
      console.error("Database error:", dbError)
      return NextResponse.json({ error: "Failed to save template" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      template,
      metaResponse: metaData
    })

  } catch (error) {
    console.error("Error submitting template:", error)
    return NextResponse.json({ 
      error: "Internal server error",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}

// Get template status from Meta
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const templateId = searchParams.get("template_id")
    const phoneNumberId = searchParams.get("phone_number_id")

    if (!templateId || !phoneNumberId) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 })
    }

    const accessToken = process.env.WHATSAPP_ACCESS_TOKEN
    if (!accessToken) {
      return NextResponse.json({ error: "Access token not configured" }, { status: 500 })
    }

    const metaResponse = await fetch(
      `https://graph.facebook.com/v21.0/${phoneNumberId}/message_templates?name=${templateId}`,
      {
        headers: {
          "Authorization": `Bearer ${accessToken}`
        }
      }
    )

    const metaData = await metaResponse.json()

    return NextResponse.json(metaData)

  } catch (error) {
    console.error("Error fetching template status:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
