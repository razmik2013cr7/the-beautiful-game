import { NavLink, Link, Outlet } from 'react-router-dom'
import { supabase } from '../supabase.js'
import { useAuth } from '../auth.jsx'
import { LANGS } from '../i18nStrings.js'
import { useI18n } from '../i18n.jsx'
import { useDarkMode } from './DarkMode.jsx'
import MobileCTA from './MobileCTA.jsx'

export default function Layout() {
  const { t, lang, setLang } = useI18n()
  const { user, isAdmin, loading } = useAuth()
  const { dark, toggle } = useDarkMode()

  return (
    <>
      <nav className="navbar">
        <div className="navbar-inner">
          <NavLink to="/" className="brand">
            <span className="ball">⚽</span>
            {t('brand')}
          </NavLink>
          <div className="nav-links">
            <NavLink to="/" end>
              {t('navHome')}
            </NavLink>
            <NavLink to="/fixtures">{t('navFixtures')}</NavLink>
            <NavLink to="/matches">{t('navMatches')}</NavLink>
            <NavLink to="/tables">{t('navTables')}</NavLink>
            {isAdmin && <NavLink to="/leagues">{t('navLeagues')}</NavLink>}
            <NavLink to="/posts">{t('navPosts')}</NavLink>
            {isAdmin && <NavLink to="/posts/new">{t('navWritePost')}</NavLink>}
            {!loading &&
              (user ? (
                <button
                  className="nav-btn"
                  onClick={() => supabase.auth.signOut()}
                  title={t('navLogout')}
                >
                  {t('navLogout')}
                </button>
              ) : (
                <>
                  <NavLink to="/login">{t('navLogin')}</NavLink>
                  <NavLink to="/register">{t('navSignup')}</NavLink>
                </>
              ))}
          </div>
          <div className="nav-controls">
            <button
              className="theme-toggle"
              onClick={toggle}
              aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
              title={dark ? 'Light mode' : 'Dark mode'}
            >
              {dark ? '☀️' : '🌙'}
            </button>
            <select
              className="lang-select"
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              aria-label="Language"
            >
              {Object.entries(LANGS).map(([code, label]) => (
                <option key={code} value={code}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </nav>
      <Outlet />
      <footer className="footer">
        <div>{t('footer')}</div>
        <div style={{ marginTop: 8, fontSize: 13 }}>
          <Link to="/terms" style={{ color: 'var(--text-muted)', marginRight: 16 }}>
            {t('tosTitle')}
          </Link>
          <Link to="/privacy" style={{ color: 'var(--text-muted)' }}>
            {t('ppTitle')}
          </Link>
        </div>
      </footer>
      <MobileCTA />
    </>
  )
}
