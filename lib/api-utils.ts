import { NextResponse } from "next/server"
import { logError } from "@/lib/errors"

export async function errorHandler(fn: () => Promise<NextResponse>) {
  try {
    return await fn()
  } catch (error) {
    logError("API:errorHandler", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export function validateRequest(data: any, requiredFields: string[]): string | null {
  for (const field of requiredFields) {
    if (!data[field]) {
      return `${field} is required`
    }
  }
  return null
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePhoneNumber(phone: string): boolean {
  const phoneRegex = /^[\d+\-\s()]+$/
  return phoneRegex.test(phone) && phone.replace(/\D/g, "").length >= 10
}
