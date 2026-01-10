import { NextResponse, type NextRequest } from "next/server"
import { isTrustedUser, createTrustedSession } from "@/lib/auth/trusted-auth"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    console.log("[v0] Login attempt with email:", email)

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "البريد الإلكتروني غير صحيح" }, { status: 400 })
    }

    // Check if user is trusted
    const isTrusted = await isTrustedUser(email.toLowerCase())
    console.log("[v0] Is trusted user:", isTrusted)

    if (!isTrusted) {
      return NextResponse.json({ error: "البريد الإلكتروني غير مصرح به" }, { status: 403 })
    }

    // Create session
    const { token, expiresAt } = await createTrustedSession(email.toLowerCase())
    console.log("[v0] Session created successfully")

    // Set cookie
    const response = NextResponse.json({ success: true, message: "تم تسجيل الدخول بنجاح" }, { status: 200 })

    response.cookies.set("trusted_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: expiresAt,
      path: "/",
    })

    return response
  } catch (error) {
    console.error("[v0] Trusted login error:", error)
    return NextResponse.json({ error: "حدث خطأ أثناء تسجيل الدخول" }, { status: 500 })
  }
}
