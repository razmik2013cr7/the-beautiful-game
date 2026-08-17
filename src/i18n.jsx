/* oxlint-disable react/only-export-components */
import { createContext, useContext, useEffect, useState } from 'react'
import { translations } from './i18nStrings.js'

const LANG_KEY = 'tbq_lang'

const I18nContext = createContext(null)

function getInitialLang() {
  try {
    const saved = localStorage.getItem(LANG_KEY)
    if (saved && translations[saved]) return saved
  } catch {
    /* ignore */
  }
  return 'en'
}

function interpolate(str, vars) {
  let out = str
  if (vars) {
    for (const [key, value] of Object.entries(vars)) {
      out = out.replaceAll(`{${key}}`, value)
    }
  }
  return out
}

export function I18nProvider({ children }) {
  const [lang, setLang] = useState(getInitialLang)

  useEffect(() => {
    try {
      localStorage.setItem(LANG_KEY, lang)
      document.documentElement.lang = lang
    } catch {
      /* ignore */
    }
  }, [lang])

  const t = (key, vars) => {
    const dict = translations[lang] || translations.en
    const value = dict[key] ?? translations.en[key] ?? key
    return interpolate(value, vars)
  }

  const tp = (key, n, vars) => {
    const form = new Intl.PluralRules(lang).select(Number(n) || 0)
    const dict = translations[lang] || translations.en
    const value =
      dict[`${key}_${form}`] ??
      dict[`${key}_other`] ??
      translations.en[`${key}_${form}`] ??
      translations.en[key] ??
      key
    return interpolate(value, { n, ...vars })
  }

  return (
    <I18nContext.Provider value={{ lang, setLang, t, tp }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  return useContext(I18nContext)
}
