import { createClient } from "@supabase/supabase-js"
import crypto from "crypto"

let ADMIN_CLIENT: ReturnType<typeof createClient> | null = null

function getAdminClient() {
  if (!ADMIN_CLIENT) {
    ADMIN_CLIENT = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
  }
  return ADMIN_CLIENT
}

export async function generateMagicLinkToken(): Promise<string> {
  return crypto.randomBytes(32).toString("hex")
}

export async function createMagicLink(email: string): Promise<{ token: string; expiresAt: Date }> {
  const token = await generateMagicLinkToken()
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

  // Delete any existing unexpired magic links for this email
  await getAdminClient().from("magic_links").delete().eq("email", email.toLowerCase()).is("used_at", null)

  const { error } = await getAdminClient().from("magic_links").insert({
    email: email.toLowerCase(),
    token,
    expires_at: expiresAt.toISOString(),
  })

  if (error) throw error

  return { token, expiresAt }
}

export async function validateMagicLink(token: string) {
  const { data, error } = await getAdminClient()
    .from("magic_links")
    .select("email, expires_at, used_at")
    .eq("token", token)
    .single()

  if (error) return null

  // Check if already used
  if (data.used_at) return null

  // Check if expired
  if (new Date() > new Date(data.expires_at)) {
    return null
  }

  return data
}

export async function markMagicLinkAsUsed(token: string) {
  const { error } = await getAdminClient()
    .from("magic_links")
    .update({ used_at: new Date().toISOString() })
    .eq("token", token)

  if (error) throw error
}

export async function isTrustedUser(email: string): Promise<boolean> {
  const { data, error } = await getAdminClient()
    .from("trusted_users")
    .select("id, is_active")
    .eq("email", email.toLowerCase())
    .eq("is_active", true)
    .single()

  if (error) return false
  return !!data
}

export async function createTrustedSession(email: string) {
  const token = crypto.randomBytes(32).toString("hex")
  const expiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year

  const { error } = await getAdminClient().from("user_sessions").insert({
    email: email.toLowerCase(),
    session_token: token,
    expires_at: expiresAt.toISOString(),
  })

  if (error) throw error

  return { token, expiresAt }
}

export async function getTrustedUserByEmail(email: string) {
  const { data } = await getAdminClient()
    .from("trusted_users")
    .select("*")
    .eq("email", email.toLowerCase())
    .eq("is_active", true)
    .single()

  return data || null
}
