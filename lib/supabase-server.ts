import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { getPublicEnv } from "@/lib/env.public"

export const getSupabaseServerClient = () => {
  const cookieStore = cookies()
  const { NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY } = getPublicEnv()

  return createServerClient(NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookieJar) {
        cookieJar.forEach(({ name, value, options }) => {
          cookieStore.set(name, value, options)
        })
      },
    },
  })
}
