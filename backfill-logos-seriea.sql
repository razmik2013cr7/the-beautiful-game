-- Backfill crests for Serie A matches. Run in the Supabase SQL Editor.
-- Only updates rows where the crest is currently empty.

update public.matches m set home_logo = v.logo
  from (values
    ('Atalanta', 'https://upload.wikimedia.org/wikipedia/en/thumb/f/f2/Atalanta_BC_new_logo.svg/330px-Atalanta_BC_new_logo.svg.png'),
    ('Bologna', 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Bologna_F.C._1909_logo.svg/330px-Bologna_F.C._1909_logo.svg.png'),
    ('Cagliari', 'https://upload.wikimedia.org/wikipedia/en/thumb/6/61/Cagliari_Calcio_1920.svg/330px-Cagliari_Calcio_1920.svg.png'),
    ('Como', 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Calcio_Como_-_logo_%28Italy%2C_2019-%29.svg/330px-Calcio_Como_-_logo_%28Italy%2C_2019-%29.svg.png'),
    ('Fiorentina', 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/ACF_Fiorentina_-_logo_%28Italy%2C_2022%29.svg/330px-ACF_Fiorentina_-_logo_%28Italy%2C_2022%29.svg.png'),
    ('Frosinone', 'https://upload.wikimedia.org/wikipedia/en/thumb/0/0b/Frosinone_Calcio_logo.svg/330px-Frosinone_Calcio_logo.svg.png'),
    ('Genoa', 'https://upload.wikimedia.org/wikipedia/en/thumb/2/2c/Genoa_CFC_crest.svg/330px-Genoa_CFC_crest.svg.png'),
    ('Internazionale', 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/FC_Internazionale_Milano_2021.svg/330px-FC_Internazionale_Milano_2021.svg.png'),
    ('Juventus', 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Juventus_FC_-_logo_black_%28Italy%2C_2020%29.svg/330px-Juventus_FC_-_logo_black_%28Italy%2C_2020%29.svg.png'),
    ('Lazio', 'https://upload.wikimedia.org/wikipedia/en/thumb/c/ce/S.S._Lazio_badge.svg/330px-S.S._Lazio_badge.svg.png'),
    ('Lecce', 'https://upload.wikimedia.org/wikipedia/en/thumb/2/23/US_Lecce_crest.svg/330px-US_Lecce_crest.svg.png'),
    ('Milan', 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Logo_of_AC_Milan.svg/330px-Logo_of_AC_Milan.svg.png'),
    ('Monza', 'https://upload.wikimedia.org/wikipedia/en/thumb/a/a7/AC_Monza_logo_%282021%29.svg/330px-AC_Monza_logo_%282021%29.svg.png'),
    ('Napoli', 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/SSC_Napoli_2025_%28white_and_azure%29.svg/330px-SSC_Napoli_2025_%28white_and_azure%29.svg.png'),
    ('Parma', 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Logo_Parma_Calcio_1913_%28adozione_2016%29.svg/330px-Logo_Parma_Calcio_1913_%28adozione_2016%29.svg.png'),
    ('Roma', 'https://upload.wikimedia.org/wikipedia/en/thumb/f/f7/AS_Roma_logo_%282017%29.svg/330px-AS_Roma_logo_%282017%29.svg.png'),
    ('Sassuolo', 'https://upload.wikimedia.org/wikipedia/en/thumb/1/1c/US_Sassuolo_Calcio_logo.svg/330px-US_Sassuolo_Calcio_logo.svg.png'),
    ('Torino', 'https://upload.wikimedia.org/wikipedia/en/thumb/2/2e/Torino_FC_Logo.svg/330px-Torino_FC_Logo.svg.png'),
    ('Udinese', 'https://upload.wikimedia.org/wikipedia/en/thumb/c/ce/Udinese_Calcio_logo.svg/330px-Udinese_Calcio_logo.svg.png'),
    ('Venezia', 'https://upload.wikimedia.org/wikipedia/en/thumb/3/39/Venezia_FC_crest.svg/330px-Venezia_FC_crest.svg.png')
  ) as v(team, logo)
  where m.competition = 'Serie A' and m.home_team = v.team and (m.home_logo is null or m.home_logo = '');

update public.matches m set away_logo = v.logo
  from (values
    ('Atalanta', 'https://upload.wikimedia.org/wikipedia/en/thumb/f/f2/Atalanta_BC_new_logo.svg/330px-Atalanta_BC_new_logo.svg.png'),
    ('Bologna', 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Bologna_F.C._1909_logo.svg/330px-Bologna_F.C._1909_logo.svg.png'),
    ('Cagliari', 'https://upload.wikimedia.org/wikipedia/en/thumb/6/61/Cagliari_Calcio_1920.svg/330px-Cagliari_Calcio_1920.svg.png'),
    ('Como', 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Calcio_Como_-_logo_%28Italy%2C_2019-%29.svg/330px-Calcio_Como_-_logo_%28Italy%2C_2019-%29.svg.png'),
    ('Fiorentina', 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/ACF_Fiorentina_-_logo_%28Italy%2C_2022%29.svg/330px-ACF_Fiorentina_-_logo_%28Italy%2C_2022%29.svg.png'),
    ('Frosinone', 'https://upload.wikimedia.org/wikipedia/en/thumb/0/0b/Frosinone_Calcio_logo.svg/330px-Frosinone_Calcio_logo.svg.png'),
    ('Genoa', 'https://upload.wikimedia.org/wikipedia/en/thumb/2/2c/Genoa_CFC_crest.svg/330px-Genoa_CFC_crest.svg.png'),
    ('Internazionale', 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/FC_Internazionale_Milano_2021.svg/330px-FC_Internazionale_Milano_2021.svg.png'),
    ('Juventus', 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Juventus_FC_-_logo_black_%28Italy%2C_2020%29.svg/330px-Juventus_FC_-_logo_black_%28Italy%2C_2020%29.svg.png'),
    ('Lazio', 'https://upload.wikimedia.org/wikipedia/en/thumb/c/ce/S.S._Lazio_badge.svg/330px-S.S._Lazio_badge.svg.png'),
    ('Lecce', 'https://upload.wikimedia.org/wikipedia/en/thumb/2/23/US_Lecce_crest.svg/330px-US_Lecce_crest.svg.png'),
    ('Milan', 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Logo_of_AC_Milan.svg/330px-Logo_of_AC_Milan.svg.png'),
    ('Monza', 'https://upload.wikimedia.org/wikipedia/en/thumb/a/a7/AC_Monza_logo_%282021%29.svg/330px-AC_Monza_logo_%282021%29.svg.png'),
    ('Napoli', 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/SSC_Napoli_2025_%28white_and_azure%29.svg/330px-SSC_Napoli_2025_%28white_and_azure%29.svg.png'),
    ('Parma', 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Logo_Parma_Calcio_1913_%28adozione_2016%29.svg/330px-Logo_Parma_Calcio_1913_%28adozione_2016%29.svg.png'),
    ('Roma', 'https://upload.wikimedia.org/wikipedia/en/thumb/f/f7/AS_Roma_logo_%282017%29.svg/330px-AS_Roma_logo_%282017%29.svg.png'),
    ('Sassuolo', 'https://upload.wikimedia.org/wikipedia/en/thumb/1/1c/US_Sassuolo_Calcio_logo.svg/330px-US_Sassuolo_Calcio_logo.svg.png'),
    ('Torino', 'https://upload.wikimedia.org/wikipedia/en/thumb/2/2e/Torino_FC_Logo.svg/330px-Torino_FC_Logo.svg.png'),
    ('Udinese', 'https://upload.wikimedia.org/wikipedia/en/thumb/c/ce/Udinese_Calcio_logo.svg/330px-Udinese_Calcio_logo.svg.png'),
    ('Venezia', 'https://upload.wikimedia.org/wikipedia/en/thumb/3/39/Venezia_FC_crest.svg/330px-Venezia_FC_crest.svg.png')
  ) as v(team, logo)
  where m.competition = 'Serie A' and m.away_team = v.team and (m.away_logo is null or m.away_logo = '');
