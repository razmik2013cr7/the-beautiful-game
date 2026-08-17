import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  addStream,
  findMatch,
  formatMatchDate,
  getLeagueFlag,
  removeStream,
  setMatchOfTheDay,
  updateMatch,
} from '../store.js'
import { useI18n } from '../i18n.jsx'
import { useAuth } from '../auth.jsx'
import { useAsync } from '../useAsync.js'
import Crest from '../components/Crest.jsx'

const NAME_KEY = 'tbq_name'

function getStoredName() {
  try {
    return localStorage.getItem(NAME_KEY) || ''
  } catch {
    return ''
  }
}

function storeName(name) {
  try {
    localStorage.setItem(NAME_KEY, name)
  } catch {
    /* noop */
  }
}

export default function MatchDetail() {
  const { matchId } = useParams()
  const navigate = useNavigate()
  const { t, lang } = useI18n()
  const { isAdmin } = useAuth()
  const { data: match, refresh } = useAsync(() => findMatch(matchId), [matchId])
  const [link, setLink] = useState({ label: '', url: '' })
  const [yourName, setYourName] = useState(() => getStoredName())
  const [logos, setLogos] = useState({ homeLogo: '', awayLogo: '' })
  const [score, setScore] = useState({ home: '', away: '' })
  const [schedule, setSchedule] = useState({ date: '', time: '' })
  const [error, setError] = useState('')

  useEffect(() => {
    if (match && logos.homeLogo === '' && logos.awayLogo === '') {
      setLogos({ homeLogo: match.homeLogo || '', awayLogo: match.awayLogo || '' })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [match?.id])

  useEffect(() => {
    if (match && schedule.date === '' && schedule.time === '') {
      setSchedule({ date: match.date || '', time: match.time || '' })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [match?.id])

  useEffect(() => {
    if (match === null) navigate('/matches', { replace: true })
  }, [match, navigate])

  if (!match) return null

  const pickMotd = async () => {
    await setMatchOfTheDay(match.id)
    refresh()
  }

  const saveResult = async (e) => {
    e.preventDefault()
    const h = Number(score.home)
    const a = Number(score.away)
    if (score.home === '' || score.away === '' || Number.isNaN(h) || Number.isNaN(a)) return
    await updateMatch(match.id, { homeScore: h, awayScore: a })
    setScore({ home: '', away: '' })
    refresh()
  }

  const clearResult = async () => {
    await updateMatch(match.id, { homeScore: null, awayScore: null })
    refresh()
  }

  const saveLogos = async (e) => {
    e.preventDefault()
    await updateMatch(match.id, {
      homeLogo: logos.homeLogo.trim(),
      awayLogo: logos.awayLogo.trim(),
    })
    refresh()
  }

  const saveSchedule = async (e) => {
    e.preventDefault()
    await updateMatch(match.id, {
      date: schedule.date.trim(),
      time: schedule.time.trim(),
    })
    refresh()
  }

  const submitStream = async (e) => {
    e.preventDefault()
    const url = link.url.trim()
    if (!url) return
    if (!/^https?:\/\//i.test(url)) {
      setError(t('errorUrl'))
      return
    }
    const cleanName = yourName.trim() || 'Anonymous'
    storeName(cleanName)
    await addStream(match.id, {
      label: link.label.trim() || new URL(url).hostname,
      url,
      addedBy: cleanName,
    })
    setLink({ label: '', url: '' })
    setError('')
    refresh()
  }

  const deleteStream = async (streamId) => {
    await removeStream(match.id, streamId)
    refresh()
  }

  const isLive = match.homeScore !== null && match.homeScore !== undefined
  const streams = match.streams || []
  const flag = getLeagueFlag(match.competition)
  const kickOff = formatMatchDate(match, lang)

  return (
    <div className="page">
      <Link to="/matches" style={{ color: 'var(--text-muted)', fontSize: 14 }}>
        {t('backToMatches')}
      </Link>

      <div className={`card ${match.isMatchOfTheDay ? 'motd' : ''}`} style={{ marginTop: 16 }}>
        <div className="meta" style={{ justifyContent: 'space-between', marginBottom: 18 }}>
          <span className="badge badge-muted">
            {flag && <span style={{ fontSize: 15 }}>{flag}</span>}
            {match.competition || t('friendly')}
          </span>
          <span style={{ display: 'flex', gap: 6 }}>
            {match.isMatchOfTheDay && <span className="badge badge-gold">{t('motdBadge')}</span>}
            {isLive && <span className="badge badge-red">{t('fullTime')}</span>}
          </span>
        </div>

        <div className="scoreboard">
          <div className="team">
            <Crest team={match.homeTeam} logo={match.homeLogo} side="home" />
            <div className="name">{match.homeTeam}</div>
          </div>
          <div className="score">
            {isLive ? (
              <>
                <span className="goals">{match.homeScore}</span>
                <span className="dash">–</span>
                <span className="goals">{match.awayScore}</span>
              </>
            ) : (
              <span className="dash vs" style={{ fontSize: 22, fontWeight: 800 }}>
                {t('vs')}
              </span>
            )}
          </div>
          <div className="team">
            <Crest team={match.awayTeam} logo={match.awayLogo} side="away" />
            <div className="name">{match.awayTeam}</div>
          </div>
        </div>

        <div className="meta" style={{ justifyContent: 'center', marginTop: 16 }}>
          🗓 {match.date} · ⏱ {match.time || t('timeTbc')} · 📍 {match.venue || t('venueTbc')} · {kickOff}
        </div>
      </div>

      {isAdmin && !match.isMatchOfTheDay && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
          <button className="btn-gold" onClick={pickMotd}>
            ⭐ {t('makeMotd')}
          </button>
        </div>
      )}

      {isAdmin && (
        <>
          <div className="section-title">
            <h2>{t('editSchedule')}</h2>
            <div className="rule" />
          </div>

          <form className="form" onSubmit={saveSchedule}>
            <div className="form-row">
              <div className="field">
                <label htmlFor="matchDate">{t('matchDate')}</label>
                <input
                  id="matchDate"
                  type="date"
                  value={schedule.date}
                  onChange={(e) => setSchedule({ ...schedule, date: e.target.value })}
                />
              </div>
              <div className="field">
                <label htmlFor="matchTime">{t('matchTime')}</label>
                <input
                  id="matchTime"
                  type="time"
                  value={schedule.time}
                  onChange={(e) => setSchedule({ ...schedule, time: e.target.value })}
                />
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn-primary">
                {t('saveSchedule')}
              </button>
            </div>
          </form>

          <div className="section-title">
            <h2>{t('recordResult')}</h2>
            <div className="rule" />
          </div>

          {isLive ? (
            <div className="form" style={{ maxWidth: 640 }}>
              <p style={{ color: 'var(--text-muted)', marginBottom: 16 }}>
                {match.homeTeam} {match.homeScore} – {match.awayScore} {match.awayTeam}
              </p>
              <div className="form-actions">
                <button className="btn-danger" onClick={clearResult}>
                  {t('clearResult')}
                </button>
              </div>
            </div>
          ) : (
            <form className="form" onSubmit={saveResult}>
              <div className="form-row">
                <div className="field">
                  <label htmlFor="homeScore">
                    {match.homeTeam} · {t('homeGoals')}
                  </label>
                  <input
                    id="homeScore"
                    type="number"
                    min="0"
                    step="1"
                    value={score.home}
                    onChange={(e) => setScore({ ...score, home: e.target.value })}
                  />
                </div>
                <div className="field">
                  <label htmlFor="awayScore">
                    {match.awayTeam} · {t('awayGoals')}
                  </label>
                  <input
                    id="awayScore"
                    type="number"
                    min="0"
                    step="1"
                    value={score.away}
                    onChange={(e) => setScore({ ...score, away: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-actions">
                <button type="submit" className="btn-primary">
                  {t('saveResult')}
                </button>
              </div>
            </form>
          )}

          <div className="section-title">
            <h2>{t('logosTitle')}</h2>
            <div className="rule" />
          </div>

          <form className="form" onSubmit={saveLogos}>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 16 }}>
              {t('logosHint')}
            </p>
            <div className="form-row">
              <div className="field">
                <label htmlFor="homeLogo">{t('homeLogo')}</label>
                <input
                  id="homeLogo"
                  placeholder="https://example.com/logo.png"
                  value={logos.homeLogo}
                  onChange={(e) => setLogos({ ...logos, homeLogo: e.target.value })}
                />
              </div>
              <div className="field">
                <label htmlFor="awayLogo">{t('awayLogo')}</label>
                <input
                  id="awayLogo"
                  placeholder="https://example.com/logo.png"
                  value={logos.awayLogo}
                  onChange={(e) => setLogos({ ...logos, awayLogo: e.target.value })}
                />
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn-primary">
                {t('saveLogos')}
              </button>
            </div>
          </form>
        </>
      )}

      <div className="section-title">
        <h2>{t('watchMatch')}</h2>
        <div className="rule" />
      </div>

      {streams.length === 0 ? (
        <div className="empty">{t('noStreams')}</div>
      ) : (
        <div className="stream-list">
          {streams.map((s) => (
            <div key={s.id} className="stream-item">
              <span className="play">▶</span>
              <div className="info">
                <div className="name">{s.label}</div>
                <div className="sub">
                  {t('addedBy')} {s.addedBy || 'Anonymous'} ·{' '}
                  {new Date(s.createdAt).toLocaleString(lang)}
                </div>
              </div>
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
                style={{ padding: '8px 16px', whiteSpace: 'nowrap' }}
              >
                {t('watchBtn')}
              </a>
              {isAdmin && (
                <button
                  className="btn-danger"
                  style={{ padding: '8px 12px' }}
                  onClick={() => deleteStream(s.id)}
                  title={t('removeTitle')}
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {isAdmin && (
        <>
          <div className="section-title">
            <h2>{t('shareStreamTitle')}</h2>
            <div className="rule" />
          </div>

          <form className="form" onSubmit={submitStream}>
            <div className="form-row">
              <div className="field">
                <label htmlFor="label">{t('labelField')}</label>
                <input
                  id="label"
                  placeholder="Sky Sports, ESPN, IPTV…"
                  value={link.label}
                  onChange={(e) => setLink({ ...link, label: e.target.value })}
                />
              </div>
              <div className="field">
                <label htmlFor="name">{t('yourName')}</label>
                <input
                  id="name"
                  placeholder="Anonymous"
                  value={yourName}
                  onChange={(e) => setYourName(e.target.value)}
                />
              </div>
            </div>

            <div className="field">
              <label htmlFor="url">{t('streamLink')}</label>
              <input
                id="url"
                placeholder={t('streamLinkPlaceholder')}
                value={link.url}
                onChange={(e) => {
                  setLink({ ...link, url: e.target.value })
                  setError('')
                }}
                required
              />
            </div>

            {error && (
              <p style={{ color: 'var(--danger)', fontSize: 14, margin: '0 0 12px' }}>{error}</p>
            )}

            <div className="form-actions">
              <button type="submit" className="btn-primary">
                {t('addStreamBtn')}
              </button>
            </div>
            <p style={{ color: 'var(--text-muted)', marginTop: 14, fontSize: 13 }}>
              {t('disclaimer')}
            </p>
          </form>
        </>
      )}
    </div>
  )
}
