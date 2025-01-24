import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import Backend from 'i18next-http-backend'
import LanguageDetector from 'i18next-browser-languagedetector'

i18n
  .use(initReactI18next)
  .use(Backend)
  .use(LanguageDetector)
  .init({
    backend: {
      loadPath: '/locales/{{lng}}.json',
    },
    debug: false, // Enable to see verbose logs
    fallbackLng: 'en-EN',
    load: 'currentOnly',
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: true,
      transKeepBasicHtmlNodesFor: ['u'],
    },
    detection: { order: ['localStorage', 'sessionStorage', 'navigator'] },
  })

export default i18n
