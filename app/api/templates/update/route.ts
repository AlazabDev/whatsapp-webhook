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
    const { templateId, ...updateData } = body

    const { data: template, error } = await supabase
      .from("message_templates")
      .update({
        ...updateData,
        updated_at: new Date(),
      })
      .eq("id", templateId)
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
      data: template,
    })
  } catch (error) {
    console.error("[v0] Update template error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
