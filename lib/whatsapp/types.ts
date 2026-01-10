export interface WhatsAppMessage {
  id: string
  whatsapp_message_id?: string
  whatsapp_number_id: string
  contact_id: string
  type: "text" | "image" | "document" | "audio" | "video"
  body: string
  direction: "incoming" | "outgoing"
  status: "sent" | "delivered" | "read" | "failed" | "received"
  media_url?: string
  from_phone_id?: string
  to_phone_id?: string
  timestamp?: string
  read_at?: string
  created_at: string
  metadata?: Record<string, any>
}

export interface WhatsAppContact {
  id: string
  name: string
  wa_id: string
  whatsapp_number_id: string
  project_id: string
  profile_picture_url?: string
  status: "active" | "inactive" | "blocked"
  tags?: string[]
  last_message_at?: string
  created_at: string
}

export interface WhatsAppNumber {
  id: string
  project_id: string
  phone_number_id: string
  display_phone_number: string
  verified_name?: string
  status: "active" | "inactive"
  quality_rating?: string
  owner_id?: string
  business_account_id?: string
  access_token?: string
  webhook_token?: string
  created_at: string
  updated_at: string
}

export interface MessageTemplate {
  id: string
  project_id: string
  whatsapp_number_id: string
  template_id: string
  name: string
  category: string
  language: string
  status: "pending" | "approved" | "rejected"
  content: {
    body: string
    header?: string
    footer?: string
    buttons?: Array<{
      type: string
      text: string
      url?: string
      phone_number?: string
    }>
  }
  variables?: string[]
  is_active: boolean
  created_at: string
  updated_at: string
}
