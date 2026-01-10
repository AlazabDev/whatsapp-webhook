import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"
import crypto from "crypto"

/**
 * Trusted auth utilities for email-only login
 * These functions handle creating and validating sessions for pre-approved users
 */

let ADMIN_CLIENT: ReturnType<typeof createClient> | null = null

function getAdminClient() {
  if (!ADMIN_CLIENT) {
    ADMIN_CLIENT = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
  }
  return ADMIN_CLIENT
}

export async function generateSessionToken(): Promise<string> {
  return crypto.randomBytes(32).toString("hex")
}

export async function createTrustedSession(email: string) {
  const token = await generateSessionToken()
  const expiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year

  const { error } = await getAdminClient().from("user_sessions").insert({
    email,
    session_token: token,
    expires_at: expiresAt.toISOString(),
  })

  if (error) throw error

  return { token, expiresAt }
}

export async function validateSessionToken(token: string) {
  const { data, error } = await getAdminClient()
    .from("user_sessions")
    .select("email, expires_at")
    .eq("session_token", token)
    .single()

  if (error) return null

  if (new Date() > new Date(data.expires_at)) {
    // Session expired, delete it
    await getAdminClient().from("user_sessions").delete().eq("session_token", token)
    return null
  }

  return data
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

export async function getTrustedUserByEmail(email: string) {
  const { data, error } = await getAdminClient()
    .from("trusted_users")
    .select("*")
    .eq("email", email.toLowerCase())
    .eq("is_active", true)
    .single()

  if (error) return null
  return data
}

export async function setSessionCookie(token: string, expiresAt: Date) {
  const cookieStore = await cookies()
  cookieStore.set("trusted_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  })
}

export async function getSessionCookie() {
  const cookieStore = await cookies()
  return cookieStore.get("trusted_session")?.value
}

export async function clearSessionCookie() {
  const cookieStore = await cookies()
  cookieStore.delete("trusted_session")
}

export async function getCurrentUser() {
  const token = await getSessionCookie()
  if (!token) return null

  const sessionData = await validateSessionToken(token)
  if (!sessionData) {
    await clearSessionCookie()
    return null
  }

  return await getTrustedUserByEmail(sessionData.email)
}
