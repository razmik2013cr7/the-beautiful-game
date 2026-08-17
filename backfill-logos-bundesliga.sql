-- Backfill crests for Bundesliga matches. Run in the Supabase SQL Editor.
-- Only updates rows where the crest is currently empty.

update public.matches m set home_logo = v.logo
  from (values
    ('1. FC Köln', 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/1._FC_Koeln_Logo_2014%E2%80%93.svg/330px-1._FC_Koeln_Logo_2014%E2%80%93.svg.png'),
    ('1. FC Union Berlin', 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/1._FC_Union_Berlin_Logo.svg/330px-1._FC_Union_Berlin_Logo.svg.png'),
    ('1. FSV Mainz 05', 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/1._FSV_Mainz_05_logo.svg/330px-1._FSV_Mainz_05_logo.svg.png'),
    ('Bayer 04 Leverkusen', 'https://upload.wikimedia.org/wikipedia/en/thumb/5/59/Bayer_04_Leverkusen_logo.svg/330px-Bayer_04_Leverkusen_logo.svg.png'),
    ('Borussia Dortmund', 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Borussia_Dortmund_logo.svg/330px-Borussia_Dortmund_logo.svg.png'),
    ('Borussia Mönchengladbach', 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Borussia_M%C3%B6nchengladbach_logo.svg/330px-Borussia_M%C3%B6nchengladbach_logo.svg.png'),
    ('Eintracht Frankfurt', 'https://upload.wikimedia.org/wikipedia/en/thumb/7/7e/Eintracht_Frankfurt_crest.svg/330px-Eintracht_Frankfurt_crest.svg.png'),
    ('FC Augsburg', 'https://upload.wikimedia.org/wikipedia/en/thumb/c/c5/FC_Augsburg_logo.svg/330px-FC_Augsburg_logo.svg.png'),
    ('FC Bayern München', 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/FC_Bayern_M%C3%BCnchen_logo_%282024%29.svg/330px-FC_Bayern_M%C3%BCnchen_logo_%282024%29.svg.png'),
    ('FC Schalke 04', 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/FC_Schalke_04_Logo.svg/330px-FC_Schalke_04_Logo.svg.png'),
    ('Hamburger SV', 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Hamburger_SV_logo.svg/330px-Hamburger_SV_logo.svg.png'),
    ('RB Leipzig', 'https://upload.wikimedia.org/wikipedia/en/thumb/0/04/RB_Leipzig_2014_logo.svg/330px-RB_Leipzig_2014_logo.svg.png'),
    ('SC Paderborn 07', 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/SC_Paderborn_07_Logo_new.svg/330px-SC_Paderborn_07_Logo_new.svg.png'),
    ('SV Elversberg', 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/SV_Elversberg_Logo_2021.svg/330px-SV_Elversberg_Logo_2021.svg.png'),
    ('SV Werder Bremen', 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/SV-Werder-Bremen-Logo.svg/330px-SV-Werder-Bremen-Logo.svg.png'),
    ('Sport-Club Freiburg', 'https://upload.wikimedia.org/wikipedia/en/thumb/6/6d/SC_Freiburg_logo.svg/330px-SC_Freiburg_logo.svg.png'),
    ('TSG Hoffenheim', 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Logo_TSG_Hoffenheim.svg/330px-Logo_TSG_Hoffenheim.svg.png'),
    ('VfB Stuttgart', 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/VfB_Stuttgart_1893_Logo.svg/330px-VfB_Stuttgart_1893_Logo.svg.png')
  ) as v(team, logo)
  where m.competition = 'Bundesliga' and m.home_team = v.team and (m.home_logo is null or m.home_logo = '');

update public.matches m set away_logo = v.logo
  from (values
    ('1. FC Köln', 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/1._FC_Koeln_Logo_2014%E2%80%93.svg/330px-1._FC_Koeln_Logo_2014%E2%80%93.svg.png'),
    ('1. FC Union Berlin', 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/1._FC_Union_Berlin_Logo.svg/330px-1._FC_Union_Berlin_Logo.svg.png'),
    ('1. FSV Mainz 05', 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/1._FSV_Mainz_05_logo.svg/330px-1._FSV_Mainz_05_logo.svg.png'),
    ('Bayer 04 Leverkusen', 'https://upload.wikimedia.org/wikipedia/en/thumb/5/59/Bayer_04_Leverkusen_logo.svg/330px-Bayer_04_Leverkusen_logo.svg.png'),
    ('Borussia Dortmund', 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Borussia_Dortmund_logo.svg/330px-Borussia_Dortmund_logo.svg.png'),
    ('Borussia Mönchengladbach', 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Borussia_M%C3%B6nchengladbach_logo.svg/330px-Borussia_M%C3%B6nchengladbach_logo.svg.png'),
    ('Eintracht Frankfurt', 'https://upload.wikimedia.org/wikipedia/en/thumb/7/7e/Eintracht_Frankfurt_crest.svg/330px-Eintracht_Frankfurt_crest.svg.png'),
    ('FC Augsburg', 'https://upload.wikimedia.org/wikipedia/en/thumb/c/c5/FC_Augsburg_logo.svg/330px-FC_Augsburg_logo.svg.png'),
    ('FC Bayern München', 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/FC_Bayern_M%C3%BCnchen_logo_%282024%29.svg/330px-FC_Bayern_M%C3%BCnchen_logo_%282024%29.svg.png'),
    ('FC Schalke 04', 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/FC_Schalke_04_Logo.svg/330px-FC_Schalke_04_Logo.svg.png'),
    ('Hamburger SV', 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Hamburger_SV_logo.svg/330px-Hamburger_SV_logo.svg.png'),
    ('RB Leipzig', 'https://upload.wikimedia.org/wikipedia/en/thumb/0/04/RB_Leipzig_2014_logo.svg/330px-RB_Leipzig_2014_logo.svg.png'),
    ('SC Paderborn 07', 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/SC_Paderborn_07_Logo_new.svg/330px-SC_Paderborn_07_Logo_new.svg.png'),
    ('SV Elversberg', 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/SV_Elversberg_Logo_2021.svg/330px-SV_Elversberg_Logo_2021.svg.png'),
    ('SV Werder Bremen', 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/SV-Werder-Bremen-Logo.svg/330px-SV-Werder-Bremen-Logo.svg.png'),
    ('Sport-Club Freiburg', 'https://upload.wikimedia.org/wikipedia/en/thumb/6/6d/SC_Freiburg_logo.svg/330px-SC_Freiburg_logo.svg.png'),
    ('TSG Hoffenheim', 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Logo_TSG_Hoffenheim.svg/330px-Logo_TSG_Hoffenheim.svg.png'),
    ('VfB Stuttgart', 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/VfB_Stuttgart_1893_Logo.svg/330px-VfB_Stuttgart_1893_Logo.svg.png')
  ) as v(team, logo)
  where m.competition = 'Bundesliga' and m.away_team = v.team and (m.away_logo is null or m.away_logo = '');
