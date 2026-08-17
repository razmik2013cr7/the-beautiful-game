import { Link } from 'react-router-dom'
import { formatMatchDate, getLeagueFlag } from '../store.js'
import { useI18n } from '../i18n.jsx'
import Crest from './Crest.jsx'

export default function MatchCard({ match, featured = false }) {
  const { t, tp, lang } = useI18n()
  const live = match.homeScore !== null && match.homeScore !== undefined
  const flag = getLeagueFlag(match.competition)

  return (
    <Link
      to={`/matches/${match.id}`}
      className={`card hoverable ${featured ? 'motd' : ''}`}
    >
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
    </Link>
  )
}
