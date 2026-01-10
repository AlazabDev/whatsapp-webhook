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

    const contactId = request.nextUrl.searchParams.get("contactId")
    const limit = Number.parseInt(request.nextUrl.searchParams.get("limit") || "50")

    if (!contactId) {
      return NextResponse.json({ error: "contactId is required" }, { status: 400 })
    }

    // Get messages
    const { data: messages, error } = await supabase
      .from("messages")
      .select("*")
      .eq("contact_id", contactId)
      .order("created_at", { ascending: false })
      .limit(limit)

    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
      data: messages.reverse(), // Return in chronological order
    })
  } catch (error) {
    console.error("[v0] Get messages error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
