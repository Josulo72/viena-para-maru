import { useState } from 'react'
import type { Lang, Message } from '../lib/types'
import { t } from '../lib/i18n'

interface Props {
  msg: Message
  mine: boolean
  myLang: Lang
  onRetry: (id: string) => void
}

const langColor: Record<Lang, string> = { es: 'bg-lang-es', pt: 'bg-lang-pt' }
const langText: Record<Lang, string> = { es: 'text-lang-es', pt: 'text-lang-pt' }

export default function Bubble({ msg, mine, myLang, onRetry }: Props) {
  const [open, setOpen] = useState(false)
  const time = new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  if (mine) {
    return (
      <div className="fade-in flex justify-end">
        <div className="max-w-[85%] rounded-bubble border border-line px-3 py-2">
          <p className="whitespace-pre-wrap break-words">{msg.source_text}</p>
          <p className="mt-1 font-mono text-[11px] text-muted text-right">
            {msg.status === 'pending' && `${t(myLang, 'translating')} · `}
            {msg.status === 'failed' && (
              <>
                {t(myLang, 'failed')} ·{' '}
                <button className="underline" onClick={() => onRetry(msg.id)}>{t(myLang, 'retry')}</button>{' '}·{' '}
              </>
            )}
            {time}
          </p>
        </div>
      </div>
    )
  }

  const translated = msg.translations[myLang]
  const sameLang = msg.source_lang === myLang
  const body = sameLang ? msg.source_text : translated ?? msg.source_text
  const hasEcho = !sameLang && !!translated

  return (
    <div className="fade-in flex justify-start">
      <div className="max-w-[85%] rounded-bubble bg-surface px-3 py-2">
        <button
          className="block w-full text-left"
          onClick={() => hasEcho && setOpen((o) => !o)}
          aria-expanded={hasEcho ? open : undefined}
          aria-label={hasEcho ? t(myLang, open ? 'hideOriginal' : 'showOriginal') : undefined}
        >
          <p className="whitespace-pre-wrap break-words">{body}</p>
        </button>

        {hasEcho && (
          <div className="echo" data-open={open}>
            <div>
              <div className={`h-px mt-2 ${langColor[msg.source_lang]}`} />
              <p className="pt-2 font-mono text-xs text-muted whitespace-pre-wrap break-words">
                {msg.source_text}
              </p>
            </div>
          </div>
        )}

        <p className="mt-1 font-mono text-[11px] text-muted">
          <span className={langText[msg.source_lang]}>{msg.source_lang.toUpperCase()}</span> · {time}
          {!sameLang && msg.status === 'pending' && ` · ${t(myLang, 'translating')}`}
          {!sameLang && msg.status === 'failed' && (
            <>
              {' '}· {t(myLang, 'failed')} ·{' '}
              <button className="underline" onClick={() => onRetry(msg.id)}>{t(myLang, 'retry')}</button>
            </>
          )}
        </p>
      </div>
    </div>
  )
}
