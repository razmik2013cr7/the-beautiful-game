alter table public.leagues enable row level security;
alter table public.matches enable row level security;
alter table public.streams enable row level security;
alter table public.posts enable row level security;
alter table public.post_likes enable row level security;

grant select on public.leagues, public.matches, public.streams, public.posts, public.post_likes to anon;
grant select on public.leagues, public.matches, public.streams, public.posts, public.post_likes to authenticated;
grant insert, update, delete on public.leagues, public.matches, public.streams, public.posts, public.post_likes to authenticated;

create policy "read leagues" on public.leagues for select using (true);
create policy "read matches" on public.matches for select using (true);
create policy "read streams" on public.streams for select using (true);
create policy "read posts" on public.posts for select using (true);
create policy "read post_likes" on public.post_likes for select using (true);

create policy "admin write leagues" on public.leagues for all to authenticated using (true) with check (true);
create policy "admin write matches" on public.matches for all to authenticated using (true) with check (true);
create policy "admin write streams" on public.streams for all to authenticated using (true) with check (true);
create policy "admin write posts" on public.posts for all to authenticated using (true) with check (true);
create policy "admin write post_likes" on public.post_likes for all to authenticated using (true) with check (true);

create unique index if not exists only_one_motd on public.matches ((true)) where is_match_of_the_day;

insert into public.leagues (id, name, country) values
  ('premier-league', 'Premier League', '🇬🇧'),
  ('la-liga', 'La Liga', '🇪🇸'),
  ('serie-a', 'Serie A', '🇮🇹'),
  ('bundesliga', 'Bundesliga', '🇩🇪'),
  ('ligue-1', 'Ligue 1', '🇫🇷'),
  ('champions-league', 'Champions League', '🇪🇺'),
  ('europa-league', 'Europa League', '🇪🇺'),
  ('world-cup', 'World Cup', '🌍'),
  ('friendly', 'Friendly', '🤝')
on conflict (name) do nothing;
