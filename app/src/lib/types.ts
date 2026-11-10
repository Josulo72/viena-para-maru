export type Lang = 'es' | 'pt'

export interface Profile {
  id: string
  display_name: string
  lang: Lang
  is_owner: boolean
}

export interface Room {
  id: string
  name: string
}

export interface Message {
  id: string
  room_id: string
  sender_id: string
  source_lang: Lang
  source_text: string
  translations: Partial<Record<Lang, string>>
  status: 'pending' | 'translated' | 'failed'
  error_detail: string | null
  client_id: string
  created_at: string
}
