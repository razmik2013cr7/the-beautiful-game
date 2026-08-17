import { Link } from 'react-router-dom'
import { useAuth } from '../auth.jsx'
import { useI18n } from '../i18n.jsx'

export default function AdminOnly({ children }) {
  const { user, isAdmin, loading } = useAuth()
  const { t } = useI18n()

  if (loading) return null
  if (isAdmin) return children

  return (
    <div className="empty" style={{ marginTop: 24 }}>
      <div className="empty-title">{user ? t('notAdmin') : t('adminOnly')}</div>
      <div className="empty-actions">
        {!user && (
          <Link to="/login" className="btn-primary">
            {t('navLogin')}
          </Link>
        )}
      </div>
    </div>
  )
}
