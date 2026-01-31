import { getSupabaseAdmin } from "./supabase"
import { env } from "./env"

export type AuthUser = {
  id: string
  email: string
  role: "admin" | "system" | "project_admin" | "viewer"
  is_active: boolean
  password_hash: string
}

export function parseBasicAuth(
  authHeader: string,
  decodeBase64: (value: string) => string,
): { email: string; password: string } | null {
  if (!authHeader.startsWith("Basic ")) return null
  const encoded = authHeader.slice("Basic ".length).trim()
  if (!encoded) return null
  const decoded = decodeBase64(encoded)
  const separatorIndex = decoded.indexOf(":")
  if (separatorIndex === -1) return null
  const email = decoded.slice(0, separatorIndex)
  const password = decoded.slice(separatorIndex + 1)
  return { email, password }
}

const hashHex = async (input: string) => {
  const encoder = new TextEncoder()
  const data = encoder.encode(input)
  const hashBuffer = await crypto.subtle.digest("SHA-256", data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
}

const constantTimeEqual = (a: string, b: string) => {
  if (a.length !== b.length) return false
  let result = 0
  for (let i = 0; i < a.length; i += 1) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return result === 0
}

export async function hashPassword(password: string) {
  return hashHex(`${env.AUTH_PASSWORD_SALT}:${password}`)
}

export async function verifyPassword(password: string, passwordHash: string) {
  const computed = await hashPassword(password)
  return constantTimeEqual(computed, passwordHash)
}

export async function findUserByEmail(email: string) {
  const supabase = getSupabaseAdmin()
  const { data } = await supabase
    .from("users")
    .select("id, email, role, is_active, password_hash")
    .eq("email", email)
    .maybeSingle()

  return data as AuthUser | null
}

export async function validateCredentials(email: string, password: string) {
  const user = await findUserByEmail(email)
  if (!user || !user.is_active) return null
  if (!(await verifyPassword(password, user.password_hash))) return null
  return user
}
