import { NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const assigned_to = searchParams.get("assigned_to")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")

    const supabase = await createSupabaseServerClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    let query = supabase
      .from("conversations")
      .select(`
        *,
        contact:contacts(id, name, wa_id, profile_picture_url),
        whatsapp_number:whatsapp_numbers(id, display_phone_number),
        assigned_user:users!conversations_assigned_to_fkey(id, full_name, avatar_url)
      `)
      .order("last_message_at", { ascending: false, nullsFirst: false })

    if (status) {
      query = query.eq("status", status)
    }

    if (assigned_to) {
      query = query.eq("assigned_to", assigned_to)
    }

    const from = (page - 1) * limit
    const to = from + limit - 1

    const { data: conversations, error, count } = await query
      .range(from, to)

    if (error) throw error

    return NextResponse.json({
      conversations: conversations || [],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    })
  } catch (error) {
    console.error("[v0] Error fetching conversations:", error)
    return NextResponse.json(
      { error: "Failed to fetch conversations" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServerClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()

    const { data, error } = await supabase
      .from("conversations")
      .insert({
        project_id: body.project_id,
        contact_id: body.contact_id,
        whatsapp_number_id: body.whatsapp_number_id,
        status: body.status || "open",
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error("[v0] Error creating conversation:", error)
    return NextResponse.json(
      { error: "Failed to create conversation" },
      { status: 500 }
    )
  }
}
