import { createSupabaseServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { logError, logInfo, logWarn, UnauthorizedError, ValidationError } from "@/lib/errors"

export async function GET() {
  try {
    logInfo("API:GET /api/messages", "Fetching messages")
    
    const supabase = await createSupabaseServerClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      logWarn("API:GET /api/messages", "Unauthorized access")
      throw new UnauthorizedError()
    }

    const { data: messages, error: messagesError } = await supabase
      .from("messages")
      .select("id, to, body, status, created_at")
      .eq("project_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50)

    const { count: totalMessages } = await supabase
      .from("messages")
      .select("*", { count: "exact", head: true })
      .eq("project_id", user.id)

    if (messagesError) throw messagesError

    logInfo("API:GET /api/messages", `Retrieved ${messages?.length || 0} messages`)

    return NextResponse.json({
      messages,
      total: totalMessages,
    })
  } catch (error) {
    logError("API:GET /api/messages", error)
    
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode })
    }
    
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validation
    if (!body.to || !body.body) {
      throw new ValidationError("Recipient and message body are required")
    }

    const supabase = await createSupabaseServerClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      throw new UnauthorizedError()
    }

    logInfo("API:POST /api/messages", `Creating message for user ${user.id}`)

    const { data, error } = await supabase
      .from("messages")
      .insert({
        project_id: user.id,
        to: body.to,
        body: body.body,
        status: "pending",
      })
      .select()

    if (error) throw error

    logInfo("API:POST /api/messages", "Message created successfully")

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    logError("API:POST /api/messages", error)
    
    if (error instanceof ValidationError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode })
    }
    
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode })
    }
    
    return NextResponse.json(
      { error: "Failed to create message" },
      { status: 500 }
    )
  }
}

