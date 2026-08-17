import { useState } from 'react'
import { addLeague, getLeagues, removeLeague, updateLeague } from '../store.js'
import { ALL_COUNTRIES } from '../countries.js'
import { useI18n } from '../i18n.jsx'
import { useAuth } from '../auth.jsx'
import { useAsync } from '../useAsync.js'
import AdminOnly from '../components/AdminOnly.jsx'

const SPECIALS = [
  ['🌍', 'World'],
  ['🤝', 'Friendly / Other'],
]

const COUNTRIES = [...SPECIALS, ...ALL_COUNTRIES]

export default function Leagues() {
  const { t } = useI18n()
  const { isAdmin } = useAuth()
  const { data: leagues = [], refresh } = useAsync(getLeagues)
  const [name, setName] = useState('')
  const [country, setCountry] = useState('🌍')
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    const clean = name.trim()
    if (!clean) return
    const created = await addLeague(clean, country)
    if (!created) {
      setError(t('leagueExists'))
      return
    }
    setName('')
    setError('')
    refresh()
  }

  const remove = async (id) => {
    await removeLeague(id)
    refresh()
  }

  const saveFlag = async (id, value) => {
    await updateLeague(id, { country: value })
    refresh()
  }

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>{t('leaguesTitle')}</h1>
          <p style={{ color: 'var(--text-muted)' }}>{t('leaguesSub')}</p>
        </div>
      </div>

      <AdminOnly>
        <form className="form" onSubmit={submit}>
          <div className="field">
            <label htmlFor="leagueName">{t('leagueName')}</label>
            <input
              id="leagueName"
              placeholder="Serie A, Copa del Rey, …"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                setError('')
              }}
            />
          </div>

          <div className="field">
            <label htmlFor="country">{t('country')}</label>
            <select
              id="country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            >
              {COUNTRIES.map(([flag, label]) => (
                <option key={flag} value={flag}>
                  {flag} {label}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <p style={{ color: 'var(--danger)', fontSize: 14, margin: '0 0 12px' }}>{error}</p>
          )}
          <div className="form-actions">
            <button type="submit" className="btn-primary">
              {t('addLeague')}
            </button>
          </div>
        </form>
      </AdminOnly>

      {leagues.length === 0 ? (
        <div className="empty" style={{ marginTop: 24 }}>
          {t('noLeagues')}
        </div>
      ) : (
        <div className="grid tight" style={{ marginTop: 24 }}>
          {leagues.map((league) => (
            <div key={league.id} className="card">
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 12,
                }}
              >
                <span className="badge badge-muted">
                  <span style={{ fontSize: 16 }}>{league.country || '🌍'}</span> {league.name}
                </span>
                {isAdmin && (
                  <button
                    className="btn-danger"
                    style={{ padding: '6px 10px' }}
                    onClick={() => remove(league.id)}
                    title={t('deleteLeague')}
                  >
                    ✕
                  </button>
                )}
              </div>
              {isAdmin && (
                <>
                  <label htmlFor={`flag-${league.id}`}>{t('country')}</label>
                  <select
                    id={`flag-${league.id}`}
                    value={league.country || '🌍'}
                    onChange={(e) => saveFlag(league.id, e.target.value)}
                  >
                    {COUNTRIES.map(([flag, label]) => (
                      <option key={flag} value={flag}>
                        {flag} {label}
                      </option>
                    ))}
                  </select>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
