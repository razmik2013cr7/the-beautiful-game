import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { addPost } from '../store.js'
import { CATEGORY_KEYS } from '../i18nStrings.js'
import { useI18n } from '../i18n.jsx'
import AdminOnly from '../components/AdminOnly.jsx'

export default function NewPost() {
  const navigate = useNavigate()
  const { t } = useI18n()
  const [form, setForm] = useState({
    title: '',
    category: 'Matchday',
    author: '',
    content: '',
  })

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    if (!form.title.trim() || !form.content.trim()) return
    const created = await addPost({ ...form, author: form.author.trim() || 'Anonymous' })
    navigate(`/posts/${created.id}`)
  }

  return (
    <div className="page">
      <div className="page-head">
        <h1>{t('newPostTitle')}</h1>
      </div>

      <AdminOnly>
        <form className="form" onSubmit={submit}>
          <div className="field">
            <label htmlFor="title">{t('titleField')}</label>
            <input
              id="title"
              placeholder={t('titlePlaceholder')}
              value={form.title}
              onChange={set('title')}
              required
            />
          </div>

          <div className="form-row">
            <div className="field">
              <label htmlFor="category">{t('categoryField')}</label>
              <select id="category" value={form.category} onChange={set('category')}>
                {Object.entries(CATEGORY_KEYS).map(([label, key]) => (
                  <option key={label} value={label}>
                    {t(key)}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="author">{t('authorField')}</label>
              <input id="author" placeholder="The Gaffer" value={form.author} onChange={set('author')} />
            </div>
          </div>

          <div className="field">
            <label htmlFor="content">{t('storyField')}</label>
            <textarea
              id="content"
              placeholder={t('storyPlaceholder')}
              value={form.content}
              onChange={set('content')}
              required
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary">
              {t('publishPost')}
            </button>
            <button type="button" className="btn-ghost" onClick={() => navigate('/posts')}>
              {t('cancel')}
            </button>
          </div>
        </form>
      </AdminOnly>
    </div>
  )
}
