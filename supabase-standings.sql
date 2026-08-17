-- Manual league tables (admin-created standings)
-- Run in the Supabase SQL Editor after supabase-rls.sql.
-- Public can read; only admins can create/edit/delete.

create table if not exists public.standings (
  id text primary key,
  competition text not null,
  pos int not null default 0,
  team text not null,
  played int not null default 0,
  won int not null default 0,
  drawn int not null default 0,
  lost int not null default 0,
  gf int not null default 0,
  ga int not null default 0,
  pts int not null default 0,
  created_at timestamptz not null default now()
);

alter table public.standings enable row level security;

grant select on public.standings to anon;
grant select on public.standings to authenticated;
grant insert, update, delete on public.standings to authenticated;

drop policy if exists "read standings" on public.standings;
create policy "read standings" on public.standings
  for select using (true);

drop policy if exists "admin write standings" on public.standings;
create policy "admin write standings" on public.standings
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create index if not exists standings_competition_idx on public.standings (competition, pos);
