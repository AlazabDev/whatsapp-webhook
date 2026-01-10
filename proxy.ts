import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { validateSessionToken } from "@/lib/auth/trusted-auth"

export async function proxy(request: NextRequest) {
  const sessionToken = request.cookies.get("trusted_session")?.value

  // If user has a valid session, allow access
  if (sessionToken) {
    const sessionData = await validateSessionToken(sessionToken)
    if (sessionData) {
      return NextResponse.next()
    } else {
      // Session is invalid or expired, redirect to login
      const response = NextResponse.redirect(new URL("/auth/trusted-login", request.url))
      response.cookies.delete("trusted_session")
      return response
    }
  }

  // Check if trying to access protected routes
  const protectedRoutes = ["/dashboard", "/projects", "/api/whatsapp", "/api/templates", "/api/team"]
  const isProtectedRoute = protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route))

  if (isProtectedRoute && !sessionToken) {
    return NextResponse.redirect(new URL("/auth/trusted-login", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.svg$).*)", "/api/:path*"],
}
