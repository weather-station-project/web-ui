import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { I18nextProvider } from 'react-i18next'
import i18n from './helpers/i18n'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import log from './config/logging'
import { Logger } from 'loglevel'

const localLog: Logger = log.getLogger('main')
localLog.debug('Starting application')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <I18nextProvider i18n={i18n}>
      <QueryClientProvider client={new QueryClient()}></QueryClientProvider>
      <App />
    </I18nextProvider>
  </StrictMode>
)
