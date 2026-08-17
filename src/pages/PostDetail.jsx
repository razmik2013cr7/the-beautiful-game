import { Link, useNavigate, useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { findPost, formatDate } from '../store.js'
import { CATEGORY_KEYS } from '../i18nStrings.js'
import { useI18n } from '../i18n.jsx'
import { useAsync } from '../useAsync.js'
import Share from '../components/Share.jsx'

export default function PostDetail() {
  const { postId } = useParams()
  const navigate = useNavigate()
  const { t, lang } = useI18n()
  const { data: post } = useAsync(() => findPost(postId), [postId])

  useEffect(() => {
    if (post === null) navigate('/posts', { replace: true })
  }, [post, navigate])

  if (!post) return null

  return (
    <div className="page">
      <article className="detail card">
        <Link to="/posts" style={{ color: 'var(--text-muted)', fontSize: 14 }}>
          {t('backToPosts')}
        </Link>

        <div className="meta" style={{ margin: '16px 0 12px' }}>
          <span className="badge badge-blue">
            {t(CATEGORY_KEYS[post.category] || (post.category || 'matchday').toLowerCase())}
          </span>
          <span>
            {t('byLabel')} {post.author || 'Anonymous'}
          </span>
          <span>·</span>
          <span>{formatDate(post.createdAt, lang)}</span>
        </div>

        <h1 style={{ fontSize: 34 }}>{post.title}</h1>

        <div className="body">{post.content}</div>

        <div style={{ marginTop: 28, display: 'flex', gap: 12, alignItems: 'center' }}>
          <button className="btn-ghost" onClick={() => navigate('/posts')}>
            {t('backBtn')}
          </button>
          <Share title={post.title} />
        </div>
      </article>
    </div>
  )
}
