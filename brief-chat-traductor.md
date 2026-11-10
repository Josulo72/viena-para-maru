# Brief: chat traductor español ↔ portugués (Brasil)

Documento de especificación para implementar la aplicación completa. Uso personal: un titular y varias conversaciones 1:1 independientes.

---

## 1. Objetivo

Una web app de chat en la que cada participante escribe en su idioma y lee siempre en el suyo. Uno escribe en español, el otro recibe en portugués de Brasil, y al revés. La traducción es automática y transparente: nadie pulsa un botón de "traducir".

**Principio de diseño de datos**: el mensaje original nunca se pierde. Se guardan siempre el texto tal cual se escribió y las traducciones generadas, por separado.

---

## 2. Alcance

**Dentro:**
- Varias conversaciones 1:1 entre el titular y cada contacto, en tiempo real
- Cada contacto solo ve su propia conversación: ni la lista de salas, ni otros contactos, ni sus perfiles
- Traducción automática bidireccional ES ↔ PT-BR. Un único idioma de contacto: portugués de Brasil
- Invitar contactos desde la app (solo el titular)
- Historial persistente y scroll infinito hacia arriba
- Ver el texto original de cualquier mensaje
- PWA instalable en móvil (iOS y Android)
- Indicador de "escribiendo"
- Estados de traducción y reintento manual si falla

**Fuera (de momento):**
- Notas de voz, audio, imágenes o archivos adjuntos
- Notificaciones push
- Registro público abierto
- Grupos y chats entre contactos
- Apps nativas

El modelo de datos sí debe quedar preparado para audio (ver §4), pero no se implementa nada de voz.

---

## 3. Stack

| Capa | Elección | Motivo |
|---|---|---|
| Frontend | React 18 + Vite + TypeScript | — |
| Estilos | Tailwind CSS | — |
| Backend / DB | Supabase (Postgres + Realtime + Auth) | Evita escribir backend propio |
| Traducción | DeepL API Free | Buena calidad ES↔PT-BR y control de formalidad |
| Lógica servidor | Supabase Edge Function (Deno) | Mantiene la API key de DeepL fuera del navegador |
| Hosting | Vercel o Netlify | — |

**Auth**: Supabase Auth con magic link por email. No hace falta contraseña, ni registro abierto, ni OAuth. Deshabilitar el signup público en el panel de Supabase y crear a mano solo la cuenta del titular. Los contactos se dan de alta por invitación (§6 bis).

---

## 4. Esquema de datos

```sql
-- Perfil de cada participante, 1:1 con auth.users
create table profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  lang         text not null check (lang in ('es','pt')),
  created_at   timestamptz not null default now()
);

-- Sala de conversación: una por cada contacto, siempre 1:1 con el titular
create table rooms (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  created_at timestamptz not null default now()
);

-- Pertenencia a sala
create table room_members (
  room_id    uuid references rooms(id) on delete cascade,
  profile_id uuid references profiles(id) on delete cascade,
  joined_at  timestamptz not null default now(),
  primary key (room_id, profile_id)
);

-- Mensajes
create table messages (
  id           uuid primary key default gen_random_uuid(),
  room_id      uuid not null references rooms(id) on delete cascade,
  sender_id    uuid not null references profiles(id),
  kind         text not null default 'text' check (kind in ('text','voice')),
  source_lang  text not null check (source_lang in ('es','pt')),
  source_text  text not null,
  translations jsonb not null default '{}'::jsonb,
  status       text not null default 'pending'
                 check (status in ('pending','translated','failed')),
  error_detail text,
  media_url    text,           -- reservado para voz, siempre null por ahora
  client_id    uuid not null,  -- generado en el cliente, evita duplicados
  created_at   timestamptz not null default now()
);

create index messages_room_created_idx on messages (room_id, created_at desc);
create unique index messages_client_id_idx on messages (client_id);

-- Indicador de "escribiendo"
create table typing_state (
  room_id    uuid references rooms(id) on delete cascade,
  profile_id uuid references profiles(id) on delete cascade,
  updated_at timestamptz not null default now(),
  primary key (room_id, profile_id)
);
```

### Sobre `translations`

Objeto JSON indexado por código de idioma:

```json
{ "pt": "Nos vemos amanhã." }
```

El cliente lee `translations[miIdioma]`. Si esa clave no existe, muestra `source_text`. Esto hace tres cosas a la vez: sirve de caché, evita duplicar columnas, y permite añadir un tercer idioma más adelante sin migrar nada.

Nunca se traduce a `source_lang`: quien escribió el mensaje lo ve siempre tal cual lo escribió.

### RLS (obligatorio)

Activar Row Level Security en las cuatro tablas. Políticas:

- `profiles`: cada usuario lee y actualiza solo su propia fila; puede leer las de quienes comparten sala con él. Un contacto nunca puede leer el perfil de otro contacto
- `rooms` y `room_members`: lectura solo si el usuario es miembro de esa sala. El titular ve todas las suyas; cada contacto, solo la suya
- `messages`: `select` e `insert` solo si el usuario es miembro de `room_id`; en el `insert`, `sender_id` debe ser igual a `auth.uid()`. Ningún `update` ni `delete` desde el cliente
- `typing_state`: `upsert` solo de la propia fila; lectura para miembros de la sala

La Edge Function usa la `service_role` key y salta RLS para escribir las traducciones. Esa key **solo** vive en los secrets de Supabase.

---

## 5. Flujo end-to-end

1. El usuario escribe y pulsa enviar
2. El cliente genera un `client_id` (uuid v4) e inserta la fila en `messages` con `status = 'pending'` y `translations = {}`
3. La burbuja aparece inmediatamente en pantalla, marcada como pendiente de traducir
4. Realtime propaga el `INSERT` al otro participante, que ve la burbuja con el texto original y un indicador de traducción en curso
5. El cliente invoca la Edge Function `translate-message` pasando el `message.id`
6. La función lee el mensaje, determina los idiomas destino (todos los idiomas de los miembros de la sala distintos de `source_lang`), llama a DeepL y hace `update` de `translations` y `status`
7. Realtime propaga el `UPDATE`. Ambos clientes sustituyen el contenido de la burbuja sin recargar nada

**Fallo de traducción**: `status = 'failed'` y `error_detail` con el mensaje. El receptor ve el texto original con una etiqueta discreta indicando que no se pudo traducir, más un botón para reintentar que vuelve a invocar la función. El mensaje nunca se pierde ni se bloquea.

**Idempotencia**: la función debe poder ejecutarse varias veces sobre el mismo mensaje sin efectos raros. Si `status` ya es `'translated'` y la clave del idioma destino existe, retorna sin llamar a DeepL.

---

## 6. Edge Function `translate-message`

**Entrada**: `{ "message_id": "uuid" }`, con el JWT del usuario en la cabecera `Authorization`.

**Comportamiento:**
1. Validar el JWT y comprobar que el usuario es miembro de la sala del mensaje. Si no, 403
2. Cargar el mensaje. Si `status = 'translated'` y ya están todas las claves, retornar 200 sin más
3. Calcular idiomas destino desde `room_members` + `profiles.lang`
4. Llamar a DeepL: `POST https://api-free.deepl.com/v2/translate` con `text`, `source_lang` y `target_lang` (`ES` / `PT`) y `target_lang` (`ES` / `PT-BR`). Pasar `formality: "prefer_less"`
5. Escribir `translations` y `status = 'translated'`
6. Ante error de DeepL: `status = 'failed'` y `error_detail` con el código HTTP y el cuerpo de la respuesta

**Salida**: `{ "status": "translated" | "failed", "translations": {...} }`

**Secrets**: `DEEPL_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY`. Ninguno de los dos aparece en el bundle del frontend. Verifícalo antes de desplegar.

**Tope de consumo (obligatorio, plan Free):**
- Máximo 1.000 caracteres por mensaje (validado en cliente y con `check (char_length(source_text) <= 1000)`)
- Tope mensual propio en 450.000 caracteres (margen bajo el límite de DeepL). Tabla `translation_usage (month, chars)`; la función suma antes de llamar a DeepL y, si se supera, marca `status = 'failed'` con `error_detail = 'quota'` sin llamar a la API
- Límite por usuario: 30 traducciones por minuto en la Edge Function; el exceso devuelve 429
- Aviso al titular en la app al 80 % del tope mensual

**Límite**: el plan Free de DeepL son 500.000 caracteres al mes. Para dos personas conversando a diario sobra, pero conviene loguear el consumo. DeepL devuelve el uso en `GET /v2/usage`.

---

## 6 bis. Invitaciones

- Tabla `invites (id, email, lang, display_name, room_id, created_by, used_at)`. Solo el titular puede insertar (RLS)
- Edge Function `invite-contact`: valida que quien llama es el titular, crea la sala 1:1, el `room_members` del titular y envía el magic link con `auth.admin.inviteUserByEmail`
- Al primer login, un trigger crea el `profile` del contacto con el `lang` de la invitación y lo une a su sala
- El signup público sigue deshabilitado: solo se entra por invitación

---

## 7. Realtime

- Suscripción al canal `postgres_changes` sobre `messages` filtrado por `room_id`, escuchando `INSERT` y `UPDATE`
- Deduplicar por `client_id` al recibir el `INSERT` propio, para no pintar la burbuja dos veces
- El indicador de "escribiendo" va por Broadcast, no por tabla, para no generar escrituras constantes en Postgres. La tabla `typing_state` queda como reserva si el broadcast da problemas
- Reconexión automática al volver del segundo plano: en móvil el WebSocket se cae al bloquear la pantalla. Al recuperar el foco, refetch de los mensajes posteriores al último `created_at` conocido y luego resuscripción

Este último punto es el bug más probable de todo el proyecto. Pruébalo explícitamente en un móvil real.

**Varias salas**: el titular se suscribe a todas sus salas (un canal por sala o filtro `room_id=in.(...)`). Un contacto solo puede suscribirse a la suya; Realtime respeta RLS, así que verificar que un contacto no recibe eventos de otras salas.

---

## 8. Dirección visual

La app trata sobre dos alfabetos que conviven. Eso es el material de diseño, no un fondo decorativo.

### Paleta

| Token | Hex | Uso |
|---|---|---|
| `--ink` | `#0F1620` | Fondo general |
| `--surface` | `#18232F` | Burbujas del otro, barras |
| `--line` | `#2B3948` | Divisores, bordes |
| `--lang-es` | `#E0A040` | Ámbar: identidad del español |
| `--lang-pt` | `#48ADA4` | Verde jade: identidad del portugués |
| `--text` | `#E9EEF3` | Texto principal |
| `--muted` | `#8496A6` | Metadatos, texto original |

Cada idioma tiene color propio. No es decoración: el color indica en qué idioma se escribió originalmente el mensaje, y aparece en el divisor del eco y en la etiqueta.

### Tipografía

- **Display**: Unbounded — geométrica y ancha, con soporte latino extendido (acentos y tildes de ES y PT). Solo en el encabezado de la sala y la pantalla de acceso. Nada más
- **Cuerpo**: Golos Text — buena legibilidad en móvil con diacríticos (ã, õ, ç, ñ)
- **Utilidad**: JetBrains Mono — timestamps, etiquetas `ES` / `PT`, texto original

Comprueba que las tres cargan el subset `latin-ext`. Si no, `ã` o `õ` caen al fallback del sistema.

### Elemento distintivo: el eco

Cada burbuja recibida muestra la traducción a tamaño de lectura normal y, debajo, separada por una línea de 1 px del color del idioma origen, el texto original en mono a 12 px y en `--muted`. Colapsado por defecto, se despliega al tocar la burbuja con una transición de altura de 180 ms.

Es lo que hace que la app no parezca una caja negra: siempre se ve qué escribió realmente la otra persona, y con el tiempo se reconocen palabras.

### Resto

Todo lo demás, disciplinado y callado. Sin gradientes, sin sombras difusas, sin animaciones de entrada en las burbujas más allá de un fade de 120 ms. Radio de borde 14 px en burbujas, 8 px en controles. Respetar `prefers-reduced-motion`. Foco de teclado visible.

### Textos de interfaz

Sobrios y en el idioma del usuario (interfaz bilingüe ES/PT según `profiles.lang`). Nada de "¡Ups!" ni disculpas. Ejemplos: `Traduciendo…` / `Traduzindo…`, `No se pudo traducir` / `Não foi possível traduzir`, `Reintentar` / `Tentar de novo`, `Ver original`.

**Lista de conversaciones**: solo la ve el titular. Un contacto entra directamente a su sala, sin pantalla de lista.

---

## 9. Criterios de aceptación

- [ ] Escribo en español y el contacto lo recibe en portugués en menos de 2 segundos
- [ ] Yo sigo viendo mi propio mensaje en español, nunca traducido
- [ ] Puedo desplegar el original de cualquier mensaje recibido
- [ ] Si DeepL falla, el mensaje llega igual en su idioma original, marcado, y con opción de reintentar
- [ ] El historial persiste tras cerrar y reabrir, con scroll hacia arriba paginado
- [ ] Bloqueo el móvil, espero un minuto, lo desbloqueo: los mensajes perdidos aparecen y el realtime sigue funcionando
- [ ] Inspeccionando el bundle del frontend no aparece ninguna clave de DeepL ni la `service_role`
- [ ] Un usuario que no es miembro de la sala no puede leer ni insertar mensajes (probar directamente contra la API REST de Supabase, no solo por la UI)
- [ ] Un contacto no puede leer salas, mensajes ni perfiles de otro contacto (REST y Realtime)
- [ ] Instalable como PWA en iOS y Android
- [ ] Interfaz usable a 360 px de ancho

---

## 10. Limitaciones conocidas

- **Variante**: usar siempre `PT-BR` como destino, no `PT-PT`; el portugués europeo suena raro en Brasil
- **Sin contexto conversacional**: cada mensaje se traduce aislado, así que los pronombres ambiguos y las respuestas de una palabra ("vale", "ese") pueden salir raras. Se resuelve pasando los 3 o 4 mensajes anteriores como contexto, pero eso exige un LLM en vez de DeepL
- **Modismos**: se traducirán mal. Es inherente

---

## 11. Preparado para voz (no implementar ahora)

El esquema ya contempla `kind` y `media_url`. Cuando se añada, una nota de voz será un mensaje con `kind = 'voice'`, el audio en Supabase Storage, y `source_text` relleno con la transcripción. El resto del flujo de traducción no cambia. No añadas nada más de voz en esta fase.
