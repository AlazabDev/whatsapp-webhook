import { createClient } from "@supabase/supabase-js"
import { getPublicEnv } from "./env.public"
import { getSupabaseAdminEnv } from "./env.server"

let cachedSupabaseClient: ReturnType<typeof createClient> | null = null
let cachedSupabaseAdminClient: ReturnType<typeof createClient> | null = null

// Singleton pattern for Supabase client
export const getSupabaseClient = () => {
  if (cachedSupabaseClient) return cachedSupabaseClient
  const { NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY } = getPublicEnv()
  cachedSupabaseClient = createClient(NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY)
  return cachedSupabaseClient
}

// Server-side client (requires service role for admin tasks)
export const getSupabaseAdmin = () => {
  if (cachedSupabaseAdminClient) return cachedSupabaseAdminClient
  const { NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = getSupabaseAdminEnv()
  cachedSupabaseAdminClient = createClient(NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
  return cachedSupabaseAdminClient
}
