import { getSupabaseAdmin } from "./supabase"
import { generateText } from "ai"

export class AIService {
  private projectId: string
  private config: any

  constructor(projectId: string, config: any) {
    this.projectId = projectId
    this.config = config
  }

  static async fromProjectId(projectId: string) {
    const supabase = getSupabaseAdmin()
    const { data: config } = await supabase.from("ai_configurations").select("*").eq("project_id", projectId).single()

    if (!config || !config.is_active) return null

    return new AIService(projectId, config)
  }

  async generateResponse(messages: { role: "user" | "assistant"; content: string }[]) {
    try {
      // Map database provider to AI SDK model string
      const provider = this.config.provider || "openai"
      const modelName = this.config.model || "gpt-4o"
      const modelId = `${provider}/${modelName}`

      const { text } = await generateText({
        model: modelId as any,
        system: this.config.system_prompt,
        messages: messages,
      })

      return text
    } catch (error) {
      console.error("[v0] AI Generation error:", error)
      return null
    }
  }
}
