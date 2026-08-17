import { useState } from 'react'
import { Link } from 'react-router-dom'
import { format } from 'date-fns-tz'
import {
  getFixtures,
  getLeagueFlag,
  getLeagues,
  getViewerTimeZone,
  kickOffInstant,
} from '../store.js'
import { useI18n } from '../i18n.jsx'
import { useAuth } from '../auth.jsx'
import { useAsync } from '../useAsync.js'
import { useHead } from '../useHead.js'
import MatchCard from '../components/MatchCard.jsx'
import { SkeletonCard } from '../components/Skeleton.jsx'

export default function Fixtures() {
  const { t, tp, lang } = useI18n()
  const { isAdmin } = useAuth()
  useHead('metaFixtures', 'metaFixturesDesc')
  const [league, setLeague] = useState('all')
  const { data: fixtures = [], loading } = useAsync(getFixtures)
  const { data: leagues = [] } = useAsync(getLeagues)

  const leagueNames = [
    ...new Set([...leagues.map((l) => l.name), ...fixtures.map((m) => m.competition).filter(Boolean)]),
  ].sort((a, b) => a.localeCompare(b))

  const list =
    league === 'all' ? fixtures : fixtures.filter((m) => (m.competition || '') === league)

  const groups = []
  const tz = getViewerTimeZone()
  for (const m of list) {
    const inst = kickOffInstant(m)
    const key = inst ? format(inst, 'yyyy-MM-dd', { timeZone: tz }) : m.date || 'TBC'
    const last = groups[groups.length - 1]
    if (last && last.date === key) {
      last.matches.push(m)
    } else {
      groups.push({ date: key, matches: [m] })
    }
  }

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>{t('fixturesTitle')}</h1>
          <p style={{ color: 'var(--text-muted)' }}>{tp('fixturesSub', list.length)}</p>
        </div>
        {isAdmin && (
          <Link to="/matches/new" className="btn-primary">
            {t('addMatch')}
          </Link>
        )}
      </div>

      <div style={{ maxWidth: 320, marginBottom: 24 }}>
        <label htmlFor="leagueFilter">{t('leaguesTitle')}</label>
        <select
          id="leagueFilter"
          value={league}
          onChange={(e) => setLeague(e.target.value)}
        >
          <option value="all">{t('filterAll')}</option>
          {leagueNames.map((name) => (
            <option key={name} value={name}>
              {getLeagueFlag(name) && `${getLeagueFlag(name)} `}
              {name}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="grid tight">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : groups.length === 0 ? (
        <div className="empty">
          <div className="empty-icon">📅</div>
          <div className="empty-title">{t('fixturesEmpty')}</div>
          {isAdmin && (
            <div className="empty-actions">
              <Link to="/matches/new" className="btn-primary">
                {t('fixturesEmptyLink')}
              </Link>
            </div>
          )}
        </div>
      ) : (
        groups.map((group) => (
          <section key={group.date} style={{ marginBottom: 28 }}>
            <div className="section-title" style={{ marginTop: 0 }}>
              <h2>{formatDateHeader(group.date, lang)}</h2>
              <div className="rule" />
            </div>
            <div className="grid tight">
              {group.matches.map((m) => (
                <MatchCard key={m.id} match={m} />
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  )
}

function formatDateHeader(iso, lang) {
  if (!iso || iso === 'TBC') return 'TBC'
  return new Date(`${iso}T12:00:00`).toLocaleDateString(lang, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
