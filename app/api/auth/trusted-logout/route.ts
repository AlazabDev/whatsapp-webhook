import { NextResponse, type NextRequest } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const response = NextResponse.json({ success: true, message: "تم تسجيل الخروج بنجاح" }, { status: 200 })

    response.cookies.delete("trusted_session")

    return response
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json({ error: "حدث خطأ أثناء تسجيل الخروج" }, { status: 500 })
  }
}
