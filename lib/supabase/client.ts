"use client"

import { createBrowserClient } from "@supabase/ssr"

let clientInstance: ReturnType<typeof createBrowserClient> | null = null

export function createClient() {
  // Only initialize on client side
  if (typeof window === "undefined") {
    throw new Error("createClient can only be called on the client side")
  }

  if (!clientInstance) {
    clientInstance = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )
  }

  return clientInstance
}

export function resetClient() {
  clientInstance = null
}
