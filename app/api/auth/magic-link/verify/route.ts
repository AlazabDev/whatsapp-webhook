import { NextResponse, type NextRequest } from "next/server"
import { validateMagicLink, markMagicLinkAsUsed, createTrustedSession } from "@/lib/auth/magic-link"

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json({ error: "الرابط غير صحيح" }, { status: 400 })
    }

    // Validate magic link
    const magicLinkData = await validateMagicLink(token)
    if (!magicLinkData) {
      return NextResponse.json({ error: "الرابط غير صالح أو انتهت صلاحيته" }, { status: 401 })
    }

    // Mark as used
    await markMagicLinkAsUsed(token)

    // Create session
    const { token: sessionToken, expiresAt } = await createTrustedSession(magicLinkData.email)

    // Set cookie
    const response = NextResponse.json({ success: true, message: "تم تسجيل الدخول بنجاح" }, { status: 200 })

    response.cookies.set("trusted_session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: expiresAt,
      path: "/",
    })

    return response
  } catch (error) {
    console.error("[v0] Magic link verify error:", error)
    return NextResponse.json({ error: "حدث خطأ أثناء التحقق" }, { status: 500 })
  }
}
