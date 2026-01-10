import { NextResponse, type NextRequest } from "next/server"
import { createMagicLink, isTrustedUser } from "@/lib/auth/magic-link"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "البريد الإلكتروني غير صحيح" }, { status: 400 })
    }

    const normalizedEmail = email.toLowerCase()

    // Check if user is trusted
    const isTrusted = await isTrustedUser(normalizedEmail)
    if (!isTrusted) {
      // Don't reveal if email exists or not for security
      return NextResponse.json(
        {
          message: "تحقق من بريدك الإلكتروني لتلقي رابط الدخول",
          success: true,
        },
        { status: 200 },
      )
    }

    // Generate magic link
    const { token } = await createMagicLink(normalizedEmail)

    // Build the magic link URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin
    const magicLinkUrl = `${baseUrl}/auth/verify?token=${token}`

    // Send email
    const { error: emailError } = await resend.emails.send({
      from: "Alazab <send@az.alazab.com>",
      to: normalizedEmail,
      subject: "رابط الدخول الآمن - منصة العزب",
      html: `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: 'Arial', sans-serif; background-color: #f5f5f5; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); overflow: hidden; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
    .header h1 { margin: 0; font-size: 28px; }
    .content { padding: 30px; }
    .greeting { font-size: 16px; color: #333; margin-bottom: 20px; }
    .message { font-size: 14px; color: #666; line-height: 1.6; margin-bottom: 30px; }
    .button-container { text-align: center; margin: 30px 0; }
    .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-size: 16px; font-weight: bold; }
    .button:hover { opacity: 0.9; }
    .footer { background-color: #f9f9f9; padding: 20px; text-align: center; font-size: 12px; color: #999; border-top: 1px solid #eee; }
    .link-text { word-break: break-all; color: #667eea; font-size: 12px; }
    .warning { background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px; font-size: 13px; color: #856404; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>منصة العزب</h1>
      <p>رابط الدخول الآمن</p>
    </div>
    <div class="content">
      <p class="greeting">مرحباً،</p>
      <p class="message">
        تم طلب رابط دخول آمن لحسابك. اضغط على الزر أدناه للدخول مباشرة إلى منصة الأزعب.
      </p>
      <div class="button-container">
        <a href="${magicLinkUrl}" class="button">الدخول الآن</a>
      </div>
      <p class="message">أو انسخ ولصق هذا الرابط في متصفحك:</p>
      <p class="link-text">${magicLinkUrl}</p>
      <div class="warning">
        <strong>⏰ تنبيه:</strong> هذا الرابط صالح لمدة 24 ساعة فقط. لا تشارك هذا الرابط مع أحد.
      </div>
      <p class="message">
        إذا لم تطلب هذا الرابط، يمكنك تجاهل هذا البريد بأمان.
      </p>
    </div>
    <div class="footer">
      <p>هذا بريد آلي، يرجى عدم الرد عليه</p>
      <p>© 2026 منصة العزب. جميع الحقوق محفوظة</p>
    </div>
  </div>
</body>
</html>
      `,
    })

    if (emailError) {
      console.error("[v0] Resend error:", emailError)
      return NextResponse.json({ error: "حدث خطأ في إرسال البريد" }, { status: 500 })
    }

    return NextResponse.json(
      {
        message: "تحقق من بريدك الإلكتروني لتلقي رابط الدخول",
        success: true,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("[v0] Magic link request error:", error)
    return NextResponse.json({ error: "حدث خطأ في معالجة الطلب" }, { status: 500 })
  }
}
