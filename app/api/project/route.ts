import { NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // الحصول على المشروع الحالي للمستخدم
    const { data: project, error } = await supabase
      .from("projects")
      .select(`
        *,
        owner:users!projects_owner_id_fkey(id, full_name, email),
        members:project_members(
          id,
          role,
          user:users(id, full_name, email, avatar_url)
        )
      `)
      .eq("owner_id", user.id)
      .single()

    if (error) throw error

    return NextResponse.json(project)
  } catch (error) {
    console.error("[v0] Error fetching project:", error)
    return NextResponse.json(
      { error: "Failed to fetch project" },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = await createSupabaseServerClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()

    const { data: project, error } = await supabase
      .from("projects")
      .update({
        name: body.name,
        description: body.description,
        updated_at: new Date().toISOString(),
      })
      .eq("owner_id", user.id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(project)
  } catch (error) {
    console.error("[v0] Error updating project:", error)
    return NextResponse.json(
      { error: "Failed to update project" },
      { status: 500 }
    )
  }
}
