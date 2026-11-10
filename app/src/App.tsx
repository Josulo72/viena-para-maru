import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from './lib/supabase'
import type { Profile, Room } from './lib/types'
import { t } from './lib/i18n'
import Login from './components/Login'
import RoomList from './components/RoomList'
import Chat from './components/Chat'

export default function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [ready, setReady] = useState(false)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [rooms, setRooms] = useState<Room[] | null>(null)
  const [activeRoom, setActiveRoom] = useState<Room | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setReady(true)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => sub.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!session) {
      setProfile(null)
      setRooms(null)
      setActiveRoom(null)
      return
    }
    ;(async () => {
      const { data: p } = await supabase
        .from('profiles').select('id, display_name, lang, is_owner')
        .eq('id', session.user.id).single()
      setProfile(p as Profile)
      const { data: r } = await supabase.from('rooms').select('id, name').order('created_at')
      setRooms((r ?? []) as Room[])
      // Un contacto solo tiene una sala: entra directo
      if (p && !p.is_owner && r && r.length > 0) setActiveRoom(r[0] as Room)
    })()
  }, [session])

  if (!ready) return null
  if (!session) return <Login />
  if (!profile || !rooms) return null

  if (activeRoom) {
    return (
      <Chat
        me={profile}
        room={activeRoom}
        onBack={profile.is_owner ? () => setActiveRoom(null) : undefined}
      />
    )
  }

  if (!profile.is_owner) {
    return (
      <div className="p-6 text-muted">
        {t(profile.lang, 'noRoom')}
        <button className="block mt-4 underline" onClick={() => supabase.auth.signOut()}>
          {t(profile.lang, 'logout')}
        </button>
      </div>
    )
  }

  return (
    <RoomList
      me={profile}
      rooms={rooms}
      onOpen={setActiveRoom}
      onCreated={(room) => setRooms((prev) => [...(prev ?? []), room])}
    />
  )
}
