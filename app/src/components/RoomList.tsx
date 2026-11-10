import { useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Lang, Profile, Room } from '../lib/types'
import { t } from '../lib/i18n'

interface Props {
  me: Profile
  rooms: Room[]
  onOpen: (r: Room) => void
  onCreated: (r: Room) => void
}

export default function RoomList({ me, rooms, onOpen, onCreated }: Props) {
  const L = me.lang
  const [showInvite, setShowInvite] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [lang, setLang] = useState<Lang>('pt')
  const [msg, setMsg] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function invite(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setMsg(null)
    const { data, error } = await supabase.functions.invoke('invite-contact', {
      body: { email, display_name: name, lang, redirect_to: window.location.origin },
    })
    setBusy(false)
    if (error || data?.error) {
      setMsg(data?.error ?? error?.message ?? 'Error')
      return
    }
    onCreated({ id: data.room_id, name })
    setMsg(t(L, 'inviteSent'))
    setName('')
    setEmail('')
    setShowInvite(false)
  }

  return (
    <main className="max-w-xl mx-auto min-h-full flex flex-col">
      <header className="flex items-center justify-between px-4 py-3 border-b border-line">
        <h1 className="font-display text-lg">{t(L, 'conversations')}</h1>
        <button className="font-mono text-xs text-muted" onClick={() => supabase.auth.signOut()}>
          {t(L, 'logout')}
        </button>
      </header>

      <ul className="flex-1">
        {rooms.length === 0 && <li className="px-4 py-6 text-muted">{t(L, 'noConversations')}</li>}
        {rooms.map((r) => (
          <li key={r.id}>
            <button
              onClick={() => onOpen(r)}
              className="w-full text-left px-4 py-4 border-b border-line hover:bg-surface"
            >
              {r.name}
            </button>
          </li>
        ))}
      </ul>

      <section className="p-4 border-t border-line space-y-3">
        {msg && <p className="text-sm text-muted">{msg}</p>}
        {!showInvite ? (
          <button
            onClick={() => setShowInvite(true)}
            className="w-full rounded-ctl border border-line py-2"
          >
            {t(L, 'invite')}
          </button>
        ) : (
          <form onSubmit={invite} className="space-y-2">
            <input
              required placeholder={t(L, 'name')} value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-ctl bg-surface border border-line px-3 py-2"
            />
            <input
              required type="email" placeholder={t(L, 'email')} value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-ctl bg-surface border border-line px-3 py-2"
            />
            <select
              value={lang} onChange={(e) => setLang(e.target.value as Lang)}
              aria-label={t(L, 'language')}
              className="w-full rounded-ctl bg-surface border border-line px-3 py-2"
            >
              <option value="pt">Português (Brasil)</option>
              <option value="es">Español</option>
            </select>
            <button
              disabled={busy}
              className="w-full rounded-ctl bg-text text-ink py-2 font-medium disabled:opacity-50"
            >
              {t(L, 'invite')}
            </button>
          </form>
        )}
      </section>
    </main>
  )
}
