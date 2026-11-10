-- Chat traductor ES ↔ PT-BR · esquema inicial
-- Ejecutar en Supabase: SQL Editor → pegar → Run

-- ───────────── Tablas ─────────────

create table public.profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  lang         text not null check (lang in ('es','pt')),
  is_owner     boolean not null default false,
  created_at   timestamptz not null default now()
);

create table public.rooms (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  created_at timestamptz not null default now()
);

create table public.room_members (
  room_id    uuid references public.rooms(id) on delete cascade,
  profile_id uuid references public.profiles(id) on delete cascade,
  joined_at  timestamptz not null default now(),
  primary key (room_id, profile_id)
);

create table public.messages (
  id           uuid primary key default gen_random_uuid(),
  room_id      uuid not null references public.rooms(id) on delete cascade,
  sender_id    uuid not null references public.profiles(id),
  kind         text not null default 'text' check (kind in ('text','voice')),
  source_lang  text not null check (source_lang in ('es','pt')),
  source_text  text not null,
  translations jsonb not null default '{}'::jsonb,
  status       text not null default 'pending'
                 check (status in ('pending','translated','failed')),
  error_detail text,
  media_url    text,
  client_id    uuid not null,
  created_at   timestamptz not null default now()
);

create index messages_room_created_idx on public.messages (room_id, created_at desc);
create unique index messages_client_id_idx on public.messages (client_id);

create table public.typing_state (
  room_id    uuid references public.rooms(id) on delete cascade,
  profile_id uuid references public.profiles(id) on delete cascade,
  updated_at timestamptz not null default now(),
  primary key (room_id, profile_id)
);

create table public.invites (
  id           uuid primary key default gen_random_uuid(),
  email        text not null unique,
  display_name text not null,
  lang         text not null check (lang in ('es','pt')),
  room_id      uuid not null references public.rooms(id) on delete cascade,
  created_by   uuid not null references public.profiles(id),
  used_at      timestamptz,
  created_at   timestamptz not null default now()
);

-- ───────────── Helpers (security definer para evitar recursión en RLS) ─────────────

create or replace function public.is_room_member(r uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from room_members where room_id = r and profile_id = auth.uid());
$$;

create or replace function public.shares_room_with(p uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from room_members a join room_members b on a.room_id = b.room_id
    where a.profile_id = auth.uid() and b.profile_id = p
  );
$$;

create or replace function public.is_owner()
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce((select is_owner from profiles where id = auth.uid()), false);
$$;

-- ───────────── RLS ─────────────

alter table public.profiles     enable row level security;
alter table public.rooms        enable row level security;
alter table public.room_members enable row level security;
alter table public.messages     enable row level security;
alter table public.typing_state enable row level security;
alter table public.invites      enable row level security;

create policy profiles_select on public.profiles for select
  using (id = auth.uid() or public.shares_room_with(id));

-- Solo se puede cambiar el nombre visible, nunca lang ni is_owner
create policy profiles_update on public.profiles for update
  using (id = auth.uid()) with check (id = auth.uid());
revoke update on public.profiles from authenticated;
grant update (display_name) on public.profiles to authenticated;

create policy rooms_select on public.rooms for select
  using (public.is_room_member(id));

create policy members_select on public.room_members for select
  using (public.is_room_member(room_id));

create policy messages_select on public.messages for select
  using (public.is_room_member(room_id));

create policy messages_insert on public.messages for insert
  with check (
    sender_id = auth.uid()
    and public.is_room_member(room_id)
    and status = 'pending'
    and translations = '{}'::jsonb
    and source_lang = (select lang from public.profiles where id = auth.uid())
  );
-- Sin políticas de update/delete en messages: el cliente no puede modificarlos.

create policy typing_select on public.typing_state for select
  using (public.is_room_member(room_id));
create policy typing_insert on public.typing_state for insert
  with check (profile_id = auth.uid() and public.is_room_member(room_id));
create policy typing_update on public.typing_state for update
  using (profile_id = auth.uid()) with check (profile_id = auth.uid());

create policy invites_owner_select on public.invites for select
  using (public.is_owner());
-- Las invitaciones solo se crean desde la Edge Function (service_role).

-- ───────────── Alta automática del contacto al aceptar la invitación ─────────────

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare inv invites;
begin
  select * into inv from invites where lower(email) = lower(new.email) and used_at is null;
  if found then
    insert into profiles (id, display_name, lang) values (new.id, inv.display_name, inv.lang);
    insert into room_members (room_id, profile_id) values (inv.room_id, new.id);
    update invites set used_at = now() where id = inv.id;
  end if;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ───────────── Realtime ─────────────

alter publication supabase_realtime add table public.messages;
