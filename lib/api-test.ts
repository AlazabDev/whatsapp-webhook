/**
 * API Test Suite for WhatsApp Hub
 * Tests all endpoints to ensure they're working correctly
 */

import { logError, logInfo } from "./errors"

interface TestResult {
  endpoint: string
  method: string
  status: "pass" | "fail"
  message: string
  statusCode?: number
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

export async function testApiEndpoints(): Promise<TestResult[]> {
  const results: TestResult[] = []
  
  logInfo("API-Tests", "Starting API endpoint tests...")

  // Test 1: GET /api/health
  try {
    const res = await fetch(`${API_BASE}/api/health`)
    results.push({
      endpoint: "/api/health",
      method: "GET",
      status: res.ok ? "pass" : "fail",
      message: res.ok ? "Health check passed" : "Health check failed",
      statusCode: res.status,
    })
  } catch (err) {
    results.push({
      endpoint: "/api/health",
      method: "GET",
      status: "fail",
      message: `Connection error: ${err instanceof Error ? err.message : "Unknown error"}`,
    })
  }

  // Test 2: GET /api/stats (requires auth)
  try {
    const res = await fetch(`${API_BASE}/api/stats`)
    results.push({
      endpoint: "/api/stats",
      method: "GET",
      status: res.status === 401 ? "pass" : res.ok ? "pass" : "fail",
      message: res.status === 401 ? "Auth required (expected)" : res.ok ? "Stats endpoint working" : "Stats endpoint error",
      statusCode: res.status,
    })
  } catch (err) {
    results.push({
      endpoint: "/api/stats",
      method: "GET",
      status: "fail",
      message: `Connection error: ${err instanceof Error ? err.message : "Unknown error"}`,
    })
  }

  // Test 3: GET /api/contacts (requires auth)
  try {
    const res = await fetch(`${API_BASE}/api/contacts`)
    results.push({
      endpoint: "/api/contacts",
      method: "GET",
      status: res.status === 401 ? "pass" : res.ok ? "pass" : "fail",
      message: res.status === 401 ? "Auth required (expected)" : res.ok ? "Contacts endpoint working" : "Contacts endpoint error",
      statusCode: res.status,
    })
  } catch (err) {
    results.push({
      endpoint: "/api/contacts",
      method: "GET",
      status: "fail",
      message: `Connection error: ${err instanceof Error ? err.message : "Unknown error"}`,
    })
  }

  // Test 4: GET /api/messages (requires auth)
  try {
    const res = await fetch(`${API_BASE}/api/messages`)
    results.push({
      endpoint: "/api/messages",
      method: "GET",
      status: res.status === 401 ? "pass" : res.ok ? "pass" : "fail",
      message: res.status === 401 ? "Auth required (expected)" : res.ok ? "Messages endpoint working" : "Messages endpoint error",
      statusCode: res.status,
    })
  } catch (err) {
    results.push({
      endpoint: "/api/messages",
      method: "GET",
      status: "fail",
      message: `Connection error: ${err instanceof Error ? err.message : "Unknown error"}`,
    })
  }

  // Test 5: GET /api/numbers (requires auth)
  try {
    const res = await fetch(`${API_BASE}/api/numbers`)
    results.push({
      endpoint: "/api/numbers",
      method: "GET",
      status: res.status === 401 ? "pass" : res.ok ? "pass" : "fail",
      message: res.status === 401 ? "Auth required (expected)" : res.ok ? "Numbers endpoint working" : "Numbers endpoint error",
      statusCode: res.status,
    })
  } catch (err) {
    results.push({
      endpoint: "/api/numbers",
      method: "GET",
      status: "fail",
      message: `Connection error: ${err instanceof Error ? err.message : "Unknown error"}`,
    })
  }

  // Test 6: POST /api/contacts with invalid data (should fail with 400)
  try {
    const res = await fetch(`${API_BASE}/api/contacts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    })
    results.push({
      endpoint: "/api/contacts",
      method: "POST",
      status: res.status === 400 || res.status === 401 ? "pass" : "fail",
      message: `Validation test: ${res.status === 400 ? "Validation error (expected)" : res.status === 401 ? "Auth error (expected)" : "Unexpected response"}`,
      statusCode: res.status,
    })
  } catch (err) {
    results.push({
      endpoint: "/api/contacts",
      method: "POST",
      status: "fail",
      message: `Connection error: ${err instanceof Error ? err.message : "Unknown error"}`,
    })
  }

  logInfo("API-Tests", `Completed ${results.length} tests`)
  
  const passed = results.filter(r => r.status === "pass").length
  logInfo("API-Tests", `Results: ${passed}/${results.length} passed`)

  return results
}

export function getTestSummary(results: TestResult[]): string {
  const passed = results.filter(r => r.status === "pass").length
  const failed = results.filter(r => r.status === "fail").length
  
  return `
API Test Summary
================
Total Tests: ${results.length}
Passed: ${passed}
Failed: ${failed}
Success Rate: ${Math.round((passed / results.length) * 100)}%

Details:
${results.map(r => `- ${r.endpoint} (${r.method}): ${r.status.toUpperCase()} - ${r.message}`).join("\n")}
  `
}
