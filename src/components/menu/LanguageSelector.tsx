import { useTranslation } from 'react-i18next'
import enFlag from '/en-EN.png'
import esFlag from '/es-ES.png'
import classNames from 'classnames'

const languages = [
  { code: 'en-EN', flag: enFlag },
  { code: 'es-ES', flag: esFlag },
]

const LanguageSelector = () => {
  const { i18n, t } = useTranslation()

  const handleChange = async (code: string): Promise<void> => {
    await i18n.changeLanguage(code)
  }

  return (
    <div className="language-selector">
      {languages.map((lang) => (
        <button key={lang.code} onClick={(): Promise<void> => handleChange(lang.code)} className={classNames('language-button', { active: i18n.language === lang.code })}>
          <img data-testid={lang.code} src={lang.flag} alt={lang.code} title={t(`language-selector.${lang.code}`)} />
        </button>
      ))}
    </div>
  )
}

export default LanguageSelector
