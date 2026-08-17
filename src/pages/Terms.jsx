import { Link } from 'react-router-dom'
import { useI18n } from '../i18n.jsx'

export default function Terms() {
  const { t } = useI18n()

  return (
    <div className="page">
      <Link to="/" style={{ color: 'var(--text-muted)', fontSize: 14 }}>
        ← {t('navHome')}
      </Link>
      <h1 style={{ marginTop: 16 }}>{t('tosTitle')}</h1>
      <div className="detail">
        <div className="body">
          {t('tosBody')}
        </div>
      </div>
    </div>
  )
}
