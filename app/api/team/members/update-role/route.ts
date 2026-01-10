import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { memberId, role } = body

    const { data: member, error } = await supabase
      .from("project_members")
      .update({ role })
      .eq("id", memberId)
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
      data: member,
    })
  } catch (error) {
    console.error("[v0] Update role error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
