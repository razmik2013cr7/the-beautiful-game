import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { supabase } from '../supabase.js'
import { useAuth } from '../auth.jsx'
import { useI18n } from '../i18n.jsx'

export default function Register() {
  const { t } = useI18n()
  const { user } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [done, setDone] = useState('')
  const [busy, setBusy] = useState(false)

  if (user) return <Navigate to="/" replace />

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setDone('')
    if (password !== confirm) {
      setError(t('passwordMismatch'))
      return
    }
    setBusy(true)
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    })
    setBusy(false)
    if (signUpError) {
      setError(t('signupError'))
      return
    }
    setDone(t('signupSuccess'))
    setPassword('')
    setConfirm('')
  }

  return (
    <div className="page" style={{ maxWidth: 420 }}>
      <div className="card" style={{ marginTop: 24 }}>
        <h1 style={{ fontSize: 24, marginBottom: 16 }}>{t('signupTitle')}</h1>
        <form className="form" onSubmit={submit}>
          <div className="field">
            <label htmlFor="name">{t('authorField')}</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
            />
          </div>
          <div className="field">
            <label htmlFor="email">{t('email')}</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
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
              autoComplete="new-password"
              required
            />
          </div>
          <div className="field">
            <label htmlFor="confirm">{t('confirmPassword')}</label>
            <input
              id="confirm"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              autoComplete="new-password"
              required
            />
          </div>
          {error && (
            <p style={{ color: 'var(--danger)', fontSize: 14, margin: '0 0 12px' }}>{error}</p>
          )}
          {done && (
            <p style={{ color: 'var(--green)', fontSize: 14, margin: '0 0 12px' }}>{done}</p>
          )}
          <div className="form-actions">
            <button type="submit" className="btn-primary" disabled={busy}>
              {t('signupBtn')}
            </button>
          </div>
          <p style={{ fontSize: 14, margin: '16px 0 0' }}>
            {t('alreadyHaveAccount')}{' '}
            <Link to="/login" style={{ color: 'var(--blue)', fontWeight: 600 }}>
              {t('loginLink')}
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
