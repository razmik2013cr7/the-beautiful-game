import { createContext, useCallback, useContext, useEffect, useState } from 'react'

const DarkModeContext = createContext(null)

export function useDarkMode() {
  return useContext(DarkModeContext)
}

export function DarkModeProvider({ children }) {
  const [dark, setDark] = useState(() => {
    try {
      const stored = localStorage.getItem('tbq_theme')
      if (stored) return stored === 'dark'
    } catch {}
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    try { localStorage.setItem('tbq_theme', dark ? 'dark' : 'light') } catch {}
  }, [dark])

  const toggle = useCallback(() => setDark((d) => !d), [])

  return (
    <DarkModeContext.Provider value={{ dark, toggle }}>
      {children}
    </DarkModeContext.Provider>
  )
}
