import { Link } from 'react-router-dom'
import { getPosts } from '../store.js'
import { useI18n } from '../i18n.jsx'
import { useAuth } from '../auth.jsx'
import { useAsync } from '../useAsync.js'
import { useHead } from '../useHead.js'
import PostCard from '../components/PostCard.jsx'

export default function Posts() {
  const { t, tp } = useI18n()
  const { isAdmin } = useAuth()
  useHead('metaPosts', 'metaPostsDesc')
  const { data: posts = [] } = useAsync(getPosts)

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>{t('postsTitle')}</h1>
          <p style={{ color: 'var(--text-muted)' }}>{tp('postsSub', posts.length)}</p>
        </div>
        {isAdmin && (
          <Link to="/posts/new" className="btn-primary">
            {t('writePostBtn')}
          </Link>
        )}
      </div>

      {posts.length === 0 ? (
        <div className="empty">
          <div className="empty-icon">✍️</div>
          <div className="empty-title">{t('noPosts')}</div>
          {isAdmin && (
            <div className="empty-actions">
              <Link to="/posts/new" className="btn-primary">
                {t('noPostsLink')}
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div className="grid">
          {posts.map((p) => (
            <PostCard key={p.id} post={p} />
          ))}
        </div>
      )}
    </div>
  )
}
