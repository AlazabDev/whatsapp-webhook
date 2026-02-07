import { NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const level = searchParams.get("level")
    const category = searchParams.get("category")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "50")

    const supabase = await createSupabaseServerClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    let query = supabase
      .from("system_logs")
      .select("*")
      .order("created_at", { ascending: false })

    if (level) {
      query = query.eq("level", level)
    }

    if (category) {
      query = query.eq("category", category)
    }

    const from = (page - 1) * limit
    const to = from + limit - 1

    const { data: logs, error, count } = await query.range(from, to)

    if (error) throw error

    return NextResponse.json({
      logs: logs || [],
      total: count || 0,
      page,
      limit,
    })
  } catch (error) {
    console.error("[v0] Error fetching logs:", error)
    return NextResponse.json(
      { error: "Failed to fetch logs" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    const body = await request.json()

    const { data, error } = await supabase
      .from("system_logs")
      .insert({
        project_id: body.project_id,
        level: body.level || "info",
        category: body.category,
        message: body.message,
        metadata: body.metadata || {},
        user_id: user?.id,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error("[v0] Error creating log:", error)
    return NextResponse.json(
      { error: "Failed to create log" },
      { status: 500 }
    )
  }
}
