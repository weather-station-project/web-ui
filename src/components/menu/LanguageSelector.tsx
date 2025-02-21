import { useTranslation } from 'react-i18next'
import enFlag from '/en-US.png'
import esFlag from '/es-ES.png'

const languages = [
  { code: 'en-EN', flag: enFlag },
  { code: 'es-ES', flag: esFlag },
]

const LanguageSelector = () => {
  const { i18n } = useTranslation()

  const handleChange = async (code: string) => {
    await i18n.changeLanguage(code)
  }

  return (
    <div className="language-selector">
      {languages.map((lang) => (
        <button key={lang.code} onClick={() => handleChange(lang.code)} className={`language-button ${i18n.language === lang.code ? 'active' : ''}`}>
          <img src={lang.flag} alt={lang.code} />
        </button>
      ))}
    </div>
  )
}

export default LanguageSelector
