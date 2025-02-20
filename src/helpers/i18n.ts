import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import Backend from 'i18next-http-backend'
import LanguageDetector from 'i18next-browser-languagedetector'
import moment from 'moment'
import { Logger } from 'loglevel'
import log from '../config/logging.ts'

const localLog: Logger = log.getLogger('i18n')

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
      format: (value, format) => {
        if (value instanceof Date) return moment(value).format(format)
        return value
      },
    },
    react: {
      useSuspense: true,
      transKeepBasicHtmlNodesFor: ['u'],
    },
    detection: { order: ['localStorage', 'sessionStorage', 'navigator'] },
  })

i18n.on('languageChanged', (lng) => {
  moment.locale(lng)
  localLog.debug(`Language changed to '${lng}'`)
})

export default i18n
