// Traduce un mensaje a los idiomas de los demás miembros de la sala con DeepL.
// Idempotente: si ya están todas las traducciones, no llama a DeepL.
import { createClient } from 'npm:@supabase/supabase-js@2.45.4'
import { cors, json } from '../_shared/cors.ts'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!
const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const DEEPL_KEY = Deno.env.get('DEEPL_API_KEY')!

const DEEPL_SOURCE: Record<string, string> = { es: 'ES', pt: 'PT' }
const DEEPL_TARGET: Record<string, string> = { es: 'ES', pt: 'PT-BR' }

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })

  const authHeader = req.headers.get('Authorization') ?? ''
  const userClient = createClient(SUPABASE_URL, ANON_KEY, {
    global: { headers: { Authorization: authHeader } },
  })
  const { data: { user } } = await userClient.auth.getUser()
  if (!user) return json({ error: 'unauthorized' }, 401)

  const { message_id } = await req.json().catch(() => ({}))
  if (!message_id) return json({ error: 'message_id requerido' }, 400)

  const admin = createClient(SUPABASE_URL, SERVICE_KEY)

  const { data: msg } = await admin.from('messages').select('*').eq('id', message_id).single()
  if (!msg) return json({ error: 'not found' }, 404)

  const { data: membership } = await admin
    .from('room_members').select('profile_id')
    .eq('room_id', msg.room_id).eq('profile_id', user.id).maybeSingle()
  if (!membership) return json({ error: 'forbidden' }, 403)

  const { data: members } = await admin
    .from('room_members').select('profiles(lang)').eq('room_id', msg.room_id)
  const targets = [...new Set(
    (members ?? []).map((m: any) => m.profiles?.lang).filter((l: string) => l && l !== msg.source_lang),
  )] as string[]

  const translations: Record<string, string> = { ...(msg.translations ?? {}) }
  const missing = targets.filter((t) => !translations[t])
  if (msg.status === 'translated' && missing.length === 0) {
    return json({ status: 'translated', translations })
  }

  try {
    for (const t of missing) {
      const body = new URLSearchParams({
        text: msg.source_text,
        source_lang: DEEPL_SOURCE[msg.source_lang],
        target_lang: DEEPL_TARGET[t],
        formality: 'prefer_less',
      })
      const res = await fetch('https://api-free.deepl.com/v2/translate', {
        method: 'POST',
        headers: {
          Authorization: `DeepL-Auth-Key ${DEEPL_KEY}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body,
      })
      if (!res.ok) throw new Error(`DeepL ${res.status}: ${await res.text()}`)
      const data = await res.json()
      translations[t] = data.translations[0].text
    }
    await admin.from('messages')
      .update({ translations, status: 'translated', error_detail: null })
      .eq('id', msg.id)
    console.log(`translated ${msg.id} chars=${msg.source_text.length * missing.length}`)
    return json({ status: 'translated', translations })
  } catch (e) {
    const detail = String(e instanceof Error ? e.message : e).slice(0, 1000)
    await admin.from('messages').update({ status: 'failed', error_detail: detail }).eq('id', msg.id)
    console.error(detail)
    return json({ status: 'failed', translations })
  }
})
