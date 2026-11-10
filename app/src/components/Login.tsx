import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { browserLang, t } from '../lib/i18n'

export default function Login() {
  const lang = browserLang()
  const [email, setEmail] = useState('')
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setState('sending')
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: false, emailRedirectTo: window.location.origin },
    })
    setState(error ? 'error' : 'sent')
  }

  return (
    <main className="min-h-full flex items-center justify-center px-4">
      <form onSubmit={submit} className="w-full max-w-sm space-y-4">
        <h1 className="font-display text-2xl tracking-tight">
          <span className="text-lang-es">ES</span>
          <span className="text-muted mx-2">↔</span>
          <span className="text-lang-pt">PT</span>
        </h1>
        <label className="block">
          <span className="font-mono text-xs text-muted">{t(lang, 'email')}</span>
          <input
            type="email" required autoComplete="email" value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-ctl bg-surface border border-line px-3 py-2 text-text"
          />
        </label>
        <button
          disabled={state === 'sending'}
          className="w-full rounded-ctl bg-text text-ink py-2 font-medium disabled:opacity-50"
        >
          {t(lang, 'sendLink')}
        </button>
        {state === 'sent' && <p className="text-sm text-muted">{t(lang, 'linkSent')}</p>}
        {state === 'error' && <p className="text-sm text-muted">{t(lang, 'notAllowed')}</p>}
      </form>
    </main>
  )
}
