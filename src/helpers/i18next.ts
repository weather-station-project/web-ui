import { initReactI18next } from 'react-i18next'
import Backend from 'i18next-http-backend'
import LanguageDetector from 'i18next-browser-languagedetector'
import { Logger } from 'loglevel'
import log from '../config/logging.ts'
import i18next from 'i18next'

const localLog: Logger = log.getLogger('i18n')

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat
export const DATETIME_FORMAT_OPTIONS = {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  timeZoneName: 'shortOffset',
}

i18next
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

i18next.on('languageChanged', (lng) => {
  localLog.debug(`Language changed to '${lng}'`)
})

export default i18next
