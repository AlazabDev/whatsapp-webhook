import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

interface CreateTemplateRequest {
  projectId: string
  whatsappNumberId: string
  name: string
  category: string
  language: string
  content: any
  variables?: string[]
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

    const body = (await request.json()) as CreateTemplateRequest

    // Verify user has access to this project
    const { data: project, error: projectError } = await supabase
      .from("projects")
      .select("*")
      .eq("id", body.projectId)
      .single()

    if (projectError || !project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    // Create template
    const { data: template, error: templateError } = await supabase
      .from("message_templates")
      .insert({
        project_id: body.projectId,
        whatsapp_number_id: body.whatsappNumberId,
        name: body.name,
        category: body.category,
        language: body.language,
        content: body.content,
        variables: body.variables || [],
        created_by: user.id,
        status: "pending",
        is_active: true,
      })
      .select()
      .single()

    if (templateError) {
      console.error("[v0] Template creation error:", templateError)
      return NextResponse.json({ error: "Failed to create template" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: template,
    })
  } catch (error) {
    console.error("[v0] Create template error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
