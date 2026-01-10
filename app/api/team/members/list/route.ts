import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const projectId = request.nextUrl.searchParams.get("projectId")

    if (!projectId) {
      return NextResponse.json({ error: "projectId is required" }, { status: 400 })
    }

    // Get project members with user details
    const { data: members, error } = await supabase
      .from("project_members")
      .select(
        `
        id,
        role,
        created_at,
        user_id,
        users!inner(id, email, full_name, avatar_url)
      `,
      )
      .eq("project_id", projectId)

    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
      data: members,
    })
  } catch (error) {
    console.error("[v0] Get members error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
