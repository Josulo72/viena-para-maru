import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { RealtimeChannel } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import type { Message, Profile, Room } from '../lib/types'
import { t } from '../lib/i18n'
import Bubble from './Bubble'

const PAGE = 40

interface Props {
  me: Profile
  room: Room
  onBack?: () => void
}

function sortMsgs(list: Message[]) {
  return [...list].sort((a, b) => a.created_at.localeCompare(b.created_at))
}

export default function Chat({ me, room, onBack }: Props) {
  const L = me.lang
  const [messages, setMessages] = useState<Message[]>([])
  const [hasMore, setHasMore] = useState(true)
  const [loadingOlder, setLoadingOlder] = useState(false)
  const [text, setText] = useState('')
  const [otherTyping, setOtherTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const stickBottom = useRef(true)
  const prevHeight = useRef<number | null>(null)
  const channelRef = useRef<RealtimeChannel | null>(null)
  const typingTimer = useRef<number>()
  const lastTypingSent = useRef(0)
  const messagesRef = useRef<Message[]>([])
  messagesRef.current = messages

  // Fusiona por client_id (evita duplicar la burbuja propia) y por id
  const upsert = useCallback((incoming: Message[]) => {
    setMessages((prev) => {
      const map = new Map(prev.map((m) => [m.client_id, m]))
      for (const m of incoming) map.set(m.client_id, { ...map.get(m.client_id), ...m })
      return sortMsgs([...map.values()])
    })
  }, [])

  const loadInitial = useCallback(async () => {
    const { data } = await supabase
      .from('messages').select('*').eq('room_id', room.id)
      .order('created_at', { ascending: false }).limit(PAGE)
    const list = (data ?? []) as Message[]
    setHasMore(list.length === PAGE)
    stickBottom.current = true
    upsert(list)
  }, [room.id, upsert])

  const loadOlder = useCallback(async () => {
    if (loadingOlder || !hasMore) return
    const oldest = messagesRef.current.find((m) => !m.id.startsWith('tmp-'))
    if (!oldest) return
    setLoadingOlder(true)
    const { data } = await supabase
      .from('messages').select('*').eq('room_id', room.id)
      .lt('created_at', oldest.created_at)
      .order('created_at', { ascending: false }).limit(PAGE)
    const list = (data ?? []) as Message[]
    setHasMore(list.length === PAGE)
    prevHeight.current = scrollRef.current?.scrollHeight ?? null
    upsert(list)
    setLoadingOlder(false)
  }, [hasMore, loadingOlder, room.id, upsert])

  // Recupera lo perdido mientras el WebSocket estaba caído
  const catchUp = useCallback(async () => {
    const real = messagesRef.current.filter((m) => !m.id.startsWith('tmp-'))
    const last = real[real.length - 1]
    let q = supabase.from('messages').select('*').eq('room_id', room.id).order('created_at')
    if (last) q = q.gte('created_at', last.created_at)
    const { data } = await q.limit(200)
    if (data) upsert(data as Message[])
    // Refresca también los pendientes por si su UPDATE se perdió
    const pending = real.filter((m) => m.status === 'pending').map((m) => m.id)
    if (pending.length) {
      const { data: upd } = await supabase.from('messages').select('*').in('id', pending)
      if (upd) upsert(upd as Message[])
    }
  }, [room.id, upsert])

  const subscribe = useCallback(() => {
    if (channelRef.current) supabase.removeChannel(channelRef.current)
    const ch = supabase
      .channel(`room:${room.id}`, { config: { broadcast: { self: false } } })
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `room_id=eq.${room.id}` },
        (p) => upsert([p.new as Message]))
      .on('postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'messages', filter: `room_id=eq.${room.id}` },
        (p) => upsert([p.new as Message]))
      .on('broadcast', { event: 'typing' }, ({ payload }) => {
        if (payload?.user === me.id) return
        setOtherTyping(true)
        window.clearTimeout(typingTimer.current)
        typingTimer.current = window.setTimeout(() => setOtherTyping(false), 3000)
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') catchUp()
      })
    channelRef.current = ch
  }, [catchUp, me.id, room.id, upsert])

  useEffect(() => {
    setMessages([])
    loadInitial().then(subscribe)
    const onVisible = () => {
      if (document.visibilityState === 'visible') {
        catchUp().then(subscribe)
      }
    }
    document.addEventListener('visibilitychange', onVisible)
    window.addEventListener('online', onVisible)
    return () => {
      document.removeEventListener('visibilitychange', onVisible)
      window.removeEventListener('online', onVisible)
      if (channelRef.current) supabase.removeChannel(channelRef.current)
      channelRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room.id])

  // Mantener scroll: abajo si ya estábamos abajo; posición estable al cargar antiguos
  useLayoutEffect(() => {
    const el = scrollRef.current
    if (!el) return
    if (prevHeight.current !== null) {
      el.scrollTop += el.scrollHeight - prevHeight.current
      prevHeight.current = null
    } else if (stickBottom.current) {
      el.scrollTop = el.scrollHeight
    }
  }, [messages, otherTyping])

  function onScroll() {
    const el = scrollRef.current!
    stickBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80
    if (el.scrollTop < 120) loadOlder()
  }

  async function translate(id: string) {
    upsert(messagesRef.current.filter((m) => m.id === id).map((m) => ({ ...m, status: 'pending' as const })))
    await supabase.functions.invoke('translate-message', { body: { message_id: id } })
  }

  async function send(e?: React.FormEvent) {
    e?.preventDefault()
    const body = text.trim()
    if (!body) return
    setText('')
    const client_id = crypto.randomUUID()
    const optimistic: Message = {
      id: `tmp-${client_id}`, room_id: room.id, sender_id: me.id, source_lang: me.lang,
      source_text: body, translations: {}, status: 'pending', error_detail: null,
      client_id, created_at: new Date().toISOString(),
    }
    stickBottom.current = true
    upsert([optimistic])
    const { data, error } = await supabase
      .from('messages')
      .insert({ room_id: room.id, sender_id: me.id, source_lang: me.lang, source_text: body, client_id })
      .select().single()
    if (error || !data) {
      upsert([{ ...optimistic, status: 'failed', error_detail: error?.message ?? 'insert' }])
      return
    }
    upsert([data as Message])
    translate(data.id)
  }

  function onInput(v: string) {
    setText(v)
    const now = Date.now()
    if (channelRef.current && now - lastTypingSent.current > 1500) {
      lastTypingSent.current = now
      channelRef.current.send({ type: 'broadcast', event: 'typing', payload: { user: me.id } })
    }
  }

  async function retry(id: string) {
    if (id.startsWith('tmp-')) {
      const m = messagesRef.current.find((x) => x.id === id)
      if (!m) return
      setMessages((prev) => prev.filter((x) => x.id !== id))
      setText(m.source_text)
      return
    }
    translate(id)
  }

  return (
    <main className="h-full max-w-xl mx-auto flex flex-col">
      <header className="flex items-center gap-3 px-4 py-3 border-b border-line pt-[max(0.75rem,env(safe-area-inset-top))]">
        {onBack && (
          <button onClick={onBack} className="font-mono text-xs text-muted" aria-label={t(L, 'back')}>←</button>
        )}
        <h1 className="font-display text-lg truncate flex-1">{room.name}</h1>
        {!onBack && (
          <button className="font-mono text-xs text-muted" onClick={() => supabase.auth.signOut()}>
            {t(L, 'logout')}
          </button>
        )}
      </header>

      <div ref={scrollRef} onScroll={onScroll} className="flex-1 overflow-y-auto px-3 py-4 space-y-2">
        {loadingOlder && <p className="text-center font-mono text-xs text-muted">{t(L, 'loadOlder')}</p>}
        {messages.map((m) => (
          <Bubble key={m.client_id} msg={m} mine={m.sender_id === me.id} myLang={L} onRetry={retry} />
        ))}
        {otherTyping && <p className="font-mono text-xs text-muted px-1">{t(L, 'typing')}</p>}
      </div>

      <form
        onSubmit={send}
        className="flex items-end gap-2 p-3 border-t border-line pb-[max(0.75rem,env(safe-area-inset-bottom))]"
      >
        <textarea
          rows={1} value={text} placeholder={t(L, 'placeholder')}
          onChange={(e) => onInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey && !('ontouchstart' in window)) {
              e.preventDefault()
              send()
            }
          }}
          className="flex-1 resize-none max-h-32 rounded-ctl bg-surface border border-line px-3 py-2"
        />
        <button className="rounded-ctl bg-text text-ink px-4 py-2 font-medium" disabled={!text.trim()}>
          {t(L, 'send')}
        </button>
      </form>
    </main>
  )
}
