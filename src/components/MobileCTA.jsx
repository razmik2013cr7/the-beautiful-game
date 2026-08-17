import { NavLink } from 'react-router-dom'
import { useI18n } from '../i18n.jsx'

export default function MobileCTA() {
  const { t } = useI18n()

  return (
    <nav className="mobile-cta">
      <NavLink to="/" end>{t('navHome')}</NavLink>
      <NavLink to="/fixtures">{t('navFixtures')}</NavLink>
      <NavLink to="/matches">{t('navMatches')}</NavLink>
      <NavLink to="/tables">{t('navTables')}</NavLink>
      <NavLink to="/posts">{t('navPosts')}</NavLink>
    </nav>
  )
}
