import { Link } from 'react-router-dom'
import { useI18n } from '../i18n.jsx'
import { useHead } from '../useHead.js'

export default function NotFound() {
  const { t } = useI18n()
  useHead('meta404', 'meta404Desc')

  return (
    <div className="page" style={{ textAlign: 'center', padding: '64px 16px' }}>
      <div style={{ fontSize: 64, marginBottom: 16 }}>⚽</div>
      <h1>404</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>
        {t('meta404Desc')}
      </p>
      <Link to="/" className="btn btn-primary">
        {t('navHome')}
      </Link>
    </div>
  )
}
