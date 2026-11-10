# Chat traductor ES ↔ PT-BR

Chat privado 1:1 con traducción automática (DeepL). Cada uno escribe en su idioma y lee en el suyo.
Especificación completa en `brief-chat-traductor.md`.

```
app/        Frontend: React + Vite + TypeScript + Tailwind (PWA)
supabase/   Esquema SQL con RLS y Edge Functions (translate-message, invite-contact)
```

## Puesta en marcha (una vez)

### 1. Supabase
1. Crea un proyecto en supabase.com (región Frankfurt o París).
2. **SQL Editor** → pega `supabase/migrations/0001_init.sql` → Run.
3. **Authentication → Sign In / Providers**: Email activado, **desactiva "Allow new users to sign up"**.
4. **Authentication → URL Configuration**: en *Site URL* pon la URL donde publiques la app (p. ej. `https://tuchat.vercel.app`) y añádela también a *Redirect URLs*.
5. **Authentication → Users → Add user**: crea tu usuario (titular) con tu email.
6. **SQL Editor**: crea tu perfil de titular (cambia el email):
   ```sql
   insert into profiles (id, display_name, lang, is_owner)
   select id, 'Yo', 'es', true from auth.users where email = 'TU@EMAIL.com';
   ```

### 2. Edge Functions
Con la [CLI de Supabase](https://supabase.com/docs/guides/cli):
```bash
supabase login
supabase link --project-ref TU_PROJECT_REF
supabase secrets set DEEPL_API_KEY=tu-clave-deepl-free
supabase functions deploy translate-message
supabase functions deploy invite-contact
```
`SUPABASE_URL`, `SUPABASE_ANON_KEY` y `SUPABASE_SERVICE_ROLE_KEY` ya los inyecta Supabase en las funciones.

### 3. Frontend
```bash
cd app
cp .env.example .env    # rellena URL y anon key (Settings → API)
npm install
npm run dev             # prueba local
npm run build           # genera dist/
```
Publicación en Vercel o Netlify: importa el repo, *root directory* `app`, comando `npm run build`, salida `dist`, y añade las dos variables `VITE_SUPABASE_*`.

## Uso
- Entras con tu email (enlace mágico). Ves la lista de conversaciones.
- **Invitar contacto**: nombre, email e idioma. Se crea su chat y le llega un email; al abrirlo entra directamente a su conversación.
- Cada contacto solo ve su propio chat.

## Comprobaciones antes de usarlo en serio
- `grep -r service_role app/dist` y `grep -r DEEPL app/dist` no deben devolver nada.
- Con la sesión de un contacto, intenta leer `messages` de otra sala vía REST: debe devolver vacío.
- Bloquea el móvil un minuto, desbloquea: los mensajes perdidos deben aparecer.

## Límites
- DeepL Free: 500.000 caracteres/mes. Si se agota, los mensajes llegan sin traducir con botón de reintentar.
- Supabase Free: el proyecto se pausa tras 7 días sin actividad.
- El envío de emails integrado de Supabase admite pocos correos por hora; para muchas invitaciones, configura un SMTP (p. ej. Resend) en Authentication → SMTP.
