import { useTranslation } from 'react-i18next'

const HistoricalData = () => {
  const { t } = useTranslation()

  return (
    <>
      <h1 data-testid="home.real-time-measurements">{t('historical-data.title')}</h1>
      <p>{t('historical-data.description')}</p>
    </>
  )
}

export default HistoricalData
