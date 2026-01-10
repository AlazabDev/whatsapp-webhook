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

    const whatsappNumberId = request.nextUrl.searchParams.get("whatsappNumberId")

    if (!whatsappNumberId) {
      return NextResponse.json({ error: "whatsappNumberId is required" }, { status: 400 })
    }

    const { data: templates, error } = await supabase
      .from("message_templates")
      .select("*")
      .eq("whatsapp_number_id", whatsappNumberId)
      .eq("is_active", true)
      .order("created_at", { ascending: false })

    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
      data: templates,
    })
  } catch (error) {
    console.error("[v0] Get templates error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
