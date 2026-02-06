import { createSupabaseServerClient } from "@/lib/supabase/server"

export async function getProjectUser() {
  const supabase = await createSupabaseServerClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    return null
  }

  return user
}

export async function createContact(data: {
  name: string
  phone_number: string
  email?: string
  project_id: string
}) {
  const supabase = await createSupabaseServerClient()

  const { data: contact, error } = await supabase
    .from("contacts")
    .insert({
      name: data.name,
      phone_number: data.phone_number,
      email: data.email,
      project_id: data.project_id,
      status: "active",
    })
    .select()
    .single()

  if (error) throw error
  return contact
}

export async function createMessage(data: {
  to: string
  body: string
  project_id: string
}) {
  const supabase = await createSupabaseServerClient()

  const { data: message, error } = await supabase
    .from("messages")
    .insert({
      to: data.to,
      body: data.body,
      project_id: data.project_id,
      status: "pending",
    })
    .select()
    .single()

  if (error) throw error
  return message
}

export async function addPhoneNumber(data: {
  phone_number: string
  name: string
  type: "connected" | "digital" | "sandbox"
  project_id: string
}) {
  const supabase = await createSupabaseServerClient()

  const { data: number, error } = await supabase
    .from("whatsapp_numbers")
    .insert({
      phone_number: data.phone_number,
      name: data.name,
      type: data.type,
      project_id: data.project_id,
      status: "pending",
    })
    .select()
    .single()

  if (error) throw error
  return number
}

export async function getContactStats(projectId: string) {
  const supabase = await createSupabaseServerClient()

  const [contactsResult, messagesResult, numbersResult] = await Promise.all([
    supabase.from("contacts").select("*", { count: "exact", head: true }).eq("project_id", projectId),
    supabase.from("messages").select("*", { count: "exact", head: true }).eq("project_id", projectId),
    supabase.from("whatsapp_numbers").select("*", { count: "exact", head: true }).eq("project_id", projectId),
  ])

  return {
    contacts: contactsResult.count || 0,
    messages: messagesResult.count || 0,
    numbers: numbersResult.count || 0,
  }
}
