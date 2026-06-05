-- ============================================================
-- BookFlow — multi-tenant scheduling SaaS schema
-- Run this in the Supabase SQL editor (Dashboard > SQL Editor).
-- ============================================================

-- Each host (your paying customer) has a profile tied to their auth account.
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  slug        text unique not null,              -- their public booking URL: /book/their-slug
  display_name text not null,
  bio         text,
  timezone    text not null default 'America/Los_Angeles',
  -- availability config
  day_start   int  not null default 9,           -- 9 = 9am
  day_end     int  not null default 17,           -- 17 = 5pm
  slot_minutes int not null default 15,
  workdays    int[] not null default '{1,2,3,4,5}', -- 0=Sun..6=Sat
  created_at  timestamptz not null default now()
);

-- Bookings made by visitors against a host.
create table if not exists public.bookings (
  id          uuid primary key default gen_random_uuid(),
  host_id     uuid not null references public.profiles(id) on delete cascade,
  start_time  timestamptz not null,              -- absolute UTC start
  end_time    timestamptz not null,
  guest_name  text not null,
  guest_email text not null,
  notes       text,
  status      text not null default 'confirmed', -- confirmed | cancelled
  created_at  timestamptz not null default now(),
  -- prevent double-booking the same host at the same time
  unique (host_id, start_time)
);

create index if not exists bookings_host_time_idx on public.bookings (host_id, start_time);

-- ============================================================
-- Row Level Security
-- ============================================================
alter table public.profiles enable row level security;
alter table public.bookings enable row level security;

-- Profiles: anyone can read (public booking pages need this); only the owner can write.
create policy "profiles_public_read" on public.profiles
  for select using (true);
create policy "profiles_owner_insert" on public.profiles
  for insert with check (auth.uid() = id);
create policy "profiles_owner_update" on public.profiles
  for update using (auth.uid() = id);

-- Bookings:
-- - the host can read their own bookings (dashboard)
-- - anyone can create a booking (public visitors)
-- - only the host can cancel/update
create policy "bookings_host_read" on public.bookings
  for select using (auth.uid() = host_id);
create policy "bookings_public_insert" on public.bookings
  for insert with check (true);
create policy "bookings_host_update" on public.bookings
  for update using (auth.uid() = host_id);

-- A public function so visitors can see which slots are already taken
-- WITHOUT exposing guest names/emails (privacy).
create or replace function public.taken_slots(p_host uuid, p_from timestamptz, p_to timestamptz)
returns table (start_time timestamptz)
language sql security definer set search_path = public as $$
  select start_time from public.bookings
  where host_id = p_host and status = 'confirmed'
    and start_time >= p_from and start_time < p_to;
$$;

grant execute on function public.taken_slots(uuid, timestamptz, timestamptz) to anon, authenticated;
