import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { parseBasicAuth, validateCredentials } from "./lib/auth"
import { createSessionToken, verifySessionToken } from "./lib/session"

export async function middleware(request: NextRequest) {
  const authHeader = request.headers.get("authorization")
  const sessionCookie = request.cookies.get("alazab_session")?.value

  if (sessionCookie) {
    const session = await verifySessionToken(sessionCookie)
    if (session && (session.role === "admin" || session.role === "system" || session.role === "project_admin")) {
      return NextResponse.next()
    }
  }

  if (!authHeader) {
    return new NextResponse("Authentication required", {
      status: 401,
      headers: { "WWW-Authenticate": "Basic realm=\"Secure Area\"" },
    })
  }

  const credentials = parseBasicAuth(authHeader, (value) => atob(value))
  const user = credentials ? await validateCredentials(credentials.email, credentials.password) : null
  if (!credentials || !user) {
    return new NextResponse("Invalid credentials", {
      status: 401,
      headers: { "WWW-Authenticate": "Basic realm=\"Secure Area\"" },
    })
  }

  if (user.role !== "admin" && user.role !== "system" && user.role !== "project_admin") {
    return new NextResponse("Forbidden", { status: 403 })
  }

  const response = NextResponse.next()
  const token = await createSessionToken({ userId: user.id, role: user.role })
  response.cookies.set("alazab_session", token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
  })
  return response
}

export const config = {
  matcher: ["/((?!api/webhook|api/queue|webhook|webhooks|_next/static|_next/image|favicon.ico).*)"],
}
