import { createSupabaseServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { logError, logInfo, UnauthorizedError, ValidationError } from "@/lib/errors"

export async function GET() {
  try {
    logInfo("API:GET /api/contacts", "Fetching contacts")
    
    const supabase = await createSupabaseServerClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      logWarn("API:GET /api/contacts", "Unauthorized access")
      throw new UnauthorizedError()
    }

    const { data: contacts, error: contactsError } = await supabase
      .from("contacts")
      .select("id, name, phone_number, email, status")
      .eq("project_id", user.id)
      .limit(50)

    const { count: totalContacts } = await supabase
      .from("contacts")
      .select("*", { count: "exact", head: true })
      .eq("project_id", user.id)

    if (contactsError) throw contactsError

    logInfo("API:GET /api/contacts", `Retrieved ${contacts?.length || 0} contacts`)

    return NextResponse.json({
      contacts,
      total: totalContacts,
    })
  } catch (error) {
    logError("API:GET /api/contacts", error)
    
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode })
    }
    
    return NextResponse.json(
      { error: "Failed to fetch contacts" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validation
    if (!body.name || !body.phone_number) {
      throw new ValidationError("Name and phone number are required")
    }

    const supabase = await createSupabaseServerClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      throw new UnauthorizedError()
    }

    logInfo("API:POST /api/contacts", `Creating contact for user ${user.id}`)

    const { data, error } = await supabase
      .from("contacts")
      .insert({
        project_id: user.id,
        name: body.name,
        phone_number: body.phone_number,
        email: body.email,
        status: "active",
      })
      .select()

    if (error) throw error

    logInfo("API:POST /api/contacts", "Contact created successfully")

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    logError("API:POST /api/contacts", error)
    
    if (error instanceof ValidationError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode })
    }
    
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode })
    }
    
    return NextResponse.json(
      { error: "Failed to create contact" },
      { status: 500 }
    )
  }
}

import { logWarn } from "@/lib/errors"

