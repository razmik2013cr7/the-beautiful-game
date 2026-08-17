import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { supabase } from '../supabase.js'
import { useAuth } from '../auth.jsx'
import { useI18n } from '../i18n.jsx'

export default function Login() {
  const { t } = useI18n()
  const { user } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  if (user) return <Navigate to="/" replace />

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
    setBusy(false)
    if (signInError) {
      setError(t('loginError'))
    }
  }

  return (
    <div className="page" style={{ maxWidth: 420 }}>
      <div className="card" style={{ marginTop: 24 }}>
        <h1 style={{ fontSize: 24, marginBottom: 16 }}>{t('loginTitle')}</h1>
        <form className="form" onSubmit={submit}>
          <div className="field">
            <label htmlFor="email">{t('email')}</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="password">{t('password')}</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && (
            <p style={{ color: 'var(--danger)', fontSize: 14, margin: '0 0 12px' }}>{error}</p>
          )}
          <div className="form-actions">
            <button type="submit" className="btn-primary" disabled={busy}>
              {t('loginBtn')}
            </button>
          </div>
          <p style={{ fontSize: 14, margin: '16px 0 0' }}>
            {t('noAccountLink')}{' '}
            <Link to="/register" style={{ color: 'var(--blue)', fontWeight: 600 }}>
              {t('navSignup')}
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
