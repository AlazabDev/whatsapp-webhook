"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react"

interface TestResult {
  endpoint: string
  method: string
  status: "pass" | "fail"
  message: string
  statusCode?: number
}

export function ApiTestPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<TestResult[]>([])
  const [error, setError] = useState<string | null>(null)

  const runTests = async () => {
    setIsLoading(true)
    setError(null)
    setResults([])

    try {
      // Test health endpoint
      const healthRes = await fetch("/api/health")
      const healthTest: TestResult = {
        endpoint: "/api/health",
        method: "GET",
        status: healthRes.ok ? "pass" : "fail",
        message: healthRes.ok ? "Health check passed" : `Health check failed (${healthRes.status})`,
        statusCode: healthRes.status,
      }

      // Test stats endpoint
      const statsRes = await fetch("/api/stats")
      const statsTest: TestResult = {
        endpoint: "/api/stats",
        method: "GET",
        status: statsRes.status === 401 ? "pass" : statsRes.ok ? "pass" : "fail",
        message: statsRes.status === 401 ? "Auth required (expected)" : `Status: ${statsRes.status}`,
        statusCode: statsRes.status,
      }

      // Test contacts endpoint
      const contactsRes = await fetch("/api/contacts")
      const contactsTest: TestResult = {
        endpoint: "/api/contacts",
        method: "GET",
        status: contactsRes.status === 401 ? "pass" : contactsRes.ok ? "pass" : "fail",
        message: contactsRes.status === 401 ? "Auth required (expected)" : `Status: ${contactsRes.status}`,
        statusCode: contactsRes.status,
      }

      // Test messages endpoint
      const messagesRes = await fetch("/api/messages")
      const messagesTest: TestResult = {
        endpoint: "/api/messages",
        method: "GET",
        status: messagesRes.status === 401 ? "pass" : messagesRes.ok ? "pass" : "fail",
        message: messagesRes.status === 401 ? "Auth required (expected)" : `Status: ${messagesRes.status}`,
        statusCode: messagesRes.status,
      }

      // Test numbers endpoint
      const numbersRes = await fetch("/api/numbers")
      const numbersTest: TestResult = {
        endpoint: "/api/numbers",
        method: "GET",
        status: numbersRes.status === 401 ? "pass" : numbersRes.ok ? "pass" : "fail",
        message: numbersRes.status === 401 ? "Auth required (expected)" : `Status: ${numbersRes.status}`,
        statusCode: numbersRes.status,
      }

      setResults([healthTest, statsTest, contactsTest, messagesTest, numbersTest])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const passed = results.filter(r => r.status === "pass").length
  const total = results.length

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>API Endpoints Test Suite</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Click the button below to run tests against all API endpoints
          </p>

          <Button onClick={runTests} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Running Tests...
              </>
            ) : (
              "Run API Tests"
            )}
          </Button>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Test Results ({passed}/{total} passed)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {results.map((result, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-lg border ${
                    result.status === "pass"
                      ? "bg-green-50 border-green-200"
                      : "bg-red-50 border-red-200"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {result.status === "pass" ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-mono text-sm font-semibold">
                          {result.method} {result.endpoint}
                        </p>
                        <span
                          className={`text-xs font-semibold px-2 py-1 rounded ${
                            result.status === "pass"
                              ? "bg-green-200 text-green-800"
                              : "bg-red-200 text-red-800"
                          }`}
                        >
                          {result.status.toUpperCase()}
                        </span>
                      </div>
                      <p
                        className={`text-sm mt-1 ${
                          result.status === "pass"
                            ? "text-green-700"
                            : "text-red-700"
                        }`}
                      >
                        {result.message}
                      </p>
                      {result.statusCode && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Status Code: {result.statusCode}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
