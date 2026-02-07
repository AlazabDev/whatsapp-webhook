import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
// Environment validation happens at runtime when needed
  } catch (error) {
    // Silently handle env validation errors during initialization
    console.warn("[Layout] Environment setup:", error instanceof Error ? error.message : String(error))
  }
  return (
    <html lang="ar" dir="rtl">
      <body className={`${_geist.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
