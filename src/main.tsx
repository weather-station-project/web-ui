import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { I18nextProvider } from 'react-i18next'
import i18n from './helpers/i18n'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <I18nextProvider i18n={i18n}></I18nextProvider>
  </StrictMode>
)
