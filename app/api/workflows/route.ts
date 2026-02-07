import { NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const is_active = searchParams.get("is_active")

    const supabase = await createSupabaseServerClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    let query = supabase
      .from("workflows")
      .select(`
        *,
        steps:workflow_steps(*)
      `)
      .order("created_at", { ascending: false })

    if (is_active !== null) {
      query = query.eq("is_active", is_active === "true")
    }

    const { data: workflows, error } = await query

    if (error) throw error

    return NextResponse.json({
      workflows: workflows || [],
      total: workflows?.length || 0,
    })
  } catch (error) {
    console.error("[v0] Error fetching workflows:", error)
    return NextResponse.json(
      { error: "Failed to fetch workflows" },
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

    // إنشاء Workflow
    const { data: workflow, error: workflowError } = await supabase
      .from("workflows")
      .insert({
        project_id: body.project_id,
        name: body.name,
        description: body.description,
        trigger_type: body.trigger_type,
        is_active: body.is_active ?? true,
      })
      .select()
      .single()

    if (workflowError) throw workflowError

    // إضافة الخطوات
    if (body.steps && body.steps.length > 0) {
      const steps = body.steps.map((step: any, index: number) => ({
        workflow_id: workflow.id,
        step_order: index + 1,
        action_type: step.action_type,
        config: step.config,
      }))

      const { error: stepsError } = await supabase
        .from("workflow_steps")
        .insert(steps)

      if (stepsError) throw stepsError
    }

    return NextResponse.json(workflow, { status: 201 })
  } catch (error) {
    console.error("[v0] Error creating workflow:", error)
    return NextResponse.json(
      { error: "Failed to create workflow" },
      { status: 500 }
    )
  }
}
