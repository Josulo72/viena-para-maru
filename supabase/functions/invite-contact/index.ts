// Solo el titular: crea la sala 1:1 con un contacto y le envía el magic link.
import { createClient } from 'npm:@supabase/supabase-js@2.45.4'
import { cors, json } from '../_shared/cors.ts'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!
const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })

  const userClient = createClient(SUPABASE_URL, ANON_KEY, {
    global: { headers: { Authorization: req.headers.get('Authorization') ?? '' } },
  })
  const { data: { user } } = await userClient.auth.getUser()
  if (!user) return json({ error: 'unauthorized' }, 401)

  const admin = createClient(SUPABASE_URL, SERVICE_KEY)
  const { data: me } = await admin.from('profiles').select('is_owner').eq('id', user.id).single()
  if (!me?.is_owner) return json({ error: 'forbidden' }, 403)

  const { email, display_name, lang = 'pt', redirect_to } = await req.json().catch(() => ({}))
  if (!email || !display_name || !['es', 'pt'].includes(lang)) {
    return json({ error: 'email, display_name y lang son obligatorios' }, 400)
  }

  const { data: room, error: roomErr } = await admin
    .from('rooms').insert({ name: display_name }).select().single()
  if (roomErr) return json({ error: roomErr.message }, 500)

  await admin.from('room_members').insert({ room_id: room.id, profile_id: user.id })

  const { error: invErr } = await admin.from('invites').insert({
    email: email.toLowerCase(), display_name, lang, room_id: room.id, created_by: user.id,
  })
  if (invErr) {
    await admin.from('rooms').delete().eq('id', room.id)
    return json({ error: invErr.message }, 400)
  }

  const { error: mailErr } = await admin.auth.admin.inviteUserByEmail(email, { redirectTo: redirect_to })
  if (mailErr) {
    await admin.from('rooms').delete().eq('id', room.id) // borra también la invitación (cascade)
    return json({ error: mailErr.message }, 400)
  }

  return json({ room_id: room.id })
})
