-- Backfill crests for Ligue 1 matches. Run in the Supabase SQL Editor.
-- Only updates rows where the crest is currently empty.

update public.matches m set home_logo = v.logo
  from (values
    ('AJ Auxerre', 'https://upload.wikimedia.org/wikipedia/en/thumb/5/51/AJAuxerreLogo.svg/330px-AJAuxerreLogo.svg.png'),
    ('AS Monaco', 'https://upload.wikimedia.org/wikipedia/en/thumb/c/cf/LogoASMonacoFC2021.svg/330px-LogoASMonacoFC2021.svg.png'),
    ('Angers SCO', 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Angers_Sporting_Club_de_l%27Ouest_logo.svg/330px-Angers_Sporting_Club_de_l%27Ouest_logo.svg.png'),
    ('Estac Troyes', 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/ESTAC_Troyes_Logo.svg/330px-ESTAC_Troyes_Logo.svg.png'),
    ('FC Lorient', 'https://upload.wikimedia.org/wikipedia/en/thumb/4/4c/FC_Lorient_logo.svg/330px-FC_Lorient_logo.svg.png'),
    ('Havre Athletic Club', 'https://upload.wikimedia.org/wikipedia/en/thumb/f/fc/Le_Havre_AC_logo.svg/330px-Le_Havre_AC_logo.svg.png'),
    ('LOSC Lille', 'https://upload.wikimedia.org/wikipedia/en/thumb/3/3f/Lille_OSC_2018_logo.svg/330px-Lille_OSC_2018_logo.svg.png'),
    ('Le Mans FC', 'https://upload.wikimedia.org/wikipedia/en/thumb/5/57/Le_Mans_FC_logo.svg/330px-Le_Mans_FC_logo.svg.png'),
    ('OGC Nice', 'https://upload.wikimedia.org/wikipedia/en/thumb/2/2e/OGC_Nice_logo.svg/330px-OGC_Nice_logo.svg.png'),
    ('Olympique Lyonnais', 'https://upload.wikimedia.org/wikipedia/en/thumb/1/1c/Olympique_Lyonnais_logo.svg/330px-Olympique_Lyonnais_logo.svg.png'),
    ('Olympique de Marseille', 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Olympique_de_Marseille_2026_logo.svg/330px-Olympique_de_Marseille_2026_logo.svg.png'),
    ('Paris FC', 'https://upload.wikimedia.org/wikipedia/en/thumb/9/9f/Paris_FC_logo.svg/330px-Paris_FC_logo.svg.png'),
    ('Paris Saint-Germain', 'https://upload.wikimedia.org/wikipedia/en/thumb/a/a7/Paris_Saint-Germain_F.C..svg/330px-Paris_Saint-Germain_F.C..svg.png'),
    ('RC Lens', 'https://upload.wikimedia.org/wikipedia/en/thumb/c/cc/RC_Lens_logo.svg/330px-RC_Lens_logo.svg.png'),
    ('RC Strasbourg Alsace', 'https://upload.wikimedia.org/wikipedia/en/thumb/8/80/Racing_Club_de_Strasbourg_logo.svg/330px-Racing_Club_de_Strasbourg_logo.svg.png'),
    ('Stade Brestois 29', 'https://upload.wikimedia.org/wikipedia/en/thumb/0/05/Stade_Brestois_29_logo.svg/330px-Stade_Brestois_29_logo.svg.png'),
    ('Stade Rennais FC', 'https://upload.wikimedia.org/wikipedia/en/thumb/9/9e/Stade_Rennais_FC.svg/330px-Stade_Rennais_FC.svg.png'),
    ('Toulouse FC', 'https://upload.wikimedia.org/wikipedia/en/thumb/6/63/Toulouse_FC_2018_logo.svg/330px-Toulouse_FC_2018_logo.svg.png')
  ) as v(team, logo)
  where m.competition = 'Ligue 1' and m.home_team = v.team and (m.home_logo is null or m.home_logo = '');

update public.matches m set away_logo = v.logo
  from (values
    ('AJ Auxerre', 'https://upload.wikimedia.org/wikipedia/en/thumb/5/51/AJAuxerreLogo.svg/330px-AJAuxerreLogo.svg.png'),
    ('AS Monaco', 'https://upload.wikimedia.org/wikipedia/en/thumb/c/cf/LogoASMonacoFC2021.svg/330px-LogoASMonacoFC2021.svg.png'),
    ('Angers SCO', 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Angers_Sporting_Club_de_l%27Ouest_logo.svg/330px-Angers_Sporting_Club_de_l%27Ouest_logo.svg.png'),
    ('Estac Troyes', 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/ESTAC_Troyes_Logo.svg/330px-ESTAC_Troyes_Logo.svg.png'),
    ('FC Lorient', 'https://upload.wikimedia.org/wikipedia/en/thumb/4/4c/FC_Lorient_logo.svg/330px-FC_Lorient_logo.svg.png'),
    ('Havre Athletic Club', 'https://upload.wikimedia.org/wikipedia/en/thumb/f/fc/Le_Havre_AC_logo.svg/330px-Le_Havre_AC_logo.svg.png'),
    ('LOSC Lille', 'https://upload.wikimedia.org/wikipedia/en/thumb/3/3f/Lille_OSC_2018_logo.svg/330px-Lille_OSC_2018_logo.svg.png'),
    ('Le Mans FC', 'https://upload.wikimedia.org/wikipedia/en/thumb/5/57/Le_Mans_FC_logo.svg/330px-Le_Mans_FC_logo.svg.png'),
    ('OGC Nice', 'https://upload.wikimedia.org/wikipedia/en/thumb/2/2e/OGC_Nice_logo.svg/330px-OGC_Nice_logo.svg.png'),
    ('Olympique Lyonnais', 'https://upload.wikimedia.org/wikipedia/en/thumb/1/1c/Olympique_Lyonnais_logo.svg/330px-Olympique_Lyonnais_logo.svg.png'),
    ('Olympique de Marseille', 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Olympique_de_Marseille_2026_logo.svg/330px-Olympique_de_Marseille_2026_logo.svg.png'),
    ('Paris FC', 'https://upload.wikimedia.org/wikipedia/en/thumb/9/9f/Paris_FC_logo.svg/330px-Paris_FC_logo.svg.png'),
    ('Paris Saint-Germain', 'https://upload.wikimedia.org/wikipedia/en/thumb/a/a7/Paris_Saint-Germain_F.C..svg/330px-Paris_Saint-Germain_F.C..svg.png'),
    ('RC Lens', 'https://upload.wikimedia.org/wikipedia/en/thumb/c/cc/RC_Lens_logo.svg/330px-RC_Lens_logo.svg.png'),
    ('RC Strasbourg Alsace', 'https://upload.wikimedia.org/wikipedia/en/thumb/8/80/Racing_Club_de_Strasbourg_logo.svg/330px-Racing_Club_de_Strasbourg_logo.svg.png'),
    ('Stade Brestois 29', 'https://upload.wikimedia.org/wikipedia/en/thumb/0/05/Stade_Brestois_29_logo.svg/330px-Stade_Brestois_29_logo.svg.png'),
    ('Stade Rennais FC', 'https://upload.wikimedia.org/wikipedia/en/thumb/9/9e/Stade_Rennais_FC.svg/330px-Stade_Rennais_FC.svg.png'),
    ('Toulouse FC', 'https://upload.wikimedia.org/wikipedia/en/thumb/6/63/Toulouse_FC_2018_logo.svg/330px-Toulouse_FC_2018_logo.svg.png')
  ) as v(team, logo)
  where m.competition = 'Ligue 1' and m.away_team = v.team and (m.away_logo is null or m.away_logo = '');
