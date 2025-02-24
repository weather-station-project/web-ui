import { useTranslation } from 'react-i18next'
import enFlag from '/en-US.png'
import esFlag from '/es-ES.png'
import classNames from 'classnames'

const languages = [
  { code: 'en-EN', flag: enFlag },
  { code: 'es-ES', flag: esFlag },
]

const LanguageSelector = () => {
  const { i18n, t } = useTranslation()

  const handleChange = async (code: string) => {
    await i18n.changeLanguage(code)
  }

  return (
    <div className="language-selector">
      {languages.map((lang) => (
        <button key={lang.code} onClick={() => handleChange(lang.code)} className={classNames('language-button', { active: i18n.language === lang.code })}>
          <img src={lang.flag} alt={lang.code} title={t(`language-selector.${lang.code}`)} />
        </button>
      ))}
    </div>
  )
}

export default LanguageSelector
