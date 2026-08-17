import { Link } from 'react-router-dom'
import { formatMatchDate, getLeagueFlag } from '../store.js'
import { useI18n } from '../i18n.jsx'
import { useAuth } from '../auth.jsx'
import Crest from './Crest.jsx'

export default function MatchCard({ match, featured = false, onMotdClick }) {
  const { t, tp, lang } = useI18n()
  const { isAdmin } = useAuth()
  const live = match.homeScore !== null && match.homeScore !== undefined
  const flag = getLeagueFlag(match.competition)

  const cardContent = (
    <>
      <div className="meta" style={{ justifyContent: 'space-between', marginBottom: 14 }}>
        <span className="badge badge-muted">
          {flag && <span style={{ fontSize: 15 }}>{flag}</span>}
          {match.competition || t('friendly')}
        </span>
        <span style={{ display: 'flex', gap: 6 }}>
          {match.isMatchOfTheDay && <span className="badge badge-gold">{t('motdBadge')}</span>}
          {live && <span className="badge badge-red">{t('fullTime')}</span>}
        </span>
      </div>

      <div className="scoreboard">
        <div className="team">
          <Crest team={match.homeTeam} logo={match.homeLogo} side="home" />
          <div className="name">{match.homeTeam}</div>
        </div>

        <div className="score">
          {live ? (
            <>
              <span className="goals">{match.homeScore}</span>
              <span className="dash">–</span>
              <span className="goals">{match.awayScore}</span>
            </>
          ) : (
            <span className="dash vs" style={{ fontSize: 18, fontWeight: 800 }}>
              {t('vs')}
            </span>
          )}
        </div>

        <div className="team">
          <Crest team={match.awayTeam} logo={match.awayLogo} side="away" />
          <div className="name">{match.awayTeam}</div>
        </div>
      </div>

      <div className="meta" style={{ justifyContent: 'center', marginTop: 14 }}>
        {formatMatchDate(match, lang)}
        {match.venue ? ` · ${match.venue}` : ''}
      </div>

      {featured && (
        <div className="meta" style={{ justifyContent: 'center', marginTop: 6 }}>
          📺 {tp('streamCount', (match.streams || []).length)}
        </div>
      )}
    </>
  )

  if (featured && isAdmin && !match.isMatchOfTheDay) {
    return (
      <button
        onClick={onMotdClick}
        style={{
          background: 'var(--card)',
          border: '1px solid var(--line)',
          borderRadius: 'var(--radius)',
          padding: '20px',
          cursor: 'pointer',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          flexWrap: 'nowrap',
          alignItems: 'stretch',
          font: 'inherit',
          color: 'inherit',
          transition: 'background 0.15s ease, transform 0.15s ease, border-color 0.15s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'var(--card-hover)'
          e.currentTarget.style.borderColor = 'var(--blue)'
          e.currentTarget.style.transform = 'translateY(-3px)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'var(--card)'
          e.currentTarget.style.borderColor = 'var(--line)'
          e.currentTarget.style.transform = 'translateY(0)'
        }}
      >
        {cardContent}
      </button>
    )
  }

  return (
    <Link
      to={`/matches/${match.id}`}
      className={`card hoverable ${featured ? 'motd' : ''}`}
    >
      {cardContent}
    </Link>
  )
}
