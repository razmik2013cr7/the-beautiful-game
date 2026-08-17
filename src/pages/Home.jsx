import { Link } from 'react-router-dom'
import { getMatches, getPosts, kickOffInstant, setMatchOfTheDay } from '../store.js'
import { useI18n } from '../i18n.jsx'
import { useAuth } from '../auth.jsx'
import { useAsync } from '../useAsync.js'
import { useHead } from '../useHead.js'
import MatchCard from '../components/MatchCard.jsx'
import PostCard from '../components/PostCard.jsx'

const DAYS = 5

export default function Home() {
  const { t } = useI18n()
  const { isAdmin } = useAuth()
  useHead('metaHome', 'metaHomeDesc')
  const { data: matches = [], refresh } = useAsync(getMatches)
  const { data: posts = [] } = useAsync(getPosts)

  const motd = matches.find((m) => m.isMatchOfTheDay)
  const latestPosts = posts.slice(0, 3)

  const handleMotdClick = async () => {
    if (motd) {
      await setMatchOfTheDay(motd.id)
      refresh()
    }
  }

  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
  const horizon = today + (DAYS + 1) * 24 * 60 * 60 * 1000
  const upcoming = matches
    .filter((m) => {
      if (m.isMatchOfTheDay) return false
      if (m.homeScore !== null && m.homeScore !== undefined) return false
      const inst = kickOffInstant(m)
      return inst && inst.getTime() >= today && inst.getTime() < horizon
    })
    .sort((a, b) => kickOffInstant(a).getTime() - kickOffInstant(b).getTime())

  return (
    <div className="page">
      <section className="hero">
        <div className="tag">{t('heroTag')}</div>
        <h1>{t('heroTitle')}</h1>
        <p>{t('heroText')}</p>
        {isAdmin && (
          <div style={{ display: 'flex', gap: 12, marginTop: 24, flexWrap: 'wrap' }}>
            <Link
              to="/matches/new"
              className="btn-primary"
              style={{ padding: '12px 22px', borderRadius: 12, fontWeight: 700 }}
            >
              {t('addMatch')}
            </Link>
            <Link
              to="/posts/new"
              className="btn-ghost"
              style={{ padding: '12px 22px', borderRadius: 12, fontWeight: 700 }}
            >
              {t('writePostBtn')}
            </Link>
          </div>
        )}
      </section>

      {latestPosts.length > 0 && (
        <>
          <div className="section-title" style={{ marginTop: 32 }}>
            <h2>{t('latestTitle')}</h2>
            <div className="rule" />
            <Link to="/posts" style={{ color: 'var(--blue)', fontWeight: 600, fontSize: 14 }}>
              {t('viewAll')}
            </Link>
          </div>
          <div className="grid tight">
            {latestPosts.map((p) => (
              <PostCard key={p.id} post={p} />
            ))}
          </div>
        </>
      )}

      {motd && (
        <>
          <div className="section-title">
            <h2>{t('motdTitle')}</h2>
            <div className="rule" />
          </div>
          <MatchCard match={motd} featured onMotdClick={handleMotdClick} />
        </>
      )}

      {upcoming.length > 0 && (
        <>
          <div className="section-title">
            <h2>{t('upcomingTitle')}</h2>
            <div className="rule" />
            <Link to="/matches" style={{ color: 'var(--blue)', fontWeight: 600, fontSize: 14 }}>
              {t('viewAll')}
            </Link>
          </div>
          <div className="grid tight">
            {upcoming.map((m) => (
              <MatchCard key={m.id} match={m} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
