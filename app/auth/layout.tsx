import type React from "react"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className="bg-gradient-to-br from-slate-50 to-slate-100">{children}</body>
    </html>
  )
}
