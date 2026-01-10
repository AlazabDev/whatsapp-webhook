/**
 * WhatsApp Message Templates Client
 * للعمل مع قوالب الرسائل
 */

export interface TemplateCreateRequest {
  projectId: string
  whatsappNumberId: string
  name: string
  category: string
  language: string
  content: {
    body: string
    header?: string
    footer?: string
    buttons?: Array<{
      type: "url" | "phone" | "text"
      text: string
      url?: string
      phoneNumber?: string
    }>
  }
  variables?: string[]
}

export async function createTemplate(data: TemplateCreateRequest) {
  try {
    const response = await fetch("/api/templates/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Failed to create template")
    }

    return await response.json()
  } catch (error) {
    console.error("[v0] Create template error:", error)
    throw error
  }
}

export async function getTemplates(whatsappNumberId: string) {
  try {
    const response = await fetch(`/api/templates/list?whatsappNumberId=${whatsappNumberId}`)

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Failed to get templates")
    }

    return await response.json()
  } catch (error) {
    console.error("[v0] Get templates error:", error)
    throw error
  }
}

export async function updateTemplate(templateId: string, data: Partial<TemplateCreateRequest>) {
  try {
    const response = await fetch("/api/templates/update", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ templateId, ...data }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Failed to update template")
    }

    return await response.json()
  } catch (error) {
    console.error("[v0] Update template error:", error)
    throw error
  }
}

export async function deleteTemplate(templateId: string) {
  try {
    const response = await fetch("/api/templates/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ templateId }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Failed to delete template")
    }

    return await response.json()
  } catch (error) {
    console.error("[v0] Delete template error:", error)
    throw error
  }
}
