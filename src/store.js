import { fromZonedTime } from 'date-fns-tz'
import { supabase } from './supabase.js'

const LEAGUE_COUNTRIES = {
  'Premier League': '🇬🇧',
  'La Liga': '🇪🇸',
  'Serie A': '🇮🇹',
  'Bundesliga': '🇩🇪',
  'Ligue 1': '🇫🇷',
  'Champions League': '🇪🇺',
  'Europa League': '🇪🇺',
  'World Cup': '🌍',
  Friendly: '🤝',
}

let leaguesCache = []
let leaguesPromise = null

const PAGE_SIZE = 1000

async function fetchAll(buildQuery) {
  const first = await buildQuery().range(0, PAGE_SIZE - 1)
  if (first.error) throw first.error
  let all = first.data || []
  if (all.length === PAGE_SIZE) {
    let from = PAGE_SIZE
    while (true) {
      const next = await buildQuery().range(from, from + PAGE_SIZE - 1)
      if (next.error) throw next.error
      const batch = next.data || []
      all = all.concat(batch)
      if (batch.length < PAGE_SIZE) break
      from += PAGE_SIZE
    }
  }
  return all
}

export function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36)
}

function toMatchRow(m) {
  return {
    id: m.id,
    home_team: m.homeTeam,
    away_team: m.awayTeam,
    home_logo: m.homeLogo ?? null,
    away_logo: m.awayLogo ?? null,
    competition: m.competition,
    date: m.date ?? null,
    time: m.time ?? null,
    timezone: m.timezone ?? null,
    venue: m.venue ?? null,
    home_score: m.homeScore ?? null,
    away_score: m.awayScore ?? null,
    is_match_of_the_day: !!m.isMatchOfTheDay,
  }
}

function fromMatchRow(r, streams = []) {
  return {
    id: r.id,
    homeTeam: r.home_team,
    awayTeam: r.away_team,
    homeLogo: r.home_logo,
    awayLogo: r.away_logo,
    competition: r.competition,
    date: r.date,
    time: r.time,
    timezone: r.timezone,
    venue: r.venue,
    homeScore: r.home_score,
    awayScore: r.away_score,
    isMatchOfTheDay: r.is_match_of_the_day,
    createdAt: r.created_at,
    streams,
  }
}

function toMatchPatch(patch) {
  const map = {
    homeTeam: 'home_team',
    awayTeam: 'away_team',
    homeLogo: 'home_logo',
    awayLogo: 'away_logo',
    competition: 'competition',
    date: 'date',
    time: 'time',
    timezone: 'timezone',
    venue: 'venue',
    homeScore: 'home_score',
    awayScore: 'away_score',
    isMatchOfTheDay: 'is_match_of_the_day',
  }
  const out = {}
  for (const [camel, snake] of Object.entries(map)) {
    if (camel in patch) out[snake] = patch[camel] ?? null
  }
  return out
}

function fromStreamRow(r) {
  return { id: r.id, url: r.url, label: r.label, addedBy: r.added_by, createdAt: r.created_at }
}

export function ensureLeagues() {
  if (!leaguesPromise) {
    leaguesPromise = supabase
      .from('leagues')
      .select('*')
      .order('name')
      .then(({ data, error }) => {
        if (error) throw error
        leaguesCache = data || []
        return leaguesCache
      })
      .catch((err) => {
        leaguesPromise = null
        throw err
      })
  }
  return leaguesPromise
}

async function loadStreams(matchId) {
  const query = supabase.from('streams').select('*').order('created_at', { ascending: false })
  const { data, error } = matchId ? await query.eq('match_id', matchId) : await query
  if (error) throw error
  return data.map(fromStreamRow)
}

export async function getMatches() {
  const [allMatches, allStreams] = await Promise.all([
    fetchAll(() => supabase.from('matches').select('*').order('created_at', { ascending: false })),
    fetchAll(() => supabase.from('streams').select('*').order('created_at', { ascending: false })),
  ])
  const byMatch = {}
  for (const s of allStreams) {
    const key = s.match_id
    ;(byMatch[key] = byMatch[key] || []).push(fromStreamRow(s))
  }
  return allMatches.map((r) => fromMatchRow(r, byMatch[r.id] || []))
}

export async function getFixtures() {
  const matches = await getMatches()
  return matches
    .filter((m) => !isFinished(m))
    .sort((a, b) => {
      const ka = `${a.date || ''}T${a.time || '00:00'}`
      const kb = `${b.date || ''}T${b.time || '00:00'}`
      return ka.localeCompare(kb)
    })
}

export async function findMatch(matchId) {
  const { data, error } = await supabase
    .from('matches')
    .select('*')
    .eq('id', matchId)
    .maybeSingle()
  if (error) throw error
  if (!data) return null
  const streams = await loadStreams(matchId)
  return fromMatchRow(data, streams)
}

export async function addMatch(match) {
  const created = {
    ...match,
    id: uid(),
    homeScore: null,
    awayScore: null,
    isMatchOfTheDay: false,
  }
  const { data, error } = await supabase
    .from('matches')
    .insert([toMatchRow(created)])
    .select()
    .single()
  if (error) throw error
  return fromMatchRow(data)
}

export async function updateMatch(matchId, patch) {
  const { error } = await supabase
    .from('matches')
    .update(toMatchPatch(patch))
    .eq('id', matchId)
  if (error) throw error
}

export async function setMatchOfTheDay(matchId) {
  const { error: clearErr } = await supabase
    .from('matches')
    .update({ is_match_of_the_day: false })
    .neq('id', matchId)
  if (clearErr) throw clearErr
  const { error } = await supabase
    .from('matches')
    .update({ is_match_of_the_day: true })
    .eq('id', matchId)
  if (error) throw error
}

export async function addStream(matchId, stream) {
  const created = {
    id: uid(),
    match_id: matchId,
    url: stream.url,
    label: stream.label ?? null,
    added_by: stream.addedBy ?? 'Anonymous',
  }
  const { data, error } = await supabase
    .from('streams')
    .insert([created])
    .select()
    .single()
  if (error) throw error
  return fromStreamRow(data)
}

export async function removeStream(_matchId, streamId) {
  const { error } = await supabase.from('streams').delete().eq('id', streamId)
  if (error) throw error
}

export async function getLeagues() {
  const data = await ensureLeagues()
  return data
}

export async function addLeague(name, country = '🌍') {
  const clean = name.trim()
  if (!clean) return null
  const created = { id: uid(), name: clean, country }
  const { data, error } = await supabase.from('leagues').insert([created]).select().single()
  if (error) {
    if (error.code === '23505') return null
    throw error
  }
  leaguesCache = (await ensureLeagues()).concat(data)
  leaguesPromise = null
  return data
}

export async function updateLeague(leagueId, patch) {
  const { error } = await supabase.from('leagues').update(patch).eq('id', leagueId)
  if (error) throw error
  leaguesCache = leaguesCache.map((l) => (l.id === leagueId ? { ...l, ...patch } : l))
  leaguesPromise = null
  return leaguesCache
}

export async function removeLeague(leagueId) {
  const { error } = await supabase.from('leagues').delete().eq('id', leagueId)
  if (error) throw error
  leaguesCache = leaguesCache.filter((l) => l.id !== leagueId)
  leaguesPromise = null
}

export function getLeagueFlag(leagueName) {
  if (!leagueName) return ''
  const league = leaguesCache.find(
    (l) => l.name.toLowerCase() === leagueName.toLowerCase(),
  )
  return league?.country || LEAGUE_COUNTRIES[leagueName] || ''
}

function fromPostRow(r) {
  return {
    id: r.id,
    title: r.title,
    category: r.category,
    author: r.author,
    content: r.content,
    likes: r.likes,
    createdAt: r.created_at,
  }
}

export async function getPosts() {
  const { data, error } = await supabase.from('posts').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return (data || []).map(fromPostRow)
}

export async function findPost(postId) {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', postId)
    .maybeSingle()
  if (error) throw error
  return data ? fromPostRow(data) : null
}

export async function addPost(post) {
  const created = {
    id: uid(),
    title: post.title,
    category: post.category,
    author: post.author,
    content: post.content,
  }
  const { data, error } = await supabase
    .from('posts')
    .insert([created])
    .select()
    .single()
  if (error) throw error
  return fromPostRow(data)
}

export function isFinished(match) {
  return (
    match.homeScore !== null &&
    match.homeScore !== undefined &&
    match.awayScore !== null &&
    match.awayScore !== undefined
  )
}

function computeTable(finishedMatches) {
  const stats = {}
  const touch = (team) => {
    if (!stats[team]) {
      stats[team] = { team, p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 }
    }
  }

  for (const m of finishedMatches) {
    touch(m.homeTeam)
    touch(m.awayTeam)
    const h = stats[m.homeTeam]
    const a = stats[m.awayTeam]
    h.p += 1
    a.p += 1
    h.gf += m.homeScore
    h.ga += m.awayScore
    a.gf += m.awayScore
    a.ga += m.homeScore

    if (m.homeScore > m.awayScore) {
      h.w += 1
      h.pts += 3
      a.l += 1
    } else if (m.homeScore < m.awayScore) {
      a.w += 1
      a.pts += 3
      h.l += 1
    } else {
      h.d += 1
      a.d += 1
      h.pts += 1
      a.pts += 1
    }
  }

  const result = Object.values(stats)
  for (const row of result) row.gd = row.gf - row.ga
  return result.sort(
    (x, y) =>
      y.pts - x.pts ||
      (y.gf - y.ga) - (x.gf - x.ga) ||
      y.gf - x.gf ||
      x.team.localeCompare(y.team),
  )
}

function fromStandingRow(r) {
  return {
    id: r.id,
    competition: r.competition,
    position: r.pos,
    team: r.team,
    p: r.played,
    w: r.won,
    d: r.drawn,
    l: r.lost,
    gf: r.gf,
    ga: r.ga,
    pts: r.pts,
  }
}

export async function getManualTables() {
  const { data, error } = await supabase
    .from('standings')
    .select('*')
    .order('pos')
    .order('created_at')
  if (error) throw error
  const groups = {}
  for (const r of data || []) {
    const row = fromStandingRow(r)
    row.gd = row.gf - row.ga
    ;(groups[row.competition] = groups[row.competition] || []).push(row)
  }
  for (const list of Object.values(groups)) {
    list.sort(
      (x, y) =>
        y.pts - x.pts ||
        y.gd - x.gd ||
        y.gf - x.gf ||
        x.team.localeCompare(y.team),
    )
  }
  return Object.entries(groups).map(([competition, standings]) => ({
    competition,
    standings,
    manual: true,
  }))
}

export async function addManualTable(competition, rows) {
  const clean = competition.trim()
  if (!clean) return null
  const created = rows.map((row, i) => ({
    id: uid(),
    competition: clean,
    pos: i + 1,
    team: row.team.trim(),
    played: row.p || 0,
    won: row.w || 0,
    drawn: row.d || 0,
    lost: row.l || 0,
    gf: row.gf || 0,
    ga: row.ga || 0,
    pts: row.pts || 0,
  }))
  const { error } = await supabase.from('standings').insert(created)
  if (error) throw error
  return created
}

export async function updateManualTable(competition, rows) {
  const clean = competition.trim()
  const { error: delErr } = await supabase
    .from('standings')
    .delete()
    .eq('competition', clean)
  if (delErr) throw delErr
  return addManualTable(clean, rows)
}

export async function removeManualTable(competition) {
  const { error } = await supabase.from('standings').delete().eq('competition', competition)
  if (error) throw error
}

export async function getLeagueTables() {
  const [matches, manual] = await Promise.all([getMatches(), getManualTables()])
  const groups = {}
  for (const m of matches) {
    if (!isFinished(m)) continue
    const comp = m.competition || 'Friendly'
    groups[comp] = groups[comp] || []
    groups[comp].push(m)
  }
  const computed = Object.entries(groups).map(([competition, list]) => ({
    competition,
    standings: computeTable(list),
    manual: false,
  }))
  const manualNames = new Set(manual.map((t) => t.competition.toLowerCase()))
  const merged = manual.concat(computed.filter((t) => !manualNames.has(t.competition.toLowerCase())))
  return merged.sort((a, b) => a.competition.localeCompare(b.competition))
}

export function formatDate(ts, lang = 'en') {
  return new Date(ts).toLocaleDateString(lang, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function getViewerTimeZone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
  } catch {
    return 'UTC'
  }
}

export function kickOffInstant(match) {
  if (!match?.date) return null
  const t = match.time || '00:00'
  if (match.timezone) {
    return fromZonedTime(`${match.date}T${t}:00`, match.timezone)
  }
  return new Date(`${match.date}T${t}:00`)
}

export function formatMatchDate(match, lang = 'en') {
  const inst = kickOffInstant(match)
  if (!inst) return ''
  return inst.toLocaleString(lang, {
    timeZone: getViewerTimeZone(),
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
