import { useState } from 'react'
import { useI18n } from '../i18n.jsx'
import { useToast } from './Toast.jsx'

export default function Share({ title, url }) {
  const { t } = useI18n()
  const toast = useToast()
  const [open, setOpen] = useState(false)

  const shareUrl = url || window.location.href
  const encodedUrl = encodeURIComponent(shareUrl)
  const encodedTitle = encodeURIComponent(title || 'The Beautiful Game')

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      toast.success(t('linkCopied'))
    } catch {
      toast.error(t('copyFailed'))
    }
    setOpen(false)
  }

  return (
    <div className="share-wrapper">
      <button
        className="share-btn"
        onClick={() => setOpen(!open)}
        title={t('share')}
      >
        ↗ {t('share')}
      </button>
      {open && (
        <div className="share-menu">
          <a
            href={`https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="share-option"
          >
            💬 WhatsApp
          </a>
          <a
            href={`https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`}
            target="_blank"
            rel="noopener noreferrer"
            className="share-option"
          >
            ✈️ Telegram
          </a>
          <a
            href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="share-option"
          >
            🐦 Twitter / X
          </a>
          <button className="share-option" onClick={copyLink}>
            📋 {t('copyLink')}
          </button>
        </div>
      )}
    </div>
  )
}
