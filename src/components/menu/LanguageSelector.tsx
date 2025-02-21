import { useTranslation } from 'react-i18next'

const LanguageSelector = () => {
  const { t, i18n } = useTranslation()
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(e.target.value)
  }

  return (
    <select className="form-control form-control-sm" value={i18n.language} onChange={handleChange}>
      <option data-testid="en" value="en">
        {t('navmenu.language_selector.english')}
      </option>
      <option data-testid="es" value="es">
        {t('navmenu.language_selector.spanish')}
      </option>
    </select>
  )
}

export default LanguageSelector
