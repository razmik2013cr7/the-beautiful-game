import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { addMatch, getLeagues, getViewerTimeZone } from '../store.js'
import { useI18n } from '../i18n.jsx'
import { useAsync } from '../useAsync.js'
import AdminOnly from '../components/AdminOnly.jsx'

export default function NewMatch() {
  const navigate = useNavigate()
  const { t } = useI18n()
  const { data: leagues = [] } = useAsync(getLeagues)
  const [form, setForm] = useState({
    homeTeam: '',
    awayTeam: '',
    homeLogo: '',
    awayLogo: '',
    competition: '',
    date: new Date().toISOString().slice(0, 10),
    time: '20:00',
    venue: '',
  })
  const [error, setError] = useState('')

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    if (!form.homeTeam.trim() || !form.awayTeam.trim()) return
    if (form.homeTeam.trim().toLowerCase() === form.awayTeam.trim().toLowerCase()) {
      setError(t('sameTeamError'))
      return
    }
    const created = await addMatch({
      ...form,
      timezone: getViewerTimeZone(),
      competition: form.competition || leagues[0]?.name || 'Friendly',
      homeTeam: form.homeTeam.trim(),
      awayTeam: form.awayTeam.trim(),
      venue: form.venue.trim() || 'Venue TBC',
    })
    navigate(`/matches/${created.id}`)
  }

  return (
    <div className="page">
      <div className="page-head">
        <h1>{t('addMatchTitle')}</h1>
      </div>

      <AdminOnly>
        <form className="form" onSubmit={submit}>
          <div className="form-row">
            <div className="field">
              <label htmlFor="homeTeam">{t('homeTeam')}</label>
              <input
                id="homeTeam"
                placeholder="Real Madrid"
                value={form.homeTeam}
                onChange={set('homeTeam')}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="awayTeam">{t('awayTeam')}</label>
              <input
                id="awayTeam"
                placeholder="Barcelona"
                value={form.awayTeam}
                onChange={set('awayTeam')}
                required
              />
            </div>
          </div>

          <div className="field">
            <label htmlFor="competition">{t('competition')}</label>
            <select
              id="competition"
              value={form.competition}
              onChange={set('competition')}
            >
              {form.competition === '' && <option value="">{t('selectLeague')}</option>}
              {leagues.map((l) => (
                <option key={l.id} value={l.name}>
                  {l.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <div className="field">
              <label htmlFor="date">{t('dateLabel')}</label>
              <input id="date" type="date" value={form.date} onChange={set('date')} required />
            </div>
            <div className="field">
              <label htmlFor="time">{t('kickoffLabel')}</label>
              <input id="time" type="time" value={form.time} onChange={set('time')} />
            </div>
          </div>

          <div className="field">
            <label htmlFor="venue">{t('venueLabel')}</label>
            <input
              id="venue"
              placeholder={t('venuePlaceholder')}
              value={form.venue}
              onChange={set('venue')}
            />
          </div>

          <div className="form-row">
            <div className="field">
              <label htmlFor="homeLogo">{t('homeLogo')}</label>
              <input
                id="homeLogo"
                placeholder="https://example.com/logo.png"
                value={form.homeLogo}
                onChange={set('homeLogo')}
              />
            </div>
            <div className="field">
              <label htmlFor="awayLogo">{t('awayLogo')}</label>
              <input
                id="awayLogo"
                placeholder="https://example.com/logo.png"
                value={form.awayLogo}
                onChange={set('awayLogo')}
              />
            </div>
          </div>

          {error && (
            <p style={{ color: 'var(--danger)', fontSize: 14, margin: '0 0 12px' }}>{error}</p>
          )}

          <div className="form-actions">
            <button type="submit" className="btn-primary">
              {t('createMatch')}
            </button>
            <button type="button" className="btn-ghost" onClick={() => navigate('/matches')}>
              {t('cancel')}
            </button>
          </div>
        </form>
      </AdminOnly>
    </div>
  )
}
