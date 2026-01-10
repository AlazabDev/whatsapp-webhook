import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

interface InviteMemberRequest {
  projectId: string
  email: string
  role: "admin" | "member" | "viewer"
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = (await request.json()) as InviteMemberRequest

    // Get user by email
    const { data: userData, error: userError } = await supabase.auth.admin.listUsers()

    const invitedUser = userData?.users?.find((u) => u.email === body.email)

    if (!invitedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Add member to project
    const { data: member, error: memberError } = await supabase
      .from("project_members")
      .insert({
        project_id: body.projectId,
        user_id: invitedUser.id,
        role: body.role,
      })
      .select()
      .single()

    if (memberError) {
      if (memberError.code === "23505") {
        return NextResponse.json({ error: "User is already a member" }, { status: 409 })
      }
      throw memberError
    }

    return NextResponse.json({
      success: true,
      data: member,
    })
  } catch (error) {
    console.error("[v0] Invite member error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
