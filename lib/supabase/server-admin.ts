import { createClient } from "@supabase/supabase-js"
import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

let adminClientInstance: ReturnType<typeof createClient> | null = null

/**
 * Admin client for server-side operations that need elevated privileges.
 * Uses SUPABASE_SERVICE_ROLE_KEY which should never be exposed to the client.
 */
export function createAdminClient() {
  if (!adminClientInstance) {
    adminClientInstance = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
  }
  return adminClientInstance
}

/**
 * Exported updateSession function for middleware
 * This function refreshes the user session and handles authentication
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
          })
          response = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
        },
      },
    },
  )

  // Refresh session
  await supabase.auth.getUser()

  return response
}
