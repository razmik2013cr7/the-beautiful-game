import { Link } from 'react-router-dom'
import { format } from 'date-fns-tz'
import { getMatches, getViewerTimeZone, kickOffInstant } from '../store.js'
import { useI18n } from '../i18n.jsx'
import { useAuth } from '../auth.jsx'
import { useAsync } from '../useAsync.js'
import { useHead } from '../useHead.js'
import MatchCard from '../components/MatchCard.jsx'
import { SkeletonCard } from '../components/Skeleton.jsx'

export default function Matches() {
  const { t, tp, lang } = useI18n()
  const { isAdmin } = useAuth()
  useHead('metaMatches', 'metaMatchesDesc')
  const { data: matches = [], loading } = useAsync(getMatches)
  const motd = matches.find((m) => m.isMatchOfTheDay)
  const rest = matches
    .filter((m) => !m.isMatchOfTheDay)
    .sort((a, b) => {
      const ka = `${a.date || ''}T${a.time || '00:00'}`
      const kb = `${b.date || ''}T${b.time || '00:00'}`
      return ka.localeCompare(kb)
    })

  const groups = []
  const tz = getViewerTimeZone()
  for (const m of rest) {
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
          <h1>{t('matchesTitle')}</h1>
          <p style={{ color: 'var(--text-muted)' }}>{tp('matchesSub', matches.length)}</p>
        </div>
        {isAdmin && (
          <Link to="/matches/new" className="btn-primary">
            {t('addMatch')}
          </Link>
        )}
      </div>

      {loading ? (
        <div className="grid tight">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : matches.length === 0 ? (
        <div className="empty">
          <div className="empty-icon">⚽</div>
          <div className="empty-title">{t('noMatches')}</div>
          {isAdmin && (
            <div className="empty-actions">
              <Link to="/matches/new" className="btn-primary">
                {t('noMatchesLink')}
              </Link>
            </div>
          )}
        </div>
      ) : (
        <>
          {motd && (
            <>
              <div className="section-title" style={{ marginTop: 0 }}>
                <h2>{t('motdTitle')}</h2>
                <div className="rule" />
              </div>
              <MatchCard match={motd} featured />
            </>
          )}
          {groups.map((group) => (
            <section key={group.date} style={{ marginBottom: 28 }}>
              <div className="section-title" style={{ marginTop: motd ? undefined : 0 }}>
                <h2>{formatDateHeader(group.date, lang)}</h2>
                <div className="rule" />
              </div>
              <div className="grid tight">
                {group.matches.map((m) => (
                  <MatchCard key={m.id} match={m} />
                ))}
              </div>
            </section>
          ))}
        </>
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
