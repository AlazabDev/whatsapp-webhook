import { logger } from "../logger"
import { env } from "../env"
import type { IntegrationConfig, IntegrationEvent } from "./types"

const retry = async <T>(fn: () => Promise<T>, retries = 3) => {
  let lastError: unknown
  for (let attempt = 0; attempt < retries; attempt += 1) {
    try {
      return await fn()
    } catch (error) {
      lastError = error
      await new Promise((resolve) => setTimeout(resolve, 500 * (attempt + 1)))
    }
  }
  throw lastError
}

export async function sendToCrm(event: IntegrationEvent, config?: IntegrationConfig | null) {
  const apiUrl = config?.api_url || env.CRM_API_URL
  const apiKey = config?.api_key || env.CRM_API_KEY

  if (!apiUrl || !apiKey) {
    logger.warn("CRM integration missing credentials", { projectId: event.projectId })
    return
  }

  try {
    await retry(async () => {
      const response = await fetch(`${apiUrl}/events`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(event),
      })
      if (!response.ok) {
        throw new Error(`CRM request failed: ${response.status}`)
      }
    })
    logger.info("CRM integration delivered", { projectId: event.projectId, messageId: event.messageId })
  } catch (error) {
    logger.error("CRM integration failed", { error, messageId: event.messageId })
  }
}
