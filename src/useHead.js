import { useEffect } from 'react'
import { useI18n } from './i18n.jsx'

function getOrCreateMeta(name, property) {
  const selector = property
    ? `meta[property="${property}"]`
    : `meta[name="${name}"]`
  let meta = document.querySelector(selector)
  if (!meta) {
    meta = document.createElement('meta')
    if (property) meta.setAttribute('property', property)
    else meta.name = name
    document.head.appendChild(meta)
  }
  return meta
}

export function useHead(titleKey, descKey) {
  const { t, lang } = useI18n()
  useEffect(() => {
    const title = t(titleKey) || t('brand')
    const desc = t(descKey) || ''

    document.title = `${title} | The Beautiful Game`

    const descMeta = getOrCreateMeta('description')
    descMeta.content = desc

    const ogTitle = getOrCreateMeta('og:title', 'og:title')
    ogTitle.content = title

    const ogDesc = getOrCreateMeta('og:description', 'og:description')
    ogDesc.content = desc

    const ogSiteName = getOrCreateMeta('og:site_name', 'og:site_name')
    ogSiteName.content = 'The Beautiful Game'

    const ogType = getOrCreateMeta('og:type', 'og:type')
    ogType.content = 'website'

    const twitterCard = getOrCreateMeta('twitter:card', 'twitter:card')
    twitterCard.content = 'summary'

    const twitterTitle = getOrCreateMeta('twitter:title', 'twitter:title')
    twitterTitle.content = title

    const twitterDesc = getOrCreateMeta('twitter:description', 'twitter:description')
    twitterDesc.content = desc

    document.documentElement.lang = lang
  }, [titleKey, descKey, lang, t])
}
