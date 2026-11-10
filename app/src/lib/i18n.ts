import type { Lang } from './types'

const dict = {
  es: {
    email: 'Email',
    sendLink: 'Enviar enlace de acceso',
    linkSent: 'Revisa tu correo y abre el enlace.',
    notAllowed: 'Esta dirección no tiene acceso.',
    translating: 'Traduciendo…',
    failed: 'No se pudo traducir',
    retry: 'Reintentar',
    showOriginal: 'Ver original',
    hideOriginal: 'Ocultar original',
    placeholder: 'Escribe un mensaje',
    send: 'Enviar',
    typing: 'escribiendo…',
    loadOlder: 'Cargando…',
    conversations: 'Conversaciones',
    noConversations: 'Aún no hay conversaciones.',
    invite: 'Invitar contacto',
    name: 'Nombre',
    language: 'Idioma',
    inviteSent: 'Invitación enviada.',
    back: 'Volver',
    logout: 'Salir',
    noRoom: 'Tu cuenta aún no tiene conversación asignada.',
    usage: 'DeepL este mes',
  },
  pt: {
    email: 'Email',
    sendLink: 'Enviar link de acesso',
    linkSent: 'Confira seu email e abra o link.',
    notAllowed: 'Este endereço não tem acesso.',
    translating: 'Traduzindo…',
    failed: 'Não foi possível traduzir',
    retry: 'Tentar de novo',
    showOriginal: 'Ver original',
    hideOriginal: 'Ocultar original',
    placeholder: 'Escreva uma mensagem',
    send: 'Enviar',
    typing: 'digitando…',
    loadOlder: 'Carregando…',
    conversations: 'Conversas',
    noConversations: 'Ainda não há conversas.',
    invite: 'Convidar contato',
    name: 'Nome',
    language: 'Idioma',
    inviteSent: 'Convite enviado.',
    back: 'Voltar',
    logout: 'Sair',
    noRoom: 'Sua conta ainda não tem conversa atribuída.',
    usage: 'DeepL este mês',
  },
} as const

export type Key = keyof typeof dict.es

export function t(lang: Lang, key: Key): string {
  return dict[lang][key]
}

export function browserLang(): Lang {
  return navigator.language.toLowerCase().startsWith('pt') ? 'pt' : 'es'
}
