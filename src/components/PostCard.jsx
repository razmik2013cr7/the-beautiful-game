import { Link } from 'react-router-dom'
import { formatDate } from '../store.js'
import { CATEGORY_KEYS } from '../i18nStrings.js'
import { useI18n } from '../i18n.jsx'

export default function PostCard({ post }) {
  const { t, tp, lang } = useI18n()

  return (
    <Link to={`/posts/${post.id}`} className="card hoverable">
      <div className="meta" style={{ marginBottom: 10 }}>
        <span className="badge badge-blue">
          {t(CATEGORY_KEYS[post.category] || (post.category || 'matchday').toLowerCase())}
        </span>
        <span>
          {t('byLabel')} {post.author || 'Anonymous'}
        </span>
        <span>·</span>
        <span>{formatDate(post.createdAt, lang)}</span>
      </div>
      <h3 style={{ marginBottom: 8 }}>{post.title}</h3>
      <p
        className="meta"
        style={{
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {post.content}
      </p>
      <div className="meta" style={{ marginTop: 12 }}>
        <span>♥ {tp('likes', post.likes || 0)}</span>
        <span>·</span>
        <span>{t('readMore')}</span>
      </div>
    </Link>
  )
}
