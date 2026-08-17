-- Sign up support: profiles + admin-only writes
-- Run this after supabase-rls.sql. Then make your account an admin (step at the bottom).

-- 1) Profiles table
create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  name text not null default '',
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

grant select on public.profiles to anon;
grant select on public.profiles to authenticated;

drop policy if exists "read own profile" on public.profiles;
create policy "read own profile" on public.profiles
  for select using (user_id = auth.uid());

-- 2) Auto-create a profile row on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (user_id, name)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', ''))
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 3) Backfill profiles for accounts that exist already
insert into public.profiles (user_id, name)
select id, coalesce(raw_user_meta_data->>'name', '')
from auth.users
on conflict (user_id) do nothing;

-- 4) Admin check helper
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists(
    select 1 from public.profiles
    where user_id = auth.uid() and is_admin
  );
$$;

grant execute on function public.is_admin() to anon;
grant execute on function public.is_admin() to authenticated;

-- 5) Tighten writes: only admins can write now
drop policy if exists "admin write leagues" on public.leagues;
drop policy if exists "admin write matches" on public.matches;
drop policy if exists "admin write streams" on public.streams;
drop policy if exists "admin write posts" on public.posts;
drop policy if exists "admin write post_likes" on public.post_likes;

create policy "admin write leagues" on public.leagues
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin write matches" on public.matches
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin write streams" on public.streams
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin write posts" on public.posts
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin write post_likes" on public.post_likes
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- 6) MAKE YOURSELF ADMIN — replace the email and run this line separately:
-- update public.profiles set is_admin = true
-- where user_id = (select id from auth.users where email = 'YOUR_EMAIL_HERE');