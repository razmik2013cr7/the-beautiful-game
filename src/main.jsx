import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { I18nProvider } from './i18n.jsx'
import { DarkModeProvider } from './components/DarkMode.jsx'
import { ToastProvider } from './components/Toast.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <I18nProvider>
      <DarkModeProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </DarkModeProvider>
    </I18nProvider>
  </StrictMode>,
)
