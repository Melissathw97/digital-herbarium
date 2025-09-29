export interface SupportPayload {
  category: string
  subject: string
  name: string
  email: string
  description: string
}

export interface SupportResponse {
  message: string
  submitted_at: string
  ticket_id: string
}