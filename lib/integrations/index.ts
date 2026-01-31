import { logger } from "../logger"
import { sendToCrm } from "./crm.adapter"
import { sendToErp } from "./erp.adapter"
import { sendToHelpdesk } from "./helpdesk.adapter"
import type { IntegrationConfig, IntegrationEvent } from "./types"

type IntegrationRecord = {
  id: string
  type: string
  config?: IntegrationConfig | null
}

export async function runIntegrations(integrations: IntegrationRecord[], event: IntegrationEvent) {
  for (const integration of integrations) {
    try {
      if (integration.type === "erp") {
        await sendToErp(event, integration.config)
      } else if (integration.type === "crm") {
        await sendToCrm(event, integration.config)
      } else if (integration.type === "helpdesk") {
        await sendToHelpdesk(event, integration.config)
      } else {
        logger.warn("Unknown integration type", { type: integration.type, integrationId: integration.id })
      }
    } catch (error) {
      logger.error("Integration handler failed", { error, integrationId: integration.id })
    }
  }
}
